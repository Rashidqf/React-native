import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import {style} from './style';
import {Button, Input} from 'react-native-elements';
import MaskInput from 'react-native-mask-input';
import {COLORS, COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {SafeAreaWrapper} from '../../components/wrapper';
import TitleTextInput from '../../components/inputComponents/titleTextInput';
import {API_DATA, ASYNC_KEYS} from '../../components';
import {localize} from '../../languages';
import {StorageOperation} from '../../storage/asyncStorage';
import {callApi} from '../../apiCalls';
import {Responsive} from '../../helper';
import {Validation} from '../../utils';
import {AppContext} from '../../theme/AppContextProvider';
import LoadingIndicator from '../../components/modalComponents/loadingModel';
import AlertModel from '../../components/modalComponents/alertModel';
import axios from 'axios';
import {useAppDispatch} from '../../store/hooks';
import {showErrorAlert} from '../../store/action/actions';
interface Props {
  navigation: any;
}
interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
}

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState({
    value: '',
    isError: false,
    title: 'Enter your phone number',
    extraProps: {
      maxLength: 15,

      mask: (text: any) => {
        return [
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ];
      },
    },
  });
  const [uuid, setUuid] = useState('');
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);

  // useEffect(() => {
  //   const urlListener = ({url}: {url: string}) => {
  //     if (typeof url === 'string') {
  //       const [name, id] = url.split('//')[1].split('/');
  //       setUuid(id);
  //       deepLinking(name, id);
  //     } else {
  //       console.log(typeof url);
  //     }
  //   };

  //   Linking.addEventListener('url', urlListener);
  //   getIntialLinking();

  //   return () => {
  //     Linking.removeEventListener('url', urlListener);
  //   };
  // }, []);

  // const getIntialLinking = () => {
  //   Linking.getInitialURL().then(url => {
  //     if (url) {
  //       const [name, id] = url.split('//')[1].split('/');
  //       setUuid(id);
  //       deepLinking(name, id);
  //     }
  //   });
  // };

  const deepLinking = (name: string, id: string) => {
    switch (name) {
      case 'invitation':
        // this.validateFriend(id);
        break;
      default:
    }
  };

  const checkValidation = () => {
    let isEmptyphonneno = Validation.isEmpty(phone.value);
    let isLengthPhoneno = Validation.isValidPhoneNo(phone.value);
    if (!isEmptyphonneno && isLengthPhoneno) {
      return true;
    } else {
      let msg = '';
      if (isEmptyphonneno) {
        msg = 'ENTER_PHONENO_MSG';
      } else if (!isLengthPhoneno) {
        msg = 'ENTER_PHONENO_VALID_MSG';
      }
      dispatch(
        showErrorAlert(localize('SUCCESS'), localize(msg), () => {
          console.log('OK pressed');
        }),
      );
      return false;
    }
  };

  const callverficationMobile = async () => {
    if (checkValidation()) {
      try {
        setIsLoading(true);
        const response = await axios.post<ApiResponse>(
          'https://api.prod.doyousidenote.com/api/v1/vcode/send',
          {phone: phone.value, phone_code: countryCode, type: 'signup'},
        );
        console.log(phone.value, countryCode);
        console.log('response', response);
        if (!response.data.success) {
          dispatch(
            showErrorAlert(localize('ERROR'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
        } else {
          dispatch(
            showErrorAlert(localize('SUCCESS'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
          navigation.navigate('VERIFY_PIN', {
            mobile_no: phone.value,
            phone_code: countryCode,
            screen_redirection: 'signup',
            refUuid: uuid,
          });
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setIsLoading(false);
      }
      // const params = {
      //   url: API_DATA.VERIFICATION_MOBILENO,
      //   data: {
      //     phone: phone.value,
      //     phone_code: countryCode,
      //     type: 'signup',
      //   },
      // };
      // showLoading(true);
      // callApi([params])
      //   .then(response => {
      //     // showLoading(false).then(() => {
      //     let resp = response[API_DATA.VERIFICATION_MOBILENO];
      //     if (resp.success) {
      //       // showToast(localize('SUCCESS'), resp.message).then(() => {
      //       navigation.navigate('VERIFY_PIN', {
      //         mobile_no: phone.value,
      //         phone_code: countryCode,
      //         screen_redirection: 'signup',
      //         refUuid: uuid,
      //       });
      //       // });
      //       StorageOperation.setData([
      //         [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      //         [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
      //       ]).then(() => {
      //         // saveUserData(resp);
      //       });
      //     } else {
      //       // showErrorAlert(localize('ERROR'), resp.message);
      //     }
      //     // });
      //   })
      //   .catch(error => {
      //     // showLoading(false);
      //   });
      // } catch (e) {
      //   console.log('catch error >>> ', e);
      // }
    }
  };

  const changeData = (key: string, object: any) => {
    setPhone(prev => ({...prev, ...object}));
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <SafeAreaWrapper>
        <LoadingIndicator isLoading={isLoading} />

        <AlertModel />
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.logoView}>
              <Image
                source={IMAGES?.shortAppLogo}
                style={{height: 90, width: 90}}
              />
            </View>
          </View>
          <View style={{marginTop: 30}}>
            <Text style={COMMON_STYLE.h7}>Welcome to Sidenote</Text>
            <Text style={COMMON_STYLE.h7}>
              {'Create an account or '}
              <Text
                onPress={() => navigation.navigate('LOGIN')}
                style={[
                  COMMON_STYLE.h7,
                  {textDecorationLine: 'underline', color: COLORS.BLUE_100},
                ]}>
                Sign In
              </Text>
            </Text>
          </View>
          <View>
            <View
              style={[
                hasFocus
                  ? [
                      COMMON_STYLE.inputViewFocusStyle,
                      {backgroundColor: theme?.colors?.MASK_INPUT},
                    ]
                  : [
                      COMMON_STYLE.inputViewStyle,
                      {backgroundColor: theme?.colors?.MASK_INPUT},
                    ],
                {marginVertical: Responsive.getHeight(3)},
              ]}>
              <View
                style={[
                  styles.inputCodeStyle,
                  {position: 'relative', width: '100%'},
                ]}>
                <TouchableOpacity onPress={() => setShow(true)}>
                  <View style={styles.mobileView}>
                    <View style={styles.countyCodeView}>
                      <Text
                        style={[
                          COMMON_STYLE.countyCode,
                          COMMON_STYLE.marginStyle(3, 0, 0, 0),
                        ]}>
                        {countryCode}
                      </Text>
                      <View
                        style={[
                          COMMON_STYLE.marginStyle(3, 0, 0, 0),
                          {
                            backgroundColor: '#171717',
                            width: 1,
                            height: '100%',
                          },
                        ]}></View>
                    </View>
                  </View>
                </TouchableOpacity>
                <MaskInput
                  style={[
                    COMMON_STYLE.mobileInputView,
                    {color: theme?.colors?.WHITE},
                  ]}
                  placeholder="Phone number"
                  placeholderTextColor={'#8F8F8F'}
                  value={phone.value}
                  onFocus={() => setHasFocus(true)}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    changeData('phone', {
                      value: masked,
                      maskedValue: obfuscated,
                    });
                  }}
                  spellCheck={false}
                  autoCorrect={false}
                  keyboardType="number-pad"
                  {...phone.extraProps}
                />
              </View>
            </View>
          </View>
          <CountryPicker
            show={show}
            lang="en"
            enableModalAvoiding={true}
            pickerButtonOnPress={item => {
              setCountryCode(item?.dial_code);
              setShow(false);
            }}
            onBackdropPress={() => setShow(false)}
            style={{
              modal: {
                height: 450,
              },
              textInput: {
                color: 'black',
              },
              countryName: {
                color: 'black',
              },
            }}
          />
          <Button
            buttonStyle={COMMON_STYLE.button}
            title={localize('CONTINUE')}
            titleStyle={COMMON_STYLE.buttonText}
            onPress={() => {
              callverficationMobile();
            }}
          />
          <Text
            style={[COMMON_STYLE.pStyle, COMMON_STYLE.marginStyle(0, 0, 4, 0)]}>
            By providing your phone number, you agree Sidenote may send you
            texts with notifications and security codes
          </Text>
        </ScrollView>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default RegisterScreen;
