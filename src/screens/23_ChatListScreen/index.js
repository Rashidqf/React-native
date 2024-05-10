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
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';
import { RowItems } from '../../components/rowItems';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import constants
import { API_DATA } from '@constants';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/Fontisto';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Validation, convertTimeStamp } from '@utils';
import NoDataFound from '../../components/noDataFound';
import { AppContext } from '../../themes/AppContextProvider';
import CustomFAB from '../../components/floating/CustomFab';
import ActionButtonModal from '../../components/modalComponents/actionButtonModal';

class ChatListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
      isRefreshing: false,
      isEnabled: false,
      chatResp: '',
      isLoading: true,
      scroll: true,
      chatType: '',
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getChatList('isnotFrom', true);
  }

  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
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
                });
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

  getChatList(isFrompin, isTrue, type, search) {
    try {
      const params = {
        url: API_DATA.CHATLIST,
        data: {
          type: type || '',
          search: search || '',
        },
      };
      if (isFrompin === 'isFrompin') {
        this.props.showLoading(false);
      }
      if (isTrue && this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATLIST];

              if (resp.success) {
                this.setState({ isLoading: false });

                this?.props?.newChatList({ ...resp?.data, archive_count: resp?.archive_count });
                this.setState({ isMoreLoading: false, chatResp: resp });
                this.setState({
                  isRefreshing: false,
                });
              } else {
                this.setState({ isLoading: false });

                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 1000);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  getReadChat(chatId) {
    try {
      const params = {
        url: API_DATA.CHATREAD,
        data: {
          chat_id: chatId,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATREAD];
              if (resp.success) {
                //
                this.getChatList('isnotFrom', false);
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

  handleDeleteConversation = (chatId, rowMap, state) => {
    if (rowMap[chatId]) {
      rowMap[chatId].closeRow();
    }
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this conversation?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.CHATDELETE,
              data: {
                chat_id: chatId,
              },
            };

            this.props.showLoading(true);
            setTimeout(() => {
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.CHATDELETE];
                    if (resp.success) {
                      // this.getChatList();
                      this.props.getChatDelete(chatId, state);
                      this.props.showLoading(false);
                      this.props.showToast(localize('SUCCESS'), resp.message);
                    } else {
                      this.props.showErrorAlert(localize('ERROR'), resp.message);
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                });
            }, 500);
          } catch (e) {}
        },
      },
    ]);
  };

  handlePinConversation = (chatId, rowMap) => {
    if (rowMap[chatId]) {
      rowMap[chatId].closeRow();
    }
    this.setState({
      isEnabled: !this.state.isEnabled,
    });
    try {
      const params = {
        url: API_DATA.CHATPIN,
        data: {
          chat_id: chatId,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              {
                this?.props?.chatList?.pinned?.length === undefined && this?.getChatList('isFrompin', true);
              }
              let resp = response[API_DATA.CHATPIN];
              if (resp.success) {
                this.props.getChatPin(chatId);
                this.props.showLoading(false);

                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
                this.setState({
                  isEnabled: !this.state.isEnabled,
                });
              }
            });
          })
          .catch(err => {
            this.setState({
              isEnabled: !this.state.isEnabled,
            });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  handleUnpinConversation = (chatId, rowMap) => {
    if (rowMap[chatId]) {
      rowMap[chatId].closeRow();
    }
    this.setState({
      isEnabled: !this.state.isEnabled,
    });
    try {
      const params = {
        url: API_DATA.CHATUNPIN,
        data: {
          chat_id: chatId,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              {
                this?.props?.chatList?.other?.length === undefined && this?.getChatList('isFrompin', true);
              }
              let resp = response[API_DATA.CHATUNPIN];
              if (resp.success) {
                this.props.getChatUnpin(chatId);
                this.props.showLoading(false);

                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
                this.setState({
                  isEnabled: !this.state.isEnabled,
                });
              }
            });
          })
          .catch(err => {
            this.setState({
              isEnabled: !this.state.isEnabled,
            });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  toggleSwitch = (chatId, rowMap, state) => {
    if (rowMap[chatId]) {
      rowMap[chatId].closeRow();
    }
    this.setState({
      isEnabled: !this.state.isEnabled,
    });
    try {
      const params = {
        url: API_DATA.CHATMUTE,
        data: {
          chat_id: chatId,
          is_mute: this.state.isEnabled === true ? 0 : 1,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATMUTE];
              if (resp.success) {
                this.props.getChatMute(chatId, state);
                this.props.showLoading(false);
                this.getDashboardList();

                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
                this.setState({
                  isEnabled: !this.state.isEnabled,
                });
              }
            });
          })
          .catch(err => {
            this.setState({
              isEnabled: !this.state.isEnabled,
            });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  handleGroupLeave = (groupId, rowMap, chatId, state) => {
    if (rowMap[chatId]) {
      rowMap[chatId].closeRow();
    }
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to leave this group?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.GROUPLEAVE,
              data: {
                id: groupId,
                user_id: this?.props?.userData?.userInfo?.id,
              },
            };
            this.props.showLoading(true);
            setTimeout(() => {
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.GROUPLEAVE];
                    if (resp.success) {
                      this.props.groupLeave(this?.props?.userData?.userInfo?.id, chatId, state);
                      this.props.showLoading(false);

                      this.props.showToast(localize('SUCCESS'), resp.message);
                      if (this?.state?.subTabName === 'general') {
                        this?.props?.navigation?.pop(2);
                      } else {
                        this?.props?.navigation?.pop(2);
                      }
                    } else {
                      this.props.showErrorAlert(localize('ERROR'), resp.message);
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                });
            }, 500);
          } catch (e) {}
        },
      },
    ]);
  };

  _renderSwipeFrontItemGroup = ({ item }) => {
    const selectedUser = item?.members?.filter(val => val?.user_id !== this?.props?.userData?.userInfo?.id);
    const { theme } = this.context;
    const styles = style(theme);
    // const selectedId = selectedUser?.map(item => item?.member_id);
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
                state: 'other',
                dashboard: false,
              })
            : this.props.navigation.navigate('SINGAL_CHAT', {
                channel: item?.channel,
                chat_id: item?.chat_id,
                profileDetail: item,
                state: 'other',
                dashboard: false,
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
              <Text style={[styles.sidenotName]} numberOfLines={1}>
                {item?.members[1]?.user_name}
              </Text>
            ) : (
              <Text style={[styles.sidenotName]} numberOfLines={1}>
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
              <Text style={styles.sidenotCateTxt3}>{'in'}</Text>
              <Text style={[styles.sidenotCateTxt3, { color: theme?.colors?.RED_500 }]}>
                {' '}
                {item?.subGroupTitle?.length > 20 ? item?.subGroupTitle.slice(0, 25).concat('...') : item?.subGroupTitle}
              </Text>
              <Text style={styles.sidenotCateTxt3}>
                {' •'} {convertTimeStamp(item?.last_message_at)}
              </Text>
            </View>
          ) : item?.type !== 'Private' ? (
            <View style={styles.sidenotTxtRow}>
              <Text style={styles.sidenotCateTxt3}>{'in'}</Text>
              <Text style={[styles.sidenotCateTxt3, { color: theme?.colors?.RED_500 }]}>{' General'}</Text>
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
        {item?.members?.length !== 0 ? (
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
          ) : item?.members?.length > 2 ? (
            <View style={styles.sidenotImgCol}>
              {/* <Image source={IMAGES.groupIcon} style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }} /> */}
              <Image source={IMAGES.CIRCLE_GROUP} style={styles.circleGroupImg} />
              <Image source={{ uri: item?.members[0]?.user_image }} style={styles.userImg1} />
              <Image source={{ uri: item?.members[1]?.user_image }} style={styles.userImg2} />
              <Text style={styles.userImgCount}>
                {'+'}
                {Number(item?.member_count) - 2}
              </Text>
              {item?.unread_count !== 0 && (
                <View style={[styles.chatCount, { top: Responsive.getWidth(0), left: 0, zIndex: 10 }]}>
                  <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Image source={{ uri: item?.image }} style={{ height: 50, width: 50, borderRadius: 25 }} />
              {item?.unread_count !== 0 && (
                <View style={[styles.chatCount, { top: Responsive.getWidth(0) }]}>
                  <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                </View>
              )}
            </View>
          )
        ) : (
          <View>
            <Image source={{ uri: item?.image }} style={{ height: 50, width: 50, borderRadius: 25 }} />
            {item?.unread_count !== 0 && (
              <View style={[styles.chatCount, { top: Responsive.getWidth(0) }]}>
                <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
              </View>
            )}
          </View>
        )}
        {/* <ImageBackground source={IMAGES.onboardingScreen} style={styles.listBgImg}></ImageBackground> */}
      </TouchableOpacity>
    );
  };

  _renderSwipeFrontItemPinnedGroup = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);

    // const selectedId = selectedUser?.map(item => item?.member_id);
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
                state: 'pinned',
              })
            : this.props.navigation.navigate('SINGAL_CHAT', {
                channel: item?.channel,
                chat_id: item?.chat_id,
                profileDetail: item,
                state: 'pinned',
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
          {item?.members?.length == 2 ? (
            item?.members[0]?.user_id === this?.props?.userData?.userInfo?.id ? (
              <Text style={[styles.sidenotName]} numberOfLines={1}>
                {item?.members[1]?.user_name}
              </Text>
            ) : (
              <Text style={[styles.sidenotName]} numberOfLines={1}>
                {item?.members[0]?.user_name}
              </Text>
            )
          ) : (
            <Text style={[styles.sidenotName]} numberOfLines={1}>
              {item?.title}
            </Text>
          )}
          {item?.subGroupTitle !== '' ? (
            <View style={styles.sidenotTxtRow}>
              <Text style={styles.sidenotCateTxt3}>{'in '}</Text>
              <Text style={[styles.sidenotCateTxt3, { color: theme?.colors?.RED_500 }]}>
                {item?.subGroupTitle?.length > 20 ? item?.subGroupTitle.slice(0, 20).concat('...') : item?.subGroupTitle}
              </Text>
              <Text style={styles.sidenotCateTxt3}>
                {' •'} {convertTimeStamp(item?.last_message_at)}
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
            {item.type === 'Private' ? (
              <Text style={styles.sidenotCateTxt3}>
                {' •'} {convertTimeStamp(item?.last_message_at)}
              </Text>
            ) : null}
          </View>
        </View>

        {item?.members?.length !== 0 ? (
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
          ) : item.image !== '' ? (
            <View style={styles.sidenotImgCol}>
              <Image
                source={item?.image ? { uri: item?.image } : IMAGES.groupIcon}
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
              <Image source={IMAGES.groupIcon} style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }} />
              {item?.unread_count !== 0 && (
                <View style={styles.chatCount}>
                  <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
                </View>
              )}
            </View>
          )
        ) : (
          <View>
            <Image source={{ uri: item?.image }} style={{ height: 50, width: 50, borderRadius: 25 }} />
            {item?.unread_count !== 0 && (
              <View style={[styles.chatCount, { top: Responsive.getWidth(0) }]}>
                <Text style={[styles.chatCountTxt]}>{item?.unread_count}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  _renderSwipeHiddenItem = ({ item }, rowMap) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <View style={styles.sidenotHiddenRow}>
        <TouchableOpacity
          style={styles.sidenotHiddenCol}
          onPress={() => {
            this?.handlePinConversation(item?.chat_id, rowMap, 'other');
          }}
        >
          <Image source={IMAGES.pinIcon} style={[styles.sidenotHiddenColImg]} />
        </TouchableOpacity>
        {item?.is_mute === 1 ? (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.toggleSwitch(item?.chat_id, rowMap, 'other')}>
            <Icon name="notifications-off-outline" style={styles.sidenotHiddenColIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.toggleSwitch(item?.chat_id, rowMap, 'other')}>
            <Icon name="notifications-outline" style={styles.sidenotHiddenColIcon} />
          </TouchableOpacity>
        )}
        {item.type === 'Group' ? (
          <View style={styles.sidenotHiddenCol}>
            {item?.members?.length === 2 ? (
              <TouchableOpacity
                style={styles.sidenotHiddenCol}
                onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'other')}
              >
                <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
              </TouchableOpacity>
            ) : (
              <>
                {item?.admin?.id === this.props.userData.userInfo.id ? (
                  <TouchableOpacity
                    style={styles.sidenotHiddenCol}
                    onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'other')}
                  >
                    <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.sidenotHiddenCol}
                    onPress={() => this.handleGroupLeave(item?.group_id, rowMap, item?.chat_id, 'other')}
                  >
                    <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'other')}>
            <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _renderSwipeHiddenPinnedItem = ({ item }, rowMap) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <View style={styles.sidenotHiddenRow}>
        <TouchableOpacity
          style={styles.sidenotHiddenCol}
          onPress={() => {
            this?.handleUnpinConversation(item?.chat_id, rowMap, 'pinned');
          }}
        >
          <Image source={IMAGES.pinIcon} style={[styles.sidenotHiddenColImg]} />
        </TouchableOpacity>
        {item.is_mute === 1 ? (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.toggleSwitch(item?.chat_id, rowMap, 'pinned')}>
            <Icon name="notifications-off-outline" style={styles.sidenotHiddenColIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.toggleSwitch(item?.chat_id, rowMap, 'pinned')}>
            <Icon name="notifications-outline" style={styles.sidenotHiddenColIcon} />
          </TouchableOpacity>
        )}
        {item.type === 'Group' ? (
          <View style={styles.sidenotHiddenCol}>
            {item?.members?.length === 2 ? (
              <TouchableOpacity
                style={styles.sidenotHiddenCol}
                onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'pinned')}
              >
                <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
              </TouchableOpacity>
            ) : (
              <>
                {item?.admin?.id === this.props.userData.userInfo.id ? (
                  <TouchableOpacity
                    style={styles.sidenotHiddenCol}
                    onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'pinned')}
                  >
                    <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.sidenotHiddenCol}
                    onPress={() => this.handleGroupLeave(item?.group_id, rowMap, item?.chat_id, 'pinned')}
                  >
                    <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.sidenotHiddenCol} onPress={() => this.handleDeleteConversation(item?.chat_id, rowMap, 'pinned')}>
            <Image source={IMAGES.deleteNewIcon} style={[styles.sidenotHiddenColImg]} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  onRowDidOpen = (rowKey, index) => {};

  onRefresh = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getChatList('isnotFrom', true, this.state.chatType);
    }, 500);
  };

  handleSearch = text => {
    if (text?.length === 0) {
      this.getChatList('isnotFrom', false, this.state?.chatType);
    }
    if (text?.length > 2) {
      this.getChatList('isnotFrom', false, this?.state?.chatType, text);
    }
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0 }}></SafeAreaWrapper>
        </ImageBackground>
      );
    }

    return (
      //  <View style={{ flex: 1 }}>
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginBottom: -50 }}>
          <View style={{ marginTop: Platform.OS === 'android' ? 100 : 60 }}>
            {/* <Text style={styles.pageTitle}>{'Chats'}</Text> */}
            <View style={styles.filterTab}>
              <TouchableOpacity
                style={this.state.chatType === '' ? styles.activeTab : styles.inActiveTab}
                onPress={() => {
                  this.setState({
                    chatType: '',
                  });
                  this.getChatList('isnotFrom', true, '');
                }}
              >
                <Text style={this.state.chatType === '' ? styles.activeIcon : styles.inActiveIcon}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={this.state.chatType === 'Group' ? styles.activeTab : styles.inActiveTab}
                onPress={() => {
                  this.setState({
                    chatType: 'Group',
                  });
                  this.getChatList('isnotFrom', true, 'Group');
                }}
              >
                <Text style={this.state.chatType === '' ? styles.activeIcon : styles.inActiveIcon}>Sidenotes</Text>
                {/* <Icon name="person" style={this.state.chatType === 'Private' ? styles.activeIcon : styles.inActiveIcon} /> */}
              </TouchableOpacity>
              <TouchableOpacity
                style={this.state.chatType === 'Private' ? styles.activeTab : styles.inActiveTab}
                onPress={() => {
                  this.setState({
                    chatType: 'Private',
                  });
                  this.getChatList('isnotFrom', true, 'Private');
                }}
              >
                <Text style={this.state.chatType === '' ? styles.activeIcon : styles.inActiveIcon}>Direct</Text>
                {/* <Icon4 name="persons" style={this.state.chatType === 'Group' ? styles.activeIcon : styles.inActiveIcon} /> */}
              </TouchableOpacity>
            </View>
            <View style={styles.searchView}>
              <Icon name="search" style={styles.searchBarIcon} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={theme?.colors?.GRAY_200}
                // value={values.title}
                onChangeText={text => this.handleSearch(text)}
                style={styles.searchBar}
              />
            </View>
          </View>
          {/* <ScrollView
            scrollEnabled={this.state.scroll}
            refreshControl={
              <RefreshControl tintColor={theme?.colors?.WHITE} refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollView}
            nestedScrollEnabled={true}
          > */}
          <ScrollView>
            <View style={styles.content}>
              {this?.props?.chatList?.archive_count !== 0 && (
                <RowItems
                  theme={theme}
                  title={'View archived'}
                  titleStyle={{ color: theme?.colors?.PURPLE_500 }}
                  containerStyle={[styles.rowItemsStyle, { marginBottom: 15 }]}
                  onPress={() => this.props.navigation.navigate('ARCHIVED', { isChat: true })}
                />
              )}
              {(this?.props?.chatList?.other?.length !== undefined && this?.props?.chatList?.other?.length !== 0) ||
              (this?.props?.chatList?.pinned?.length !== undefined && this?.props?.chatList?.pinned?.length !== 0) ? (
                <View style={{ flex: 1 }}>
                  {this?.props?.chatList?.pinned?.length !== 0 && this?.props?.chatList?.pinned?.length !== undefined ? (
                    <Text style={styles.secTitle}>{'Pinned'}</Text>
                  ) : null}
                  {this?.props?.chatList?.pinned?.length !== 0 ? (
                    <View>
                      <SwipeListView
                        swipeGestureBegan={() => this.setState({ scroll: false })}
                        data={this?.props?.chatList?.pinned}
                        keyExtractor={(rowData, index) => {
                          return rowData?.chat_id?.toString();
                        }}
                        renderItem={this._renderSwipeFrontItemPinnedGroup}
                        renderHiddenItem={this._renderSwipeHiddenPinnedItem}
                        leftOpenValue={0}
                        rightOpenValue={-320}
                        onRowOpen={() => this.setState({ scroll: false })}
                        onRowDidOpen={this.onRowDidOpen}
                        onRowDidClose={() => this.setState({ scroll: true })}
                        closeOnRowPress={true}
                        closeOnRowBeginSwipe={true}
                        closeOnRowOpen={true}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                      />
                    </View>
                  ) : null}

                  {this?.props?.chatList?.other?.length !== 0 &&
                    this?.props?.chatList?.other?.length !== undefined &&
                    this?.props?.chatList?.pinned?.length !== 0 &&
                    this?.props?.chatList?.pinned?.length !== undefined && <Text style={styles.secTitle}>{'Other'}</Text>}
                  {this?.props?.chatList?.other?.length !== 0 ? (
                    <View>
                      <SwipeListView
                        swipeGestureBegan={() => this.setState({ scroll: false })}
                        data={this?.props?.chatList?.other}
                        keyExtractor={(rowData, index) => {
                          return rowData?.chat_id?.toString();
                        }}
                        renderItem={this._renderSwipeFrontItemGroup}
                        renderHiddenItem={this._renderSwipeHiddenItem}
                        leftOpenValue={0}
                        rightOpenValue={-320}
                        onRowOpen={() => this.setState({ scroll: false })}
                        onRowDidOpen={this.onRowDidOpen}
                        onRowDidClose={() => this.setState({ scroll: true })}
                        closeOnRowPress={true}
                        closeOnRowBeginSwipe={true}
                        closeOnRowOpen={true}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                      />
                    </View>
                  ) : // <>
                  // <Text>data diplay</Text></>
                  null}
                </View>
              ) : (
                <NoDataFound
                  title="Nothing to see"
                  text="You don’t have any active chats yet"
                  titleColor={theme?.colors?.GRAY_50}
                  textColor={theme?.colors?.GRAY_100}
                  titleFontSize={20}
                  // source={IMAGES.noChatImage}
                  imageWidth={205}
                  imageHeight={156}
                />
              )}
            </View>
          </ScrollView>
          {this?.props?.showModal ? <ActionButtonModal navigation={this?.props?.navigation} /> : null}
          {/* </ScrollView> */}
        </SafeAreaWrapper>
        <CustomFAB />
      </ImageBackground>
      //  </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupList: state?.dashboardState?.groupList,
    chatList: state?.groupState?.chatList,
    showModal: state?.dashboardState?.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ChatListScreen);
