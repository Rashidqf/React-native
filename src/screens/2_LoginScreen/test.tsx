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
import {Button} from 'react-native-elements';
import {SafeAreaWrapper} from '../../components/wrapper/index';
import TitleTextInput from '../../components/inputComponents/titleTextInput';

import {ASYNC_KEYS} from '../../constants';
import {COLORS, COMMON_STYLE, IMAGES, STYLES} from '../../theme';
import {localize} from '../../languages';
// import {FirebaseService} from '@services';
import {StorageOperation} from '../../storage/asyncStorage';
import {style} from './style';
import {callApi} from '../../apiCalls';
import {Validation} from '../../utils';
import {COMMON_DATA, API_DATA} from '../../constants';
import {AppContext} from '../../theme/AppContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {AppContext} from '../../theme/AppContextProvider';
// import {useNavigation} from '@react-navigation/native';
// import { TitleTextInput } from '@components'; // Assuming TitleTextInput is a custom component
// import { ASYNC_KEYS } from '@constants';
// import { IMAGES } from '@themes';
// import { localize } from '@languages';
// import { Validation } from '@utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AppContext } from '../../themes/AppContextProvider';
// import { style } from './style';
// import { Button } from 'react-native-elements';
// import messaging from '@react-native-firebase/messaging';
// import { callApi } from '@apiCalls';

const TestScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [email, setEmail] = useState({
    value: '',
    isError: false,
    title: 'Enter your email',
    extraProps: {keyboardType: 'email-address'},
  });
  const [password, setPassword] = useState({
    value: '',
    isError: false,
    title: 'Enter your password',
    extraProps: {isPassword: true},
  });
  const [deviceToken, setDeviceToken] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const context = useContext(AppContext);
  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;
  const styles = style(theme);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = () => {
    setIsKeyboardOpen(true);
  };

  const _keyboardDidHide = () => {
    setIsKeyboardOpen(false);
  };

  useEffect(() => {
    const checkPermissionAndToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await AsyncStorage.getItem('fcmToken');
        if (!token) {
          try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
              setDeviceToken(fcmToken);
            }
          } catch (err) {
            console.log('Error getting FCM token:', err);
          }
        }
      }
    };

    checkPermissionAndToken();
  }, []);

  const saveUserData = (resp: any) => {
    // Simulating storage operation
    // Replace this with actual storage handling if needed
    AsyncStorage.setItem(ASYNC_KEYS.IS_LOGIN, 'true').then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'TAB_NAVIGATOR'}],
      });
    });
  };

  const checkValidation = () => {
    const isValidEmail = Validation.isValidEmail(email.value);
    const isEmptyPassword = Validation.isEmpty(password.value);

    if (isValidEmail && !isEmptyPassword) {
      return true;
    } else {
      let msg = '';
      if (Validation.isEmpty(email.value)) {
        msg = 'ENTER_EMAIL_MSG';
      } else if (!isValidEmail) {
        msg = 'ENTER_VALID_EMAIL_MSG';
      } else if (isEmptyPassword) {
        msg = 'ENTER_PASS_MSG';
      }
      alert(localize('ERROR') + ' ' + localize(msg));
      return false;
    }
  };

  const callLogin = () => {
    if (checkValidation()) {
      try {
        const params = {
          url: 'your_api_url_here',
          data: {
            login_type: 'email',
            email: email.value,
            password: password.value,
            auth_type: 'N',
            device_type: 'your_device_type_here',
            device_token: deviceToken,
          },
        };

        // Assuming callApi is a function that makes the API call
        callApi([params])
          .then(response => {
            let resp = response['your_api_key_here'];
            if (resp.success) {
              saveUserData(resp);
            } else {
              alert(localize('ERROR') + ' ' + resp.message);
            }
          })
          .catch(error => {
            console.log('API call error:', error);
          });
      } catch (e) {
        console.log('Error:', e);
      }
    }
  };

  const renderInputComponent = (key: string) => {
    const temp = key === 'email' ? email : password;

    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        onChangeText={masked => {
          key === 'email'
            ? setEmail({...email, value: masked})
            : setPassword({...password, value: masked});
        }}
        {...temp.extraProps}
      />
    );
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.splashbackgroundImage}>
      <ScrollView
        contentContainerStyle={{marginTop: 100}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.loginContent}>
          {!isKeyboardOpen && (
            <View style={{alignSelf: 'center', marginTop: 19}}>
              <Image
                source={IMAGES?.shortAppLogo}
                style={{height: 95, width: 95, marginTop: 19}}
              />
            </View>
          )}
          <View style={{marginTop: 60}}>
            {renderInputComponent('email')}
            <TouchableOpacity
              style={COMMON_STYLE.linkBtn}
              onPress={() => navigation.navigate('LOGIN_PHONE')}>
              <Image source={IMAGES.mail} style={COMMON_STYLE.linkIcon} />
              <Text style={COMMON_STYLE.linkLabel}>
                Use phone number instead
              </Text>
            </TouchableOpacity>
          </View>
          {renderInputComponent('password')}
        </View>

        <Button
          style={COMMON_STYLE.marginTop}
          buttonStyle={COMMON_STYLE.button}
          title={localize('CONTINUE')}
          titleStyle={COMMON_STYLE.buttonText}
          onPress={() => callLogin()}
        />
      </ScrollView>
    </ImageBackground>
  );
};

export default TestScreen;
