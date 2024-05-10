import React, { useContext, useEffect, useState } from 'react';

import { Image, StyleSheet, View, Text, Platform, Switch, TouchableOpacity, PermissionsAndroid, Alert, Linking } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';
import { notificationListStart, setTheme, showLoading } from '../actions/reduxAction';
import TabNavigator from './TabNavigator';

// ThirdParty Components
import { Button } from 'react-native-elements';

//import storage functions
import { StorageOperation } from '@storage';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

//imoprt constants
import { ASYNC_KEYS, API_DATA, COMMON_DATA } from '@constants';

//imoprt constants
import { COMMON_STYLE, IMAGES } from '@themes';
import { Light, Dark, COLORS } from '../themes/colors';
//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import Screens
import * as Screen from '@screens';
import onShare from '../utils/deepLinking';
import { AppContext } from '../themes/AppContextProvider';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  const userData = props?.userData;
  const propsData = props;
  const { theme, changeTheme } = useContext(AppContext);
  const { selectTheme } = useSelector(state => state?.redState);
  const dispatch = useDispatch();
  const styles = themeStyle(theme?.colors);

  function renderHeaderButton(icon, onPress) {
    return (
      <Button
        buttonStyle={COMMON_STYLE.headerButtonStyle}
        type={'clear'}
        icon={<Image source={icon} style={styles.headerIcon} />}
        onPress={onPress}
      />
    );
  }
  function renderHeaderProfile(icon, onPress) {
    return (
      <Button
        buttonStyle={styles.headerProfile}
        type={'clear'}
        icon={<Image source={icon} style={styles.profileImage} />}
        onPress={onPress}
      />
    );
  }

  const DrawerItem = props => {
    return (
      <TouchableOpacity onPress={props.onPress} style={[styles.navItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={props.Icon}
            style={[styles.navIcon, props?.tintColor && { tintColor: props?.color ? props?.color : theme?.colors?.WHITE }]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.navTitle}>{props.Title}</Text>
        </View>
        {props?.Count ? (
          <View style={[styles.navCount]}>
            <Text style={[styles.chatCountTxt]}>{props?.Count}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };
  function CustomDrawerContent(props) {
    const [permission, setPermission] = useState('');
    const [contactCount, setContactCount] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
      if (Platform.OS === 'ios') {
        Contacts.checkPermission().then(permission => {
          if (permission === 'undefined') {
            Contacts.requestPermission().then(permission => { });
          }
          if (permission === 'authorized') {
            setPermission(permission);
            Contacts.getCount().then(count => {
              setContactCount(count);
            });
          }
          if (permission === 'denied') {
            setPermission(permission);
          }
          if (permission === 'undefined') {
            setPermission(permission);
            // Alert.alert('Sort App', 'You have to give permission to get contacts ', [
            //   {
            //     text: 'Cancel',
            //     onPress: () => console.log('Cancel Pressed'),
            //     style: 'cancel',
            //   },
            //   { text: 'Allow', onPress: () => Linking.openSettings() },
            // ]);
          }
        });
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          // title: 'Contacts',
          // message: 'This app would like to view your contacts.',
        }).then(permission => {
          if (permission === 'granted') {
            setPermission(permission);
            Contacts.getCount().then(count => {
              setContactCount(count);
            });
            // props.navigation.navigate('FIND_FRIENDS');
          }
          if (permission === 'denied') {
            setPermission(permission);

            // props.navigation.goBack();
          }
          if (permission === 'never_ask_again') {
            setPermission(permission);
            // Alert.alert('Sort App', 'You have to give permission to get contacts ', [
            //   {
            //     text: 'Cancel',
            //     onPress: () => console.log('Cancel Pressed'),
            //     style: 'cancel',
            //   },
            //   { text: 'Allow', onPress: () => Linking.openSettings() },
            // ]);
          }
        });
      }
    }, []);

    const logout = () => {
      Alert.alert(localize('APP_NAME'), 'Are you sure you want to logout?', [
        {
          text: 'No',
          onPress: () => {
            console.log('No Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            try {
              const params = {
                url: API_DATA.LOGOUT,
                data: {
                  device_token: this.props?.userData?.userInfo?.token,
                },
              };

              var accessToken = userData.access_token;

              dispatch(showLoading(true));

              callApi([params], accessToken)
                .then(response => {
                  dispatch(showLoading(false)).then(() => {
                    let resp = response[API_DATA.LOGOUT];
                    StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
                      setTimeout(() => {
                        propsData.navigation.reset({
                          index: 0,
                          routes: [{ name: 'REGISTER' }],
                        });
                      }, 500);
                    });
                  });
                })
                .catch(error => {
                  showLoading(false);
                });
            } catch (e) {
              console.log('catch error >>> ', e);
            }
          },
        },
      ]);
    };

    const Invitaion = userData.userInfo.invitation_url;
    return (
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        <View style={styles.drawerTopContent}>
          <View style={styles.profileMainView}>
            <View style={styles.profileImageView}>
              <Image
                source={{ uri: userData?.userInfo?.image ? userData?.userInfo?.image : IMAGES.sortIcon }}
                style={[styles.drawerProfile, { borderRadius: 75 }]}
                resizeMode={'cover'}
              />

              {/* {userData?.userInfo?.notification_unread_count > 0 ? (
                <View style={styles.chatCount}>
                  <Text style={[styles.chatCountTxt]}>{userData?.userInfo?.notification_unread_count}</Text>
                </View>
              ) : null} */}
            </View>
            <>
              <TouchableOpacity onPress={() => props.navigation.navigate('SETTINGS')}>
                <Image source={IMAGES.settings} style={{ height: 24, width: 24, tintColor: COLORS.GRAY_100 }} />
              </TouchableOpacity>
            </>
          </View>

          <Text style={styles.h5}>{userData?.userInfo?.name}</Text>
          <TouchableOpacity style={styles.linkBtn} onPress={() => props.navigation.navigate('EDIT_PROFILE')}>
            <Text style={styles.linkText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <DrawerItem
          tintColor={true}
          Title="Connections"
          Icon={IMAGES.link_icon}
          onPress={() => props.navigation.navigate('MY_CONNECTION')}
        />
        <DrawerItem
          tintColor={true}
          Title="Itineraries"
          Icon={IMAGES.notes_icon}
          onPress={() => props.navigation.navigate('Itineraries_Screen')}
        />
        <DrawerItem
          tintColor={true}
          Title="Drafts"
          Icon={IMAGES.calendar_pen_icon}
          onPress={() => props.navigation.navigate('Drafts_Screen')}
        />
        {/* <DrawerItem tintColor={true} Title="Settings" Icon={IMAGES.settings} onPress={() => props.navigation.navigate('SETTINGS')} /> */}
        {/* <DrawerItem
          tintColor={true}
          Title="Notifications"
          Icon={IMAGES.notification}
          onPress={() => {
            dispatch(notificationListStart());
            props.navigation.navigate('NotificationScreen');
          }}
          color={theme?.colors?.GRAY_100}
        /> */}
        <DrawerItem Title="Invite Friends" Icon={IMAGES.InviteIcon} onPress={() => onShare(Invitaion)} tintColor={false} />
        {/* <DrawerItem
          Title="Blocked Users"
          Icon={IMAGES.block}
          color={theme?.colors?.GRAY_100}
          tintColor={true}
          onPress={() => props.navigation.navigate('BLOCKED_USER')}
        /> */}

        {/* <View style={[styles.navItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={IMAGES.theme_Icon} style={[styles.navIcon, { tintColor: theme?.colors?.GRAY_100 }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navTitle}>{'Night Mode'}</Text>
          </View>
          <Switch
            trackColor={{
              false: theme?.colors?.GRAY_1000,
              true: theme?.colors?.RED_500,
            }}
            onValueChange={() => {
              changeTheme(theme?.theme === 'light' ? Dark : Light);
              dispatch(setTheme(theme?.theme === 'light' ? Dark : Light));
            }}
            value={theme?.theme === 'light' ? false : true}
          />
        </View> */}
        {/* <DrawerItem Title="Help & Support" Icon={IMAGES.help} tintColor={true} /> */}
        {/* <DrawerItem
          Title="Terms of Service"
          Icon={IMAGES.notes}
          tintColor={true}
          onPress={() => props.navigation.navigate('OpenLink', { url: COMMON_DATA?.TERMS_LINK, name: 'Terms of Service' })}
        /> */}
        {/* <DrawerItem
          Title="Privacy Policy"
          Icon={IMAGES.lock}
          tintColor={true}
          onPress={() => props.navigation.navigate('OpenLink', { url: COMMON_DATA?.PRIVACY_LINK, name: 'Privacy Policy' })}
        /> */}
        {/* <DrawerItem Title="Location" Icon={IMAGES.contacts} onPress={() => props?.navigation?.navigate("LOCATION")}/> */}
        <View style={{ paddingHorizontal: Responsive.getWidth(6), marginTop: 30 }}>
          <Button
            style={[styles.marginTop, { height: 50 }]}
            buttonStyle={[styles.button, { backgroundColor: theme?.colors?.RED_500, borderRadius: 15, height: 50 }]}
            title={localize('LOGOUT')}
            titleStyle={[styles.buttonText, { fontWeight: 'bold' }]}
            onPress={() => logout()}
          />
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={({ navigation, route }) => ({
        drawerStyle: {
          // backgroundColor: COLORS?.BLACK_50,
          backgroundColor: COLORS?.GRAY_900,
          width: 315,
        },
        headerStyle: styles.headerStyle,
        headerTitleAlign: 'center',
        headerTitle: '',
        headerTitleStyle: styles.headerTitleStyle,
        headerShown: true,
        headerTransparent: true,
        headerLeft: () => (
          <>
            <TouchableOpacity style={styles.headerProfile} onPress={() => navigation.toggleDrawer()}>
              <Image
                source={{ uri: userData?.userInfo?.image ? userData?.userInfo?.image : IMAGES.sortIcon }}
                style={[styles.profileImage, { width: 32, height: 32 }]}
              />
              {/* {userData?.userInfo?.notification_unread_count > 0 ? (
                <View style={styles.chatCount}>
                  <Text style={[styles.chatCountTxt]}>{userData?.userInfo?.notification_unread_count}</Text>
                </View>
              ) : null} */}
            </TouchableOpacity>
          </>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity>
              <Image source={IMAGES.more} style={[styles.headerActionButton, { marginRight: 22 }]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props?.navigation?.navigate('Inbox_Connections_Screen')}>
              <Image source={IMAGES.directInbox} style={styles.headerActionButton} />
            </TouchableOpacity>
          </View>
        ),
        // headerRight: () => renderHeaderButton(IMAGES.more),
      })}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="TAB_NAVIGATOR" component={TabNavigator} options={{ headerShown: true }} />
    </Drawer.Navigator>
  );
}
function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigator);

const themeStyle = color =>
  StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      shadowOffset: { height: 0 },
      elevation: 0,
      height: 100,
    },

    sectionHeaderTitle: {
      ...COMMON_STYLE.textStyle(15, color?.RED_500, 'BOLD', 'left'),
      marginTop: Responsive.getWidth(2),
    },

    headerTitleStyle: {
      ...COMMON_STYLE.textStyle(14, color?.GRAY_100, 'BOLD', 'center'),
    },
    headerProfile: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      borderRadius: 75,
      // overflow: 'hidden',
      backgroundColor: color?.RED_500,
      marginLeft: Responsive.getWidth(6),
      padding: 0,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 75,
      resizeMode: 'cover',
    },
    headerIcon: {
      ...COMMON_STYLE.imageStyle(6),
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Responsive.getWidth(6),
      paddingVertical: Responsive.getWidth(5),
    },
    navIcon: {
      ...COMMON_STYLE.imageStyle(6),
      marginRight: Responsive.getWidth(5),
    },
    navTitle: {
      ...COMMON_STYLE.textStyle(14, color?.WHITE, 'BOLD', 'left'),
    },
    drawerTopContent: {
      paddingVertical: Responsive.getWidth(5),
      paddingHorizontal: Responsive.getWidth(6),
    },
    profileImageView: {
      position: 'relative',
      width: Responsive.getWidth(17),
      height: Responsive.getWidth(17),
      borderRadius: 75,
      backgroundColor: color?.GRAY_200,
      marginBottom: Responsive.getWidth(5),
      borderWidth: 2,
      // borderColor: color?.RED_500,
    },
    profileMainView: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    drawerProfile: {
      // ...COMMON_STYLE.imageStyle(17),
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    chatCount: {
      height: 20,
      width: 20,
      backgroundColor: color?.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -Responsive.getWidth(1),
      right: -Responsive.getWidth(1),
    },
    chatCountTxt: {
      ...COMMON_STYLE.textStyle(11, 'BOLD'),
      color: color?.WHITE,
    },
    navCount: {
      minHeight: 20,
      minWidth: 20,
      backgroundColor: color?.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    h5: {
      ...COMMON_STYLE.textStyle(16, color?.WHITE, 'BASE', 'left'),
      marginBottom: 4,
    },
    linkText: {
      ...COMMON_STYLE.textStyle(14, color?.PURPLE_500, 'BASE', 'left'),
    },
    drawerBottomContent: {
      flex: 1,
      height: Responsive.getHeight(30),
      backgroundColor: color?.GRAY_800,
      ...COMMON_STYLE.marginStyle(6, 6, 2, 6),
    },
    buttonText: {
      ...COMMON_STYLE.textStyle(14, color?.WHITE, 'BASE'),
    },
    headerActionIcon: {
      flexDirection: 'row',
    },
    headerActionButton: {
      width: 24,
      height: 24,
    },
    headerRightContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'row',
      marginRight: Responsive.getWidth(6),
    },
  });
