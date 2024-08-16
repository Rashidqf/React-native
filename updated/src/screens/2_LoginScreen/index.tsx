import React, {useState, useEffect, useContext, useRef} from 'react';
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
import {StorageOperation} from '../../storage/asyncStorage';
import {style} from './style';
import {Validation} from '../../utils';
import {COMMON_DATA, API_DATA} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../theme/AppContextProvider';
import {useNavigation} from '@react-navigation/native';
import ToastAlert from '../../components/modalComponents/toastAlert';
import axios from 'axios';
import {saveUserData, showErrorAlert} from '../../store/action/actions';
import {useAppDispatch} from '../../store/hooks';
import LoadingIndicator from '../../components/modalComponents/loadingModel';
import AlertModel from '../../components/modalComponents/alertModel';

interface Props {
  navigation: any;
}

interface State {
  email: {
    value: string;
    isError: boolean;
    title: string;
    extraProps: {
      keyboardType: 'email-address';
    };
  };
  password: {
    value: string;
    isError: boolean;
    title: string;
    extraProps: {
      isPassword: boolean;
    };
  };
  deviceToken: string;
  hasFocus: boolean;
  isKeyboardOpen: boolean;
  showPasswordField: boolean;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const passwordInputRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<State>({
    email: {
      value: '',
      isError: false,
      title: 'Enter your email',
      extraProps: {keyboardType: 'email-address'},
    },
    password: {
      value: '',
      isError: false,
      title: 'Enter your password',
      extraProps: {isPassword: true},
    },
    deviceToken: '',
    hasFocus: false,
    isKeyboardOpen: false,
    showPasswordField: false, // Initially not showing password field
  });
  const [mydata, setData] = useState();

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
    setState(prevState => ({...prevState, isKeyboardOpen: true}));
  };

  const _keyboardDidHide = () => {
    setState(prevState => ({...prevState, isKeyboardOpen: false}));
  };

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    setTimeout(() => {
      // saveUserLoginData();
    }, 2000);
  };

  const renderInputComponent = (key: 'email' | 'password') => {
    const temp: any = state[key];
    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        onChangeText={(masked: any) => {
          changeData(key, {value: masked});
        }}
        inputRef={key === 'password' ? passwordInputRef : null}
        {...temp.extraProps}
      />
    );
  };

  const changeData = (key: any, newData: any) => {
    setState(prevState => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        ...newData,
      },
    }));
  };

  const checkValidation = () => {
    let isValidEmail = Validation.isValidEmail(state.email.value);
    let isEmptyPassword = Validation.isEmpty(state.password.value);

    if (isValidEmail && !isEmptyPassword) {
      return true;
    } else {
      let msg = '';
      if (Validation.isEmpty(state.email.value)) {
        msg = 'ENTER_EMAIL_MSG';
      } else if (!isValidEmail) {
        msg = 'ENTER_VALID_EMAIL_MSG';
      } else if (isEmptyPassword) {
        msg = 'ENTER_PASS_MSG';
      }

      dispatch(
        showErrorAlert(localize('ERROR'), localize(msg), () => {
          console.log('OK pressed');
        }),
      );
      return false;
    }
  };

  const callLogin = async () => {
    setIsLoading(true);
    if (!checkValidation()) {
      setIsLoading(false);
      return;
    } else {
      try {
        console.log('running');
        const params = {
          url: API_DATA.LOGIN,
          data: {
            login_type: 'email',
            email: state.email.value,
            password: state.password.value,
            auth_type: 'N',
            device_type: COMMON_DATA.DEVICE_TYPE,
            device_token: state.deviceToken,
          },
        };

        const response = await axios.post(
          'https://api.prod.doyousidenote.com/api/v1/login',
          params.data,
        );
        dispatch(
          saveUserData({
            userInfo: response.data,
            access_token: response?.data?.data?.token,
            is_login: true,
          }),
        );

        if (!response.data.success) {
          setIsLoading(false);
          saveUserDatas(response?.data);
          dispatch(
            showErrorAlert(localize('ERROR'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
        } else {
          saveUserDatas(response?.data);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('API call error:');
      }
    }
  };

  const saveUserDatas = async (resp: any) => {
    const userInfo = resp.data.id ? JSON.stringify(resp.userInfo) : '';
    const accessToken = resp.data.token || '';

    StorageOperation.setData([
      [ASYNC_KEYS.IS_LOGIN, 'true'],
      [ASYNC_KEYS.USER_DATA, userInfo],
      [ASYNC_KEYS.ACCESS_TOKEN, accessToken],
    ]).then(async () => {
      const savedIsLogin = await AsyncStorage.getItem(ASYNC_KEYS.IS_LOGIN);
      const savedUserData = await AsyncStorage.getItem(ASYNC_KEYS.USER_DATA);
      const savedAccessToken = await AsyncStorage.getItem(
        ASYNC_KEYS.ACCESS_TOKEN,
      );

      navigation.reset({
        index: 0,
        routes: [{name: 'TAB_NAVIGATOR'}],
      });
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background.png')}
      style={styles.splashbackgroundImage}>
      <LoadingIndicator isLoading={isLoading} />
      <AlertModel />
      <SafeAreaWrapper>
        <ScrollView
          contentContainerStyle={{marginTop: 100}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.loginContent}>
            {!state.isKeyboardOpen && (
              <View style={{alignSelf: 'center'}}>
                <Image
                  source={IMAGES?.shortAppLogo}
                  style={{height: 95, width: 95, marginTop: 19}}
                />
              </View>
            )}
            <View style={{marginTop: 30}}>
              <Text style={COMMON_STYLE.h7}>
                {'Already have an account '}
                <Text
                  onPress={() => navigation.navigate('REGISTER')}
                  style={[
                    COMMON_STYLE.h7,
                    {textDecorationLine: 'underline', color: COLORS.BLUE_100},
                  ]}>
                  Sign Up
                </Text>
              </Text>
            </View>
            <View>
              {renderInputComponent('email')}
              {state.showPasswordField && renderInputComponent('password')}
              <TouchableOpacity
                style={[COMMON_STYLE.linkBtn]}
                onPress={() => navigation.navigate('LOGIN_PHONE')}>
                <Image
                  source={require('../../assets/images/login/phone.png')}
                  style={[STYLES.linkIcon, {marginEnd: 8, marginTop: 5}]}
                />
                <Text style={COMMON_STYLE.linkLabel}>
                  Use phone number instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            style={COMMON_STYLE.marginTop}
            buttonStyle={COMMON_STYLE.button}
            title={localize('CONTINUE')}
            onPress={() => {
              if (!state.email.value) {
                dispatch(
                  showErrorAlert(
                    localize('ERROR'),
                    localize('ENTER_EMAIL_MSG'),
                    () => {
                      console.log('OK pressed');
                    },
                  ),
                );
              } else if (state.showPasswordField) {
                callLogin();
              } else {
                setState(prevState => ({
                  ...prevState,
                  showPasswordField: true,
                }));
                passwordInputRef.current?.focus();
              }
            }}
          />
        </ScrollView>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default LoginScreen;
