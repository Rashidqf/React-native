import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
  ImageBackground,
} from 'react-native';

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

// import firebase services
import { FirebaseService } from '@services';

//import constants
import { COMMON_DATA, API_DATA } from '@constants';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
// import api functions
import { callApi } from '@apiCalls';

import { Responsive } from '@helpers';

//import camera gallary pickup
import ImagePicker from 'react-native-image-crop-picker';
import { AppContext } from '../../themes/AppContextProvider';
import { COLORS } from '../../themes/colors';

class NotificationPermissionScreen extends React.Component {
  constructor(props) {
    super(props);

    const userInfo = this.props.userData.userInfo;
    this.state = {
      fullname: {
        value: '',
        isError: false,
        title: 'Full Name',
      },
      email: {
        value: '',
        isError: false,
        title: 'Email Address',
        extraProps: { keyboardType: 'email-address' },
      },
      password: {
        value: '',
        isError: false,
        title: 'Enter your password',
        extraProps: { isPassword: true },
      },
      isShowPicker: false,
      profilePic: '',
      profile: '',
    };
  }
  static contextType = AppContext;

  saveUserData(resp) {
    StorageOperation.setData([
      [ASYNC_KEYS.IS_LOGIN, 'true'],
      [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      [ASYNC_KEYS.ACCESS_TOKEN, this.props.userData.access_token],
    ]).then(() => {
      this.props
        .saveUserData({
          userInfo: resp.data,
          access_token: this.props.userData.access_token,
          is_login: true,
        })
        .then(() => {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'PROMPT' }],
          });
        });
    });
  }

  updateProfile() {
    try {
      const params = {
        url: API_DATA.UPDATEPROFILE,
        data: {
          email: this?.props?.route?.params?.email,
          name: this?.props?.route?.params?.name,
          phone: this?.props?.route?.params?.mobileNo,
          phone_code: this?.props?.route?.params?.phone_code,
          image: this.state.profile,
        },
      };
      var accessToken = this.props.userData.access_token;
      this.props.showLoading(true);
      callApi([params], accessToken)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.UPDATEPROFILE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              // this.props.navigation.navigate('TAB_NAVIGATOR');
              this.props.showLoading(false);
              StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)]]).then(() => {
                this.saveUserData(resp);
              });
              this.props.saveUserData({
                is_login: true,
                userInfo: resp?.data,
                access_token: accessToken,
              });
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(error => {
          this.props.showLoading(false);
        });
      // });
    } catch (e) {
      console.log('catch error >>> ', e);
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
  logout() {
    this.setState({ isShowLogout: false }, () => {
      try {
        const params = {
          url: API_DATA.LOGOUT,
          data: {},
        };

        var accessToken = this.props.userData.access_token;

        this.props.showLoading(true);

        callApi([params], accessToken)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.LOGOUT];
              StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
                setTimeout(() => {
                  this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'LOGIN' }],
                  });
                }, 500);
              });
            });
          })
          .catch(error => {
            this.props.showLoading(false);
          });
      } catch (e) {
        console.log('catch error >>> ', e);
      }
    });
  }

  _renderBotton(title, onPress, color) {
    const { theme } = this.context;
    const styles = style(theme);
    return <Button type="clear" title={title} buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={onPress} />;
  }

  _renderPickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.isShowPicker}>
        <TouchableWithoutFeedback onPress={() => this.setState({ isShowPicker: false })}>
          <SafeAreaView style={styles.safeAreaStyle}>
            <View style={styles.alertBoxStyle}>
              <Button
                buttonStyle={styles.closeButtonStyle}
                icon={<Image style={styles.closeIconStyle} source={IMAGES.close} />}
                onPress={() => this.setState({ isShowPicker: false })}
              />
              <Text numberOfLines={2} style={styles.alertTitleStyle}>
                {localize('SELECT_PHOTO')}
              </Text>
              <Text style={styles.descriptionStyle}>{localize('SELECT_PHOTO_MSG')}</Text>
              <View style={styles.profileBtnViewStyle}>
                {this._renderBotton(localize('CAMERA'), () => this.openImagePicker('camera'))}
                {this._renderBotton(localize('GALLERY'), () => this.openImagePicker('gallery'))}
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  openImagePicker(type) {
    this.setState({ isShowPicker: false }, () => {
      setTimeout(() => {
        const configOption = {
          width: 600,
          height: 600,
          compressImageMaxWidth: 600,
          compressImageMaxHeight: 600,
          //   cropping: Platform.OS === 'ios' ? true : true,
          compressImageQuality: 0.8,
        };
        if (type == 'camera') {
          ImagePicker.openCamera(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        } else {
          ImagePicker.openPicker(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        }
      }, 1000);
    });
  }

  handleImageResponce(image) {
    this.setState({
      profilePic: image.path,
      profile: {
        uri: image.path,
        type: image.mime,
        name: image.path.split('/').pop(),
      },
    });
  }

  handlePickerError(error) {
    if (error.code === 'E_PICKER_NO_CAMERA_PERMISSION') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('CAMERA_PERMISSION'),
      });
    } else if (error.code === 'E_PERMISSION_MISSING') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('GALLERY_PERMISSION'),
      });
    }
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollView}>
            <View style={styles.loginContent}>
              <View style={styles.topContent}>
                <Image source={IMAGES.undrawMyNotifications} style={styles.undrawMyNotificationsImg} />
                <View style={styles.stayLoopText}>
                  <Text style={styles.stayText}>Stay in the</Text>
                  <Text style={styles.pictureText}>Loop</Text>
                </View>
                <Text style={styles.favoriteText}>Activate Notifications for the Latest Updates</Text>
              </View>
              <View style={styles.bottomContent}>
                <Button
                  buttonStyle={[styles.button, { backgroundColor: COLORS.ORANGE_200 }]}
                  title={'Enable notifications'}
                  titleStyle={styles.buttonText}
                  onPress={() => this.updateProfile()}
                />
              </View>
            </View>
            {this._renderPickerPopup()}
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
export default connect(mapStateToProps, mapDispatchToProps)(NotificationPermissionScreen);
