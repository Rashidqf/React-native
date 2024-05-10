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
  Pressable,
  Alert,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, COLORS } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button, Input } from 'react-native-elements';
// import api functions
import { callApi } from '@apiCalls';

//import camera gallary pickup
import ImagePicker from 'react-native-image-crop-picker';

// import Utils
import { Validation } from '@utils';

import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';

import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';
import HeaderComponent from '../../components/customHeader/Header';

class ProfileEditScreen extends React.Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable style={COMMON_STYLE.headerBtnStyle} onPress={() => this.updateProfile()}>
            <Text style={COMMON_STYLE.headerBtnTextStyle}>{'Save'}</Text>
          </Pressable>
        );
      },
    });
    this.state = {
      fullname: {
        value: this.props.userData.userInfo.name,
        isError: false,
        title: 'Full Name',
        isfocused: true,
      },
      email: {
        value: this.props.userData.userInfo.email,
        isError: false,
        title: 'Email Address',
        extraProps: {
          keyboardType: 'email-address',
          // editable: 'false',
          inputStyle: { color: COLORS.INPUT_GRAY_COLOR },
        },
      },
      countryCode: this.props.userData.userInfo?.phone_code,
      masked: this.props.userData.userInfo.name,
      phone: {
        value: this.props.userData.userInfo.phone,
        isError: false,
        title: 'Enter your phone number',
        extraProps: {
          maxLength: 15,
          // editable: 'false',
          keyboardType: 'number-pad',
          mask: text => {
            return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
          },
        },
      },
      nickname: {
        value: this.props.userData.userInfo.nickname || '',
        isError: false,
        title: 'Nick Name',
        isfocused: true,
      },
      profilePic: Validation.isEmpty(this.props.userData.userInfo.image) ? 'profile_dummy' : this.props.userData.userInfo.image,
      profile: '',
      isShowPicker: false,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    setTimeout(() => {
      this.getProfileDetail();
    }, 500);
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
            routes: [{ name: 'PROFILE_PICTURE' }],
          });
        });
    });
  }
  //get profile detail
  getProfileDetail() {
    try {
      const params = {
        url: API_DATA.PROFILE,
      };
      var accessToken = this.props.userData.access_token;
      this.props.showLoading(true);
      callApi([params], accessToken)
        .then(response => {
          let resp = response[API_DATA.PROFILE];
          this.props.showLoading(false).then(() => {
            if (resp.success) {
              StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)]]).then(() => {
                this.saveUserData(resp);
              });
              this.props.saveUserData(resp);
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
      this.setState({ isStartApiCalling: false });
    }
  }

  // check all validation
  checkValidation() {
    let isEmptyFullName = Validation.isEmpty(this.state.fullname.value);
    let isNickName = Validation.isEmpty(this.state.nickname.value);
    if (!isEmptyFullName) {
      return true;
    } else {
      let msg = '';
      if (Validation.isEmpty(this.state.fullname.value)) {
        msg = 'ENTER_FULLNAME_MSG';
      }

      this.props.showErrorAlert(localize('ERROR'), localize(msg));

      return false;
    }
  }
  updateProfile() {
    if (this.checkValidation()) {
      try {
        const params = {
          url: API_DATA.UPDATEPROFILE,
          data: {
            email: this.state.email.value,
            name: this.state.fullname.value,
            image: this.state.profile,
            phone: this.state.phone.value,
            nickname: this.state.nickname.value,
            phone_code: this.state?.countryCode,
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
                this.props.navigation.navigate('TAB_NAVIGATOR');
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
  }

  deleteAccount() {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete your account?', [
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({ isShowLogout: false }, () => {
            try {
              const params = {
                url: API_DATA.DELETE_ACCOUNT,
                data: {},
              };

              var accessToken = this.props.userData.access_token;

              this.props.showLoading(true);

              callApi([params], accessToken)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.DELETE_ACCOUNT];

                    this.props.showToast(localize('SUCCESS'), resp.message);
                    StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
                      setTimeout(() => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [{ name: 'REGISTER' }],
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
        },
      },
    ]);
  }

  _renderPickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="slide" transparent={true} visible={this.state.isShowPicker}>
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
  _renderChangeImagePickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="slide" transparent={true} visible={this.state.isShowPicker}>
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
                {/* {this._renderBotton(localize('GALLERY'), () => this.openImagePicker('gallery'))} */}
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  _renderBotton(title, onPress, color) {
    const { theme } = this.context;
    const styles = style(theme);
    return <Button type="clear" title={title} buttonStyle={styles.modalButton} titleStyle={styles.modalButtonText} onPress={onPress} />;
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
  // render custom component
  renderInputComponent(key) {
    const temp = this.state[key];

    return (
      <TitleTextInput
        editable={temp.title === 'Email Address' ? false : true}
        title={temp.title}
        value={key === 'fullname' ? this?.state?.fullname?.value : temp.value}
        onChangeText={masked => {
          this.changeData(key, {
            value: masked,
          });
          this?.setState({
            masked,
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

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginTop: 40 }}>
          <HeaderComponent
            title="Edit Profile"
            onSave={() => this.updateProfile()}
            onCancel={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              style={styles.KeyboardAvoidingView}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              enabled
              keyboardVerticalOffset={100}
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.loginContent}>
                  <View style={styles.topContent}>
                    <View style={styles.profilePhoto}>
                      <Image source={{ uri: this.state.profilePic }} style={styles.profileImg} />
                      <TouchableOpacity onPress={() => this.setState({ isShowPicker: true })} style={styles.addIconStyle}>
                        <Image source={IMAGES.addIcon} style={styles.addIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ position: 'relative' }}>
                    {this.renderInputComponent('fullname')}
                    <TouchableOpacity
                      style={styles.inputClearIconBtn}
                      onPress={() =>
                        this?.setState({
                          fullname: { value: '', isError: false, title: 'Full Name', isfocused: true },
                        })
                      }
                    >
                      <Image source={IMAGES.clearIcon} style={styles.inputClearIcon} />
                    </TouchableOpacity>
                  </View>
                  {this.renderInputComponent('email')}
                  {/* {this.renderInputComponent('nickname')} */}
                  <Text style={styles.titleStyle}>Enter Phone no</Text>
                  <View
                    style={[
                      styles.inputViewStyle,
                      {
                        flexDirection: 'row',
                        marginVertical: Responsive.getHeight(1),
                      },
                    ]}
                  >
                    <Button
                      type="clear"
                      style={styles.inputphoneStyle}
                      titleStyle={[styles.inputStyle, { color: theme?.colors?.INPUT_GRAY_COLOR }]}
                      title={this?.state?.countryCode}
                    />
                    {/* <Text style={styles.countyCode}>+1</Text> */}

                    <View style={styles.inputCodeStyle}>
                      <MaskInput
                        editable={false}
                        style={[styles.inputStyle, { color: theme?.colors?.INPUT_GRAY_COLOR }]}
                        placeholder="Phone number"
                        placeholderTextColor="#847D7B"
                        value={this.state.phone.value}
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
                  {/* <Button
                  style={styles.marginTop}
                  buttonStyle={styles.button}
                  title={localize('LOGOUT')}
                  titleStyle={styles.buttonText}
                  onPress={
                    () => this.logout()
                    //this.props.navigation.navigate("PROMPT")
                  }
                /> */}
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => this.deleteAccount()}
                style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}
              >
                <Text style={{ ...COMMON_STYLE.textStyle(12, theme?.colors?.RED_500, 'BOLD'), textDecorationLine: 'underline' }}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
          {this._renderPickerPopup()}
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
