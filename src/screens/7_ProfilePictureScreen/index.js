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
import { FONTS } from '../../themes/fonts';

class ProfilePictureScreen extends React.Component {
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
      isChangePicker: false,
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

  removeImage() {}
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
  _renderImagePickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.isChangePicker}>
        <TouchableWithoutFeedback onPress={() => this.setState({ isChangePicker: false })}>
          <SafeAreaView style={[styles.safeAreaStyle, {}]}>
            <View
              style={{
                width: '100%',
                maxHeight: Responsive.getHeight(85),
                borderRadius: Responsive.getWidth(5),
                backgroundColor: 'rgba(24, 24, 24, 0.7)',
              }}
            >
              <View style={styles.BtnViewStyle}>
                <TouchableOpacity
                  onPress={() => this.setState({ isShowPicker: true, isChangePicker: false })}
                  style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: FONTS.BASE, fontSize: 18, color: COLORS.WHITE }}>{localize('CHANGE_IMAGE')}</Text>
                </TouchableOpacity>
                <View style={{ height: 1, backgroundColor: theme?.colors?.WHITE }} />
                <TouchableOpacity
                  style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}
                  onPress={() =>
                    this.setState({
                      profile: '',
                      profilePic: '',
                      isChangePicker: false,
                    })
                  }
                >
                  <Text style={{ fontFamily: FONTS.BASE, fontSize: 18, color: COLORS.WHITE }}>{localize('REMOVE_IMAGE')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                width: '100%',
                borderRadius: 20,
                backgroundColor: 'rgba(24, 24, 24, 0.7)',
                borderRadius: Responsive.getWidth(5),
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ isChangePicker: false })}
                style={{ justifyContent: 'center', alignItems: 'center', height: 60 }}
              >
                <Text style={{ fontFamily: FONTS.BASE, fontSize: 18, color: COLORS.ORANGE_200 }}>{localize('CANCEL')}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  openImagePicker(type) {
    this.setState({ isShowPicker: false, isChangePicker: false }, () => {
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
              <View style={styles.middelContent}>
                <View style={styles.profilePhoto}>
                  {!this.state.profilePic ? (
                    <TouchableOpacity onPress={() => this.setState({ isShowPicker: true })}>
                      <Image source={IMAGES.plusThin} style={{ tintColor: COLORS?.ORANGE_200, height: 75, width: 75 }} />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Image source={{ uri: this.state.profilePic }} style={styles.profileImg} />
                      <TouchableOpacity style={styles.addIconStyle} onPress={() => this.setState({ isChangePicker: true })}>
                        <Image source={IMAGES.closeIconBorder} style={styles.addIcon} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
              <View style={styles.topContent}>
                <Text style={styles.pictureText}>Want to add a profile picture</Text>
                <Text style={styles.favoriteText}>Want to use your favorite selfie?</Text>
              </View>
              <View style={styles.bottomContent}>
                {this.state.profilePic ? (
                  <Button
                    buttonStyle={styles.button}
                    title={localize('NEXT')}
                    titleStyle={styles.buttonText}
                    // onPress={() => this.props.navigation.navigate('PROMPT')}
                    onPress={() => this.updateProfile()}
                  />
                ) : (
                  <></>
                )}
                <Button
                  style={styles.marginTop}
                  buttonStyle={[styles.button, styles.buttonTrans]}
                  title={localize('SKIP_NOW')}
                  titleStyle={[styles.buttonText, styles.buttonTransText]}
                  onPress={() => this.props.navigation.navigate('PROMPT')}
                />
              </View>
            </View>
            {this._renderImagePickerPopup()}
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePictureScreen);
