import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, ImageBackground, Keyboard } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';

// import api functions
import { callApi } from '@apiCalls';

// import Utils
import { Validation } from '@utils';

//import constants
import { COMMON_DATA, API_DATA } from '@constants';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../themes/AppContextProvider';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: {
        value: '',
        isError: false,
        title: 'Enter your email',
        extraProps: { keyboardType: 'email-address' },
      },
      password: {
        value: '',
        isError: false,
        title: 'Enter your password',
        extraProps: { isPassword: true },
      },
      deviceToken: '',
      hasFocus: false,
      isKeyboardOpen: false,
    };
  }
  static contextType = AppContext;

  setFocus(hasFocus) {
    this.setState({ hasFocus });
  }
  componentDidMount() {
    this.props.networkListner();

    this.checkNotificationPermission();
    this.requestUserPermission();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    // Remove the keyboard event listeners when the component unmounts
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpen: true });
  };

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpen: false });
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      this.getFcmToken();
    }
  };

  getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    if (!fcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        // console.log('resp token', fcmToken);

        if (fcmToken) {
          // console.log('the new generated token', fcmToken);
          this.setState({
            deviceToken: fcmToken,
          });
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  // Check User allow notification permission or not to receive push notification
  checkNotificationPermission() {
    // FirebaseService.firebasePushSetup();
    setTimeout(() => {
      this.saveUserLoginData();
    }, 2000);
  }

  //Save User login or token related detail to access using reducer from any screen
  saveUserLoginData(token) {
    StorageOperation.getData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
      let user_data = {};
      let token = '';
      let is_login = false;

      if (value[0][1] == 'true') {
        is_login = true;
        user_data = JSON.parse(value[1][1]);
        token = value[2][1];

        this.props
          .saveUserData({
            is_login: is_login,
            userInfo: user_data,
            access_token: token,
          })
          .then(() => {
            // setTimeout(() => {
            //   this.props.navigation.reset({
            //     index: 0,
            //     routes: [{name: 'TAB_NAVIGATOR'}],
            //   });
            // }, 1000);
          });
      } else {
        // setTimeout(() => {
        //   this.props.navigation.reset({
        //     index: 0,
        //     routes: [{name: 'ONBOARD_SCREEN'}],
        //   });
        // }, 1000);
      }
    });
  }

  // render custom component
  renderInputComponent(key) {
    const temp = this.state[key];

    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        onChangeText={masked => {
          this.changeData(key, {
            value: masked,
          });
        }}
        {...temp.extraProps}
      />
    );
  }

  changeData(key, object) {
    var tmpObj = {};
    tmpObj[key] = { ...this.state[key], ...object };
    this.setState(tmpObj);
  }
  saveUserData(resp) {
    StorageOperation.setData([
      [ASYNC_KEYS.IS_LOGIN, 'true'],
      [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
    ]).then(() => {
      this.props
        .saveUserData({
          userInfo: resp.data,
          access_token: resp.data.token,
          is_login: true,
        })
        .then(() => {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'TAB_NAVIGATOR' }],
          });
        });
    });
  }

  // check all validation
  checkValidation() {
    let isValidEmail = Validation.isValidEmail(this.state.email.value);
    let isEmptyPassword = Validation.isEmpty(this.state.password.value);

    if (isValidEmail && !isEmptyPassword) {
      return true;
    } else {
      let msg = '';
      if (Validation.isEmpty(this.state.email.value)) {
        msg = 'ENTER_EMAIL_MSG';
      } else if (!isValidEmail) {
        msg = 'ENTER_VALID_EMAIL_MSG';
      } else if (isEmptyPassword) {
        msg = 'ENTER_PASS_MSG';
      }
      this.props.showErrorAlert(localize('ERROR'), localize(msg));

      return false;
    }
  }
  //API Actions
  callLogin(type) {
    if (this.checkValidation()) {
      try {
        const params = {
          url: API_DATA.LOGIN,
          data: {
            login_type: 'email',
            email: this.state.email.value,
            password: this.state.password.value,
            auth_type: 'N',
            device_type: COMMON_DATA.DEVICE_TYPE,
            device_token: this.state.deviceToken,
          },
        };
        //  FirebaseService.getNotificationToken().then(token => {

        this.props.showLoading(true);

        callApi([params])
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.LOGIN];
              if (resp.success) {
                StorageOperation.setData([
                  [ASYNC_KEYS.IS_LOGIN, 'true'],
                  [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
                  [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
                ]).then(() => {
                  this.saveUserData(resp);
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(error => {
            this.props.showLoading(false);
          });
        //});
      } catch (e) {
        console.log('catch error >>> ', e);
      }
    }
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.splashbackgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <ScrollView
            contentContainerStyle={{ marginTop: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.loginContent}>
              {!this.state.isKeyboardOpen && (
                <View style={{ alignSelf: 'center', marginTop: 19 }}>
                  <Image source={IMAGES?.shortAppLogo} style={{ height: 95, width: 95, marginTop: 19 }} />
                </View>
              )}
              <View style={{ marginTop: 60 }}>
                {this.renderInputComponent('email')}
                <TouchableOpacity style={styles.linkBtn} onPress={() => this.props.navigation.navigate('LOGIN_PHONE')}>
                  <Image source={IMAGES.mail} style={styles.linkIcon} />
                  <Text style={styles.linkLabel}>Use phone number instead</Text>
                </TouchableOpacity>
              </View>
              {this.renderInputComponent('password')}
            </View>

            <Button
              style={styles.marginTop}
              buttonStyle={styles.button}
              title={localize('CONTINUE')}
              titleStyle={styles.buttonText}
              onPress={() => this.callLogin()}
            />

            {/* <View style={styles.linkLabel}> */}
            {/* <Text style={styles.preStyle}> */}
            {/* Don't have an account? */}
            {/* <TouchableOpacity  */}
            {/* <Text onPress={() => this.props.navigation.navigate('REGISTER')} style={styles.signupstyle}> */}
            {/* {' '} */}
            {/* Sign Up */}
            {/* </Text> */}
            {/* </TouchableOpacity> */}
            {/* </Text> */}
            {/* </View> */}
          </ScrollView>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
