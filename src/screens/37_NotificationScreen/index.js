import React from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';
import { API_DATA } from '@constants';
import NoDataFound from '../../components/noDataFound';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AppContext } from '../../themes/AppContextProvider';

class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.getNotificationReadAll()}>
            <Text style={COMMON_STYLE.headerBtnTextStyle}>{'Clear All'}</Text>
          </TouchableOpacity>
        );
      },
    });
    this.state = {
      notiList: this?.props?.notiList,
      currentPage: 1,
      isMoreLoading: false,
      isRefreshing: false,
    };
  }
  static contextType = AppContext;
  componentDidMount() {
    this?.getNotificationList(this?.state?.currentPage);
  }

  getNotificationList(page) {
    try {
      const params = {
        url: API_DATA.NOTIFICATION_LIST,
        data: {
          page: page,
        },
      };
      if (this?.state?.currentPage === 1) {
        this.props.showLoading(true);
      }
      if (this?.state?.isMoreLoading === true) {
        this?.props?.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.NOTIFICATION_LIST];
              if (resp.success) {
                if (page === 1) {
                  this.props.notificationList(resp);
                } else {
                  this?.props?.notificationListLoadMore(resp);
                  this?.setState({ isMoreLoading: false });
                }
                if (page < resp?.total_pages) {
                  this?.setState({
                    currentPage: page + 1,
                  });
                }
                this.props.showLoading(false);
                this?.setState({ isRefreshing: false });
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

  getNotificationRead(id) {
    try {
      const params = {
        url: API_DATA.NOTIFICATION_READ,
        data: {
          id: id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.NOTIFICATION_READ];
              if (resp.success) {
                this.props.notificationRead(resp, id);
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
  }

  refreshControlNotification = () => {
    this?.setState({ isRefreshing: true });
    setTimeout(() => {
      this?.getNotificationList(1);
    }, 500);
  };

  getNotificationReadAll(id) {
    try {
      const params = {
        url: API_DATA.NOTIFICATION_CLEAR_ALL,
        data: {},
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.NOTIFICATION_CLEAR_ALL];
              if (resp.success) {
                this.props.notificationClearAll();
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
  }

  handleReadNotification = val => {
    {
      console.log('group ===>', val);
    }
    this?.getNotificationRead(val?.id);
    if (
      val?.type === 'task_create_assign_user' ||
      val?.type === 'task_create_assign_group' ||
      val?.type === 'task_update_assign_group' ||
      val?.type === 'task_update_assign_user' ||
      val?.type === 'subtask_update_assign_group' ||
      val?.type === 'task_complete'
    ) {
      {
        this?.props?.navigation?.navigate('TASK_DETAIL', {
          taskId: val?.task_id,
        });
      }
    }

    if (
      val?.type === 'event_create_assign_group' ||
      val?.type === 'event_update_assign_user' ||
      val?.type === 'event_task_complete' ||
      val?.type === 'event_update_assign_group' ||
      val?.type === 'event_reminder' ||
      val?.type === 'event_create_share_user' ||
      val?.type === 'event_update_share_user'
    ) {
      this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId: val?.event_id });
    }
    if (val?.type === 'new_message') {
      if (val?.chat_type === 'Group') {
        this?.props?.navigation?.navigate('CONVERSATION', {
          groupTitle: val?.group_title,
          groupId: val?.group_id,
          channel: val?.channel,
          chat_id: val?.chat_id,
          dashboard: true,
          notifi: true,
        });
        this?.props?.CurrentTabName('chat');
      } else {
        this?.props?.navigation?.navigate('SINGAL_CHAT', {
          profileDetail: val,
          notification: true,
          dashboard: true,
          notifi: true,
        });
      }
    }
    if (val?.type === 'reply_message') {
      if (val?.chat_type === 'Group') {
        this?.props?.navigation?.navigate('CONVERSATION', {
          groupTitle: val?.group_title,
          groupId: val?.group_id,
          channel: val?.channel,
          chat_id: val?.chat_id,
          dashboard: true,
          notifi: true,
        });
        this?.props?.CurrentTabName('chat');
      } else {
        this?.props?.navigation?.navigate('SINGAL_CHAT', {
          profileDetail: val,
          notification: true,
          dashboard: true,
          notifi: true,
        });
      }
    }
    if (val?.type === 'group_member_add') {
      this?.props?.navigation?.navigate('CONVERSATION', {
        groupTitle: val?.group?.title,
        groupId: val?.group_id,
        channel: val?.channel,
        chat_id: val?.chat_id,
        dashboard: true,
        notifi: true,
      });
      this?.props?.CurrentTabName('chat');
    }
    if (val?.type === 'poll_add') {
      this?.props?.navigation?.navigate('POLL', { pollId: val?.poll_id });
    }
    if (val?.type === 'user_invitation_accept') {
      this?.props?.navigation?.navigate('MY_CONNECTION');
    }
    if (
      val?.type === 'itinerary_create_assign_moderator' ||
      val?.type === 'itinerary_update_assign_moderator' ||
      val?.type === 'itinerary_update_added_guest' ||
      val?.type === 'itinerary_create_added_guest' ||
      val?.type === 'itinerary_task_update_added_user' ||
      val?.type === 'itinerary_task_create_added_user' ||
      val?.type === 'itinerary_task_update_added_group' ||
      val?.type === 'itinerary_task_create_added_group' ||
      val?.type === 'itinerary_update' ||
      val?.type === 'itinerary_create'
    ) {
      this?.props?.navigation?.navigate('New_Itinerary_Details', {
        id: val?.itinerary_id,
      });
    }
    if (val?.type == 'group_member_invitaiton') {
      this?.props?.navigation?.navigate('Inbox_Connections_Screen');
    }
    const newUserData = {
      ...this?.props?.userData?.userInfo,
      notification_unread_count: this.props.userData?.userInfo?.notification_unread_count - 1,
    };
    StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(newUserData)]]).then(() => {});
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(this?.props?.userData?.userInfo?.notification_unread_count - 1);
    }
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      // <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
      //   {this?.props?.notiList ? (
      //     this?.props?.notiList?.data?.length ? (
      //       <FlatList
      //         refreshControl={
      //           <RefreshControl
      //             tintColor={theme?.colors?.WHITE}
      //             refreshing={this.state.isRefreshing}
      //             onRefresh={() => this.refreshControlNotification()}
      //           />
      //         }
      //         data={this?.props?.notiList?.data}
      //         keyboardShouldPersistTaps="handled"
      //         onEndReachedThreshold={0.5}
      //         ListFooterComponent={() =>
      //           this?.state?.isMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
      //         }
      //         onEndReached={() => {
      //           if (
      //             this?.props?.notiList?.total_pages !== 1 &&
      //             !this?.state?.isMoreLoading &&
      //             this?.props?.notiList?.total_count !== this?.props?.notiList?.data?.length
      //           ) {
      //             this?.setState({ isMoreLoading: true });
      //             this?.getNotificationList(this?.state?.currentPage);
      //           }
      //         }}
      //         keyExtractor={(item, index) => String(index)}
      //         showsVerticalScrollIndicator={false}
      //         renderItem={({ item }) => (
      //           <View style={[styles.contentRow]}>
      //             <TouchableOpacity
      //               style={item?.read_at ? styles.notificationRow2 : styles.notificationRow}
      //               onPress={() => this?.handleReadNotification(item)}
      //             >
      //               <View style={{ flex: 1 }}>
      //                 <Text style={item?.read_at ? styles.notificationTxtur : styles.notificationTxt}>{item?.title}</Text>
      //                 <Text style={[item?.read_at ? styles.notificationTxt2ur : styles.notificationTxt2]}>{item?.body}</Text>
      //               </View>
      //               <View style={[styles.notificationArrowCol]}>
      //                 <Image source={IMAGES.rightArrow} style={item?.read_at ? styles.listArrowIcon2 : styles.listArrowIcon} />
      //               </View>
      //             </TouchableOpacity>
      //           </View>
      //         )}
      //       />
      //     ) : (
      //       <NoDataFound
      //         title="Nothing to see"
      //         text="You don’t have any notifications yet"
      //         titleColor={'#C8BCBC'}
      //         textColor={'#847D7B'}
      //         titleFontSize={20}
      //         source={IMAGES.noChatImage}
      //         imageWidth={205}
      //         imageHeight={156}
      //       />
      //     )
      //   ) : null}
      // </SafeAreaWrapper>
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          {this?.props?.notiList ? (
            this?.props?.notiList?.data?.length ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    tintColor={theme?.colors?.WHITE}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.refreshControlNotification()}
                  />
                }
                data={this?.props?.notiList?.data}
                keyboardShouldPersistTaps="handled"
                onEndReachedThreshold={0.5}
                ListFooterComponent={() =>
                  this?.state?.isMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                }
                onEndReached={() => {
                  if (
                    this?.props?.notiList?.total_pages !== 1 &&
                    !this?.state?.isMoreLoading &&
                    this?.props?.notiList?.total_count !== this?.props?.notiList?.data?.length
                  ) {
                    this?.setState({ isMoreLoading: true });
                    this?.getNotificationList(this?.state?.currentPage);
                  }
                }}
                keyExtractor={(item, index) => String(index)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={[styles.contentRow]}>
                    <TouchableOpacity
                      style={item?.read_at ? styles.notificationRow2 : styles.notificationRow}
                      onPress={() => this?.handleReadNotification(item)}
                    >
                      <View style={[styles.notificationArrowCol]}>
                        <Image
                          source={item?.user?.image ? { uri: item?.user?.image } : IMAGES.sortIcon}
                          style={[styles.notification_profile_dp_style]}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={item?.read_at ? styles.notificationTxtur : styles.notificationTxt}>
                          <Text style={styles?.notificationLabelText}>{item?.user?.name} </Text>
                          {item?.title}
                        </Text>
                        <View style={[styles.createdEvent, { justifyContent: 'space-between' }]}>
                          {/* <Text style={[item?.read_at ? styles.notificationTxt2ur : styles.notificationTxt2]}>Created a new event</Text> */}
                          {/* <View style={[styles.createdEvent, { marginRight: 10 }]}>
                            <Image source={IMAGES.icon_calendar_add} style={[styles.icon_calendar_add_style]} />
                            <Text style={[item?.read_at ? styles.notificationTxt2ur : styles.notificationTxt2]}>Event Title</Text>
                          </View> */}
                        </View>
                      </View>
                      {item?.itinerary?.media?.length ? (
                        <View style={[styles.notificationArrowCol, styles.notification_list]}>
                          <Image source={{ uri: item?.itinerary?.media[0]?.url }} style={[styles.notification_list_img_style]} />
                        </View>
                      ) : null}
                      {item?.event?.media?.length ? (
                        <View style={[styles.notificationArrowCol, styles.notification_list]}>
                          <Image source={{ uri: item?.event?.media[0]?.url }} style={[styles.notification_list_img_style]} />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : (
              <NoDataFound
                title="Nothing to see"
                text="You don’t have any notifications yet"
                titleColor={'#C8BCBC'}
                textColor={'#847D7B'}
                titleFontSize={20}
                source={IMAGES.noChatImage}
                imageWidth={205}
                imageHeight={156}
              />
            )
          ) : null}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    notiList: state?.redState?.notiList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
