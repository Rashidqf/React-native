import React, {useContext} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {IMAGES, STYLES, COMMON_STYLE} from '../theme';
import {ASYNC_KEYS} from '../components';
import {localize} from '../languages';
import {AppContext} from '../theme/AppContextProvider';

const Drawer = createDrawerNavigator();

import {
  SplashScreen,
  OnboardingScreens,
  LoginScreen,
  LoginPhoneScreen,
  LoginVerifyScreen,
  RegisterScreen,
  CreateAccountScreen,
} from '../screens';
import Home from '../screens/Home';
import DrawerNavigator from './DrawerNavigator';
import PromptScreen from '../screens/8_PromptScreen';
import ProfileEditScreen from '../screens/10_ProfileEditScreen';
import ProfilePictureScreen from '../screens/7_ProfilePictureScreen';
import InviteScreen from '../screens/12_InviteScreen';
import ContactsListScreen from '../screens/13_ContactsListScreen';
import ActivitySheetScreen from '../screens/14_ActivitySheetScreen';
import ActivitySheetScreenTest from '../screens/13_ContactsListScreen/ContactListTest';
import MyConnection from '../screens/35_MyConnection';

const Stack = createStackNavigator();

const renderHeaderButton = (icon: any, onPress: () => void, theme: any) => {
  const imageStyle: any = COMMON_STYLE.imageStyle;
  return (
    <Button
      buttonStyle={COMMON_STYLE.headerButtonStyle}
      type={'clear'}
      icon={
        <Image source={icon} style={imageStyle(4, theme?.colors?.GRAY_100)} />
      }
      onPress={onPress}
    />
  );
};

function headerBackgroundImg() {
  return (
    <Image
      style={{width: '100%', height: '100%'}}
      source={IMAGES.bgHeader}
      resizeMode="stretch"
    />
  );
}

const AppContainer: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;

  const styles = style(theme);

  return (
    <ImageBackground
      source={require('../assets/images/background/background.png')}
      style={{flex: 1, backgroundColor: 'red'}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ACTIVITY_SHEET"
          screenOptions={({navigation, route}) => ({
            headerStyle: styles.headerStyle,
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerTitle: () => (
              <Text style={styles.headerTitleStyle}>
                {localize(route.name)}
              </Text>
            ),
            headerTitleStyle: styles.headerTitleStyle,
            headerShown: true,
            headerLeft: () =>
              renderHeaderButton(
                IMAGES.backArrow,
                () => navigation.goBack(),
                theme,
              ),
          })}>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ONBOARDING_SCREENS"
            component={OnboardingScreens}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="LOGIN"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="REGISTER"
            component={RegisterScreen}
            options={{
              headerStyle: [styles.headerStyle, {borderBottomWidth: 0}],
              headerShown: true,
              headerTitle: () => null,
            }}
          />
          <Stack.Screen
            name="CREATE_ACCOUNT"
            component={CreateAccountScreen}
            options={{
              headerStyle: [styles.headerStyle, {borderBottomWidth: 0}],
              headerShown: true,
              headerTitle: () => null,
            }}
          />
          <Stack.Screen
            name="PROFILE_PICTURE"
            component={ProfilePictureScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LOGIN_PHONE"
            component={LoginPhoneScreen}
            options={({navigation}) => ({
              headerShown: true,
              headerLeft: () =>
                renderHeaderButton(
                  IMAGES.backArrow,
                  () => navigation.goBack(),
                  theme,
                ),
            })}
          />
          <Stack.Screen
            name="PROMPT"
            component={PromptScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EDIT_PROFILE"
            component={ProfileEditScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TAB_NAVIGATOR"
            component={DrawerNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VERIFY_PIN"
            component={LoginVerifyScreen}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="HOME"
            component={Home}
            options={{headerShown: true}}
          />
          <Stack.Screen
            name="INVITE"
            component={InviteScreen}
            options={{
              headerShown: false,
              // headerRight: () => renderHeaderButton(IMAGES.search),
            }}
          />
          <Stack.Screen
            name="FIND_FRIENDS"
            component={ContactsListScreen}
            options={({navigation, route}) => {
              return {
                headerShown: true,
                headerBackground: () => headerBackgroundImg(),
                headerLeft: () =>
                  renderHeaderButton(
                    IMAGES.backArrow,
                    () => navigation.pop(2),
                    theme,
                  ),
                headerRight: () =>
                  renderHeaderButton(
                    IMAGES.search,
                    () => navigation.goBack(),
                    theme,
                  ),
              };
            }}
          />
          <Stack.Screen
            name="ACTIVITY_SHEET"
            component={ActivitySheetScreen}
            options={{
              headerShown: true,
              // headerRight: () =>
              //   renderHeaderButton(
              //     IMAGES.search,
              //     () => navigation.goBack(),
              //     theme,
              //   ),
              // headerBackground: () => headerBackgroundImg(),
            }}
          />
          <Stack.Screen
            name="ACTIVITY_SHEET_TEST"
            component={ActivitySheetScreenTest}
            options={{
              headerShown: true,
              headerRight: () =>
                renderHeaderButton(
                  IMAGES.search,
                  () => navigation.goBack(),
                  theme,
                ),
              headerBackground: () => headerBackgroundImg(),
            }}
          />
          <Stack.Screen
            name="MY_CONNECTION"
            component={MyConnection}
            options={({navigation, route}) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButton(
                    IMAGES.backArrow,
                    () => navigation.goBack(),
                    theme,
                  ),
                headerRight: () =>
                  renderHeaderButton(IMAGES.search, undefined, theme),
                headerTitle: 'Connections',
              };
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
};
export default AppContainer;

const style = (theme: any) =>
  StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      // shadowOffset: {height: 0},
      elevation: 0,
      height: 100,
      backgroundColor: 'transparent',
    },

    headerTitleStyle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_100, 'BOLD', 'center'),
    },
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
  });
