import * as React from 'react';
import {Text, View, Image, StyleSheet, ImageBackground} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Import languages
import {localize} from '../languages';

// Import Screens
// import * as Screen from '@screens';
import {COLORS, COMMON_STYLE, IMAGES} from '../theme';
import {Responsive} from '../helper';
import {AppContext} from '../theme/AppContextProvider';
import {HomeScreen} from '../screens';

const Tab = createBottomTabNavigator();

type Route = {
  name: string;
};

type RenderTabItemProps = {
  route: Route;
  focused: boolean;
  count?: number;
};

function renderTabItem({route, focused, count}: RenderTabItemProps) {
  const context = React.useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;

  const styles = themeStyle(theme);
  return (
    <View style={styles.tabStyle}>
      <Image
        // source={
        //   focused ? IMAGES[`${route.name}_ACTIVE`] : IMAGES[`${route.name}`]
        // }
        style={[
          // themeStyle.tabIcon(focused),
          focused ? {tintColor: '#FC5401'} : null,
        ]}
      />
      {/* <Text style={themeStyle.tabTitleStyle(focused)}> */}
      <Text>{localize(route.name)}</Text>
      {count ? (
        <View style={styles.countView}>
          <Text style={styles.countTxt}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}

const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const context = React.useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;

  const styles = themeStyle(theme?.colors);
  return (
    <ImageBackground source={IMAGES.onboardingScreen} style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="HOME_TAB"
        screenOptions={({route}) => ({
          tabBarStyle: [styles.tabBarStyle, {height: 70 + insets.bottom}],
          tabBarIcon: ({focused}) => renderTabItem({route, focused}),
          tabBarShowLabel: false,
        })}>
        <Tab.Screen
          name="HOME_TAB"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        {/* <Tab.Screen
          name="CHATS_TAB"
          component={Screen.ChatListScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => renderTabItem({route, focused}),
          }}
        />
        <Tab.Screen
          name="EVENTS_TAB"
          component={Screen.EventScreen}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="TASKS_TAB"
          component={Screen.NotificationScreen}
          options={{headerShown: false}}
        /> */}
      </Tab.Navigator>
    </ImageBackground>
  );
};

export default TabNavigator;

const themeStyle = (color?: any) =>
  StyleSheet.create({
    tabBarStyle: {
      backgroundColor: color?.GRAY_1000,
      // backgroundColor: 'transparent',
      borderTopWidth: 0,
    },
    tabStyle: {alignItems: 'center'},
    countView: {
      height: 20,
      width: 20,
      backgroundColor: color?.RED_100,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -Responsive.getWidth(1),
      right: -Responsive.getWidth(1),
    },
    countTxt: {
      ...COMMON_STYLE.textStyle(10, color?.RED_500, 'BOLD'),
    },
    // tabIcon: (focused: boolean) => {
    //   return {
    //     ...COMMON_STYLE.imageStyle(6, !focused && color?.GRAY_300),
    //   };
    // },
    // tabTitleStyle: (focused: boolean) => {
    //   return {
    //     ...COMMON_STYLE.textStyle(
    //       12,
    //       focused ? color?.RED_500 : color?.GRAY_300,
    //       'BOLD',
    //     ),
    //     marginTop: Responsive.getHeight(1),
    //   };
    // },
  });
