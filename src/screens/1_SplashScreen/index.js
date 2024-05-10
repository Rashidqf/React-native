import React from 'react';

import { View, Text, Image, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { AppContext } from '../../themes/AppContextProvider';
import AnimatedLottieView from 'lottie-react-native';

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextType = AppContext;

  componentDidMount() {
    this.props.networkListner();

    this.checkNotificationPermission();
  }

  // Check User allow notification permission or not to receive push notification
  checkNotificationPermission() {
    // FirebaseService.firebasePushSetup();
    setTimeout(() => {
      this.saveUserLoginData();
    }, 2000);
  }

  //Save User login or token related detail to access using reducer from any screen
  saveUserLoginData(token) {
    StorageOperation.getData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
      let user_data = {};
      let token = '';
      let is_login = false;

      if (value[0][1] == 'true') {
        is_login = true;
        user_data = JSON.parse(value[1][1]);
        token = value[2][1];

        this.props
          .saveUserData({
            is_login: is_login,
            userInfo: user_data,
            access_token: token,
          })
          .then(() => {
            setTimeout(() => {
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TAB_NAVIGATOR' }],
                // routes: [{ name: 'PROFILE_PICTURE' }],
              });
            }, 1000);
          });
      } else {
        setTimeout(() => {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: this.props?.isOnboardingFinished ? 'REGISTER' : 'ONBOARDING_SCREENS' }],
          });
        }, 1000);
      }
    });
  }

  render() {
    const { theme } = this?.context;
    const styles = style(theme);

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.splashbackgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <View style={{ justifyContent: 'space-between', flex: 1 }}>
            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
              {/* <Image style={[styles.logoImageStyle, { borderRadius: 10 }]} source={IMAGES.sortIcon} /> */}
              <AnimatedLottieView
                autoPlay
                source={require('./splash.json')}
                loop={true}
                speed={1}
                style={{ justifyContent: 'center', alignContent: 'center', width: 250, height: 250 }}
                autoSize={false}
              />
            </View>
            <View>
              <Text style={styles.titleStyle}>{'CREATED BY'}</Text>
              <Text style={styles.subtitleStyle}>{'MARSH TECH'}</Text>
            </View>
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    isOnboardingFinished: state.redState.isOnboardingFinished,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
