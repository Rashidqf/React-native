import * as React from 'react';
import { Text, View, Image, StyleSheet, ImageBackground } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { HeaderView } from '@components';

//imoprt constants
import { ASYNC_KEYS, REDUCER_TYPE } from '@constants';

//import languages
import { localize } from '@languages';

//import Screens
import * as Screen from '@screens';

//import storage functions
import { StorageOperation } from '@storage';

import { IMAGES, COMMON_STYLE, COLORS } from '@themes';

import { Responsive } from '@helpers';
import { AppContext } from '../themes/AppContextProvider';

const Tab = createBottomTabNavigator();

function renderTabItem(route, focused, count) {
  const { theme } = React.useContext(AppContext);

  const styles = themeStyle(theme?.colors);
  return (
    <View style={styles.tabStyle}>
      <Image
        source={focused ? IMAGES[`${route.name}_ACTIVE`] : IMAGES[`${route.name}`]}
        style={[styles.tabIcon(focused), focused ? { tintColor: '#FC5401' } : null]}
      />
      <Text style={styles.tabTitleStyle(focused)}>{localize(route.name)}</Text>
      {count ? (
        <View style={styles.countView}>
          <Text style={styles.countTxt}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}

function showLoginPopup(props) {
  props.saveReduxData(REDUCER_TYPE.SHOW_REGISTER_POPUP, {
    is_show_register_popup: true,
  });
}

const TabNavigator = props => {
  const insets = useSafeAreaInsets();
  const { theme } = React.useContext(AppContext);

  const styles = themeStyle(theme?.colors);
  return (
    <ImageBackground source={IMAGES.onboardingScreen} style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="HOME_TAB"
        screenOptions={({ route }) => ({
          tabBarStyle: [styles.tabBarStyle, { height: 70 + insets.bottom }],
          tabBarIcon: ({ focused, color, size }) => {
            return renderTabItem(route, focused);
          },
        })}
        tabBarOptions={{
          showLabel: false,
        }}
      >
        <Tab.Screen name="HOME_TAB" component={Screen.HomeScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name="CHATS_TAB"
          component={Screen.ChatListScreen}
          options={({ navigation, route }) => {
            return {
              headerShown: false,
              tabBarIcon: ({ focused }) => {
                return renderTabItem(route, focused);
              },
            };
          }}
        />
        <Tab.Screen name="EVENTS_TAB" component={Screen.EventScreen} options={{ headerShown: false }} />
        <Tab.Screen name="TASKS_TAB" component={Screen.NotificationScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </ImageBackground>
  );
};

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(TabNavigator);

const themeStyle = color =>
  StyleSheet.create({
    tabBarStyle: {
      backgroundColor: color?.GRAY_1000,
      backgroundColor: 'transparent',
      borderTopWidth: 0,
    },
    tabStyle: { alignItems: 'center' },
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
    tabIcon: focused => {
      return {
        ...COMMON_STYLE.imageStyle(6, !focused && color?.GRAY_300),
      };
    },
    tabTitleStyle: focused => {
      return {
        ...COMMON_STYLE.textStyle(12, focused ? color?.RED_500 : color?.GRAY_300, 'BOLD'),
        marginTop: Responsive.getHeight(1),
      };
    },
  });
