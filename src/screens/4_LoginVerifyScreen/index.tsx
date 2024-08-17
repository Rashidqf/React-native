import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
} from 'react-native';

//import themes
// import { IMAGES } from '@themes';

//import components
// import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
// import { ASYNC_KEYS } from '@constants';

//import languages
// import { localize } from '@languages';

//import storage functions
// import { StorageOperation } from '@storage';

//import style
// import { style } from './style';

import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import {useNavigation} from '@react-navigation/native';

// import api functions
// import { callApi } from '@apiCalls';

//import constants
// import { API_DATA } from '@constants';
// import { Responsive } from '@helpers';
// import { AppContext } from '../../themes/AppContextProvider';

import {Responsive} from '../../helper';
import {localize} from '../../languages';
import {StorageOperation} from '../../storage/asyncStorage';
import {Validation} from '../../utils';
import {AppContext} from '../../theme/AppContextProvider';
import {COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {style} from './style';
import {API_DATA, ASYNC_KEYS} from '../../components';
import {SafeAreaWrapper} from '../../components/wrapper';
import TitleTextInput from '../../components/inputComponents/titleTextInput';
import {callApi} from '../../apiCalls';
import {TextInput} from 'react-native-paper';
import axios from 'axios';
import {useAppSelector} from '../../store/hooks';
import LoadingIndicator from '../../components/modalComponents/loadingModel';

interface Props {
  navigation: any;
  route: any;
}

const LoginVerifyScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    mobile_no = '1234567890',
    phone_code = '+1',
    screen_redirection = 'login',
    refUuid = 'default-uuid',
  } = route.params ?? {};

  const [mobileNo, setMobileNo] = useState(mobile_no);
  const [phoneCode, setPhoneCode] = useState(phone_code);
  const [screenRedirection, setScreenRedirection] =
    useState(screen_redirection);
  const [value, setValue] = useState('');
  const [uuid, setUuid] = useState(refUuid);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState({
    value: '',
    isError: false,
    title: 'Enter your phone number',
  });

  const CELL_COUNT = 6;

  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);
  // const selector = useAppSelector();

  const codeFieldRef = useRef<React.ElementRef<typeof CodeField>>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (codeFieldRef.current) {
          codeFieldRef.current.focus();
        }
      },
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const data = useAppSelector(state => state.redState.userData);

  // const saveUserData = (resp: any) => {
  //   StorageOperation.setData([
  //     [ASYNC_KEYS.IS_LOGIN, 'true'],
  //     [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
  //     [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
  //   ]);
  //   // .then(() => {
  //   //   navigation.reset({
  //   //     index: 0,
  //   //     routes: [{name: 'TAB_NAVIGATOR'}],
  //   //   });
  //   // });
  // };

  const callVerificationCode = async (code: string) => {
    setIsLoading(true);
    try {
      const params = {
        url: API_DATA.VERIFICATION_CODE,
        data: {
          phone_code: phoneCode,
          phone: mobileNo,
          code: code,
          type: screenRedirection,
        },
      };

      const response = await axios.post(
        'https://api.prod.doyousidenote.com/api/v1/vcode/verify',
        params.data,
      );
      setIsLoading(false);
      // saveUserData(response);
      if (response.data.success) {
        if (screenRedirection === 'login') {
          // saveUserData(response.data);
          StorageOperation.setData([
            [ASYNC_KEYS.IS_LOGIN, 'true'],
            [ASYNC_KEYS.USER_DATA, JSON.stringify(response.data.data)],
            [ASYNC_KEYS.ACCESS_TOKEN, response.data.data.token],
          ]);
          navigation.reset({
            index: 0,
            routes: [{name: 'TAB_NAVIGATOR'}],
          });
        } else {
          navigation.navigate('CREATE_ACCOUNT', {
            mobile_no: mobileNo,
            phone_code: phoneCode,
            refUuid: uuid,
          });
        }
      } else {
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Catch error: ', error);
    }
  };

  const callVerificationMobile = async () => {
    try {
      const params = {
        url: API_DATA.VERIFICATION_MOBILENO,
        data: {
          phone: mobileNo,
          type: screenRedirection,
        },
      };

      const response = await axios.post(
        'https://api.prod.doyousidenote.com/api/v1/vcode/send',
        params.data,
      );

      //   callApi([params])
      //     .then(response => {
      //       let resp = response[API_DATA.VERIFICATION_MOBILENO];
      //       if (resp.success) {
      //         alert(localize('SUCCESS') + ': ' + resp.message);
      //       } else {
      //         alert(localize('ERROR') + ': ' + resp.message);
      //       }
      //     })
      //     .catch(error => {
      //       console.log('Error: ', error);
      //     });
    } catch (e) {
      console.log('Catch error: ', e);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <LoadingIndicator isLoading={isLoading} />

      <SafeAreaWrapper>
        <ScrollView
          contentContainerStyle={{marginTop: 100}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.loginContent]}>
            <View style={[styles.verifyContent]}>
              <Text style={styles.verifyText}>
                Enter the 6-digit code sent to your phone number {phoneCode}-
                {mobileNo}
              </Text>
              <View style={styles.codeField}>
                <CodeField
                  ref={codeFieldRef}
                  value={phone.value}
                  onChangeText={text => {
                    setPhone({...phone, value: text});
                    if (text.length === 6) {
                      callVerificationCode(text);
                    }
                  }}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeField}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={({index, symbol, isFocused}) => (
                    <Text
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  )}
                />
              </View>
              <TouchableOpacity onPress={() => callVerificationCode(value)}>
                <Text style={styles.activateText}>
                  Full code is need to activate
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.receiveText}>Didn’t receive code?</Text>
                <Text
                  onPress={() => callVerificationMobile()}
                  style={[
                    styles.resendText,
                    {textDecorationLine: 'underline'},
                  ]}>
                  Resend
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default LoginVerifyScreen;
