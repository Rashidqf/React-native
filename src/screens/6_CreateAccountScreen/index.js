import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView, Linking, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import languages
import { localize } from '@languages';

// import firebase services
import { IMAGES, COMMON_STYLE } from '@themes';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';

//import constants
import { COMMON_DATA, API_DATA } from '@constants';

// import api functions
import { callApi } from '@apiCalls';

// import Utils
import { Validation } from '@utils';

// import helpers
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';
import { FONTS } from '../../themes/fonts';
import { COLORS } from '../../themes/colors';

class CreateAccountScreen extends React.Component {
  constructor(props) {
    super(props);

    const mobileno = props.route.params.mobile_no;
    const phoneCode = props.route.params.phone_code;

    this.state = {
      mobile_No: mobileno,
      phone_code: phoneCode,
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
        title: 'Create Password',
        extraProps: { isPassword: true },
      },
      
      uniqueid: this.props?.route?.params?.refUuid,
      // selectTerms: false,
    };
  }
  static contextType = AppContext;

  // render custom component
  renderInputComponent(key) {
    const temp = this.state[key];

    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        // inputStyle={{ color: COLORS.WHITE, fontFamily: FONTS.BOLD, fontSize: Responsive.getFontSize(16) }}
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

  // check all validation
  checkValidation() {
    let isEmptyName = Validation.isEmpty(this.state.fullname.value);
    let isValidEmail = Validation.isValidEmail(this.state.email.value);
    let isValidPassword = Validation.isValidPassword(this.state.password.value);
    // let isAccepted = Validation.isAcceptTerms(this?.state.selectTerms);
   
    if (isValidEmail && isValidPassword && !isEmptyName ) {
      return true;
    } else {
      let msg = '';
      if (isEmptyName) {
        msg = 'ENTER_FULLNAME_MSG';
      } else if (Validation.isEmpty(this.state.email.value)) {
        msg = 'ENTER_EMAIL_MSG';
      } else if (!isValidEmail) {
        msg = 'ENTER_VALID_EMAIL_MSG';
      } else if (Validation.isEmpty(this.state.password.value)) {
        msg = 'ENTER_PASS_MSG';
      } else if (!isValidPassword) {
        msg = 'ENTER_PASS_VALIDATION_MSG';
      } 
      this.props.showErrorAlert(localize('ERROR'), localize(msg));

      return false;
    }
  }
  saveUserData(resp) {
    this.props
      .saveUserData({
        userInfo: resp.data,
        access_token: resp.data.token,
        is_login: true,
      })
      .then(() => {
        setTimeout(() => {
          // this.props.navigation.navigate('PROFILE_PICTURE', { resp: resp });
          this.props.navigation.reset({
            index: 0,

            routes: [
              {
                name: 'PROFILE_PICTURE',
                params: {
                  ...resp,
                  email: this.state.email.value,
                  name: this.state.fullname.value,
                  // nickname: this.state.nickname.value,
                  password: this.state.password.value,
                  mobileNo: this.state.mobile_No,
                  phone_code: this.state.phone_code,
                },
              },
            ],
          });
        }, 1000);
      });
  }
  callSignUp() {
    if (this.checkValidation()) {
      try {
        //FirebaseService.getNotificationToken().then(token => {
        const params = {
          url: API_DATA.SIGN_UP,
          data: {
            name: this.state.fullname.value,
            email: this.state.email.value,
            phone: this.state.mobile_No,
            // nickname: this.state.nickname.value,
            password: this.state.password.value,
            auth_type: 'N',
            device_type: COMMON_DATA.DEVICE_TYPE,
            device_token: 'token',
            invitation_uuid: this.state.uniqueid,
            phone_code: this?.state?.phone_code,
          },
        };
        console.log('params', params);
        this.props.showLoading(true);

        callApi([params])
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.SIGN_UP];
              if (resp.success) {
                StorageOperation.setData([
                  [ASYNC_KEYS.IS_LOGIN, 'true'],
                  [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
                  [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
                ]).then(() => {
                  this.saveUserData(resp);
                });
                this.props.showToast(localize('SUCCESS'), resp.message);
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
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
              enabled
              // keyboardVerticalOffset={100}
            >
              <ScrollView
                contentContainerStyle={{ marginTop: 90 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.loginContent}>
                  <View style={styles.topContent}>
                    <Text style={styles.createAccountText}>Create Account</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={styles.alreadyText}>Already have an account?</Text>
                      <Text
                        style={[styles.signInText, { textDecorationLine: 'underline' }]}
                        onPress={() => this.props.navigation.navigate('LOGIN')}
                      >
                        Sign In
                      </Text>
                    </View>
                  </View>
                  {this.renderInputComponent('fullname')}
                 
                  {this.renderInputComponent('email')}
                  {this.renderInputComponent('password')}
                  <View style={styles.tncView}>
                    {/* <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          selectTerms: !this.state?.selectTerms,
                        })
                      }
                    >
                      <Image source={this?.state?.selectTerms ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2} style={[styles.checkboxStyle]} />
                    </TouchableOpacity>
                    <Text style={styles.iAccText}>I accept </Text>
                    <Text
                      style={[styles.tncText, { textDecorationLine: 'underline' }]}
                      onPress={() => props.navigation.navigate('OpenLink', { url: COMMON_DATA?.TERMS_LINK, name: 'Terms of Service' })}
                    >
                      Terms & conditions
                    </Text> */}
                    <Text
                      style={[styles.tncText]}
                      //  onPress={() => props.navigation.navigate('OpenLink', { url: COMMON_DATA?.TERMS_LINK, name: 'Terms of Service' })}
                    >
                  Minimum length of password must be 8 characters.
                    </Text>
                  </View>
                  {/* <View style={{ height: Responsive.getWidth(8) }} /> */}

                  <Button
                    style={styles.buttonContainerStyle}
                    buttonStyle={styles.button}
                    title={localize('CONTINUE')}
                    titleStyle={styles.buttonText}
                    onPress={
                      () => this.callSignUp()
                      //this.props.navigation.navigate("PROFILE_PICTURE")
                    }
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountScreen);
