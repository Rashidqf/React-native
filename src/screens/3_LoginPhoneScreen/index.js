import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, ImageBackground, Keyboard } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { Responsive } from '@helpers';
// import api functions
import { callApi } from '@apiCalls';

//import constants
import { API_DATA } from '@constants';

// import Utils
import { Validation } from '@utils';

import { AppContext } from '../../themes/AppContextProvider';
import { FONTS } from '../../themes/fonts';

class LoginPhoneScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasFocus: false,
      show: false,
      countryCode: '+1',
      phone: {
        value: '',
        isError: false,
        title: 'Enter your phone number',
        extraProps: {
          maxLength: 15,
          keyboardType: 'number-pad',
          mask: text => {
            return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
          },
        },
      },
      isKeyboardOpen: false,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.props.networkListner();

    this.checkNotificationPermission();
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

  setFocus(hasFocus) {
    this.setState({ hasFocus });
  }

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
  checkValidation() {
    let isEmptyphonneno = Validation.isEmpty(this.state.phone.value);
    let isLengthPhoneno = Validation.isValidPhoneNo(this.state.phone.value);
    console.log('>>>>phone no ', isLengthPhoneno);
    if (!isEmptyphonneno && isLengthPhoneno) {
      return true;
    } else {
      let msg = '';
      if (isEmptyphonneno) {
        msg = 'ENTER_PHONENO_MSG';
      } else if (!isLengthPhoneno) {
        msg = 'ENTER_PHONENO_VALID_MSG';
      }
      this.props.showErrorAlert(localize('ERROR'), localize(msg));

      return false;
    }
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
  callverficationMobile() {
    if (this.checkValidation()) {
      console.log('>>>mobile no', this.state.phone.value);
      try {
        const params = {
          url: API_DATA.VERIFICATION_MOBILENO,
          data: {
            phone: this.state.phone.value,
            phone_code: this?.state?.countryCode,
            type: 'login',
          },
        };

        this.props.showLoading(true);

        callApi([params])
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.VERIFICATION_MOBILENO];
              if (resp.success) {
                console.log('>>>>verification mobile', resp.data);
                this.props.showToast(localize('SUCCESS'), resp.message).then(() => {
                  this.props.navigation.navigate('VERIFY_PIN', {
                    mobile_no: this.state.phone.value,
                    phone_code: this.state?.countryCode,
                    screen_redirection: 'login',
                  });
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(error => {
            this.props.showLoading(false);
          });
      } catch (e) {
        console.log('catch error >>> ', e);
      }
    }
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES?.onboardingScreen} style={styles.background}>
        <SafeAreaWrapper backgroundColor={{}}>
          <ScrollView
            contentContainerStyle={{ marginTop: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          >
            {!this.state.isKeyboardOpen && (
              <View style={{ alignSelf: 'center', marginTop: 19 }}>
                <Image source={IMAGES?.shortAppLogo} style={{ height: 95, width: 95, marginTop: 19 }} />
              </View>
            )}
            <View style={styles.inputContainerStyle}>
              <Text style={styles.titleStyle}>Enter your phone number</Text>
            </View>
            <View style={styles.loginContent}>
              <View
                style={[
                  this.state.hasFocus
                    ? [styles.inputViewFocusStyle, { backgroundColor: theme?.colors?.MASK_INPUT }]
                    : [styles.inputViewStyle, { backgroundColor: theme?.colors?.MASK_INPUT }],
                  { marginVertical: Responsive.getHeight(2) },
                ]}
              >
                {/* <Button type="clear" style={styles.inputphoneStyle} titleStyle={styles.inputStyle} title={'+1'} /> */}
                <TouchableOpacity onPress={() => this.setState({ show: true })}>
                  <View style={styles.mobileView}>
                    <View style={styles.countyCodeView}>
                      <Text style={[styles.countyCode, styles.marginStyle(3, 0, 0, 0)]}>{this?.state?.countryCode}</Text>
                      <View style={[styles.marginStyle(3, 0, 0, 0), { backgroundColor: '#171717', width: 1, height: '100%' }]}></View>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={[styles.inputCodeStyle, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
                  <MaskInput
                    style={[styles.inputStyle, { paddingLeft: 20, width: '100%', fontFamily: FONTS.BOLD, fontSize: 16 }]}
                    placeholder="Phone number"
                    placeholderTextColor="#847D7B"
                    value={this.state.phone.value}
                    onFocus={this.setFocus.bind(this, true)}
                    onChangeText={(masked, unmasked, obfuscated) => {
                      this.changeData('phone', {
                        value: masked,
                        maskedValue: obfuscated,
                      });
                    }}
                    // autoCapitalize={false}
                    spellCheck={false}
                    autoCorrect={false}
                    {...this.state.phone.extraProps}
                  />
                </View>
              </View>
              <CountryPicker
                show={this?.state?.show}
                initialState="+1"
                enableModalAvoiding={true}
                pickerButtonOnPress={item => {
                  this.setState({
                    countryCode: item?.dial_code,
                    show: false,
                  });
                }}
                onBackdropPress={() => this.setState({ show: false })}
                style={{
                  modal: {
                    height: 450,
                  },
                }}
              />

              <TouchableOpacity style={styles.linkBtn} onPress={() => this.props.navigation.navigate('LOGIN')}>
                <Image source={IMAGES.mail} style={styles.linkIcon} />
                <Text style={styles.linkLabel}>Use email address instead</Text>
              </TouchableOpacity>
            </View>

            <Button
              style={styles.marginTop}
              buttonStyle={styles.button}
              title={localize('CONTINUE')}
              titleStyle={styles.buttonText}
              onPress={() => this.callverficationMobile()}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginPhoneScreen);
