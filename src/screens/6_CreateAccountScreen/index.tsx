import React, {useContext, useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {style} from './style';
import {AppContext} from '../../theme/AppContextProvider';
import {COLORS, COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {Validation} from '../../utils';
import {API_DATA, ASYNC_KEYS, COMMON_DATA} from '../../components';
import TitleTextInput from '../../components/inputComponents/titleTextInput';
import axios from 'axios';
import {useAppDispatch} from '../../store/hooks';
import {saveUserData, showErrorAlert} from '../../store/action/actions';
import {localize} from '../../languages';
import {StorageOperation} from '../../storage/asyncStorage';

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
}

const CreateAccountScreen = ({route, navigation}: any) => {
  const context = useContext(AppContext);
  const dispatch = useAppDispatch();
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);

  // const mobileno = route.params.mobile_no;
  // const phoneCode = route.params.phone_code;
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    mobile_No: route?.params?.mobile_no,
    phone_code: route?.params?.phone_code,
    fullname: {
      value: '',
      isError: false,
      title: 'Full Name',
    },
    email: {
      value: '',
      isError: false,
      title: 'Email Address',
      extraProps: {keyboardType: 'email-address'},
    },
    password: {
      value: '',
      isError: false,
      title: 'Create Password',
      extraProps: {isPassword: true},
    },
    uniqueid: route?.params?.refUuid,
  });

  const renderInputComponent = (key: 'fullname' | 'email' | 'password') => {
    const temp: any = state[key];

    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        onChangeText={(masked: string) => {
          changeData(key, {value: masked});
        }}
        {...temp.extraProps}
      />
    );
  };

  const changeData = (key: string, object: any) => {
    setState(prevState => ({
      ...prevState,
      [key]: {...prevState[key], ...object},
    }));
  };

  const checkValidation = () => {
    let isEmptyName = Validation.isEmpty(state.fullname.value);
    let isValidEmail = Validation.isValidEmail(state.email.value);
    let isValidPassword = Validation.isValidPassword(state.password.value);

    if (isValidEmail && isValidPassword && !isEmptyName) {
      return true;
    } else {
      let msg = '';
      if (isEmptyName) {
        msg = 'ENTER_FULLNAME_MSG';
      } else if (Validation.isEmpty(state.email.value)) {
        msg = 'ENTER_EMAIL_MSG';
      } else if (!isValidEmail) {
        msg = 'ENTER_VALID_EMAIL_MSG';
      } else if (Validation.isEmpty(state.password.value)) {
        msg = 'ENTER_PASS_MSG';
      } else if (!isValidPassword) {
        msg = 'ENTER_PASS_VALIDATION_MSG';
      }
      // alert(msg); // Replace with your error handling
      return false;
    }
  };

  // const saveUserData = (resp: any) => {
  //   // Implement your logic here
  //   console.log('Saving user data:', resp);
  // };

  const callSignUp = async () => {
    if (checkValidation()) {
      const params = {
        url: API_DATA.SIGN_UP,
        data: {
          name: state.fullname.value,
          email: state.email.value,
          phone: state.mobile_No,
          password: state.password.value,
          auth_type: 'N',
          device_type: COMMON_DATA.DEVICE_TYPE,
          device_token: 'token',
          invitation_uuid: state.uniqueid,
          phone_code: state.phone_code,
        },
      };
      try {
        setIsLoading(true);
        const response = await axios.post<ApiResponse>(
          'https://api.prod.doyousidenote.com/api/v1/signup',
          params.data,
        );
        console.log('token', response.data.token);
        if (!response.data.success) {
          dispatch(
            showErrorAlert(localize('ERROR'), response.data.message, () => {
              console.log('OK pressed');
            }),
          );
          dispatch(
            saveUserData({
              is_login: true,
              userInfo: response.data,
              access_token: response.data.token,
            }),
          );
        } else {
          StorageOperation.setData([
            [ASYNC_KEYS.IS_LOGIN, 'true'],
            [ASYNC_KEYS.USER_DATA, JSON.stringify(response.data)],
            [ASYNC_KEYS.ACCESS_TOKEN, response.data.token],
          ]).then(() => {
            saveUserData(response);
          });
        }
        dispatch(
          showErrorAlert(localize('SUCCESS'), response.data.message, () => {
            console.log('OK pressed');
          }),
        );
        // navigation.navigate('VERIFY_PIN', {
        //   mobile_no: phone.value,
        //   phone_code: countryCode,
        //   screen_redirection: 'signup',
        //   refUuid: uuid,
        // });
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setIsLoading(false);
      }

      console.log('params', params);
    }
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <View style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          enabled>
          <ScrollView
            contentContainerStyle={{marginTop: 90}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.loginContent}>
              <Text style={styles.createAccountText}>Create Account</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.alreadyText}>Already have an account?</Text>
                <Text
                  style={[styles.signInText, {textDecorationLine: 'underline'}]}
                  onPress={() => navigation.navigate('LOGIN')}>
                  Sign In
                </Text>
              </View>
              {renderInputComponent('fullname')}
              {renderInputComponent('email')}
              {renderInputComponent('password')}
              <View style={styles.tncView}>
                <Text style={[styles.tncText]}>
                  Minimum length of password must be 8 characters.
                </Text>
              </View>
              <Button
                style={COMMON_STYLE.buttonContainerStyle}
                buttonStyle={COMMON_STYLE.button}
                title="CONTINUE"
                onPress={() => callSignUp()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default CreateAccountScreen;
