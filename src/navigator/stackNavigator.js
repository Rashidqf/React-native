import React, { useContext } from 'react';

import { Image, StyleSheet, Text, Pressable, TouchableOpacity, ImageBackground } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';

// ThirdParty Components
import { Button } from 'react-native-elements';

//imoprt constants
import { ASYNC_KEYS } from '@constants';

//imoprt constants
import { COMMON_STYLE, IMAGES, STYLES, COLORS } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

//import Screens
import * as Screen from '@screens';
import { AppContext } from '../themes/AppContextProvider';
import NewItineraryScreen from '../screens/46_New_Itinerary';
import AddedNewItineraryScreen from '../screens/47_Added_New_Itinerary';
import NewItineraryDetailsScreen from '../screens/48_New_Itinerary_Details';
import ChooseGuestScreen from '../screens/49_ChooseGuest';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// render custom component
function renderHeaderButton(icon, onPress, theme) {
  return (
    <Button
      buttonStyle={COMMON_STYLE.headerButtonStyle}
      type={'clear'}
      icon={<Image source={icon} style={COMMON_STYLE.imageStyle(4, theme?.colors?.GRAY_100)} />}
      onPress={onPress && onPress}
    />
  );
}

function renderHeaderButtonText(label, onPress) {
  return (
    <Pressable style={COMMON_STYLE.headerBtnStyle} onPress={onPress}>
      <Text style={COMMON_STYLE.headerBtnTextStyle}>{label}</Text>
    </Pressable>
  );
}

function headerBackgroundImg() {
  return <Image style={{ width: '100%', height: '100%' }} source={IMAGES.bgHeader} resizeMode="stretch" />;
}

function AppContainer() {
  const { theme } = useContext(AppContext);
  const styles = style(theme);
  return (
    <ImageBackground source={IMAGES.settings} style={{ flex: 1, backgroundColor: 'red' }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation, route }) => ({
            headerStyle: styles.headerStyle,
            headerTitleAlign: 'center',
            headerTransparent: true,
            headerTitle: () => <Text style={styles.headerTitleStyle}>{localize(route.name)}</Text>,
            headerTitleStyle: styles.headerTitleStyle,
            headerShown: true,
            headerMode: 'float',
            headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
            initialRoute: 'LOGIN',
          })}
        >
          <Stack.Screen name="SPLASH_SCREEN" component={Screen.SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ONBOARDING_SCREENS" component={Screen.OnboardingScreens} options={{ headerShown: false }} />
          <Stack.Screen
            name="LOGIN"
            component={Screen.LoginScreen}
            options={({ navigation, route }) => ({
              headerShown: true,
              headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
            })}
          />
          <Stack.Screen
            name="REGISTER"
            component={Screen.RegisterScreen}
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
            name="LOGIN_PHONE"
            component={Screen.LoginPhoneScreen}
            options={({ navigation, route }) => ({
              headerShown: true,
              headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
            })}
          />
          <Stack.Screen name="VERIFY_PIN" component={Screen.LoginVerifyScreen} options={{ headerShown: true }} />
          <Stack.Screen
            name="CREATE_ACCOUNT"
            component={Screen.CreateAccountScreen}
            options={{
              headerStyle: [styles.headerStyle, { borderBottomWidth: 0 }],
              headerShown: true,
              headerTitle: () => null,
            }}
          />
          <Stack.Screen
            name="PROFILE_PICTURE"
            component={Screen.ProfilePictureScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NOTIFICATION_PERMISSION_SCREEN"
            component={Screen.NotificationPermissionScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PROMPT"
            component={Screen.PromptScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EDIT_PROFILE"
            component={Screen.ProfileEditScreen}
            options={{
              headerShown: false,
            }}
          // options={({ navigation, route }) => {
          //   return {
          //     headerShown: true,
          //     headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
          //     // headerRight: () =>
          //     //   renderHeaderButtonText("Save", () => navigation.goBack()),
          //   };
          // }}
          />
          <Stack.Screen
            name="PROFILE"
            component={Screen.ProfileScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Clear', () => navigation.goBack()),
                headerRight: () => renderHeaderButtonText('Save', () => navigation.goBack()),
              };
            }}
          />
          <Stack.Screen
            name="POLL"
            component={Screen.PollScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
                headerRight: () => (
                  <TouchableOpacity
                    disabled={route?.params?.selected && route?.params?.selected.length === 0}
                    style={COMMON_STYLE.headerBtnStyle}
                  // onPress={() => route?.params?.handleSubmit()}
                  >
                    {route?.params?.selected && route?.params?.selected.length === 0 ? (
                      <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text>
                    ) : (
                      <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Edit</Text>
                    )}
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={Screen.NotificationScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.pop(2), theme),
              };
            }}
          />

          <Stack.Screen
            name="ACTIVITY_SHEET"
            component={Screen.ActivitySheetScreen}
            options={{
              headerShown: true,
              headerRight: () => renderHeaderButton(IMAGES.search, undefined, theme),
              headerBackground: () => headerBackgroundImg(),
            }}
          />
          <Stack.Screen
            name="FIND_FRIENDS"
            component={Screen.ContactsListScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerBackground: () => headerBackgroundImg(),
                headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.pop(2), theme),
                headerRight: () => renderHeaderButton(IMAGES.search, undefined, theme),
              };
            }}
          />
          <Stack.Screen
            name="MY_CONNECTION"
            component={Screen.MyConnection}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
                headerRight: () => renderHeaderButton(IMAGES.search, undefined, theme),
                headerTitle: 'Connections',
              };
            }}
          />
          <Stack.Screen
            name="SIDENOTE_FRIENDS"
            component={Screen.SidenoteScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButtonText(
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Cancel</Text>,
                    () => navigation.goBack(),
                  ),
                headerRight: () => (
                  <TouchableOpacity
                    disabled={route?.params?.selected && route?.params?.selected.length === 0}
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                  >
                    <Text
                      style={
                        route?.params?.selected && route?.params?.selected.length === 0
                          ? [COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]
                          : [COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]
                      }
                    >
                      Chat
                    </Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="ADD_MEMBER"
            component={Screen.AddMemberScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerRight: () => (
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => {
                      navigation?.navigate('NEW_CATEGORY', {
                        selectedMember: route?.params?.selectedMember,
                        memberTitle: route?.params?.memberTitle,
                      });
                    }}
                  >
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen name="UPDATE_MEMBER" component={Screen.UpdateMemberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UPDATE_SUB_MEMBER" component={Screen.UpdateSubMemberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PRIVATE_GROUP" component={Screen.PrivateGroupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CONVERSATION" component={Screen.ConversationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NEW_CATEGORY" component={Screen.NewCategoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CHAT_PROFILE" component={Screen.ChatProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SHARED_SIDENOTE_LIST" component={Screen.SharedSideNoteList} options={{ headerShown: true }} />
          <Stack.Screen name="ADD_SIDENOTE" component={Screen.AddSidenote} options={{ headerShown: true }} />
          <Stack.Screen name="SHARED_SIDENOTE" component={Screen.SharedSidenoteScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MEMBERS" component={Screen.MembersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="IMAGE_GALLERY" component={Screen.ImageGalleryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CATEGORIES" component={Screen.CategoriesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ARCHIVED" component={Screen.ArchivedScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BLOCKED_USER" component={Screen.BlockUserScreen} options={{ headerShown: true }} />
          <Stack.Screen
            name="SETTINGS"
            component={Screen.SettingsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerRight: () => (
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                  // disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.RED_500 }]}>Save</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="SoundsScreen"
            component={Screen.SoundsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
              };
            }}
          />
          <Stack.Screen
            name="SidenoteSoundsScreen"
            component={Screen.SidenoteSoundsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
              };
            }}
          />
          <Stack.Screen
            name="OpenLink"
            component={Screen.WebViewScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: false,
              };
            }}
          />
          <Stack.Screen
            name="INVITE"
            component={Screen.InviteScreen}
            options={{
              headerShown: false,
              // headerRight: () => renderHeaderButton(IMAGES.search),
            }}
          />
          <Stack.Screen
            name="NEW_TASK"
            component={Screen.NewTaskScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButtonText(
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.RED_500 }]}>Cancel</Text>,
                    () => navigation.goBack(),
                  ),
                headerRight: () => (
                  // renderHeaderButtonText(
                  //   'Save',
                  //   () => {
                  //     console.log('test', route?.params?.handleSubmit);
                  //     route?.params?.handleSubmit();
                  //   },
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                  // disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.RED_500 }]}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="NEW_SUB_TASK"
            component={Screen.NewSubTaskScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButtonText(
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Cancel</Text>,
                    () => navigation.goBack(),
                  ),
                headerRight: () => (
                  <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => route?.params?.handleSubmit()}>
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="CREATE_TASK"
            component={Screen.CreateEventScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                // headerRight: () => (
                //   <TouchableOpacity
                //     style={COMMON_STYLE.headerBtnStyle}
                //     onPress={() => route?.params?.handleSubmit()}
                //     // disabled={!route?.params?.isValid}
                //   >
                //     {/* {console.log('route?.params?.values', route?.params?.values)} */}
                //     <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Post</Text>
                //   </TouchableOpacity>
                // ),
              };
            }}
          />
          <Stack.Screen
            name="Create_Event_Task"
            component={Screen.CreateEventTask}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => route?.params?.handleSubmit()}>
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Save</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="Create_Itinerary_Task"
            component={Screen.CreateItineraryTask}
            options={({ navigation, route }) => {
              return {
                headerTitle: 'New Task',
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => route?.params?.handleSubmit()}>
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Save</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="Assign_User_Screen"
            component={Screen.AssignUserScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => {
                      if (route?.params?.isCreateTask === true) {
                        navigation?.navigate('Create_Event_Task', {
                          selectedTask: route?.params?.selectedTask,
                          userNameTask: route?.params?.userNameTask,
                          from: route?.params?.from,
                        });
                        // route.params?.userNameTask({ userNameTask: route?.params?.userNameTask });
                        // route.params?.setFieldValue('assigned_user_id', route?.params?.selectedTask);
                        // navigation?.goBack();
                      } else {
                        navigation?.navigate('Update_Event_Task', {
                          selectedTask: route?.params?.selectedTask,
                          userNameTask: route?.params?.userNameTask,
                        });
                      }
                    }}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Save</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="Share_With_User"
            component={Screen.ShareWithUserScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerTitle: 'Share With User',
                headerRight: () => (
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => {
                      if (route?.params?.isUpdate) {
                        navigation?.navigate('UPDATE_EVENT', {
                          eventId: route?.params?.eventId,
                          selected: route?.params?.selected,
                          title: route?.params?.tiile,
                        });
                      } else {
                        navigation?.navigate('CREATE_TASK', {
                          selected: route?.params?.selected,
                          title: route?.params?.tiile,
                        });
                      }
                    }}
                  >
                    {route?.params?.selected?.length !== 0 && (
                      <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text>
                    )}
                  </TouchableOpacity>
                ),
              };
            }}
          />
          <Stack.Screen
            name="TASK_DETAIL"
            component={Screen.TaskDetailScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                // headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
              };
            }}
          />
          <Stack.Screen
            name="Event_Task_Detail"
            component={Screen.EventTaskDetail}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                // headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                // headerRight: () => (
                //   <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => route?.params?.handleSubmit()}>
                //     <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Delete</Text>
                //   </TouchableOpacity>
                // ),
              };
            }}
          />
          <Stack.Screen
            name="SUB_TASK_DETAIL_SCREEN"
            component={Screen.SubTaskDetailScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => route?.params?.handleSubmit()}>
                    <Text style={[COMMON_STYLE.headerBtnTextStyle]}>Delete</Text>
                  </TouchableOpacity>
                ),
              };
            }}
          />

          <Stack.Screen
            name="UPDATE_TASK"
            component={Screen.UpdateTaskScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  // renderHeaderButtonText(
                  //   'Save',
                  //   () => {
                  //     console.log('test', route?.params?.handleSubmit);
                  //     route?.params?.handleSubmit();
                  //   },
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                    disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={!route?.params?.isValid ? { color: 'gray' } : COMMON_STYLE.headerBtnTextStyle}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="UPDATE_EVENT"
            component={Screen.UpdateEventScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                title: 'Update Event',
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  // renderHeaderButtonText(
                  //   'Save',
                  //   () => {
                  //     console.log('test', route?.params?.handleSubmit);
                  //     route?.params?.handleSubmit();
                  //   },
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => {
                      route?.params?.handleSubmit();
                      navigation.goBack();
                    }}
                    disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={!route?.params?.isValid ? { color: 'gray' } : COMMON_STYLE.headerBtnTextStyle}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="Update_Event_Task"
            component={Screen.UpdateEventTask}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                title: 'Update Event Task',
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  // renderHeaderButtonText(
                  //   'Save',
                  //   () => {
                  //     console.log('test', route?.params?.handleSubmit);
                  //     route?.params?.handleSubmit();
                  //   },
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                  // disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={COMMON_STYLE.headerBtnTextStyle}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="UPDATE_SUB_TASK"
            component={Screen.UpdateSubTaskScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack()),
                headerRight: () => (
                  // renderHeaderButtonText(
                  //   'Save',
                  //   () => {
                  //     console.log('test', route?.params?.handleSubmit);
                  //     route?.params?.handleSubmit();
                  //   },
                  <TouchableOpacity
                    style={COMMON_STYLE.headerBtnStyle}
                    onPress={() => route?.params?.handleSubmit()}
                    disabled={!route?.params?.isValid}
                  >
                    {/* {console.log('route?.params?.values', route?.params?.values)} */}
                    <Text style={!route?.params?.isValid ? { color: 'gray' } : COMMON_STYLE.headerBtnTextStyle}>Save</Text>
                  </TouchableOpacity>
                ),
                // ),
              };
            }}
          />
          <Stack.Screen
            name="EVENT_DETAILS"
            component={Screen.EventDetailsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: false,
                headerTitle: '',
                headerTransparent: true,
                // headerLeft: () => (
                // <Button
                //   buttonStyle={COMMON_STYLE.headerButtonStyle}
                //   type={'clear'}
                //   icon={<Image source={IMAGES.closeIcon} style={COMMON_STYLE.imageStyle(6)} />}
                //   onPress={() => this.props.navigation.goBack()}
                // />
                // ),
              };
            }}
          />
          <Stack.Screen
            name="ASSIGN_GROUP"
            component={Screen.AssignGroupScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButtonText(<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />, () => {
                    if (route?.params?.isFrom === true) {
                      navigation?.navigate('Create_Itinerary_Task', {
                        selected: route?.params?.selected,
                        groupTitle: route?.params?.title,
                        from: route?.params?.from,
                      });
                    }
                    if (route?.params?.isCreate === true) {
                      navigation?.navigate('NEW_TASK', {
                        selected: route?.params?.selected,
                        groupTitle: route?.params?.title,
                        from: route?.params?.from,
                      });
                    } else if (route?.params?.isCreate === false) {
                      navigation?.navigate('UPDATE_TASK', {
                        selected: route?.params?.selected,
                        groupTitle: route?.params?.title,
                        from: route?.params?.from,
                      });
                    }
                  }),
                // headerLeft: () => (
                //   <Button
                //     buttonStyle={COMMON_STYLE.headerButtonStyle}
                //     type={'clear'}
                //     icon={<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />}
                //     onPress={() => {
                //       this?.props?.navigation?.navigate('NEW_TASK', {
                //         selected: route?.params?.selected,
                //         groupTitle: route?.params?.title,
                //       });
                //     }}
                //   />
                // ),
                headerTitle: `Assign to a ${route?.params?.tabName}`,
                // ,              title: 'shdhsdh',
              };
            }}
          />
          <Stack.Screen
            name="ASSIGN_SUB_GROUP"
            component={Screen.AssignSubGroupScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () =>
                  renderHeaderButtonText(<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />, () => {
                    if (route?.params?.subIsCreate === true) {
                      navigation?.navigate('NEW_SUB_TASK', {
                        subSelected: route?.params?.subSelected,
                        subGroupTitle: route?.params?.subTitle,
                        subFrom: route?.params?.subFrom,
                      });
                    } else {
                      navigation?.navigate('UPDATE_SUB_TASK', {
                        subSelected: route?.params?.subSelected,
                        subGroupTitle: route?.params?.subTitle,
                        subFrom: route?.params?.subFrom,
                      });
                      // navigation.goBack();
                    }
                  }),
                // headerLeft: () => (
                //   <Button
                //     buttonStyle={COMMON_STYLE.headerButtonStyle}
                //     type={'clear'}
                //     icon={<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />}
                //     onPress={() => {
                //       this?.props?.navigation?.navigate('NEW_TASK', {
                //         selected: route?.params?.selected,
                //         groupTitle: route?.params?.title,
                //       });
                //     }}
                //   />
                // ),
              };
            }}
          />
          <Stack.Screen
            name="LOCATION_SEARCH"
            component={Screen.LocationSearch}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerTitle: 'Location',
                headerLeft: () =>
                  renderHeaderButtonText(<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />, () => navigation.goBack()),
                headerRight: () => renderHeaderButtonText('Done', () => navigation.goBack()),
              };
            }}
          />
          <Stack.Screen
            name="LOCATION"
            component={Screen.LocationExample}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerTitle: 'Location',
                headerLeft: () =>
                  renderHeaderButtonText(<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4)} />, () => navigation.goBack()),
              };
            }}
          />
          <Stack.Screen
            name="SINGAL_CHAT"
            component={Screen.OneToOneConversationScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: false,
                headerTitle: '',
                headerTransparent: true,
                // headerLeft: () => (
                // <Button
                //   buttonStyle={COMMON_STYLE.headerButtonStyle}
                //   type={'clear'}
                //   icon={<Image source={IMAGES.closeIcon} style={COMMON_STYLE.imageStyle(6)} />}
                //   onPress={() => this.props.navigation.goBack()}
                // />
                // ),
              };
            }}
          />
          <Stack.Screen
            name="New_Itinerary"
            component={Screen.NewItineraryScreen}
            options={({ navigation, route }) => {
              return {
                headerTitle: 'New Itinerary',
              };
            }}
          />
          <Stack.Screen
            name="Added_New_Itinerary"
            component={Screen.AddedNewItineraryScreen}
            options={({ navigation, route }) => {
              return {
                headerTransparent: true,
                headerLeft: false,
                headerRight: () => (
                  <Button
                    buttonStyle={COMMON_STYLE.headerButtonStyle}
                    type={'clear'}
                    icon={<Image source={IMAGES.visible} style={COMMON_STYLE.imageStyle(6, theme?.colors?.ORANGE_200)} />}
                    // onPress={() => this.props.navigation('New_Itinerary_Details')}
                    onPress={() => this?.props?.navigation?.navigate('New_Itinerary_Details')}
                  />
                ),
              };
            }}
          />
          <Stack.Screen
            name="New_Itinerary_Details"
            component={Screen.NewItineraryDetailsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: false,
                headerTitle: '',
                headerTransparent: true,
              };
            }}
          />
          <Stack.Screen
            name="Choose_Guest_Screen"
            component={Screen.ChooseGuestScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButton(IMAGES.backArrow, () => navigation.goBack(), theme),
                headerRight: () => renderHeaderButton(IMAGES.search, undefined, theme),
                headerTitle: 'Assign to a group',
              };
            }}
          />
          <Stack.Screen
            name="Choose_Moderator_Screen"
            component={Screen.ChooseModeratorScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack(), theme),
                headerRight: () => renderHeaderButtonText('Done', () => navigation.goBack()),
                headerTitle: 'Choose moderator',
              };
            }}
          />
          <Stack.Screen
            name="Itineraries_Screen"
            component={Screen.ItinerariesScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerTitle: 'Itineraries',
              };
            }}
          />
          <Stack.Screen
            name="Drafts_Screen"
            component={Screen.DraftsScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerTitle: 'Drafts',
              };
            }}
          />
          <Stack.Screen
            name="Inbox_Connections_Screen"
            component={Screen.InboxConnections}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                // headerTitle: 'Inbox: Connections',
              };
            }}
          />
          <Stack.Screen
            name="Itinerary_Description_Screen"
            component={Screen.ItineraryDescriptionScreen}
            options={({ navigation, route }) => {
              return {
                headerShown: true,
                headerLeft: () => renderHeaderButtonText('Cancel', () => navigation.goBack(), theme),
                headerTitle: 'Description',
              };
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageBackground>
  );
}

export default AppContainer;

const style = theme =>
  StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      shadowOffset: { height: 0 },
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
