import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  Platform,
  Switch,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import Contacts from 'react-native-contacts';
import TabNavigator from './tabNavigator';

// Third-party Components
import {Button} from 'react-native-elements';

// Import storage functions
import {StorageOperation} from '../storage/asyncStorage';

// Import constants
import {ASYNC_KEYS, API_DATA, COMMON_DATA} from '../constants';

// Import themes

// Import languages
import {localize} from '../languages';

import {Responsive} from '../helper';

// Import API functions
import {callApi} from '../apiCalls';

// Import Screens
// import * as Screen from '@screens';
import onShare from '../utils/deepLinking';
import {AppContext} from '../theme/AppContextProvider';
import {COLORS, COMMON_STYLE, IMAGES} from '../theme';
import LoadingIndicator from '../components/modalComponents/loadingModel';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

interface UserData {
  access_token: string;
  userInfo: {
    image?: string;
    token?: string;
    invitation_url?: string;
    name: string;
  };
}

interface DrawerNavigatorProps {
  userData: UserData;
  navigation: any;
}

interface CustomDrawerContentProps {
  navigation: any;
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({
  userData,
  navigation,
}) => {
  const context = React.useContext(AppContext);
  if (!context) {
    return null;
  }


  const {theme, changeTheme} = context;
  const styles = themeStyle(theme?.colors);
  const [isLoading, setIsLoading] = useState(false);

  const renderHeaderButton = (icon: any, onPress: () => void) => (
    <Button
      buttonStyle={COMMON_STYLE.headerButtonStyle}
      type={'clear'}
      icon={<Image source={icon} style={COMMON_STYLE.headerIcon} />}
      onPress={onPress}
    />
  );

  const renderHeaderProfile = (icon: any, onPress: () => void) => (
    <Button
      buttonStyle={styles.headerProfile}
      type={'clear'}
      icon={<Image source={icon} style={styles.profileImage} />}
      onPress={onPress}
    />
  );

  const CustomDrawerContent: React.FC<CustomDrawerContentProps> = props => {
    const [permission, setPermission] = useState<string>('');
    const [contactCount, setContactCount] = useState<number | null>(null);

    useEffect(() => {
      if (Platform.OS === 'ios') {
        Contacts.checkPermission().then(permission => {
          if (permission === 'undefined') {
            Contacts.requestPermission().then(permission => {});
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
          }
        });
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        ).then(permission => {
          if (permission === 'granted') {
            setPermission(permission);
            Contacts.getCount().then(count => {
              setContactCount(count);
            });
          }
          if (permission === 'denied') {
            setPermission(permission);
          }
          if (permission === 'never_ask_again') {
            setPermission(permission);
          }
        });
      }
    }, []);

    const logout = () => {
      setIsLoading(true);
      StorageOperation.removeData([
        ASYNC_KEYS.IS_LOGIN,
        ASYNC_KEYS.USER_DATA,
        ASYNC_KEYS.ACCESS_TOKEN,
      ]).then(value => {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'LOGIN'}],
          });
        }, 1000);
        setIsLoading(false);
      });
      // Alert.alert(localize('APP_NAME'), 'Are you sure you want to logout?', [
      //   {
      //     text: 'No',
      //     onPress: () => console.log('No Pressed'),
      //     style: 'cancel',
      //   },
      //   {
      //     text: 'Yes',
      //     onPress: () => {
      //       try {
      //         // const params = {
      //         //   url: API_DATA.LOGOUT,
      //         //   data: {
      //         //     device_token: userData?.userInfo?.token,
      //         //   },
      //         // };
      //         // const accessToken = userData.access_token;
      //         //   callApi([params], accessToken)
      //         //     .then(response => {
      //         //       let resp = response[API_DATA.LOGOUT];
      //         //       StorageOperation.removeData([
      //         //         ASYNC_KEYS.IS_LOGIN,
      //         //         ASYNC_KEYS.USER_DATA,
      //         //         ASYNC_KEYS.ACCESS_TOKEN,
      //         //       ]).then(value => {
      //         //         setTimeout(() => {
      //         //           props.navigation.reset({
      //         //             index: 0,
      //         //             routes: [{name: 'REGISTER'}],
      //         //           });
      //         //         }, 500);
      //         //       });
      //         //     })
      //         //     .catch(error => {
      //         //       console.error(error);
      //         //     });
      //       } catch (e) {
      //         console.log('catch error >>> ', e);
      //       }
      //     },
      //   },
      // ]);
    };

    // const Invitation = userData.userInfo.invitation_url;
    return (
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        <LoadingIndicator isLoading={isLoading} />
        <View style={styles.drawerTopContent}>
          <View style={styles.profileMainView}>
            <View style={styles.profileImageView}>
              {/* <Image
                source={{
                  uri: '../assets/images/background/background.png',
                  // uri: userData?.userInfo?.image
                  //   ? userData?.userInfo?.image
                  //   : userData?.userInfo?.image,
                  // : IMAGES.sortIcon,   set later
                }}
                style={[COMMON_STYLE.drawerProfile, {borderRadius: 75}]}
                resizeMode={'cover'}
              /> */}
            </View>
            <>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('SETTINGS')}>
                <Image
                  source={IMAGES.settings}
                  style={{height: 24, width: 24, tintColor: COLORS.GRAY_100}}
                />
              </TouchableOpacity>
            </>
          </View>

          <Text style={styles.h5}>{userData?.userInfo?.name}</Text>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => props.navigation.navigate('EDIT_PROFILE')}>
            <Text style={styles.linkText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <DrawerItem
          label="Connections"
          icon={() => (
            <Image source={IMAGES.link_icon} style={styles.navIcon} />
          )}
          onPress={() => props.navigation.navigate('MY_CONNECTION')}
        />
        <DrawerItem
          label="Itineraries"
          icon={() => (
            <Image source={IMAGES.notes_icon} style={styles.navIcon} />
          )}
          onPress={() => props.navigation.navigate('Itineraries_Screen')}
        />
        <DrawerItem
          label="Drafts"
          icon={() => (
            <Image source={IMAGES.calendar_pen_icon} style={styles.navIcon} />
          )}
          onPress={() => props.navigation.navigate('Drafts_Screen')}
        />
        {/* <DrawerItem
          label="Invite Friends"
          icon={() => (
            <Image source={IMAGES.InviteIcon} style={styles.navIcon} />
          )}
          onPress={() => onShare(Invitation)}
        /> */}
        <View
          style={{paddingHorizontal: Responsive.getWidth(6), marginTop: 30}}>
          <Button
            style={[styles.marginTop, {height: 50}]}
            buttonStyle={[
              styles.button,
              {
                backgroundColor: theme?.colors?.RED_500,
                borderRadius: 15,
                height: 50,
              },
            ]}
            title={localize('LOGOUT')}
            titleStyle={[styles.buttonText, {fontWeight: 'bold'}]}
            onPress={logout}
          />
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={({navigation, route}) => ({
        drawerStyle: {
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
          <TouchableOpacity
            style={styles.headerProfile}
            onPress={() => navigation.toggleDrawer()}>
            <Image
              source={{
                uri: userData?.userInfo?.image
                  ? userData?.userInfo?.image
                  : userData?.userInfo?.image,
                //   : IMAGES.sortIcon, set later
              }}
              style={[COMMON_STYLE.profileImage, {width: 32, height: 32}]}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity>
              <Image
                source={IMAGES.more}
                style={[COMMON_STYLE.headerActionButton, {marginRight: 22}]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Inbox_Connections_Screen')}>
              <Image
                source={IMAGES.directInbox}
                style={styles.headerActionButton}
              />
            </TouchableOpacity>
          </View>
        ),
      })}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="TAB_NAVIGATOR"
        component={TabNavigator}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const themeStyle = (color?: any) =>
  StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      //   shadowOffset: {height: 0},
      elevation: 0,
      height: 100,
    },
    sectionHeaderTitle: {
      ...COMMON_STYLE.textStyle(15, color?.RED_500, 'BOLD', 'left'),
      marginTop: 20,
      marginBottom: 5,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      ...COMMON_STYLE.textStyle(13, color?.GRAY_100, 'BOLD', 'left'),
    },
    headerTitleStyle: {
      ...COMMON_STYLE.textStyle(13, color?.GRAY_100, 'BOLD', 'left'),
      alignSelf: 'center',
    },
    marginTop: {
      marginTop: 20,
    },
    button: {
      width: '100%',
      height: 46,
      borderRadius: 10,
    },
    buttonText: {
      ...COMMON_STYLE.textStyle(13, color?.WHITE, 'BOLD', 'center'),
    },
    headerProfile: {
      marginLeft: 20,
      height: 36,
      width: 36,
      borderRadius: 36,
      backgroundColor: color?.GRAY_900,
      borderColor: color?.GRAY_900,
      borderWidth: 1,
      shadowColor: color?.RED_500,
      shadowOpacity: 0.2,
      shadowOffset: {height: 0, width: 0},
      shadowRadius: 4,
    },
    headerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    headerActionButton: {
      height: 24,
      width: 24,
      tintColor: color?.WHITE,
    },
    drawerTopContent: {
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    drawerProfile: {
      height: 140,
      width: 140,
      borderRadius: 70,
      borderWidth: 5,
      borderColor: color?.GRAY_900,
    },
    h5: {
      ...COMMON_STYLE.textStyle(20, color?.WHITE, 'BOLD', 'center'),
      marginTop: 15,
    },
    linkBtn: {
      backgroundColor: 'transparent',
      paddingVertical: 5,
      alignSelf: 'center',
    },
    linkText: {
      ...COMMON_STYLE.textStyle(13, color?.GRAY_400, 'REGULAR', 'center'),
      textDecorationLine: 'underline',
    },
    navIcon: {
      height: 24,
      width: 24,
      tintColor: color?.WHITE,
    },
    profileMainView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    profileImageView: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    profileImage: {
      height: 32,
      width: 32,
      borderRadius: 16,
    },
  });
