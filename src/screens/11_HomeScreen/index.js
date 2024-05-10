import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  SafeAreaView,
  Animated,
  ImageBackground,
  Linking,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button, Card } from 'react-native-elements';
import ActionButton from 'react-native-circular-action-menu';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import NoDataFound from '../../components/noDataFound';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Validation, convertTimeStamp } from '@utils';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import sound1 from '../../sounds/sound1.mp3';
import { AppContext } from '../../themes/AppContextProvider';
import CustomFAB from '../../components/floating/CustomFab';
import { Modal } from 'react-native-paper';
import ActionButtonModal from '../../components/modalComponents/actionButtonModal';

let echo;

const taskData = [
  {
    id: 1,
    title: 'Pick up cake from Publix',
  },
  {
    id: 2,
    title: 'Task number 2',
  },
];

const sidenoteData = [
  {
    id: 1,
    title: '{Sidenote Name}',
    category: '{Category}',
  },
  {
    id: 2,
    title: '{Sidenote Name}',
    category: '{Category}',
  },
  {
    id: 3,
    title: '{Sidenote Name}',
    category: '{Category}',
  },
];

Item = ({ title, styles }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: taskData,
      sidenoteData: sidenoteData,
      active: 0,
      taskSelected: {},
      eventData: [],
      isRefreshing: false,

      showMoreButtonVisible: false,
      showMore: false,
      isLoader: true,
      isOpen: false,
    };
    this.rotationValue = new Animated.Value(0);
  }
  static contextType = AppContext;
  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  urlListener = ({ url }) => {
    // this.getIntialLinking();

    if (typeof url === 'string') {
      const [name, id] = url.split('//')[1].split('/');
      // navigateHandler(url);
      this.deepLinking(name, id);
    } else {
      console.log(typeof url);
    }
  };

  componentDidMount() {
    this.getProfileDetail();
    this.requestUserPermission();
    this.notificationLister();
    this.getDashboardList(true);
    this.foregroundHandler();
    this.getEventList();
    this.pushNotificationForground();
    this.connectionChat();

    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(this?.props?.userData?.userInfo?.notification_unread_count);
    }
    Linking.addEventListener('url', this.urlListener);

    this.getIntialLinking();
  }

  componentWillUnmount() {
    Linking.removeAllListeners();
  }
  getProfileDetail() {
    try {
      const params = {
        url: API_DATA.PROFILE,
      };
      var accessToken = this.props.userData.access_token;
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], accessToken)
          .then(response => {
            let resp = response[API_DATA.PROFILE];
            this.props.showLoading(false).then(() => {
              if (resp.success) {
                StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)]]).then(() => {
                  this.saveUserData(resp);
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(error => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>> ', e);
      this.setState({ isStartApiCalling: false });
    }
  }

  getIntialLinking = () => {
    Linking.getInitialURL().then(url => {
      if (url) {
        const [name, id] = url.split('//')[1].split('/');

        // navigateHandler(url);
        this.deepLinking(name, id);
      }
    });
  };
  connectionChat = channelId => {
    const id = this?.props?.userData?.userInfo?.id;
    echo = new Echo({
      host: 'https://sortapp.mobileapphero.com:6001',
      broadcaster: 'socket.io',
      client: socketio,
    });
    echo.channel(`chatlist-${id}`).listen('.UserEvent', this.onUserEvent);
    echo.connector.socket.on('connect', function () {});
    echo.connector.socket.on('disconnect', function () {});
    echo.connector.socket.on('reconnecting', function (attemptNumber) {});
    echo.connector.socket.on('error', function () {});
  };

  onUserEvent = data => {
    const id = this?.props?.userData?.userInfo?.id;
    if (data.type === 'chat_delete') {
      this?.props?.navigation?.navigate('TAB_NAVIGATOR');
    }
    if (data.type === 'chat_block') {
      this.getChatDetail(data.chat_id);
    }
    this?.props?.newChatList({ ...data?.chatList, archive_count: data?.archive_count });
    {
      data?.dashboardChatList !== undefined && this.props.updateDashboard(data?.dashboardChatList, data?.chatList?.other?.length);
    }
  };

  offUserEvent = () => {
    echo.connector.socket.off('connect');
    echo.connector.socket.off('conndisconnectect');
    echo.connector.socket.off('reconnecting');
    echo.disconnect();
  };

  componentWillUnmount() {
    this.offUserEvent();
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(this?.props?.userData?.userInfo?.notification_unread_count);
    }
  }
  getChatDetail = chat_Id => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: chat_Id,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              if (resp.success) {
                this.props.getChatDetail(resp?.data);
              } else {
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {}
  };
  pushNotificationForground = () => {
    const { navigate, push } = this?.props?.navigation;
    const unsubscribe = messaging().onMessage(remoteMessage => {
      console.log('remotMessage >>>>', remoteMessage);
      if (remoteMessage?.data?.type === 'new_message') {
        StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(this?.props?.userData?.userInfo)]]).then(() => {});
        // this?.props?.notificationCount();
      } else {
        const newUserData = {
          ...this?.props?.userData?.userInfo,
          notification_unread_count: this.props.userData?.userInfo?.notification_unread_count + 1,
        };

        StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(newUserData)]]).then(() => {});
        this?.props?.notificationCount();
      }
      PushNotification.configure({
        onNotification: notification => {
          if (notification.userInteraction === true) {
            if (
              remoteMessage?.data?.type === 'task_create_assign_user' ||
              remoteMessage?.data?.type === 'task_update_assign_user' ||
              remoteMessage?.data?.type === 'task_create_assign_group' ||
              remoteMessage?.data?.type === 'task_update_assign_group'
            ) {
              navigate('TASK_DETAIL', {
                taskId: remoteMessage?.data?.task_id,
              });
            }
            if (
              remoteMessage?.data?.type === 'event_create_assign_group' ||
              remoteMessage?.data?.type === 'event_update_assign_user' ||
              remoteMessage?.data?.type === 'event_update_assign_group' ||
              remoteMessage?.data?.type === 'event_task_complete' ||
              remoteMessage?.data?.type === 'event_create_share_user' ||
              remoteMessage?.data?.type === 'event_update_share_user' ||
              remoteMessage?.data?.type === 'event_reminder'
            ) {
              this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId: remoteMessage?.data?.event_id });
            }
            if (remoteMessage?.data?.type === 'new_message') {
              if (remoteMessage?.data?.chat_type === 'Group') {
                push('CONVERSATION', {
                  groupTitle: remoteMessage?.data?.group_title,
                  groupId: remoteMessage?.data?.group_id,
                  channel: remoteMessage?.data?.channel,
                  chat_id: remoteMessage?.data?.chat_id,
                  dashboard: true,
                });
                this?.props?.CurrentTabName('chat');
              } else {
                push('SINGAL_CHAT', {
                  profileDetail: remoteMessage?.data,
                  notification: true,
                  dashboard: true,
                });
              }
              this.getReadChat(remoteMessage?.data?.chat_id);
            }

            if (remoteMessage?.data?.type === 'reply_message') {
              if (remoteMessage?.data?.chat_type === 'Group') {
                push('CONVERSATION', {
                  groupTitle: remoteMessage?.data?.group_title,
                  groupId: remoteMessage?.data?.group_id,
                  channel: remoteMessage?.data?.channel,
                  chat_id: remoteMessage?.data?.chat_id,
                  dashboard: true,
                });
                this?.props?.CurrentTabName('chat');
              } else {
                push('SINGAL_CHAT', {
                  profileDetail: remoteMessage?.data,
                  notification: true,
                  dashboard: true,
                });
              }
              this.getReadChat(remoteMessage?.data?.chat_id);
            }
            if (remoteMessage?.data?.type === 'group_member_add') {
              push('CONVERSATION', {
                groupTitle: remoteMessage?.data?.group_title,
                groupId: remoteMessage?.data?.group_id,
                channel: remoteMessage?.data?.channel,
                chat_id: remoteMessage?.data?.chat_id,
                dashboard: true,
              });
              this?.props?.CurrentTabName('chat');
            }
            if (remoteMessage?.data?.type === 'task_complete') {
              push('TASK_DETAIL', {
                taskId: remoteMessage?.data?.task_id,
              });
            }
            if (remoteMessage?.data?.type === 'poll_add') {
              push('POLL', { pollId: remoteMessage?.data?.poll_id });
            }
            if (remoteMessage?.data?.type === 'user_invitation_accept') {
              this.props.navigation.navigate('SINGAL_CHAT', {
                profileDetail: remoteMessage?.data,
                notification: true,
                dashboard: true,
              });
            }
            if (
              remoteMessage?.data?.type === 'itinerary_create_assign_moderator' ||
              remoteMessage?.data?.type === 'itinerary_update_assign_moderator' ||
              remoteMessage?.data?.type === 'itinerary_update_added_guest' ||
              remoteMessage?.data?.type === 'itinerary_create_added_guest' ||
              remoteMessage?.data?.type === 'itinerary_task_update_added_user' ||
              remoteMessage?.data?.type === 'itinerary_task_create_added_user' ||
              remoteMessage?.data?.type === 'itinerary_task_update_added_group' ||
              remoteMessage?.data?.type === 'itinerary_task_create_added_group' ||
              remoteMessage?.data?.type === 'itinerary_update' ||
              remoteMessage?.data?.type === 'itinerary_create'
            ) {
              this?.props?.navigation?.navigate('New_Itinerary_Details', {
                id: remoteMessage?.data?.itinerary_id,
              });
            }
          }

          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: true,
      });
    });

    return unsubscribe;
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      this.getFcmToken();
    }
  };

  getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          // console.log('the new generated token', fcmToken);
          await AsyncStorage.setItem('fcmTOken', fcmToken);
          try {
            const params = {
              url: API_DATA.USER_TOKEN,
              data: {
                device_token: fcmToken,
                device_type: Platform.OS.toUpperCase(),
              },
            };
            this.props.showLoading(true);
            setTimeout(() => {
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.USER_TOKEN];
                    if (resp.success) {
                      // console.log('resp token', resp.data);
                    } else {
                      this.props.showErrorAlert(localize('ERROR'), resp.message);
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                });
            }, 500);
          } catch (e) {
            console.log('cathe error =>', e);
          }
        }
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  notificationLister = async () => {
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log('notifications cased app', remoteMessage.notification, remoteMessage);
    // });
    // messaging().onMessage(async remoteMessage => {
    //   console.log('rec.. for...', remoteMessage);
    // });
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });
    const handleDeepLinking = remoteMessage => {
      const { data } = remoteMessage;
      console.log('remotMessage >>>>', remoteMessage);

      if (remoteMessage) {
        if (remoteMessage?.data?.type !== 'new_message') {
          const newUserData = {
            ...this?.props?.userData?.userInfo,
            notification_unread_count: this.props.userData?.userInfo?.notification_unread_count + 1,
          };

          StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(newUserData)]]).then(() => {});
          this?.props?.notificationCount();
        }
        if (
          remoteMessage?.data?.type === 'task_create_assign_user' ||
          remoteMessage?.data?.type === 'task_update_assign_user' ||
          remoteMessage?.data?.type === 'task_create_assign_group' ||
          remoteMessage?.data?.type === 'task_update_assign_group'
        ) {
          this?.props?.navigation?.navigate('TASK_DETAIL', {
            taskId: remoteMessage?.data?.task_id,
          });
        }
        if (remoteMessage?.data?.type === 'task_complete') {
          this.props.navigation.navigate('TASK_DETAIL', {
            taskId: remoteMessage?.data?.task_id,
          });
        }
        if (
          remoteMessage?.data?.type === 'event_create_assign_group' ||
          remoteMessage?.data?.type === 'event_update_assign_user' ||
          remoteMessage?.data?.type === 'event_update_assign_group' ||
          remoteMessage?.data?.type === 'event_task_complete' ||
          remoteMessage?.data?.type === 'event_create_share_user' ||
          remoteMessage?.data?.type === 'event_update_share_user' ||
          remoteMessage?.data?.type === 'event_reminder'
        ) {
          this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId: remoteMessage?.data?.event_id });
        }
        if (remoteMessage?.data?.type === 'new_message') {
          if (remoteMessage?.data?.chat_type === 'Group') {
            this?.props?.navigation?.navigate('CONVERSATION', {
              groupTitle: data?.group_title,
              groupId: data?.group_id,
              // detail: item,
              // selectUser: selectedId,
              channel: data?.channel,
              chat_id: data?.chat_id,
              // groupCreated: false,
              dashboard: true,
            });
            this?.props?.CurrentTabName('chat');
          } else {
            this.props.navigation.navigate('SINGAL_CHAT', {
              profileDetail: data,
              notification: true,
              dashboard: true,
            });
          }
          this.getReadChat(remoteMessage?.data?.chat_id);
        }
        if (remoteMessage?.data?.type === 'reply_message') {
          if (remoteMessage?.data?.chat_type === 'Group') {
            this?.props?.navigation?.navigate('CONVERSATION', {
              groupTitle: data?.group_title,
              groupId: data?.group_id,
              // detail: item,
              // selectUser: selectedId,
              channel: data?.channel,
              chat_id: data?.chat_id,
              // groupCreated: false,
              dashboard: true,
            });
            this?.props?.CurrentTabName('chat');
          } else {
            this.props.navigation.navigate('SINGAL_CHAT', {
              profileDetail: data,
              notification: true,
              dashboard: true,
            });
          }
          this.getReadChat(remoteMessage?.data?.chat_id);
        }
        if (remoteMessage?.data?.type === 'group_member_add') {
          this?.props?.navigation?.navigate('CONVERSATION', {
            groupTitle: data?.group_title,
            groupId: data?.group_id,
            channel: data?.channel,
            chat_id: data?.chat_id,
            dashboard: true,
          });
          this?.props?.CurrentTabName('chat');
        }
        if (remoteMessage?.data?.type === 'poll_add') {
          this.props.navigation.navigate('POLL', { pollId: data?.poll_id });
        }
        if (remoteMessage?.data?.type === 'user_invitation_accept') {
          this.props.navigation.navigate('SINGAL_CHAT', {
            profileDetail: data,
            notification: true,
            dashboard: true,
          });
        }
        if (
          remoteMessage?.data?.type === 'itinerary_create_assign_moderator' ||
          remoteMessage?.data?.type === 'itinerary_update_assign_moderator' ||
          remoteMessage?.data?.type === 'itinerary_update_added_guest' ||
          remoteMessage?.data?.type === 'itinerary_create_added_guest' ||
          remoteMessage?.data?.type === 'itinerary_task_update_added_user' ||
          remoteMessage?.data?.type === 'itinerary_task_create_added_user' ||
          remoteMessage?.data?.type === 'itinerary_task_update_added_group' ||
          remoteMessage?.data?.type === 'itinerary_task_create_added_group' ||
          remoteMessage?.data?.type === 'itinerary_update' ||
          remoteMessage?.data?.type === 'itinerary_create'
        ) {
          this?.props?.navigation?.navigate('New_Itinerary_Details', {
            id: remoteMessage?.data?.itinerary_id,
          });
        }
      }
    };
    messaging().getInitialNotification().then(handleDeepLinking);
    messaging().onNotificationOpenedApp(handleDeepLinking);
  };

  foregroundHandler = () => {
    PushNotification.createChannel(
      {
        channelId: 'android-channel-id', // (required)
        channelName: 'General', // (required)
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    const unsubscribe = messaging().onMessage(remoteMessage => {
      const { notification, messageId, data } = remoteMessage;
      console.log('remoteMessage ios =---->>>', remoteMessage);
      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: notification?.notify_content_type === 'Name' ? '' : notification.body,
          title: notification.title,
          sound: notification.sound,
        });
        if (Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(this?.props?.userData?.userInfo?.notification_unread_count);
        }
      } else {
        console.log('remoteMessage >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data);
        // PushNotification.createChannel(
        //   {
        //     channelId: 'sound_channel', // (required)
        //     channelName: 'sortapp', // (required)
        //     // playSound: true, // (optional) default: true
        //     // importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
        //     // vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        //     // soundName: data?.sound || '', // (optional) See `soundName` parameter of `localNotification` function
        //   },
        //   created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        // );

        PushNotification.localNotification({
          channelId: 'sound_channel',
          channelName: 'sortapp',
          id: data.message_id,
          body: data?.notify_content_type === 'Name' ? '' : data.body,
          title: data.title,
          soundName: data?.sound,
          vibrate: true,
          playSound: true,
          actions: '["Yes", "No"]',
        });
      }
    });
    return unsubscribe;
  };

  deepLinking = (name, id) => {
    switch (name) {
      case 'invitation':
        // this.acceptFriend(id);
        this.validateFriend(id);
        break;
      default:
    }
    this.onLocalNotification();
  };

  getMyConnectionsList() {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: {},
      };

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MYCONNECTIONS];
              if (resp.success) {
                this.setState({
                  isRefreshing: false,
                  isLoader: false,
                });
                this?.props?.saveMyConnections(resp.data);
                this.setState({ isMoreLoading: false });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  onLocalNotification = notification => {
    // console.log('deeplinking ===>', notification);

    const msg = notification?.getMessage();
    if (msg) {
      const isClicked = notification?.getData().userInteraction === 1;
      Linking.openURL(notification?.getMessage());
    }
  };

  joinFriend = Id => {
    try {
      const params = {
        url: API_DATA.JOINFRIEND,
        data: {
          uuid: Id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.JOINFRIEND];

              this.getMyConnectionsList();
              if (resp) {
                if (this.props?.route?.params?.fromSignup === true) {
                } else {
                  this.props.showToast(localize('SUCCESS'), resp.message);
                }
              } else {
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  validateFriend = Id => {
    try {
      const params = {
        url: API_DATA.VALIDATEURL,
        data: {
          uuid: Id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.VALIDATEURL];

              if (resp.success) {
                this.joinFriend(Id);
              } else {
                if (resp.message === 'Invalid invitation code!') {
                  this.props.showErrorAlert(false, resp.message);
                }
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  getDashboardList(isTrue) {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      if (isTrue && this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.DASHBOARD];
              if (resp.success) {
                this.props.saveDashboard(resp.data, resp.total_task_count, resp.total_chat_count);
                this.props.showLoading(false);
                this.setState({
                  isRefreshing: false,
                  isLoader: false,
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
                if (resp.status === 401) {
                  try {
                    const params = {
                      url: API_DATA.LOGOUT,
                      data: {},
                    };

                    var accessToken = this?.props?.userData.access_token;

                    this.props.showLoading(true);

                    callApi([params], accessToken)
                      .then(response => {
                        this.props.showLoading(false).then(() => {
                          let resp = response[API_DATA.LOGOUT];
                          StorageOperation.removeData([ASYNC_KEYS.IS_LOGIN, ASYNC_KEYS.USER_DATA, ASYNC_KEYS.ACCESS_TOKEN]).then(value => {
                            setTimeout(() => {
                              this?.props.navigation.reset({
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
                } else {
                  this.props.showErrorAlert(localize('ERROR'), resp.message);
                }
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 1000);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  getEventList = () => {
    try {
      const params = {
        url: API_DATA.EVENTLIST,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTLIST];
              this.setState({ isLoading: false });
              if (resp.success) {
                const keysValues = {
                  pastEvents: 'Past',

                  todayEvents: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Today</Text>
                    </View>
                  ),
                  tomorrowEvents: (
                    <View style={[styles.sectionHeader]}>
                      <Text style={styles.sectionHeaderTitle}>Tomorrow</Text>
                    </View>
                  ),
                  futureEvents: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Upcoming</Text>
                    </View>
                  ),
                };
                let data = [];
                Object.keys(resp?.data)?.forEach((item, index) => {
                  if (item !== 'pastEvents') {
                    data.push({ title: keysValues[item], data: resp?.data[item], index: index });
                  }
                });
                this?.props?.saveEventList({ data });
                this?.setState({
                  isRefreshing: false,
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  handleTasks = taskID => {
    try {
      const params = {
        url: API_DATA.TASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKCOMPLETE];
              if (resp.success) {
                this.props.saveTaskComplete(resp.data, taskID);
                this.getDashboardList(false);
                this.props.showToast(localize('SUCCESS'), resp.message);
                if (this.props.taskList) {
                  this.props.saveTaskListComplete(resp.data, taskID);
                }
                this.props.showLoading(false);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  getReadChat(chatId) {
    try {
      const params = {
        url: API_DATA.CHATREAD,
        data: {
          chat_id: chatId,
        },
      };
      // this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATREAD];
              if (resp.success) {
                this.getDashboardList(false);
              } else {
                // this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  _renderEventItem = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <TouchableOpacity
        index={item.id}
        style={styles.eventItem}
        onPress={() => this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId: item.id })}
      >
        <Image source={item?.media?.length ? { uri: item?.media[item?.media.length - 1]?.url } : IMAGES.image} style={styles.eventImage} />
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <View style={styles.userRow}>
            <Image source={{ uri: item?.user?.image }} style={styles.eventSmallImage} />
            <Text style={[styles.userRowTxt]} numberOfLines={1}>
              {item?.user?.name}
            </Text>
          </View>
          <Text style={styles.eventTitle}>{item?.title.length > 12 ? item?.title.slice(0, 13).concat('...') : item.title}</Text>
          {item.is_fullday ? (
            <Text style={styles.eventTime}>Fullday</Text>
          ) : (
            <Text style={styles.eventTime}>
              {moment(item.start_time).format('hh:mm A')}-{moment(item.end_time).format('hh:mm A')}
            </Text>
          )}
          {/* {
            item?.group_id ? 
               <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Image source={IMAGES.chat_name_icon} style={styles.chatIcon} />
            <Text style={styles.chatTitle}>Chat Name: </Text>
          </View> :null
          } */}
        </View>
      </TouchableOpacity>
    );
  };

  onRefresh() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getDashboardList(true);
    }, 500);
  }
  _renderTaskItem = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);

    return <Item title={item.title} theme={styles} />;
  };

  _renderSwipeFrontItemGroup = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <TouchableOpacity
        style={styles.sidenotRow}
        onPress={() => {
          item.type === 'Group'
            ? this.props.navigation.navigate('CONVERSATION', {
                groupTitle: item?.title,
                groupId: item?.group_id,
                detail: item,
                // selectUser: selectedId,
                channel: item?.subGroupChannel ? item?.subGroupChannel : item?.channel,
                chat_id: item?.chat_id,
                tabName: item?.subGroupTitle ? item?.subGroupTitle : 'general',
                tabChatId: item?.subGroupChatId,
                tabGroupId: item?.subGroupId ? item?.subGroupId : item?.group_id,
                groupCreated: false,
              })
            : this.props.navigation.navigate('SINGAL_CHAT', {
                profileDetail: item,
              });
          this?.props?.CurrentTabName('chat');
          item?.unread_count !== 0 ? this.getReadChat(item?.chat_id) : null;
        }}
        activeOpacity={1}
      >
        <View style={styles.sidenotStatusCol}>
          {item?.is_mute === 1 ? (
            <Icon name="notifications-off-outline" style={styles.sidenotHiddenColIcon} />
          ) : item?.unread_count !== 0 ? (
            <View style={styles.tinyCircle} />
          ) : null}
        </View>
        <View style={styles.sidenotContentCol}>
          {item?.members?.length == 2 && item.type !== 'Group' ? (
            item?.members[0]?.user_id === this?.props?.userData?.userInfo?.id ? (
              <Text style={[styles.sidenotName, { color: theme?.colors?.WHITE }]} numberOfLines={1}>
                {item?.members[1]?.user_name}
              </Text>
            ) : (
              <Text style={[styles.sidenotName, { color: theme?.colors?.WHITE }]} numberOfLines={1}>
                {item?.members[0]?.user_name}
              </Text>
            )
          ) : (
            <Text style={[styles.sidenotName]} numberOfLines={1}>
              {item?.title}
            </Text>
          )}
          {/* <View style={styles.sidenotTxtRow}> */}
          {item?.subGroupTitle !== '' ? (
            <View style={styles.sidenotTxtRow}>
              <Text style={styles.sidenotCateTxt3}>{'in '}</Text>
              <Text style={[styles.sidenotCateTxt3, { color: theme?.colors?.RED_500 }]}>
                {item?.subGroupTitle?.length > 20 ? item?.subGroupTitle.slice(0, 20).concat('...') : item?.subGroupTitle}
              </Text>
              <Text style={styles.sidenotCateTxt3}>
                {'• '} {convertTimeStamp(item?.last_message_at)}
              </Text>
            </View>
          ) : item?.type !== 'Private' ? (
            <View style={styles.sidenotTxtRow}>
              <Text style={styles.sidenotCateTxt3}>{'in '}</Text>
              <Text style={[styles.sidenotCateTxt3, { color: theme?.colors?.RED_500 }]}>{'General'}</Text>
              <Text style={styles.sidenotCateTxt3}>
                {' •'} {convertTimeStamp(item?.last_message_at)}
              </Text>
            </View>
          ) : null}
          <View style={styles.sidenotTxtRow}>
            <Text style={[styles.sidenotLastMsg]}>
              {item?.last_message.length > 25
                ? item?.last_message
                    .replace(/[\[\]']+/g, '')
                    .replace(/ *\([^)]*\)*/g, '')
                    .slice(0, 25)
                    .concat('...')
                : item?.last_message.replace(/[\[\]']+/g, '').replace(/ *\([^)]*\)*/g, '')}
            </Text>
            {item?.type === 'Private' ? (
              <Text style={styles.sidenotCateTxt3}>
                {' •'} {convertTimeStamp(item?.last_message_at)}
              </Text>
            ) : null}
          </View>

          {/* </View> */}
        </View>
        {item.members?.length !== 0 ? (
          item?.members?.length == 2 ? (
            item?.members[0]?.user_id === this?.props?.userData?.userInfo?.id ? (
              <View style={styles.sidenotImgCol}>
                <Image
                  source={item?.members?.[1]?.user_image ? { uri: item?.members?.[1]?.user_image } : IMAGES.groupIcon}
                  style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }}
                />
                {item?.unread_count !== 0 && (
                  <View style={styles.chatCount}>
                    <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.sidenotImgCol}>
                <Image
                  source={item?.members?.[0]?.user_image ? { uri: item?.members?.[0]?.user_image } : IMAGES.groupIcon}
                  style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }}
                />
                {item?.unread_count !== 0 && (
                  <View style={styles.chatCount}>
                    <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                  </View>
                )}
              </View>
            )
          ) : (
            <View style={styles.sidenotImgCol}>
              {/* <Image source={IMAGES.groupIcon} style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }} /> */}
              <Image source={IMAGES.CIRCLE_GROUP} style={styles.circleGroupImg} />
              <Image source={{ uri: item?.members[0]?.user_image }} style={styles.userImg1} />
              <Image source={{ uri: item?.members[1]?.user_image }} style={styles.userImg2} />
              <Text style={styles.userImgCount}>
                {'+'}
                {Number(item?.member_count)}
              </Text>
              {item?.unread_count !== 0 && (
                <View style={[styles.chatCount, { top: 0, right: '80%', zIndex: 1024 }]}>
                  <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                </View>
              )}

              {/* {item?.unread_count !== 0 && ( */}
              {/* <View style={styles.chatCount}>
                  <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                </View> */}
              {/* )} */}
            </View>
          )
        ) : (
          <View style={styles.sidenotImgCol}>
            <Image source={{ uri: item?.image }} style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }} />
            {item?.unread_count !== 0 && (
              <View style={[styles.chatCount]}>
                <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  handleTaskDetail = taskId => {
    this?.props?.navigation?.navigate('TASK_DETAIL', { taskId });
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <>
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <SafeAreaWrapper backgroundColor={{}}>
            {this.state?.isLoader === false ? (
              <>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.ScrollView}
                  nestedScrollEnabled={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      tintColor={theme?.colors?.WHITE}
                      onRefresh={() => this.onRefresh()}
                    />
                  }
                >
                  <View style={styles.content}>
                    {/* <Text style={styles.pageTitle}>{localize('HOME_TAB')}</Text> */}
                    <View style={[styles.widgetBox, { marginLeft: 0 }]}>
                      <View style={styles.widgetTopBox}>
                        <View style={styles.widgetDate}>
                          <Text style={styles.widgetDateText}>{moment().format('DD')}</Text>
                        </View>
                        <View style={styles.widgetDayDate}>
                          <Text style={styles.widgetDayText}>{moment().format('dddd')}</Text>
                          <Text style={styles.fourteenGrayStyle}>{moment().format('MMM yyyy')}</Text>
                        </View>
                      </View>

                      {this?.props?.dashboardList?.events?.length ? (
                        <View style={styles.carouselContainer}>
                          <Carousel
                            ref={c => {
                              this._carousel = c;
                            }}
                            // horizontal
                            data={this?.props?.dashboardList?.events}
                            renderItem={this._renderEventItem}
                            sliderWidth={Responsive.getWidth(100)}
                            itemWidth={Responsive.getWidth(70)}
                            onSnapToItem={index => this.setState({ active: index })}
                            inactiveSlideOpacity={1}
                            inactiveSlideScale={1}
                            activeSlideAlignment="start"
                          />
                          <View style={{ marginTop: 15, alignItems: 'center' }}>
                            <AnimatedDotsCarousel
                              length={this?.props?.dashboardList?.events?.length}
                              currentIndex={this?.state?.active}
                              maxIndicators={4}
                              interpolateOpacityAndColor={true}
                              activeIndicatorConfig={{
                                color: theme?.colors?.WHITE,
                                margin: 3,
                                opacity: 1,
                                size: 7,
                                marginTop: -20,
                              }}
                              inactiveIndicatorConfig={{
                                color: theme?.colors?.GRAY_300,
                                margin: 3,
                                opacity: 0.5,
                                size: 7,
                                marginTop: -20,
                              }}
                              decreasingDots={[
                                {
                                  config: { color: theme?.colors?.WHITE, margin: 3, opacity: 0.5, size: 3 },
                                  quantity: 1,
                                },
                                {
                                  config: { color: theme?.colors?.WHITE, margin: 3, opacity: 0.5, size: 2 },
                                  quantity: 1,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      ) : (
                        <View style={styles.widgetNotfound}>
                          <Text style={styles.notFoundText}>Nothing for today</Text>
                          <Image
                            source={IMAGES.open_doodles_laying_down}
                            style={[styles.topNotfoundImgMain, { right: -Responsive.getWidth(28) }]}
                          />
                        </View>
                      )}
                    </View>

                    <View>
                      {this?.props?.dashboardList?.tasks?.length > 0 ? (
                        <FlatList
                          keyboardShouldPersistTaps="handled"
                          data={this?.props?.dashboardList?.tasks}
                          renderItem={({ item }) => {
                            return (
                              <TouchableOpacity style={[styles.taskBox]} onPress={() => this?.handleTaskDetail(item?.id)}>
                                <View style={styles.userRow}>
                                  <Image source={{ uri: item?.user?.image }} style={[styles.userRowImg]} />
                                  <Text style={[styles.userRowTxt]} numberOfLines={1}>
                                    {item?.user?.name}
                                  </Text>
                                </View>
                                <Text style={[styles.taskBoxTitle]} numberOfLines={1}>
                                  {item?.title}
                                </Text>
                                <View style={styles.sidenoteRow}>
                                  <Image source={IMAGES.chat_icon} style={[styles.sidenoteIcon]} />
                                  <Text style={styles.sidenoteTxt} numberOfLines={1}>
                                    {item?.chat_name ? item?.chat_name : ''}
                                    {item?.chat_name ? ' , ' : null}
                                    {item?.chat_category ? item.chat_category : ''}
                                  </Text>
                                </View>
                                {/* {moment(new Date()).isBefore(item.date) ? ( */}
                                <Text style={styles.taskBoxTimeTxt}>{`${convertTimeStamp(item.date)}`}</Text>
                                {/* ) : null} */}
                                {/* <Text style={styles.taskBoxTimeTxt}>3h</Text> */}
                              </TouchableOpacity>
                            );
                          }}
                          horizontal={true}
                          pagingEnabled={true}
                          keyExtractor={item => item.index}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          ItemSeparatorComponent={() => <View style={styles.taskSepratorStyle} />}
                          ListFooterComponent={() => (
                            <TouchableOpacity onPress={() => this.props?.navigation?.navigate('NEW_TASK')}>
                              <View style={[styles.lastTaskBox]}>
                                <Image source={IMAGES.iconAddCircle} style={[styles.profileImage, { width: 26.6, height: 26.6 }]} />
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      ) : (
                        <View style={styles.noTaskfound}>
                          <Image source={IMAGES.open_doodles_zombieing2} style={styles.noTaskfoundImg} />
                          <Text style={styles.noTaskfoundText}>No tasks scheduled</Text>
                        </View>
                      )}
                    </View>
                    <View style={[styles.chatListContainer]}>
                      {this.props?.dashboardList?.chats?.length !== 0 ? (
                        <>
                          <SwipeListView
                            data={this.props?.dashboardList?.chats}
                            renderItem={this._renderSwipeFrontItemGroup}
                            renderHiddenItem={this._renderSwipeHiddenItem}
                            leftOpenValue={0}
                            keyExtractor={(item, index) => index.toString()}
                            rightOpenValue={-320}
                          />
                          {this.props?.dashboardList?.totalChat > 3 ? (
                            <TouchableOpacity style={styles.moreChatBtn} onPress={() => this.props.navigation.navigate('CHATS_TAB')}>
                              {this.props?.dashboardList?.totalChat > 3 ? (
                                <Text style={styles.moreChatBtnText}>+ {this.props?.dashboardList?.totalChat - 3} more</Text>
                              ) : null}
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : (
                        <View style={styles.homeNoDataContainer}>
                          <Image source={IMAGES.noChatImage} style={styles.homeNoDataImg} />
                          <Text style={styles.homeNoDataTitle}>{'No chats yet'}</Text>
                          <Text style={styles.homeNoDataPara}>{'Active chats will appear here'}</Text>
                        </View>
                        // <NoDataFound
                        //   title="No chats yet"
                        //   imageWidth={Responsive.getWidth(50)}
                        //   imageHeight={Responsive.getWidth(40)}
                        //   source={IMAGES.noChatImage}
                        //   // text="Active chats will appear here"
                        //   text="Start your first sidenote below"
                        //   titleColor={COLORS.GRAY_50}
                        //   textColor={COLORS.GRAY_100}
                        // />
                      )}
                    </View>
                  </View>
                </ScrollView>
              </>
            ) : null}
          </SafeAreaWrapper>
          {this?.props?.showModal ? <ActionButtonModal navigation={this?.props?.navigation} /> : null}
        </ImageBackground>
        <CustomFAB />
      </>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    dashboardList: state?.dashboardState?.dashboardList,
    taskList: state?.dashboardState?.taskList,
    eventList: state?.eventState?.eventList,
    groupList: state?.dashboardState?.groupList,
    chatList: state?.groupState?.chatList,
    selectTheme: state?.redState.selectTheme,
    showModal: state?.dashboardState?.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
