import React, {useEffect, useContext} from 'react';
import {View, Text, ImageBackground, Image} from 'react-native';
import {SafeAreaWrapper} from '../../components/wrapper/safeAreaWrapper';
import {ASYNC_KEYS} from '../../constants';
import {IMAGES} from '../../theme';
import {style} from './style';
import {StorageOperation} from '../../storage/asyncStorage';
import {AppContext} from '../../theme/AppContextProvider';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {saveUserData} from '../../store/action/actions';

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.redState.userData);
  const isOnboardingFinished = useAppSelector(
    state => state.redState.isOnboardingFinished,
  );

  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);
  useEffect(() => {
    networkListener();
    checkNotificationPermission();
  }, []);

  const networkListener = () => {};

  const checkNotificationPermission = () => {
    setTimeout(() => {
      saveUserLoginData();
    }, 2000);
  };

  // uselater

  const saveUserLoginDatas = () => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: isOnboardingFinished ? 'LOGIN' : 'ONBOARDING_SCREENS'}],
      });
    }, 1000);
  };

  const saveUserLoginData = () => {
    StorageOperation.getData([
      ASYNC_KEYS.IS_LOGIN,
      ASYNC_KEYS.USER_DATA,
      ASYNC_KEYS.ACCESS_TOKEN,
    ]).then(value => {
      console.log(value);
      if (value[0] && value[0][1] === 'true') {
        const is_login = true;
        const user_data = value[1] ? JSON.parse(value[1][1]) : {};
        const token = value[2] ? value[2][1] : '';

        dispatch(
          saveUserData({
            is_login: is_login,
            userInfo: user_data,
            access_token: token,
          }),
        ).then(() => {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'TAB_NAVIGATOR'}],
            });
          }, 1000);
        });
      } else {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'LOGIN'}],
          });
        }, 1000);
      }
    });
  };
  return (
    <ImageBackground
      source={IMAGES.splash}
      style={styles.splashbackgroundImage}>
      <SafeAreaWrapper>
        <View style={{justifyContent: 'space-between', flex: 1}}>
          <View
            style={{justifyContent: 'center', alignSelf: 'center', flex: 1}}>
            <Image
              source={require('../../assets/images/background/background.png')}
            />
            {/* <AnimatedLottieView
              autoPlay
              source={require('./splash.json')}
              loop={true}
              speed={1}
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                width: 250,
                height: 250,
              }}
              autoSize={false}
            /> */}
          </View>
          <View>
            <Text style={styles.titleStyle}>{'CREATED BY'}</Text>
            <Text style={styles.subtitleStyle}>{'MARSH TECH'}</Text>
          </View>
        </View>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default SplashScreen;
