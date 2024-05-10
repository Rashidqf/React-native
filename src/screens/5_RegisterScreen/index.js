import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, Linking, ImageBackground } from 'react-native';
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

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button, Input } from 'react-native-elements';

// import api functions
import { callApi } from '@apiCalls';

//import constants
import { API_DATA } from '@constants';
import { Responsive } from '@helpers';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';

// import Utils
import { Validation } from '@utils';
import { AppContext } from '../../themes/AppContextProvider';
import { COLORS } from '../../themes/colors';
import { FONTS } from '../../themes/fonts';

class RegisterScreen extends React.Component {
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
      uuid: '',
    };
  }
  static contextType = AppContext;

  setFocus(hasFocus) {
    this.setState({ hasFocus });
  }

  urlListener = ({ url }) => {
    // this.getIntialLinking();

    if (typeof url === 'string') {
      const [name, id] = url.split('//')[1].split('/');
      this.setState({
        uuid: id,
      });
      // navigateHandler(url);
      this.deepLinking(name, id);
    } else {
      console.log(typeof url);
    }
  };
  componentDidMount() {
    Linking.addEventListener('url', this.urlListener);
    this.getIntialLinking();
  }

  // componentWillUnmount() {
  //   Linking.removeAllListeners();
  // }

  getIntialLinking = () => {
    Linking.getInitialURL().then(url => {
      if (url) {
        const [name, id] = url.split('//')[1].split('/');
        this.setState({
          uuid: id,
        });
        // navigateHandler(url);
        this.deepLinking(name, id);
      }
    });
  };

  deepLinking = (name, id) => {
    switch (name) {
      case 'invitation':
        // this.validateFriend(id);
        break;
      default:
    }
  };

  // check all validation
  checkValidation() {
    let isEmptyphonneno = Validation.isEmpty(this.state.phone.value);
    let isLengthPhoneno = Validation.isValidPhoneNo(this.state.phone.value);
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

  callverficationMobile() {
    if (this.checkValidation()) {
      try {
        const params = {
          url: API_DATA.VERIFICATION_MOBILENO,
          data: {
            phone: this.state.phone.value,
            phone_code: this.state.countryCode,
            type: 'signup',
          },
        };
        this.props.showLoading(true);

        callApi([params])
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.VERIFICATION_MOBILENO];
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message).then(() => {
                  this.props.navigation.navigate('VERIFY_PIN', {
                    mobile_no: this.state.phone.value,
                    phone_code: this.state?.countryCode,
                    screen_redirection: 'signup',
                    refUuid: this.state.uuid,
                  });
                });
                StorageOperation.setData([
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
      } catch (e) {
        console.log('catch error >>> ', e);
      }
    }
  }
  // Button Press Action & Event handling functions
  // Change of textInput states
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
        <SafeAreaWrapper backgroundColor={{}}>
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false} keyboardShouldPersistTaps="handled">
            <View>
              <View style={styles.logoView}>
                <Image source={IMAGES?.shortAppLogo} style={{ height: 90, width: 90 }} />
              </View>
            </View>
            <View style={{ marginTop: 30 }}>
              <Text style={styles.h7}>Welcome to Sidenote</Text>
              <Text style={styles.h7}>
                {'Create an account or '}
                <Text
                  onPress={() => this.props.navigation.navigate('LOGIN')}
                  style={[styles.h7, { textDecorationLine: 'underline', color: COLORS.BLUE_100 }]}
                >
                  Sign In
                </Text>
              </Text>
            </View>
            <View>
              <View
                style={[
                  this.state.hasFocus
                    ? [styles.inputViewFocusStyle, { backgroundColor: theme?.colors?.MASK_INPUT }]
                    : [styles.inputViewStyle, { backgroundColor: theme?.colors?.MASK_INPUT }],
                  { marginVertical: Responsive.getHeight(3) },
                ]}
              >
                <View style={[styles.inputCodeStyle, { position: 'relative', width: '100%' }]}>
                  <TouchableOpacity onPress={() => this.setState({ show: true })}>
                    <View style={styles.mobileView}>
                      <View style={styles.countyCodeView}>
                        <Text style={[styles.countyCode, styles.marginStyle(3, 0, 0, 0)]}>{this?.state?.countryCode}</Text>
                        <View style={[styles.marginStyle(3, 0, 0, 0), { backgroundColor: '#171717', width: 1, height: '100%' }]}></View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <MaskInput
                    style={[styles.mobileInputView, { color: theme?.colors?.WHITE }]}
                    placeholder="Phone number"
                    placeholderTextColor={'#8F8F8F'}
                    // selectionColor={theme?.colors?.WHITE}
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
            </View>
            <CountryPicker
              show={this?.state?.show}
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
            <Button
              buttonStyle={styles.button}
              title={localize('CONTINUE')}
              titleStyle={styles.buttonText}
              onPress={() => {
                // this.props.showLoading(true)
                this.callverficationMobile();
                // this.props.navigation.navigate("CREATE_ACCOUNT")
              }}
            />
            <Text style={[styles.pStyle, styles.marginStyle(0, 0, 4, 0)]}>
              By providing your phone number, you agree Sidenote may send you texts with notifications and security codes
            </Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
