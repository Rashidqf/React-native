import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

//import themes
import { IMAGES } from '@themes';

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

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';

import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

// import api functions
import { callApi } from '@apiCalls';

//import constants
import { API_DATA } from '@constants';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';
class LoginVerifyScreen extends React.Component {
  constructor(props) {
    super(props);

    const mobileno = props.route.params.mobile_no;
    const countrycode = props?.route?.params?.phone_code;
    const redirection = props.route.params.screen_redirection;
    this.state = {
      mobile_No: mobileno,
      phoneCode: countrycode,
      screen_redirection: redirection,
      phone: {
        value: '',
        isError: false,
        title: 'Enter your phone number',
      },
      CELL_COUNT: 6,
      value: '',
      uuid: this.props?.route?.params?.refUuid,
    };
  }
  static contextType = AppContext;

  componentDidMount() {}
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
  callverficationCode(code) {
    try {
      const params = {
        url: API_DATA.VERIFICATION_CODE,
        data: {
          phone: this.state.mobile_No,
          code: code,
          phone_code: this.state.phoneCode,
          type: this.state.screen_redirection,
        },
      };

      this.props.showLoading(true);

      callApi([params])
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.VERIFICATION_CODE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message).then(() => {
                if (this.state.screen_redirection == 'login') {
                  StorageOperation.setData([
                    [ASYNC_KEYS.IS_LOGIN, 'true'],
                    [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
                    [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
                  ]).then(() => {
                    this.saveUserData(resp);
                  });
                } else {
                  this.props.navigation.navigate('CREATE_ACCOUNT', {
                    mobile_no: this.state.mobile_No,
                    phone_code: this?.state?.phoneCode,
                    refUuid: this.state.uuid,
                  });
                }
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

  callverficationMobile() {
    try {
      const params = {
        url: API_DATA.VERIFICATION_MOBILENO,
        data: {
          phone: this.state.mobile_No,
          type: this.state.screen_redirection,
        },
      };

      this.props.showLoading(true);

      callApi([params])
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.VERIFICATION_MOBILENO];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message).then(() => {});
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

  setValue(value) {
    this.setState({ value: value });
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <ScrollView
            contentContainerStyle={{ marginTop: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.loginContent]}>
              <View style={[styles.verifyContent]}>
                <Text style={styles.verifyText}>
                  Enter the 6-digit code sent to your phone number {this.state?.phoneCode}
                  {this.state.mobile_No}
                </Text>
                <View style={styles.codeField}>
                  <CodeField
                    ref={'CodeField'}
                    // {...props}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={this.state.phone.value}
                    onChangeText={text => {
                      this.changeData('phone', {
                        value: text,
                      });
                      if (text.length == 6) {
                        this.callverficationCode(text);
                      }
                    }}
                    cellCount={this.state.CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                      <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        // onLayout={getCellOnLayoutHandler(index)}
                      >
                        {symbol || (isFocused ? <Cursor /> : null)}
                      </Text>
                    )}
                  />
                </View>
                <TouchableOpacity onPress={() => this.callverficationCode()}>
                  <Text style={styles.activateText}>Full code is need to activate</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.receiveText}>Didn’t receive code?</Text>
                  <Text onPress={() => this.callverficationMobile()} style={[styles.resendText, { textDecorationLine: 'underline' }]}>
                    Resend
                  </Text>
                </View>
              </View>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginVerifyScreen);
