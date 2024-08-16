import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import {Button} from 'react-native-elements';
import MaskInput from 'react-native-mask-input';
import {Responsive} from '../../helper';
import {localize} from '../../languages';
import {Validation} from '../../utils';
import {AppContext} from '../../theme/AppContextProvider';
import {COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {style} from './style';
import {API_DATA} from '../../components';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import LoadingIndicator from '../../components/modalComponents/loadingModel';
import AlertModel from '../../components/modalComponents/alertModel';
import {useAppDispatch} from '../../store/hooks';
import {saveUserData, showErrorAlert} from '../../store/action/actions';

interface Props {
  navigation: any;
}

const LoginPhoneScreen: React.FC<Props> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AppContext);
  const dispatch = useAppDispatch();

  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;
  const styles = style(theme);
  const [hasFocus, setHasFocus] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardOpen(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardOpen(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const saveUserLoginData = () => {
    // Simulating async storage operation
    setTimeout(() => {
      // Replace with your actual logic to retrieve and save user data
    }, 2000);
  };

  const checkValidation = () => {
    setIsLoading(true);
    const isEmptyPhoneNumber = Validation.isEmpty(phoneNumber);
    const isValidPhoneNumber = Validation.isValidPhoneNo(phoneNumber);

    if (!isEmptyPhoneNumber && isValidPhoneNumber) {
      setIsLoading(false);
      return true;
    } else {
      let msg = '';
      if (isEmptyPhoneNumber) {
        msg = 'ENTER_PHONENO_MSG';
      } else if (!isValidPhoneNumber) {
        msg = 'ENTER_PHONENO_VALID_MSG';
      }
      setIsLoading(false);
      setAlertMessage(msg); // Set alert message for display
      return false;
    }
  };

  interface ApiResponse {
    success: boolean;
    message: string;
    status: number;
  }

  const callVerificationMobile = async () => {
    if (checkValidation()) {
      setIsLoading(true);
      try {
        const response = await axios.post<ApiResponse>(
          'https://api.prod.doyousidenote.com/api/v1/vcode/send',
          {phone_code: countryCode, phone: phoneNumber, type: 'login'},
        );

        if (!response.data.success) {
          dispatch(
            showErrorAlert(localize('ERROR'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
          dispatch(
            saveUserData({
              userInfo: response.data,
              access_token: response?.data?.data?.token,
              is_login: true,
            }),
          );
        } else {
          dispatch(
            showErrorAlert(localize('SUCCESS'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
          navigation.navigate('VERIFY_PIN', {
            mobile_no: phoneNumber,
            phone_code: countryCode,
            screen_redirection: 'login',
          });
        }
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    console.log('Navigating to LOGIN_EMAIL screen');
    navigation.navigate('LOGIN');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background.png')}
      style={styles.background}>
      <LoadingIndicator isLoading={isLoading} />

      <AlertModel />

      <ScrollView
        contentContainerStyle={{marginTop: 100}}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled">
        {!isKeyboardOpen && (
          <View style={{alignSelf: 'center', marginTop: 19}}>
            <Image
              source={require('../../assets/images/logo/logo.png')}
              style={{height: 95, width: 95, marginTop: 19}}
            />
          </View>
        )}
        <View style={styles.inputContainerStyle}>
          <Text style={styles.titleStyle}>Enter your phone number</Text>
        </View>
        <View style={styles.loginContent}>
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
              {marginVertical: Responsive.getHeight(2)},
            ]}>
            <TouchableOpacity onPress={() => setShowCountryPicker(true)}>
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
                      {backgroundColor: '#171717', width: 1, height: '100%'},
                    ]}></View>
                </View>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.inputCodeStyle,
                {width: '100%', alignItems: 'center', justifyContent: 'center'},
              ]}>
              <MaskInput
                style={[
                  COMMON_STYLE.inputStyle,
                  {
                    paddingLeft: 20,
                    width: '100%',
                    fontFamily: FONTS.BOLD,
                    fontSize: 16,
                  },
                ]}
                placeholder="Phone number"
                placeholderTextColor="#847D7B"
                value={phoneNumber}
                keyboardType="number-pad"
                onFocus={() => setHasFocus(true)}
                onChangeText={(masked, unmasked) => setPhoneNumber(masked)}
                spellCheck={false}
                autoCorrect={false}
                mask={text => [
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
                ]}
              />
            </View>
          </View>
          <CountryPicker
            lang={'en'}
            show={showCountryPicker}
            initialState="+1"
            enableModalAvoiding={true}
            pickerButtonOnPress={(item: any) => {
              setCountryCode(item?.dial_code);
              setShowCountryPicker(false);
            }}
            onBackdropPress={() => setShowCountryPicker(false)}
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

          <TouchableOpacity
            style={COMMON_STYLE.linkBtn}
            onPress={handleNavigate}>
            <Text style={COMMON_STYLE.linkLabel}>
              Use email address instead
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          style={COMMON_STYLE.marginTop}
          buttonStyle={COMMON_STYLE.button}
          title={localize('CONTINUE')}
          titleStyle={COMMON_STYLE.buttonText}
          onPress={() => callVerificationMobile()}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default LoginPhoneScreen;
