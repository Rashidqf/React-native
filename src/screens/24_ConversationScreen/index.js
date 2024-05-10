import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  SectionList,
  Alert,
  Switch,
  BackHandler,
  RefreshControl,
  StyleSheet,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, EventCard } from '@components';

//import constants
import { API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { Button, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/Foundation';
import Icon4 from 'react-native-vector-icons/Entypo';
import { GestureHandlerRootView, TapGestureHandler, TextInput } from 'react-native-gesture-handler';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import ImagePicker from 'react-native-image-crop-picker';
import { convertTimeStamp, compareTime } from '@utils';
import NoDataFound from '../../components/noDataFound';
import moment, { defaultFormat } from 'moment';
import Swipeout from 'react-native-swipeout';
import ImageView from 'react-native-image-viewing';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mentions from '../../components/tagComponent';
import renderValue from './MessageDisplay';
import { UserModal } from '@components';
import onShare from '../../utils/deepLinking';
import LinearGradient from 'react-native-linear-gradient';
import LikeUserModal from '../../components/likeUserModal';
import Clipboard from '@react-native-community/clipboard';
import { AppContext } from '../../themes/AppContextProvider';
import Hyperlink from 'react-native-hyperlink';
import AnimatedLottieView from 'lottie-react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RowItems from '../../components/rowItems/rowItems';
import Video from 'react-native-video';
// import EventCard from '../../components/eventCard/eventCard';

let echo;

class ConversationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();
    this.textInputRef = React.createRef();
    this.groupRed = React.createRef();
    this.state = {
      sidenotViewData: [{}],
      tabName: this?.props?.route?.params?.tabName !== undefined ? this.props.route?.params?.tabName : 'general',
      groupId: this?.props?.route?.params?.groupId,
      groupTitle: this?.props?.route?.params?.groupTitle,
      // selectUser: this?.props?.route?.params?.selectUser,
      detail: this?.props?.route?.params?.detail,
      channel: this?.props?.route?.params?.channel,
      chatId: this?.props?.route?.params?.chat_id,
      tabChatId: this?.props?.route?.params?.tabChatId,
      message: '',
      imagePick: '',
      isShowPicker: false,
      isGroupPopup: false,
      like: 0,
      separator: false,
      separatorDate: '',
      loading: false,
      currentPage: 1,
      isRefresh: false,
      // tabTopName: this.props.route?.params?.tabTopName ? this.props.route?.params?.tabTopName : 'chat', //'polls',
      pollTab: 'activePoll',
      openExpand: [],
      user: {},
      modalVisible: false,
      replyModal: false,
      replyMessage: '',
      replyPoll: '',
      replyEvent: '',
      replyTask: '',
      replyTime: '',
      replyMedia: [],
      subIndex: null,
      tabGroupId: this.props?.route?.params?.tabGroupId ? this.props?.route?.params?.tabGroupId : this.props?.route?.params?.groupId,
      groupDetailId: this?.props?.groupDetail,
      groupDetailAgain: null,
      // groupDetailA: null,
      groupDetailA: this?.props?.groupDetailA,
      groupCreated: this?.props?.route?.params?.groupCreated,
      messageDetails: [],
      page: 1,
      tempId: '',
      images: [],
      visible: { index: 0, visible: false },
      chatDetails: '',
      listState: this?.props?.route?.params?.state,
      msgReply: false,
      msgId: '',
      replyData: '',
      hideReply: false,
      listIndex: '',
      pollText: false,
      viewReply: {
        state: false,
        index: 0,
      },
      isLoaginTask: true,
      isLoading: true,
      // notifi: this?.props?.route?.params?.notifi,
      Option: ['', ''],
      question: '',
      eventCurrentPage: 1,
      isRefreshing: false,
      isLiking: [],
      isLoaderEvent: true,
      isAtShow: false,
      members: this?.props?.chatDetail?.members,
      isShowModal: false,
      profileDetail: '',
      isBlock: false,
      replyMsgId: '',
      likeModal: false,
      isShowMenu: false,
      isEnabled: false,
      likeUserList: [],
      likeMessage: '',
      isCopyMsg: false,
      isEvent: false,
      isTask: false,
      isUserTyping: false,
      typingUserData: null,
      alreadyTyping: false,
      sixtySecondsExceeded: false,
      addToCalendarEvent: false,
      addToCalendarEventId: '',
      modalForSubGroup: false,
      modalForReportMessage: false,
      reportText: '',
      userDataModal: false,
      previousSenderId: '',
      isVideoPlaying: false,
      videoURL: '',
      isFullScreen: true,
      tabGroupEvent: false,
    };
    this.atPress = this.atPress.bind(this);
  }
  static contextType = AppContext;

  timeoutForTyping = null;
  timeoutForTyping2 = null;
  sixtySecondsTimer = null;
  componentDidMount = () => {
    this.getChatDetail(this.state.chatId);
    // this.onImageEffect();
    this.handleGroupDetail(this.state.groupId);
    this.connectionChat();
    this.handleGroupDetailSub(this.state.groupId);
    this?.props?.navigation?.setParams({
      subTabName: this?.state?.tabName,
    });

    setTimeout(() => {
      this.getMessageList();
    }, 1000);
    this.getEventListId();
    this.getTaskListId();
    // this.getTaskList();
    this.getEventList();
    this.getReadChat(this.state.tabChatId ? this.state.tabChatId : this.state.chatId);
    if (this.props?.cTabName === 'polls') {
      // if (this.state.tabTopName === 'polls') {
      this.getPollList();
    }
    if (this?.props?.route?.params?.groupCreated === true) {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    if (this?.props?.route?.params?.isNewSubgroup) {
      console.log('New Subgroup is created..............');
      this?.openModalForNewSubGroup();
    }
  };
  atPress() {
    this.setState({ isAtShow: !this.state.isAtShow });
  }

  openModalForNewSubGroup() {
    this?.setState({ modalForSubGroup: true });
  }

  onReportMessageHandler() {
    const data = {
      msgId: this?.state?.msgId,
      replyData: this?.state?.replyData,
      replyMessage: this?.state?.replyMessage,
      replyMedia: this?.state?.replyMedia,
    };
    try {
      const params = {
        url: `${API_DATA.CHATMESSAGEREPORT}`,
        data: {
          message_id: this?.state?.msgId,
          message: this?.state?.reportText,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[`${API_DATA.CHATMESSAGEREPORT}`];
              this.setState({ isLoading: false });
              console.log('$$$$$$$$$$', resp);
              if (resp.success) {
                this.setState({ modalForReportMessage: false });
                this?.setState({ reportText: '' });
              } else {
                this.setState({ isLoading: false });
                this.setState({ modalForReportMessage: false });
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
            this.setState({ modalForReportMessage: false });
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
    console.log('On Report Handler', JSON.stringify(data));
  }

  onImageEffect = chatDetail => {
    // const chatDetail = this?.props?.chatDetail;
    if (chatDetail?.media) {
      const finalArr = chatDetail?.media?.map(val => {
        const obj = {
          uri: val,
        };
        return obj;
      });

      this.setState({
        images: finalArr.reverse(),
      });
    }
  };

  handleBackButton = () => {
    this.props.navigation.navigate('TAB_NAVIGATOR');
    return true;
  };
  getLikeUserList = id => {
    try {
      const params = {
        url: `${API_DATA.LIKE_USER_LIST}`,
        data: {
          message_id: id,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[`${API_DATA.LIKE_USER_LIST}`];
              this.setState({ isLoading: false });
              this?.setState({
                likeModal: true,
              });
              if (resp.success) {
                this?.setState({
                  likeUserList: resp?.data,
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
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  getPollList(page) {
    const Page = page === undefined ? page : this.state.eventCurrentPage;
    try {
      const params = {
        url: `${API_DATA.POLLLIST}?page=${this.state.eventCurrentPage}`,
        data: {
          group_id: this?.state?.tabName === 'general' ? this.state.groupId : this?.state?.tabGroupId,
        },
      };

      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      //   this.props.stateClearPoll();

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[`${API_DATA.POLLLIST}?page=${this.state.eventCurrentPage}`];
              this.setState({ isLoading: false, isRefreshing: false });
              if (resp.success) {
                if (this.state.eventCurrentPage === 1) {
                  this.props.savePollList(resp);
                } else {
                  this.props.pollListLoadMore(resp);
                }
                this.setState({
                  eventCurrentPage: this.state.eventCurrentPage + 1,
                  isRefresh: false,
                });
              } else {
                this.setState({ isLoading: false, isRefreshing: false });
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
  }

  getChatDetail = chat_Id => {
    const chatId = chat_Id !== undefined ? chat_Id : this.state.tabChatId ? this.state.tabChatId : this.state.chatId;

    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: chatId,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];

              if (resp.success) {
                this.props.getChatDetail(resp?.data);
                this.onImageEffect(resp?.data);
                this.setState({ chatDetails: resp?.data });
              } else {
                {
                  this?.props?.route?.params?.dashboard === true
                    ? this.props?.navigation?.navigate('TAB_NAVIGATOR')
                    : this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
                        this?.props?.navigation?.goBack();
                      });
                }
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {}
  };

  getChatList() {
    try {
      const params = {
        url: API_DATA.CHATLIST,
        data: {},
      };

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATLIST];
              if (resp.success) {
                this?.props?.newChatList({ ...resp?.data, archive_count: resp?.archive_count });
                this.setState({ isMoreLoading: false });
                this.setState({
                  isRefreshing: false,
                });
              } else {
                {
                  this?.props?.route?.params?.dashboard === true
                    ? this.props?.navigation?.navigate('TAB_NAVIGATOR')
                    : this.props.showErrorAlert(localize('ERROR'), resp.message);
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
                this.getDashboardList();
                // this.getChatList();
              } else {
                this?.props?.route?.params?.dashboard === true ? this.props?.navigation?.navigate('TAB_NAVIGATOR') : '';
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

  getTaskListId = () => {
    console.log('this?.state?.tabGroupId', this?.state?.tabGroupId);
    this.props.clearTask();
    try {
      const params = {
        url: API_DATA.TASKLISTGROUPID,
        data: {
          group_id: this?.state?.tabName === 'general' ? this.state.groupId : this?.state?.tabGroupId,
        },
      };

      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKLISTGROUPID];
              const { theme } = this.context;
              const styles = style(theme);
              if (resp.success) {
                const keysValues = {
                  pastTasks: 'Past',

                  todayTasks: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Today</Text>
                    </View>
                  ),
                  tomorrowTasks: (
                    <View style={[styles.sectionHeader]}>
                      <Text style={styles.sectionHeaderTitle}>Tomorrow</Text>
                    </View>
                  ),
                  futureTasks: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Upcoming</Text>
                    </View>
                  ),
                };
                let data = [];
                Object.keys(resp?.data)?.forEach(item => {
                  if (item !== 'pastTasks') {
                    data.push({ title: keysValues[item], data: resp?.data[item] });
                  }
                });
                this?.props?.taskListGroupId({ data });
              } else {
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 800);
    } catch (e) {}
  };

  getTaskList = () => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKLIST];
              const { theme } = this.context;
              const styles = style(theme);
              if (resp.success) {
                const keysValues = {
                  pastTasks: 'Past',

                  todayTasks: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Today</Text>
                    </View>
                  ),
                  tomorrowTasks: (
                    <View style={[styles.sectionHeader]}>
                      <Text style={styles.sectionHeaderTitle}>Tomorrow</Text>
                    </View>
                  ),
                  futureTasks: (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderTitle}>Upcoming</Text>
                    </View>
                  ),
                };
                let data = [];
                Object.keys(resp?.data)?.forEach(item => {
                  if (item !== 'pastTasks') {
                    data.push({ title: keysValues[item], data: resp?.data[item] });
                  }
                });
                this?.props?.saveTaskList({ data });
              } else {
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 800);
    } catch (e) {}
  };
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
              const { theme } = this.context;
              const styles = style(theme);
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
                    if (resp?.data[item]?.length) {
                      data.push({ title: keysValues[item], data: resp?.data[item], index: index });
                    }
                  }
                });
                // this?.props?.saveEventList({ data });
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
  getEventListId = () => {
    this.props.clearEvent();
    try {
      const params = {
        url: API_DATA.EVENTLISTID,
        data: {
          group_id: this?.state?.tabName === 'general' ? this.state.groupId : this?.state?.tabGroupId,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      console.log('group id', params.data);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTLISTID];
              this.setState({ isLoading: false });
              const { theme } = this.context;
              const styles = style(theme);
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
                    if (resp?.data[item]?.length) {
                      data.push({ title: keysValues[item], data: resp?.data[item], index: index });
                    }
                  }
                });
                // this?.props?.eventListId({ data });
                // this?.props?.saveEventList({ data });
                this?.setState({
                  isRefreshing: false,
                  isLoaderEvent: false,
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
                  this?.props?.navigation?.goBack();
                });
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

  getEventTaskForDate = date => {
    this.props.clearEvent();
    try {
      const params = {
        url: API_DATA.CALENDAR_EVENT_TASK,
        data: {
          group_id: this?.state?.tabName === 'general' ? this.state.groupId : this?.state?.tabGroupId,
          date: moment(date).format('YYYY-MM-DD'),
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      console.log('params =====>', params);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CALENDAR_EVENT_TASK];
              this.setState({ isLoading: false });
              // console.log('resp ===============>', resp?.data?.task);
              if (resp.success) {
                this?.props?.eventListId([
                  ...resp?.data?.event?.map(item => ({ ...item, isEvent: true })),
                  ...resp?.data?.task?.map(item => ({ ...item, isTask: true })),
                ]);
                this?.props?.taskListGroupId(resp?.data?.task);
                // this?.props?.saveEventList({ data });
                this?.setState({
                  isRefreshing: false,
                  isLoaderEvent: false,
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
                  this?.props?.navigation?.goBack();
                });
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
  getCategoryEventList = () => {
    try {
      const params = {
        url: API_DATA.CATEGORY_EVENTLIST,
        data: {
          group_id: this?.state?.tabGroupId,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token).then(response => {
          let resp = response[API_DATA.CATEGORY_EVENTLIST];
          console.log('event in category,', resp.data);
          if (resp.success) {
            this?.props?.eventListId([...resp?.data?.events?.map(item => ({ ...item, isEvent: true }))]);
            this.setState({ isLoaderEvent: false });
          } else {
            this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
              this?.props?.navigation?.goBack();
            });
          }

          console.log('event list id', this.props.eventListID);
        });
      }, 500);
    } catch (error) {
      console.log('try error', error);
    }
  };
  getMessageList = (chat_Id, page) => {
    const chatId = chat_Id !== undefined ? chat_Id : this.state.tabChatId ? this.state.tabChatId : this.state.chatId;
    const pagenumber = page === undefined ? this.state.currentPage : page;
    this.setState({
      chatId: chatId,
    });
    try {
      const params = {
        url: `${API_DATA.MESSAGELIST}?page=${pagenumber}`,
        data: {
          chat_id: chatId,
          limit: 20,
        },
      };

      setTimeout(() => {
        callApi([params], this.props.userData.access_token).then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[`${API_DATA.MESSAGELIST}?page=${pagenumber}`];
            if (resp.success) {
              if (pagenumber === 1) {
                this.getChatDetail();
                this.setState({ messageDetails: resp });
                this.props.messageList(resp);
              } else {
                this.props.messageListLoadMore(resp);
                this.setState({ isMoreLoading: false });
              }
              this.setState({
                currentPage: pagenumber + 1,
                isRefresh: false,
              });
              resp.data.map(msg => {
                setTimeout(() => {
                  this.offUserEvent();
                  this.connectionChat(msg?.channel);
                }, 1000);
              });
            }
          });
        }, 500);
      }, 500);
    } catch (e) {}
  };

  handleGroupDetail = groupId => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: this.state.groupId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];

              if (resp.success) {
                this?.props?.saveGroupDetail(resp.data);
                this?.setState({
                  groupDetailA: resp?.data,
                  detail: resp?.data,
                });
                this?.props?.showLoading(false);
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };
  handleGroupDetailSub = groupId => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: groupId ? groupId : this.state.tabGroupId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              if (resp.success) {
                this?.props?.saveSubGroupDetail(resp.data);
                // this?.setState({
                //   groupDetailA: resp?.data,
                // });
                this?.props?.showLoading(false);
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };
  handleGroupDetailId = subGroupId => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: this?.state?.tabName === 'general' ? this.state.groupId : subGroupId,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];

              if (resp.success) {
                this?.props?.saveGroupDetail(resp.data);
                this.setState({
                  groupDetailAgain: resp?.data,
                  channel: resp?.data?.channel,
                });
                this?.props?.showLoading(false);
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  handleSubGroupModal = modalOptionNumber => {
    // Handle modal for subgroups
    try {
      if (modalOptionNumber === 1) {
        // Navigate for choose moderators
        this?.setState({ modalForSubGroup: false });
        this.props.navigation.navigate('Choose_Moderator_Screen', {
          isSubgroup: true,
          groupId: this?.state?.tabGroupId,
        });
      } else {
        const params = {
          url: API_DATA.GROUPMODERATOR,
          data: {
            ...(modalOptionNumber === 2 && { all_moderator: 1 }),
            ...(modalOptionNumber === 3 && { user_id: this?.props?.userData?.userInfo?.id }),
            group_id: this?.state?.tabGroupId,
            is_moderator: 1,
          },
        };

        this?.props?.showLoading(true);
        setTimeout(() => {
          callApi([params], this?.props?.userData?.access_token)
            .then(response => {
              this?.props?.showLoading(false).then(() => {
                let resp = response[API_DATA.GROUPMODERATOR];
                if (resp.success) {
                  this?.setState({ modalForSubGroup: false });
                  this?.props?.showLoading(false);
                } else {
                }
              });
            })
            .catch(err => {
              this?.props?.showLoading(false);
            });
        }, 500);
      }
    } catch (e) {}
  };

  onUserEvent = data => {
    let tempId = Math.round(new Date().getTime() / 1000);
    if (data.type === 'new_message') {
      if (this.props.userData.userInfo.id !== data.sender.id) {
        this?.props?.appendGroupMessage({ ...data, is_liked: 0, is_read: 1, like_count: 0 });
        this?.setState({
          images: [{ uri: data?.media[0] }, ...this.state.images],
        });
        // this.getReadChat(data.chat_id);
      } else {
        const tempId = data?.poll_id || data?.event_id || data?.task_id ? data.temp_id : this.state.tempId;
        this?.props?.updateCreateGroupMessage(tempId, data.message_id, data.chat_id, data);
      }
    }
    if (data.type === 'reply_message') {
      if (this.props.userData.userInfo.id !== data.sender.id) {
        this?.props?.appendReplyGroupMessage({ ...data, is_liked: 0, is_read: 1 });
      } else {
        this?.props?.updateReplyGroupMessage(data.temp_id, data.message_id, data.chat_id, data.parent_id);
      }
    }
    if (data.type === 'like_message') {
      if (this.props.userData.userInfo.id !== data.user.id) {
        this?.props?.realTimeMessageLike(data.message_id, true);
      }
    }

    if (data.type === 'unlike_message') {
      if (this.props.userData.userInfo.id !== data.user.id) {
        this?.props?.realTimeMessageLike(data.message_id, false);
      }
    }
    if (data.type === 'typing start') {
      if (this.props.userData.userInfo.id !== data.user.id) {
        this.setState({
          typingUserData: data,
        });
      }
    }
    if (data.type === 'typing stop') {
      this.setState({
        isUserTyping: false,
        typingUserData: null,
      });
    }
  };

  connectionChat = channelId => {
    echo = new Echo({
      host: 'https://sortapp.mobileapphero.com:6001',
      broadcaster: 'socket.io',
      client: socketio,
    });
    // console.log('channel log from connection ====>', channelId, this.state.channel);
    const Id = this?.props?.userData?.userInfo?.id;
    echo.channel(channelId || this.state.channel).listen('.UserEvent', this.onUserEvent);
    echo.channel(`pollvote-${Id}`).listen('.UserEvent', this.onPollEvent);
    echo.channel(`grouplist-${Id}`).listen('.UserEvent', this.onGroupEvent);

    echo.connector.socket.on('connect', function () {
      console.log('connected', echo.socketId());
    });

    echo.connector.socket.on('disconnect', function () {});
    echo.connector.socket.on('reconnecting', function (attemptNumber) {});
    echo.connector.socket.on('error', function () {});
  };
  onPollEvent = data => {
    // if (!data?.votes?.some(item => item.user_id === this.props.userData.userInfo.id)) {
    //   this.props.savePollVoteInChatFromServer({ ...data, is_answered: 0 });
    // } else {
    this.props.savePollVoteInChatFromServer(data);
    // }
    this.props.savePollVoteServer(data, 'pollDetails');
  };

  onGroupEvent = data => {
    this?.props?.saveSubGroupDetail(data?.data);
  };
  componentWillUnmount() {
    this.userTyping(0);

    this.offUserEvent();
  }
  userTyping(typing) {
    try {
      const params = {
        url: API_DATA.USERTYPING,
        data: {
          is_typing: typing,
          chat_id: this.state.tabChatId ? this.state.tabChatId : this.state.chatId,
        },
      };
      // this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.USERTYPING];
              if (resp.success) {
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
  }
  offUserEvent = () => {
    echo.connector.socket.off('connect');
    echo.connector.socket.off('conndisconnectect');
    echo.connector.socket.off('reconnecting');
    echo.disconnect();
  };

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  sendGroupMessage = () => {
    let tempId = Math.round(new Date().getTime() / 1000);
    let fileExtension;
    this.setState({ msgReply: false });
    if (this.state.imagePick) {
      fileExtension = this.state.imagePick.uri.split('.').pop().toLowerCase();
    }
    console.log('fileExtension', fileExtension);
    try {
      const params = {
        url: API_DATA.GROUPMSGSEND,
        data: this.state.imagePick
          ? {
              group_id: this?.state?.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
              message: this.state.message.trim(),
              message_id: this.state.msgReply === true ? this.state.msgId : '',
              tag_message_id: this.state.msgId !== undefined ? this.state.msgId : '',
              ['medias[0]']: this.state.imagePick,
            }
          : {
              group_id: this?.state?.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
              message: this.state.message.trim(),
              message_id: this.state.msgReply === true ? this.state.msgId : '',
              tag_message_id: this.state.msgId !== undefined ? this.state.msgId : '',
            },
      };

      const messageObj = this.state.imagePick
        ? {
            media: [this.state.imagePick.uri],
            message: this.state.message.trim(),
            parent_id: this.state.msgId,
            tempId,
            event_id: '',
            poll_id: '',
            poll: [],
            event: [],
            task: [],
            is_liked: 0,
            like_count: 0,
            sender: {
              ...this.props?.userData?.userInfo,
            },
            tag_message: this?.state.replyMessage !== false && this?.state.replyMessage !== undefined ? this?.state.replyMessage : '',
            // tag_media: this?.state.replyMedia !== [] && this?.state.replyMedia !== undefined ? this?.state.replyMedia : '',
          }
        : {
            message: this.state.message.trim(),
            parent_id: this.state.msgId,
            tempId,
            event_id: '',
            poll_id: '',
            poll: [],
            event: [],
            task: [],
            is_liked: 0,
            like_count: 0,

            sender: {
              ...this.props?.userData?.userInfo,
            },
            tag_message: this?.state.replyMessage !== false && this?.state.replyMessage !== undefined ? this?.state.replyMessage : '',
            // tag_media: this?.state.replyMedia !== [] && this?.state.replyMedia !== undefined ? this?.state.replyMedia : '',
          };

      this.setState({ tempId: tempId });
      // {
      //   this.state.msgReply === true ? this.props.replyGroupMessage(messageObj) : this.props.createGroupMessage(messageObj);
      // }
      this.props.createGroupMessage(messageObj);
      this.userTyping(0);
      console.log('redux data object', messageObj);
      setTimeout(() => {
        this.setState({ imagePick: '' });
        this.setState({ message: '', replyMessage: '' });
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPMSGSEND];
              console.log('group msg', resp);
              if (resp.success) {
                this.getChatDetail();
                this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log(e);
    }
    this.setState({ message: '', replyMsgId: this.state.msgId, msgId: '' });
  };

  msgLike = item => {
    let msgId = item.message_id;
    let like = item.is_liked;

    if (this.state.isLiking.includes(msgId)) return;

    this.state.isLiking.push(msgId);
    try {
      const params = {
        url: API_DATA.MSGLIKE,
        data: {
          message_id: msgId,
          is_like: like === 0 ? 1 : 0,
        },
      };
      this?.props?.messageLike(msgId);

      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.MSGLIKE];

              if (resp.success) {
                this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          })
          .finally(() => {
            this.setState({
              isLiking: this.state.isLiking.filter(i => i !== msgId),
            });
          });
      }, 500);
    } catch (e) {}
  };

  createPoll = () => {
    let tempId = Math.round(new Date().getTime() / 1000);

    let Options = this?.state?.Option?.reduce((acc, item, index) => ({ ...acc, [`options[${index}]`]: item }), {});

    try {
      const params = {
        url: API_DATA.POLLADD,
        data: {
          group_id: this?.state?.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
          question: this.state.question,

          ...Options,
          temp_id: tempId,
          is_hide_result: this.state.isEnabled ? 1 : 0,
        },
      };

      const pollObj = {
        poll: {
          options: this?.state?.Option?.map(item => ({
            answer: item,
            vote_count: 0,
            vote_percentage: 0,
            isMyAnswer: 0,
          })),
          options_count: 2,
          question: this.state.question.trim(),
          total_votes: 0,
          end_at: new Date(new Date().setDate(new Date().getDate() + 1)),
          tempId,
        },
        sender: {
          ...this.props?.userData?.userInfo,
        },
        tempId,
        poll_id: '',
        event_id: '',
        event: [],
        task: [],
        like_count: 0,
        message: this.state.message.trim(),
        is_liked: 0,
      };

      this?.props?.savePollInChat(pollObj);

      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.POLLADD];
              if (resp.success) {
                this.props.savePollAdd({ ...resp?.data, temp_id: tempId });
                this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
    this.setState({ question: '', Option: [], pollText: false });
  };

  pollVote = (pollId, optionId) => {
    try {
      const params = {
        url: API_DATA.POLLVOTE,
        data: {
          poll_id: pollId,
          option_id: optionId,
        },
      };

      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.POLLVOTE];
              if (resp.success) {
                // this?.props?.savePollVoteInChat(pollId, optionId);

                // this?.props?.savePollVote(pollId, optionId, 'chats');

                this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
    this.setState({ question: '', Option: [], pollText: false });
    // this.offPollEvent();
  };

  handleGoing = (item, index) => {
    this.setState({ modalVisible: true, user: item, listIndex: index });
  };

  deleteMessage = msgId => {
    try {
      const params = {
        url: API_DATA.MESSAGEDELETE,
        data: {
          message_id: msgId,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.MESSAGEDELETE];
              this?.props?.messageDelete(msgId);
              this.getChatList();
              this.getDashboardList();
              this.getChatDetail();
              if (resp.success) {
                this?.props?.showLoading(false);
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
    this.setState({ message: '' });
  };

  getConnectionDetails = (friendId, onPressText) => {
    try {
      const params = {
        url: API_DATA.CONNECTIONDETAILS,
        data: {
          friend_id: friendId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.CONNECTIONDETAILS];
              if (resp.success) {
                console.log('get connection', resp);
                this.setState({ profileDetail: resp.data[0] });
                setTimeout(() => {
                  this.setState({
                    isShowModal: true,
                    userDetails: this.state.profileDetail,
                  });
                }, 0);
                // this?.props?.navigation?.replace('SINGAL_CHAT', {
                //   profileDetail: this?.state?.profileDetail,
                //   is_block: this?.state?.profileDetail?.is_block,
                //   replyMessage: this?.state?.replyMessage,
                //   replyMedia: this?.state?.replyMedia,
                //   replyPoll: this?.state?.replyPoll,
                //   replyEvent: this?.state?.replyEvent,
                //   replyTask: this?.state?.replyTask,
                //   msgId: this?.state?.msgId,
                // });
                // this.setState({ isShowModal: true });
              } else {
                this?.props?.chatDetail?.members?.map(item => {
                  if (item?.user_id == friendId) {
                    this.setState({ profileDetail: item });
                  }
                });
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
    this.setState({ message: '' });
  };

  onChangeExpand = id => {
    if (id === this.state.openExpand) {
      this.setState({
        openExpand: null,
      });
    } else {
      this.setState({
        openExpand: id,
        expanded: true,
      });
    }
  };

  handleTaskDetail = taskId => {
    this?.props?.navigation?.navigate('TASK_DETAIL', { taskId });
  };
  handleEventDetail = (eventId, index) => {
    this.setState({ listIndex: index });
    this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId, eventChat: true });
  };
  handleStartTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };
  handleEndTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };

  addToCalendarEvent = data => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          event_id: this?.state?.addToCalendarEventId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              if (resp.success) {
                this?.props?.addToCalender(this?.state?.addToCalendarEventId);
                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  _renderSwipeFrontItemGroup = ({ item, index }) => {
    const currentMessageSender = item.sender.id;
    const previousMessageSender = this.props.message.data[index + 1] ? this.props.message.data[index + 1]?.sender?.id : 0;
    const nextMessageSender = this.props.message.data[index - 1] ? this.props.message.data[index - 1]?.sender?.id : 0;

    const mediaIndex = this?.state?.images?.findIndex(v => {
      return v.uri === item?.media?.[0] || v === item?.images?.[0];
    });
    const VideoIndex = this?.state?.images?.findIndex(v => {
      return v.uri === item?.media ? item?.media?.[0] : v === item?.mediaVideos?.[0];
    });

    const { theme } = this.context;
    const styles = style(theme);
    const rightIconList = [
      {
        text: (
          <View style={styles.groupWipeoutBtnViewRight}>
            <Text style={styles.msgTimeTxt}>
              {'sent at '}
              {convertTimeStamp(item?.message_at)}
            </Text>
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
      {
        text: (
          <View style={styles.groupWipeoutBtnViewRight}>
            <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.copy} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => (item?.message ? Clipboard.setString(item?.message) : {}),
      },
      {
        text: (
          <TouchableOpacity
            style={[styles.groupWipeoutBtnViewRight, styles.radiusRight]}
            onPress={() => {
              this.msgLike(item);
            }}
          >
            {item?.is_liked === 0 ? (
              <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.chat_like} />
            ) : (
              <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.like} />
            )}
          </TouchableOpacity>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
    ];
    const rightWithOutIconList = [
      {
        text: (
          <View style={styles.groupWipeoutBtnViewRight}>
            <Text style={styles.msgTimeTxt}>
              {'sent at '}
              {convertTimeStamp(item?.message_at)}
            </Text>
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },

      {
        text: (
          <TouchableOpacity
            style={[styles.groupWipeoutBtnViewRight, styles.radiusRight]}
            onPress={() => {
              this.msgLike(item);
            }}
          >
            {item?.is_liked === 0 ? (
              <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.chat_like} />
            ) : (
              <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.like} />
            )}
          </TouchableOpacity>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
    ];

    const leftIconList = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewLeft, , styles.radiusLeft]}>
            <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.replyLeft} />
          </View>
        ),

        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this?.textInputRef?.current?.focus();

          item?.event?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyEvent: item?.event,
                replyMedia: item?.media,
              })
            : item?.media?.length
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyMessage: item?.message,
                replyMedia: item?.media,
              })
            : item?.task?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyTask: item?.task,
              })
            : item?.poll?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyPoll: item?.poll,
              })
            : item?.message
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                replyModal: true,
                replyMessage: item?.message,
                replyTime: item?.message_at,
              })
            : null;
        },
      },

      {
        text: (
          <TouchableOpacity
            style={[styles.groupWipeoutBtnViewLeft]}
            onPress={() => {
              this.msgLike(item);
            }}
          >
            {item?.is_liked === 0 ? (
              <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.chat_like} />
            ) : (
              <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.like} />
            )}
          </TouchableOpacity>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
      {
        text: (
          <View style={styles.groupWipeoutBtnViewLeft}>
            <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.copy} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => (item?.message ? Clipboard.setString(item?.message) : {}),
      },
      {
        text: (
          <View style={styles.groupWipeoutBtnViewLeft}>
            <Text style={styles.msgTimeTxt}>
              {'sent at '}
              {convertTimeStamp(item?.message_at)}
            </Text>
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
    ];
    const leftWithoutIconList = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewLeft, , styles.radiusLeft]}>
            <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.replyLeft} />
          </View>
        ),

        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this?.textInputRef?.current?.focus();

          item?.event?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyEvent: item?.event,
                replyMedia: item?.media,
              })
            : item?.media?.length
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyMessage: item?.message,
                replyMedia: item?.media,
              })
            : item?.task?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyTask: item?.task,
              })
            : item?.poll?.length !== 0
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                msgReply: true,
                replyPoll: item?.poll,
              })
            : item?.message
            ? this?.setState({
                msgId: item?.message_id,
                replyData: item?.sender,
                replyModal: true,
                replyMessage: item?.message,
                replyTime: item?.message_at,
              })
            : null;
        },
      },

      {
        text: (
          <TouchableOpacity
            style={[styles.groupWipeoutBtnViewLeft]}
            onPress={() => {
              this.msgLike(item);
            }}
          >
            {item?.is_liked === 0 ? (
              <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.chat_like} />
            ) : (
              <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.like} />
            )}
          </TouchableOpacity>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },

      {
        text: (
          <View style={styles.groupWipeoutBtnViewLeft}>
            <Text style={styles.msgTimeTxt}>
              {'sent at '}
              {convertTimeStamp(item?.message_at)}
            </Text>
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
    ];
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TapGestureHandler
          numberOfTaps={2}
          maxDelayMs={250}
          onActivated={() => {
            this.msgLike(item);
            console.log('Taping', JSON.stringify(item));
          }}
        >
          <View style={[styles.msgContainer, { paddingHorizontal: 0 }]}>
            <Swipeout
              // right={item?.sender?.id === this.props.userData.userInfo.id ? (item?.message ? rightIconList : rightWithOutIconList) : null}
              // left={item?.sender?.id !== this?.props?.userData?.userInfo?.id ? (item?.message ? leftIconList : leftWithoutIconList) : null}
              autoClose={true}
              backgroundColor={theme?.colors?.TRANSPARENT}
              showsVerticalScrollIndicator={false}
            >
              {/* START MSG LEFT SIDE */}
              {this.props.userData.userInfo.id !== item?.sender?.id && (
                <View style={{ flex: 1 }}>
                  {/* Start Poll View */}
                  {item?.poll?.length !== 0 ? (
                    <View style={styles.msgContainerLeft}>
                      <View style={styles.msgRow}>
                        {currentMessageSender !== nextMessageSender && (
                          <TouchableOpacity
                            style={styles.senderImgWrap}
                            onPress={() => {
                              this.getConnectionDetails(item?.sender?.id);
                            }}
                          >
                            <Image source={{ uri: item?.sender?.image }} style={[styles.userImg]} />
                          </TouchableOpacity>
                        )}
                        <View
                          style={[
                            styles.msgTxtBox,
                            { marginLeft: currentMessageSender === nextMessageSender ? Responsive.getWidth(9) : 0 },
                          ]}
                        >
                          {previousMessageSender !== currentMessageSender && <Text style={[styles.msgTimeTxt]}>{item?.sender?.name}</Text>}
                          <View style={[styles.msgTxtBox, { marginHorizontal: 0, position: 'relative' }]}>
                            <TouchableOpacity
                              style={styles.pollCardLeft}
                              onLongPress={() =>
                                this?.setState({
                                  msgId: item?.message_id,
                                  replyData: item?.sender,
                                  replyModal: true,
                                  replyPoll: item?.poll,
                                  replyTime: item?.message_at,
                                })
                              }
                              onPress={() => this.props.navigation.navigate('POLL', { pollId: item?.poll?.id })}
                            >
                              <Text style={[styles.chatPollCardTitleLeft]}>{item?.poll?.question}</Text>
                              {item?.poll?.options?.map(option =>
                                item?.poll?.createdBy?.id === this.props.userData.userInfo.id ? (
                                  <TouchableOpacity
                                    disabled={item?.poll?.is_answered === 1 || (item?.poll?.is_complete === 1 && true)}
                                    style={styles.pollProgress}
                                    onPress={() => {
                                      this.pollVote(item?.poll.id, option?.id);
                                    }}
                                  >
                                    {option?.isMyAnswer === 1 ? (
                                      <>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                          <Image source={IMAGES.checkMark} style={styles.myAnswerIcon} />
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </>
                                    )}
                                  </TouchableOpacity>
                                ) : item?.poll?.is_hide_result && item?.poll?.is_everyone_voted ? (
                                  <TouchableOpacity
                                    disabled={item?.poll?.is_answered === 1 || (item?.poll?.is_complete === 1 && true)}
                                    style={styles.pollProgress}
                                    onPress={() => {
                                      this.pollVote(item?.poll.id, option?.id);
                                    }}
                                  >
                                    {option?.isMyAnswer === 1 ? (
                                      <>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                          <Image source={IMAGES.checkMark} style={styles.myAnswerIcon} />
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </>
                                    )}
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    disabled={item?.poll?.is_answered === 1 || (item?.poll?.is_complete === 1 && true)}
                                    style={styles.pollProgress}
                                    onPress={() => {
                                      this.pollVote(item?.poll.id, option?.id);
                                    }}
                                  >
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                      <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                    </View>
                                  </TouchableOpacity>
                                ),
                              )}

                              <View style={styles.pollVoteRow}>
                                <Text style={styles.pollVoteTxtLeft}>{compareTime(item?.poll?.end_at)}</Text>
                                {item?.poll?.total_votes !== 0 ? (
                                  <Text style={styles.pollVoteTxtLeft}>
                                    {item?.poll?.total_votes} {item?.poll?.total_votes === 1 ? 'Vote' : 'Votes'}
                                  </Text>
                                ) : null}
                              </View>
                            </TouchableOpacity>
                            {item?.like_count !== 0 && item?.like_count > -1 ? (
                              <View style={styles.msgLikeViewLeft}>
                                <TouchableOpacity
                                  style={[styles.msgLikeBtn]}
                                  onPress={() => {
                                    this?.getLikeUserList(item?.message_id);
                                    this.setState({ likeMessage: item?.poll?.question });
                                  }}
                                >
                                  <Icon name="heart" style={styles.likeIcon2} />
                                  {/* <Text style={[styles.likeCountTxt]}>
                                {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                              </Text> */}
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      </View>
                      {item?.replies?.length > 0 ? (
                        <View style={[styles.replyBtnRow, { marginLeft: 0 }]}>
                          <TouchableOpacity style={[styles.replyBtn]}>
                            <Icon4 name="reply" style={styles.replyBtnIcon} />
                            <Text style={styles.replyBtnTxt}>{item?.replies?.length > 0 ? item?.replies?.length : ''}</Text>
                          </TouchableOpacity>
                          {item?.replies?.length > 2 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  hideReply: !index,
                                  replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                  viewReply: { state: !this?.state?.viewReply.state, index },
                                });
                              }}
                            >
                              <Text style={styles.replyBtnTxt}>
                                {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                  {/* End Poll View */}

                  {/* Start Msg Left Side */}
                  {item?.message !== '' ? (
                    <TouchableOpacity style={[styles.msgContainerLeft]} onLongPress={() => this.setState({ isShowMenu: true })}>
                      <View style={[styles.msgRow, { justifyContent: 'flex-start' }]}>
                        {currentMessageSender !== nextMessageSender && (
                          <TouchableOpacity
                            style={styles.senderImgWrap}
                            onPress={() => {
                              this.getConnectionDetails(item?.sender?.id);
                            }}
                          >
                            <Image source={{ uri: item?.sender?.image }} style={styles.userImg} />
                            {/* {item?.replies?.length ? (
                        <Image source={IMAGES.replay_line} style={styles.replyBtnLine} resizeMode={'contain'} />
                      ) : null} */}
                          </TouchableOpacity>
                        )}

                        <View
                          style={[
                            styles.msgTxtBox2,
                            { marginLeft: currentMessageSender === nextMessageSender ? Responsive.getWidth(9) : 0 },
                          ]}
                        >
                          {previousMessageSender !== currentMessageSender && (
                            <Text style={[styles.msgTimeTxt, { minWidth: Responsive.getWidth(30) }]}>{item?.sender?.name}</Text>
                          )}

                          <View style={[styles.typeMsgTxtInnerLeftView]}>
                            {item?.tag_message && item?.tag_message !== '' ? (
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: '#2980b9',
                                }}
                              >
                                <Text style={styles.typeMsgInnerTxt1Left}>
                                  {item?.tag_message?.replace(/ *\([^)]*\)*/g, '').replace(/[\[\]']+/g, '')}
                                </Text>
                              </Hyperlink>
                            ) : null}
                            <TouchableOpacity
                              // style={styles.typeMsgTxtLeftView}
                              onLongPress={() =>
                                this?.setState({
                                  msgId: item?.message_id,
                                  replyData: item?.sender,
                                  replyModal: true,
                                  replyMessage: item?.message,
                                  isCopyMsg: true,
                                  replyTime: item?.message_at,
                                })
                              }
                            >
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: 'white',
                                }}
                              >
                                <Text style={styles.typeMsgTxtLeft}>{renderValue(item?.message, this.onPressText, theme, 'white')} </Text>
                              </Hyperlink>
                            </TouchableOpacity>
                          </View>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewLeft}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this?.setState({ likeMessage: item?.message });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      {/* {item?.replies?.length > 0 ? (
                        <View style={[styles.replyBtnRow, { marginLeft: 0 }]}>
                          <TouchableOpacity
                            style={[styles.replyBtn]}
                            onPress={() => {
                              this?.setState({
                                msgId: item?.message_id,
                                replyData: item?.sender,
                                replyModal: true,
                                replyMessage: item?.message,
                              });
                            }}
                          >
                            <Icon4 name="reply" style={styles.replyBtnIcon} />
                            <Text style={styles.replyBtnTxt}>{item?.replies?.length}</Text>
                          </TouchableOpacity>
                          {item?.replies?.length > 2 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  hideReply: !index,
                                  replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                  viewReply: { state: !this?.state?.viewReply.state, index },
                                });
                              }}
                            >
                              <Text style={styles.replyBtnTxt}>
                                {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null} */}
                    </TouchableOpacity>
                  ) : null}

                  {item?.task?.length !== 0 ? (
                    <View style={[styles.msgContainerLeft]}>
                      <View style={[styles.msgRow]}>
                        {currentMessageSender !== nextMessageSender && (
                          <TouchableOpacity
                            style={styles.senderImgWrap}
                            onPress={() => {
                              this.getConnectionDetails(item?.sender?.id);
                            }}
                          >
                            <Image source={{ uri: item?.sender?.image }} style={styles.userImg} />
                            {/* {item?.replies?.length ? (
                        <Image source={IMAGES.replay_line} style={styles.replyBtnLine} resizeMode={'contain'} />
                      ) : null} */}
                          </TouchableOpacity>
                        )}
                        <View
                          style={[
                            styles.msgTxtBox,
                            { marginLeft: currentMessageSender === nextMessageSender ? Responsive.getWidth(9) : 0 },
                          ]}
                        >
                          {previousMessageSender !== currentMessageSender && <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>}
                          <TouchableOpacity
                            onPress={() => this.handleTaskDetail(item?.task?.id)}
                            style={[styles.typeMsgTxt, { flexDirection: 'row', backgroundColor: theme?.colors?.RED_500 }]}
                            onLongPress={() =>
                              this?.setState({
                                msgId: item?.message_id,
                                replyData: item?.sender,
                                replyModal: true,
                                replyTask: item?.task,
                                replyTime: item?.message_at,
                              })
                            }
                          >
                            <TouchableOpacity
                              style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                              onPress={() => {
                                this.handleTasks(item?.task?.id);
                              }}
                            >
                              <Image
                                source={item?.task?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                style={[styles.listIcon, { borderWidth: 1, borderColor: theme?.colors?.LIGHT_OPACITY, borderRadius: 5 }]}
                              />
                            </TouchableOpacity>
                            <Text style={[styles.typeMsgTxtIn, { padding: 0, borderWidth: 0 }]}>{item?.task?.title}</Text>
                          </TouchableOpacity>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewLeft}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.task?.title });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      {item?.replies?.length > 0 ? (
                        <View style={[styles.replyBtnRow, { marginLeft: 0 }]}>
                          <TouchableOpacity style={[styles.replyBtn]}>
                            <Icon4 name="reply" style={styles.replyBtnIcon} />
                            <Text style={styles.replyBtnTxt}>{item?.replies?.length > 0 ? item?.replies?.length : null}</Text>
                          </TouchableOpacity>
                          {item?.replies?.length > 2 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  hideReply: !index,
                                  replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                  viewReply: { state: !this?.state?.viewReply.state, index },
                                });
                              }}
                            >
                              <Text style={styles.replyBtnTxt}>
                                {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  {item?.media?.length ? (
                    <View style={styles.msgContainerLeft}>
                      <View
                        style={[styles.msgRow, { marginLeft: currentMessageSender === nextMessageSender ? Responsive.getWidth(9) : 0 }]}
                      >
                        {currentMessageSender !== nextMessageSender && (
                          <TouchableOpacity
                            style={[styles.senderImgWrap]}
                            onPress={() => {
                              this.getConnectionDetails(item?.sender?.id);
                            }}
                          >
                            <Image source={{ uri: item?.sender?.image }} style={styles.userImg} />
                            {/* {item?.replies?.length ? (
                        <Image source={IMAGES.replay_line} style={styles.replyBtnLine} resizeMode={'contain'} />
                      ) : null} */}
                          </TouchableOpacity>
                        )}
                        <View style={[styles.msgTxtBox]}>
                          {previousMessageSender !== currentMessageSender && <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>}
                          {item.media[0].split('.').pop().toLowerCase() === 'jpg' ||
                          item.media[0].split('.').pop().toLowerCase() === 'jpeg' ||
                          item.media[0].split('.').pop().toLowerCase() === 'png' ? (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onLongPress={() =>
                                this?.setState({
                                  msgId: item?.message_id,
                                  replyData: item?.sender,
                                  replyModal: true,
                                  replyMessage: item?.message,
                                  replyMedia: item?.media,
                                  replyTime: item?.message_at,
                                })
                              }
                              onPress={() => this.setState({ visible: { index: mediaIndex, visible: true } })}
                            >
                              <Image source={item?.media[0] ? { uri: item?.media[0] } : { uri: item?.images[0] }} style={styles.shareImg} />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onLongPress={() =>
                                this?.setState({
                                  msgId: item?.message_id,
                                  replyData: item?.sender,
                                  replyModal: true,
                                  replyMessage: item?.message,
                                  replyMedia: item?.media,
                                  replyTime: item?.message_at,
                                })
                              }
                              onPress={() => {
                                this.setState({
                                  videoURL: item.media[0],
                                  isFullScreen: true,
                                });
                              }}
                            >
                              <Video
                                source={{ uri: item?.media[0] }}
                                style={{ height: '100%', width: '100%' }}
                                resizeMode="stretch"
                                muted={true}
                              />
                            </TouchableOpacity>
                          )}
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewLeft}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.media[0] });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>

                      {/* {item?.replies?.length > 0 ? (
                        <View style={[styles.replyBtnRow, { marginLeft: 0 }]}>
                          <TouchableOpacity
                            style={[styles.replyBtn]}
                            onPress={() => {
                              this?.setState({
                                msgId: item?.message_id,
                                replyData: item?.sender,
                                replyModal: true,
                                replyMessage: item?.message,
                                replyMedia: item?.media,
                              });
                            }}
                          >
                            <Icon4 name="reply" style={styles.replyBtnIcon} />
                            <Text style={styles.replyBtnTxt}>{item?.replies?.length > 0 ? item?.replies?.length : null}</Text>
                          </TouchableOpacity>
                          {item?.replies?.length > 2 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  hideReply: !index,
                                  replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                  viewReply: { state: !this?.state?.viewReply.state, index },
                                });
                              }}
                            >
                              <Text style={styles.replyBtnTxt}>
                                {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null} */}
                    </View>
                  ) : null}
                  {item?.mediaVideos?.length ? (
                    <View style={styles.msgContainerLeft}>
                      <View style={styles.msgRow}>
                        {currentMessageSender !== nextMessageSender && (
                          <TouchableOpacity
                            style={[styles.senderImgWrap]}
                            onPress={() => {
                              this.getConnectionDetails(item?.sender?.id);
                            }}
                          >
                            <Image source={{ uri: item?.sender?.image }} style={styles.userImg} />
                          </TouchableOpacity>
                        )}
                        <View
                          style={[
                            styles.msgTxtBox,
                            { marginLeft: currentMessageSender === nextMessageSender ? Responsive.getWidth(9) : 0 },
                          ]}
                        >
                          {previousMessageSender !== currentMessageSender && <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>}
                          <TouchableOpacity
                            style={styles.shareImgView}
                            onPress={() => {
                              this.setState({
                                videoURL: item.mediaVideos[0],
                                isFullScreen: true,
                              });
                            }}
                          >
                            <Video
                              source={{ uri: item?.mediaVideos[0] }}
                              style={{ height: '100%', width: '100%' }}
                              resizeMode="stretch"
                              muted={true}
                            />
                          </TouchableOpacity>

                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewLeft}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.mediaVideos[0] });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                             {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                           </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {item?.event?.length !== 0 && (
                    <View style={styles.msgContainerLeft}>
                      <View style={styles.msgRow}>
                        <View style={styles.senderImgWrap}>
                          <Image source={IMAGES.sortIcon} style={styles.userImg} />
                        </View>
                        <TouchableOpacity style={styles.msgTxtBox}>
                          <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>
                          <TouchableOpacity
                            style={styles.eventViewLeft}
                            onLongPress={() =>
                              this?.setState({
                                msgId: item?.message_id,
                                replyData: item?.sender,
                                replyModal: true,
                                replyEvent: item?.event,
                                replyMedia: item?.media,
                                replyTime: item?.message_at,
                              })
                            }
                            onPress={() => this.handleEventDetail(item?.event_id)}
                          >
                            <View style={styles.eventDateView}>
                              <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                              <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                            </View>
                            <View style={styles.eventDetail}>
                              <Text style={styles.eventTitle2}>
                                {item?.title?.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
                              </Text>
                              <Text style={styles.eventSubjectTxtLeft}>
                                {item?.description?.length > 8 ? item?.description.slice(0, 8).concat('...') : item?.event?.description}
                              </Text>
                              <Text style={styles.eventDateLeft}>
                                {moment(item?.event?.date).format('ddd')},
                                {item?.event?.start_time !== ''
                                  ? `${this.handleStartTime(item?.start_time)}-${this.handleEndTime(item?.event?.end_time)}`
                                  : ' Fullday'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewLeft}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.event?.title });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      {item?.replies?.length > 0 ? (
                        <View style={[styles.replyBtnRow, { marginLeft: 0 }]}>
                          <TouchableOpacity style={[styles.replyBtn]}>
                            <Icon4 name="reply" style={styles.replyBtnIcon} />
                            <Text style={styles.replyBtnTxt}>{item?.replies?.length > 0 ? item?.replies?.length : null}</Text>
                          </TouchableOpacity>
                          {item?.replies?.length > 2 ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({
                                  hideReply: !index,
                                  replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                  viewReply: { state: !this?.state?.viewReply.state, index },
                                });
                              }}
                            >
                              <Text style={styles.replyBtnTxt}>
                                {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      ) : null}
                      {!item?.event?.is_calendar ? (
                        <TouchableOpacity
                          onPress={() =>
                            this?.setState({
                              addToCalendarEventId: item?.event?.id,
                              addToCalendarEvent: true,
                            })
                          }
                        >
                          <Text>Add to calendar</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  )}

                  {/* Start Reply Left Side  */}
                  {item?.replies?.map((reply, index) => {
                    const replyMediaIndex = this?.state?.images?.findIndex(v => {
                      return v.uri === reply?.media?.[0];
                    });

                    return (
                      <View style={{ flex: 1 }}>
                        {index <= 1 || this.state.replyMsgId === reply.parent_id ? (
                          <View style={[styles.msgContainerLeft, { paddingLeft: 35, position: 'relative', marginBottom: 0 }]}>
                            <View style={[styles.msgRow, { alignItems: 'flex-start' }]}>
                              <TouchableOpacity
                                style={styles.senderImgWrap}
                                onPress={() => {
                                  this.getConnectionDetails(reply?.sender?.id);
                                }}
                              >
                                <Image source={{ uri: reply?.sender?.image }} style={styles.userImg} />
                              </TouchableOpacity>
                              <View style={[styles.msgTxtBox]}>
                                <Text style={[styles.msgTimeTxt, { marginBottom: -10 }]}>{reply?.sender?.name}</Text>
                                {reply?.message !== '' ? (
                                  <Hyperlink
                                    linkDefault={true}
                                    linkStyle={{
                                      color: '#2980b9',
                                    }}
                                  >
                                    <Text
                                      // numberOfLines={this?.state?.hideReply === true ? 3 : item?.replies?.length}
                                      style={[styles.typeMsgTxt, { borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent' }]}
                                    >
                                      {/* {reply?.message} */}
                                    </Text>
                                  </Hyperlink>
                                ) : null}

                                {reply?.media?.length ? (
                                  <TouchableOpacity
                                    style={styles.shareImgView}
                                    onPress={() => this.setState({ visible: { index: replyMediaIndex, visible: true } })}
                                  >
                                    <Image source={{ uri: reply?.media[0] }} style={{ height: '60%', width: '50%', marginTop: 10 }} />
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                            </View>
                            {item?.replies?.length ? <View style={styles.replyLine} /> : null}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                  {/* End Reply Left Side  */}
                </View>
              )}
              {/* END MSG LEFT SIDE */}

              {/* START MSG RIGHT SIDE */}
              {this.props.userData.userInfo.id === item?.sender?.id && (
                <View style={{ flex: 1 }}>
                  {item?.message !== '' ? (
                    <View style={styles.msgContainerRight}>
                      <View style={[styles.msgRow, { justifyContent: 'flex-end' }]}>
                        {/* {item?.replies?.length ? (
                      <Image source={IMAGES.replay_line} style={styles.replyBtnLine} resizeMode={'contain'} />
                    ) : null} */}
                        <View style={[styles.msgTxtBox2, { marginRight: 0 }]}>
                          <View style={styles.typeMsgTxtInnerView}>
                            {item?.tag_message !== '' ? (
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: '#2980b9',
                                }}
                              >
                                <Text style={styles.typeMsgInnerTxt1}>
                                  {item?.tag_message?.replace(/ *\([^)]*\)*/g, '').replace(/[\[\]']+/g, '')}
                                </Text>
                              </Hyperlink>
                            ) : null}
                            <Hyperlink
                              linkDefault={true}
                              linkStyle={{
                                color: '#FC5401',
                              }}
                            >
                              <Text style={[styles.typeMsgInnerTxt2, { minWidth: Responsive.getWidth(30) }]}>
                                {renderValue(item?.message, this.onPressText, theme, '#AA9AFF')}
                              </Text>
                            </Hyperlink>
                          </View>
                          {/* <View style={styles.replyBtnRow}>
                            {item?.replies?.length > 2 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    hideReply: !index,
                                    replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                    viewReply: { state: !this?.state?.viewReply.state, index },
                                  });
                                }}
                              >
                                <Text style={styles.replyBtnTxt}>
                                  {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View> */}
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewRight}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.message });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {item?.media?.length ? (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        {/* {item?.is_liked === 0 ? (
                      <TouchableOpacity
                        style={[styles.msgLikeBtn]}
                        onPress={() => {
                          this.msgLike(item);
                        }}
                      >
                        <Icon name="heart-outline" style={styles.likeIcon} />
                        <Text style={[styles.likeCountTxt, { color: theme?.colors?.RED_500 }]}>
                          {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.msgLikeBtn2]}
                        onPress={() => {
                          this.msgLike(item);
                        }}
                      >
                        <Icon name="heart" style={[styles.likeIcon, { color: theme?.colors?.RED_500 }]} />
                        <Text style={[styles.likeCountTxt, { color: theme?.colors?.RED_500 }]}>
                          {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                        </Text>
                      </TouchableOpacity>
                    )} */}
                        <View style={[styles.msgTxtBox, { marginRight: 0 }]}>
                          {item.media[0].split('.').pop().toLowerCase() === 'jpg' ||
                          item.media[0].split('.').pop().toLowerCase() === 'jpeg' ||
                          item.media[0].split('.').pop().toLowerCase() === 'png' ? (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onPress={() => this.setState({ visible: { index: mediaIndex, visible: true } })}
                            >
                              <Image source={item?.media[0] ? { uri: item?.media[0] } : { uri: item?.images[0] }} style={styles.shareImg} />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onPress={() => {
                                this.setState({
                                  videoURL: item.media[0],
                                  isFullScreen: true,
                                });
                              }}
                            >
                              <Video
                                source={{ uri: item?.media[0] }}
                                style={{ height: '100%', width: '100%' }}
                                resizeMode="stretch"
                                muted={true}
                              />
                            </TouchableOpacity>
                          )}

                          {/* {console.log('item media in chat', item.media[0].uri.endsWith('.jpg') == true)} */}
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewRight}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.media[0] });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />

                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                          <View style={styles.replyBtnRow}>
                            {item?.replies?.length > 2 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    hideReply: !index,
                                    replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                    viewReply: { state: !this?.state?.viewReply.state, index },
                                  });
                                }}
                              >
                                <Text style={styles.replyBtnTxt}>
                                  {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {item?.mediaVideos?.length ? (
                    <>
                      <View style={styles.msgContainerRight}>
                        <View style={styles.msgRow}>
                          <TouchableOpacity
                            style={styles.shareImgView}
                            onPress={() => {
                              this.setState({
                                videoURL: item.mediaVideos[0],
                                isFullScreen: true,
                              });
                            }}
                          >
                            <Video
                              source={{ uri: item?.mediaVideos[0] }}
                              style={{ height: '100%', width: '100%' }}
                              resizeMode="stretch"
                              muted={true}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  ) : null}
                  {item?.event?.length !== 0 && (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        <TouchableOpacity style={styles.msgTxtBox}>
                          <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>
                          <TouchableOpacity style={styles.eventView} onPress={() => this.handleEventDetail(item?.event_id)}>
                            <View style={styles.eventDateView}>
                              <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                              <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                            </View>
                            <View style={styles.eventDetail}>
                              <Text style={styles.eventTitle2}>
                                {item?.event?.title?.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
                              </Text>
                              <Text style={styles.eventSubjectTxt}>
                                {item?.event?.description?.length > 8
                                  ? item?.event?.description.slice(0, 8).concat('...')
                                  : item?.event?.description}
                              </Text>
                              <Text style={styles.eventDate}>
                                {moment(item?.event?.date).format('ddd')},
                                {item?.event?.start_time !== ''
                                  ? `${this.handleStartTime(item?.event?.start_time)}-${this.handleEndTime(item?.event?.end_time)}`
                                  : ' Fullday'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.replyBtnRow}>
                            {item?.replies?.length > 2 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    hideReply: !index,
                                    replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                    viewReply: { state: !this?.state?.viewReply.state, index },
                                  });
                                }}
                              >
                                <Text style={styles.replyBtnTxt}>
                                  {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewRight}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                {/* <Text style={[styles.likeCountTxt]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                            </Text> */}
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {item?.poll?.length !== 0 ? (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        <View style={[styles.msgTxtBox, { width: Responsive.getWidth(100), marginHorizontal: 3 }]}>
                          <TouchableOpacity
                            style={styles.pollCard}
                            onPress={() => this.props.navigation.navigate('POLL', { pollId: item?.poll?.id })}
                          >
                            <Hyperlink
                              linkDefault={true}
                              linkStyle={{
                                color: '#2980b9',
                              }}
                            >
                              <Text style={[styles.chatPollCardTitle]}>{item?.poll?.question}</Text>
                            </Hyperlink>
                            {item?.poll?.options?.map(option =>
                              item?.poll?.createdBy?.id === this.props.userData.userInfo.id ? (
                                <TouchableOpacity
                                  disabled={item?.poll?.is_answered === 1 || item?.poll?.is_complete === 1 ? true : false}
                                  style={styles.pollProgress}
                                  onPress={() => {
                                    this.pollVote(item?.poll.id, option?.id);
                                  }}
                                >
                                  {option?.isMyAnswer === 1 ? (
                                    <>
                                      <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                        <Image source={IMAGES.checkMark} style={styles.myAnswerIcon} />
                                      </View>
                                      <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                      <View
                                        style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                      </View>
                                      <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                      <View
                                        style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                      />
                                    </>
                                  )}
                                </TouchableOpacity>
                              ) : item?.poll?.is_hide_result && item?.poll?.is_everyone_voted ? (
                                <TouchableOpacity
                                  disabled={item?.poll?.is_answered === 1 || item?.poll?.is_complete === 1 ? true : false}
                                  style={styles.pollProgress}
                                  onPress={() => {
                                    this.pollVote(item?.poll.id, option?.id);
                                  }}
                                >
                                  {option?.isMyAnswer === 1 ? (
                                    <>
                                      <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                        <Image source={IMAGES.checkMark} style={styles.myAnswerIcon} />
                                      </View>
                                      <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                      <View
                                        style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                      </View>
                                      <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                      <View
                                        style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                      />
                                    </>
                                  )}
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  disabled={item?.poll?.is_answered === 1 || (item?.poll?.is_complete === 1 && true)}
                                  style={styles.pollProgress}
                                  onPress={() => {
                                    this.pollVote(item?.poll.id, option?.id);
                                  }}
                                >
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                  </View>
                                </TouchableOpacity>
                              ),
                            )}

                            <View style={styles.pollVoteRow}>
                              <Text style={styles.pollVoteTxt}>{compareTime(item?.poll?.end_at)}</Text>
                              {item?.poll?.total_votes !== 0 ? (
                                <Text style={styles.pollVoteTxt}>
                                  {item?.poll?.total_votes} {item?.poll?.total_votes === 1 ? 'Vote' : 'Votes'}
                                </Text>
                              ) : null}
                            </View>
                          </TouchableOpacity>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewRight}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.poll?.question });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                <Text style={[styles.likeCountTxt]}>
                                  {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      <View style={styles.replyBtnRow}>
                        {item?.replies?.length > 2 ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                hideReply: !index,
                                replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                viewReply: { state: !this?.state?.viewReply.state, index },
                              });
                            }}
                          >
                            <Text style={styles.replyBtnTxt}>
                              {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                  {item?.task?.length !== 0 ? (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        {/* {item?.replies?.length ? (
                      <Image source={IMAGES.replay_line} style={styles.replyBtnLine} resizeMode={'contain'} />
                    ) : null} */}
                        <View style={[styles.msgTxtBox, { marginRight: 0 }]}>
                          <TouchableOpacity
                            onPress={() => this.handleTaskDetail(item?.task?.id)}
                            style={[styles.typeMsgTxt, { flexDirection: 'row' }]}
                          >
                            <TouchableOpacity
                              style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                              onPress={() => this.handleTasks(item?.task?.id)}
                            >
                              <Image
                                source={item?.task?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                style={[styles.listIcon]}
                              />
                            </TouchableOpacity>

                            <Text style={[styles.typeMsgTxtIn]}>{item?.task?.title}</Text>
                          </TouchableOpacity>
                          <View style={styles.replyBtnRow}>
                            {item?.replies?.length > 2 ? (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    hideReply: !index,
                                    replyMsgId: item?.message_id === this.state.replyMsgId ? '' : item?.message_id,
                                    viewReply: { state: !this?.state?.viewReply.state, index },
                                  });
                                }}
                              >
                                <Text style={styles.replyBtnTxt}>
                                  {item?.message_id === this.state.replyMsgId ? 'Hide Replies' : 'View Replies'}
                                </Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          {item?.like_count !== 0 && item?.like_count > -1 ? (
                            <View style={styles.msgLikeViewRight}>
                              <TouchableOpacity
                                style={[styles.msgLikeBtn]}
                                onPress={() => {
                                  this?.getLikeUserList(item?.message_id);
                                  this.setState({ likeMessage: item?.task?.title });
                                }}
                              >
                                <Icon name="heart" style={styles.likeIcon2} />
                                <Text style={[styles.likeCountTxt]}>
                                  {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {item?.replies?.map((reply, index) => {
                    const replyMediaIndex = this?.state?.images?.findIndex(v => {
                      return v.uri === reply?.media?.[0];
                    });
                    return (
                      <View style={{ flex: 1 }}>
                        {index <= 1 || this.state.replyMsgId === reply.parent_id ? (
                          <View style={[styles.msgContainerRight, { paddingRight: 10, position: 'relative', marginBottom: 0 }]}>
                            <View
                              style={[
                                styles.msgRow,
                                styles.msgRowReplyView,
                                { backgroundColor: 'transparent', paddingTop: Responsive.getWidth(2) },
                              ]}
                            >
                              <View style={[styles.msgTxtBox, { marginRight: Responsive.getWidth(5) }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                  <View style={{ flex: 1, paddingRight: 10 }}>
                                    <Text style={[styles.msgTimeTxt, { marginBottom: -10, textAlign: 'right' }]}>
                                      {reply?.sender?.name}
                                    </Text>
                                    {reply?.message !== '' ? (
                                      <Hyperlink
                                        linkDefault={true}
                                        linkStyle={{
                                          color: '#FC5401',
                                        }}
                                      >
                                        <Text
                                          // numberOfLines={this?.state?.hideReply === true ? 10 : item?.replies?.length}
                                          style={[styles.typeMsgReplyTxtIn, { textAlign: 'right' }]}
                                        >
                                          {/* {reply?.message} */}
                                        </Text>
                                      </Hyperlink>
                                    ) : null}
                                  </View>
                                  <TouchableOpacity
                                    style={styles.senderImgWrap}
                                    onPress={() => {
                                      this.getConnectionDetails(reply?.sender?.id);
                                    }}
                                  >
                                    <Image source={{ uri: reply?.sender?.image }} style={styles.userImg} />
                                  </TouchableOpacity>
                                </View>
                                {reply?.media?.length ? (
                                  <TouchableOpacity
                                    style={styles.shareImgView}
                                    onPress={() => this.setState({ visible: { index: replyMediaIndex, visible: true } })}
                                  >
                                    <Image source={{ uri: reply?.media[0] }} style={{ height: '60%', width: '50%', marginTop: 10 }} />
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                            </View>
                            {item?.replies?.length ? <View style={styles.replyLineRight} /> : null}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}
              {/* END MSG RIGHT SIDE */}
            </Swipeout>
          </View>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  };

  _renderPickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.isShowPicker}>
        <TouchableWithoutFeedback onPress={() => this.setState({ isShowPicker: false })}>
          <SafeAreaView style={styles.safeAreaStyle}>
            <View style={styles.alertBoxStyle}>
              <Button
                buttonStyle={styles.closeButtonStyle}
                icon={<Image style={styles.closeIconStyle} source={IMAGES.close} />}
                onPress={() => this.setState({ isShowPicker: false })}
              />
              <Text numberOfLines={2} style={styles.alertTitleStyle}>
                {'Choose Images/videos'}
              </Text>
              {/* <Text style={styles.descriptionStyle}>{localize('SELECT_PHOTO_MSG')}</Text> */}
              <View style={styles.profileBtnViewStyle}>
                {this._renderBotton(localize('CAMERA'), () => this.openImagePicker('camera'))}
                {this._renderBotton(localize('GALLERY'), () => this.openImagePicker('gallery'))}
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  _renderGroupPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.isGroupPopup}>
        <TouchableWithoutFeedback onPress={() => this.setState({ isGroupPopup: false })}>
          <SafeAreaView style={styles.modalContainer2}>
            <View style={styles.modalView2}>
              <View style={styles.modalTitleView}>
                <Text style={styles.modalTitleText}>{'Choose a sidenote'}</Text>
              </View>
              <FlatList
                data={this?.props?.groupDetailA?.subgroups || []}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.groupModalFlatList}
                renderItem={({ item, index }) => (
                  <>
                    {item?.isArchive === 0 && (
                      <TouchableOpacity
                        // style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                        onPress={() => {
                          this.setState({
                            tabName: item?.title,
                            subIndex: index,
                            tabGroupId: item?.id,
                            chatId: item?.chat_id,
                            tabChatId: item?.chat_id,
                            channel: item?.channel,
                            isGroupPopup: false,
                          });
                          this?.props?.navigation?.setParams({
                            subTabName: item?.title,
                            subIndex: index,
                          });
                          this.getReadChat(item?.chat_id);
                          this.getChatDetail(item?.chat_id);
                          this.handleGroupDetailId(item?.id);
                          this.getMessageList(item?.chat_id, this.state.page);
                        }}
                      >
                        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
                          {item?.is_private === 1 ? <Image source={IMAGES.mini} style={[styles.subListIcon2]} /> : null}
                          <Text style={[styles.titleStyle2, this.state.tabName == item?.title ? styles.titleActiveStyle2 : null]}>
                            {item?.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </>
                )}
                ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                keyExtractor={(id, index) => index.toString()}
              />
              <TouchableOpacity style={styles.groupCloseBtn} onPress={() => this.setState({ isGroupPopup: false })}>
                <Icon name={'close-circle'} style={styles.groupCloseBtnIcon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  _renderBotton(title, onPress, color) {
    const { theme } = this.context;
    const styles = style(theme);
    return <Button type="clear" title={title} buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={onPress} />;
  }
  openImagePicker(type) {
    this.setState({ isShowPicker: false }, () => {
      setTimeout(() => {
        const configOption = {
          width: 600,
          height: 600,
          //   compressImageMaxWidth: 600,
          //   compressImageMaxHeight: 600,
          //   cropping: Platform.OS === 'ios' ? true : true,
          //   compressImageQuality: 1,
        };
        if (type == 'camera') {
          ImagePicker.openCamera(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        }
        if (type == 'gallery') {
          ImagePicker.openPicker(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        }
      }, 1000);
    });
  }
  handleImageResponce(image) {
    this.getChatDetail(),
      this.setState({
        imagePick: {
          uri: image.path,
          type: image.mime,
          name: image.path.split('/').pop(),
        },
        images: [{ uri: image.path }, ...this.state.images],
      });
    // this.onImageEffect();
    console.log('image/video', this.state.imagePick.uri);
  }

  handlePickerError(error) {
    if (error.code === 'E_PICKER_NO_CAMERA_PERMISSION') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('CAMERA_PERMISSION'),
      });
    } else if (error.code === 'E_PERMISSION_MISSING') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('GALLERY_PERMISSION'),
      });
    }
  }

  handleParticipate(value) {
    this.setState({ going: value, modalVisible: false });
    setTimeout(() => {
      this.getEventParticipate();
    }, 500);
  }

  handelNewTab = data => {
    this?.setState({
      groupDetailA: { ...this?.state?.handelNewTab, subgroups: [...this?.state?.groupDetailA?.subgroups, data] },
    });
  };
  handleEventDetail = eventId => {
    this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId, eventChat: true });
  };

  handleEditTask = taskId => {
    this.props.navigation.navigate('UPDATE_TASK', {
      taskId,
      getTaskList: this?.getTaskList,
      groupTask: this?.state?.groupId,
      tabGroupId: this?.state?.tabGroupId,
    });
  };

  handleDeleteTask = taskId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this task?', [
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
              url: API_DATA.TASKDELETE,
              data: {
                id: taskId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.TASKDELETE];
                  if (resp.success) {
                    this.props.saveTaskDelete(taskId);
                    this.props.showToast(localize('SUCCESS'), resp.message);
                    this.getDashboardList();
                    this.props.showLoading(false);
                  } else {
                    this.props.showErrorAlert(localize('ERROR'), resp.message);
                  }
                });
              })
              .catch(err => {
                this.props.showLoading(false);
              });
          } catch (e) {}
        },
      },
    ]);
  };

  handleTasks = (taskID, parentId) => {
    try {
      const params = {
        url: API_DATA.TASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKCOMPLETE];
            if (resp.success) {
              this.props.saveTaskCompleteInChat(resp.data, taskID);
              this.props.saveTaskListComplete(resp.data, taskID, parentId);
              this.getTaskList();
              this.getTaskListId();
              if (this?.props?.dashboardList) {
                this.props.saveTaskComplete(resp.data, taskID);
              }
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(err => {
          this.props.showLoading(false);
        });
    } catch (e) {}
  };

  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      // this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.DASHBOARD];
              if (resp.success) {
                this.props.saveDashboard(resp.data, resp.total_task_count, resp.total_chat_count);
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
    } catch (e) {}
  }

  handleDeleteEvent = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this event?', [
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
              url: API_DATA.EVENTDELETE,
              data: {
                id: eventId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.EVENTDELETE];
                  if (resp.success) {
                    this.props.saveEventDelete(eventId);
                    this.props.showLoading(false);
                  } else {
                    this.props.showErrorAlert(localize('ERROR'), resp.message);
                  }
                });
              })
              .catch(err => {
                this.props.showLoading(false);
              });
          } catch (e) {}
        },
      },
    ]);
  };
  handleReportEvent = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to report this?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.props.showToast(localize('SUCCESS'), 'Event reported successfully');
        },
      },
    ]);
  };
  handleReportPoll = () => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to report this?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.props.showToast(localize('SUCCESS'), 'Poll reported successfully');
        },
      },
    ]);
  };
  handleReportTask = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to report this?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.props.showToast(localize('SUCCESS'), 'Task reported successfully');
        },
      },
    ]);
  };
  handleEditEvent = eventId => {
    this.props.navigation.navigate('UPDATE_EVENT', {
      eventId,
      getEventList: this?.getEventList,
      isItinerary: false,
    });
  };

  getEventParticipate = item => {
    var userData = this.state.user;
    try {
      const params = {
        url: API_DATA.EVENTPARTICIPATE,
        data: {
          id: userData.id,
          user_id: this.props?.userData?.userInfo.id,
          going: this?.state?.going,
        },
      };

      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTPARTICIPATE];
              if (resp.success) {
                // this.getEventListId();
                this.getEventList();
                this?.props?.saveEventParticipateChat(resp, userData.id, this.state.going);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {}
  };

  handleChangeOption = (text, index) => {
    let textIndex = [...this.state.Option];
    (textIndex[index] = text), this.setState({ Option: textIndex });
  };

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getPollList();
    }, 500);
  };
  onPressText = (id, name) => {
    console.log('id>>>>>>>>>>>>>>', id);
    if (this?.props?.userData?.userInfo?.id == id) {
      this.setState({ isShowModal: false });
    } else {
      this.getConnectionDetails(id, 'onPressText');
      // setTimeout(() => {
      // this.setState({ isShowModal: true });
      // }, 500);
    }
  };

  handleUserBlock = connectionId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this user?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.BLOCKUSER,
                data: {
                  connection_id: connectionId,
                  is_block: this?.state?.profileDetail?.is_block === 1 ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.BLOCKUSER];

                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);

                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };
  handleChatBlock = chatId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this person?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.CHATBLOCK,
                data: {
                  chat_id: chatId,
                  is_block: this.state.isBlock === true ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.CHATBLOCK];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this.props.getChatBlock();
                      // this.getChatDetail();
                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };
  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled,
    });
  };
  handleTypingView() {
    return (
      <View>
        {this.state?.typingUserData ? (
          this?.state?.typingUserData?.chat_id === this?.state?.chatId ? (
            <AnimatedLottieView
              autoPlay
              source={require('../34_OneToOneConversationScreen/typing.json')}
              loop={true}
              speed={1}
              style={{ justifyContent: 'center', alignContent: 'center', width: 60, height: 50 }}
              autoSize={false}
            />
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </View>
    );
  }

  handleDisconnect = friend_id => {
    try {
      const params = {
        url: API_DATA.DISCONNECT,
        data: {
          connection_id: friend_id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.DISCONNECT];
              if (resp.success) {
                console.log('dis res', resp);
                // this?.getMyConnectionsList();
                // this.props.getChatDetail(resp?.data);
              } else {
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {
      console.log('disconnect catch', e);
    }
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const chatDetail = this?.props?.chatDetail;
    const dateFormat = new Date();
    // const eventListId = this?.props?.eventListID?.data?.map((item, index) => ({ ...item, index }));
    let eventListId = this?.props?.eventListID;
    // this?.props?.eventListID?.data?.forEach((item, index) => {
    //   if (item?.data?.length) {
    //     if (eventListId) eventListId.push({ ...item, index });
    //     else eventListId = [{ ...item, index }];
    //   }
    // });

    let customDayHeaderStyles = [];
    const customPickerStyle = customPickerStyles(theme);
    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });
    if (this.state.isLoading) {
      return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.screenBG}>
          <SafeAreaWrapper
            backgroundColor={theme?.colors?.TRANSPARENT}
            containerStyle={{ marginLeft: 0, marginRight: 0 }}
          ></SafeAreaWrapper>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.screenBG}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
          {this?.props?.message ? (
            <View style={{ flex: 1 }}>
              {/* {this?.state?.isEvent ? (
                <View>
                  <Text style={this?.props?.cTabName == 'event' ? styles?.selectedHeaderText : styles?.headerText}>
                    {`Events - ${this?.state?.tabName}`}
                  </Text>
                </View>
              ) : null}
              {this?.state?.isTask ? (
                <View>
                  <Text style={this?.props?.cTabName == 'task' ? styles?.selectedHeaderText : styles?.headerText}>
                    {`Task - ${this?.state?.tabName}`}
                  </Text>
                </View>
              ) : null} */}

              <View style={[styles.header]}>
                <TouchableOpacity
                  style={styles.headerLeft}
                  onPress={() => this.props.navigation.pop(2)}
                  // onPress={() => (this?.state?.notifi ? this?.props?.navigation?.goBack() : this.props.navigation.pop(2))}
                >
                  <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
                </TouchableOpacity>
                <View style={[styles.headerCenter, { alignItems: 'center' }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push('CHAT_PROFILE', {
                        subTabName: this?.state?.tabName,
                        subIndex: this?.state?.subIndex,
                        chatId: this?.state.chatId,
                        groupId: this.state.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
                        groupTitle: this?.state?.groupTitle,
                        state: this?.state?.listState,
                      })
                    }
                  >
                    <Image source={{ uri: chatDetail?.image }} style={COMMON_STYLE.imageStyle(8)} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerTitleView}
                    onPress={() =>
                      this.props.navigation.push('CHAT_PROFILE', {
                        subTabName: this?.state?.tabName,
                        subIndex: this?.state?.subIndex,
                        chatId: this?.state.chatId,
                        groupId: this.state.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
                        groupTitle: this?.state?.groupTitle,
                        state: this?.state?.listState,
                      })
                    }
                  >
                    <Text style={[styles.headerTitle, { textAlign: 'center' }]}>
                      {chatDetail?.members?.length == 2 && !this?.state?.groupTitle ? (
                        chatDetail?.members[0]?.user_id === this?.props?.userData?.userInfo?.id ? (
                          <Text style={[styles.sidenotName]} numberOfLines={1}>
                            {chatDetail?.members[1]?.user_name}
                          </Text>
                        ) : (
                          <Text style={[styles.sidenotName]} numberOfLines={1}>
                            {chatDetail?.members[0]?.user_name}
                          </Text>
                        )
                      ) : this.state?.groupTitle?.length > 18 ? (
                        this.state?.groupTitle.slice(0, 18).concat('...')
                      ) : (
                        this?.state?.groupTitle
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // style={[styles.buttonStyle]}
                    onPress={() => {
                      this.setState({
                        isEvent: false,
                        isTask: false,
                      });
                      this?.props?.CurrentTabName('chat');
                    }}
                  >
                    <Icon2
                      name="message-square"
                      style={[styles.chatIcon, this?.props?.cTabName == 'chat' ? { color: theme?.colors?.RED_500 } : null]}
                    />
                  </TouchableOpacity>
                  {this.state.tabName === 'general' ? (
                    <TouchableOpacity
                      style={[styles.buttonStyle]}
                      onPress={() => {
                        this.setState({
                          isRefreshing: false,
                          isEvent: true,
                          isTask: false,
                        });
                        this?.props?.CurrentTabName('event');
                        this.getEventListId();
                        this.getEventTaskForDate(dateFormat);
                      }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Icon2
                          name="calendar"
                          style={[
                            styles.chatIcon,
                            ,
                            { marginRight: 0 },
                            this?.props?.cTabName == 'event' ? { color: theme?.colors?.RED_500 } : null,
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.buttonStyle]}
                      onPress={() => {
                        // this?.setState({ tabGroupEvent: true });
                        this?.props?.CurrentTabName('categoryEvent');
                        this?.getCategoryEventList();
                      }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Icon2
                          name="calendar"
                          style={[
                            styles.chatIcon,
                            ,
                            { marginRight: 0 },
                            this?.props?.cTabName == 'categoryEvent' ? { color: theme?.colors?.RED_500 } : null,
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <KeyboardAwareScrollView
                // keyboardDismissMode="none"
                keyboardShouldPersistTaps="handled"
                bounces={false}
                contentContainerStyle={{ flex: 1 }}
                extraScrollHeight={Responsive.getHeight(8)}
                enableAutomaticScroll={true}
                enableOnAndroid={false}
                showsVerticalScrollIndicator={false}
              >
                {this.state.isShowModal && this.state.profileDetail ? (
                  <UserModal
                    visible={this.state.isShowModal}
                    inVisible={() => this.setState({ isShowModal: false })}
                    userDetails={this.state.profileDetail}
                    chat_id={this.state.profileDetail.chat_id}
                    sendMessage={false}
                    onPressSendMsg={() => {
                      // this.setState({
                      //   userDataModal: true, userDetails: this.state.profileDetail
                      // })
                      // this?.props?.navigation?.replace('SINGAL_CHAT', {
                      // profileDetail: this?.state?.profileDetail,
                      // is_block: this?.state?.profileDetail?.is_block,
                      // })
                    }}
                    onPressSharedSidenote={() =>
                      this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.profileDetail?.chat_id })
                    }
                    onPressBlock={() =>
                      this.state?.profileDetail?.chat_id
                        ? this.handleChatBlock(this.state?.profileDetail?.chat_id)
                        : this.handleUserBlock(this.state?.profileDetail?.connection_id)
                    }
                    onPressInvite={() => onShare(this?.props?.userData?.userInfo?.invitation_url)}
                    onPressAddtoSidenote={() => this?.props?.navigation?.replace('ADD_SIDENOTE', { userData: this?.state?.profileDetail })}
                  />
                ) : null}
                {/* {this.state.tabTopName === 'chat' ? ( */}
                {this?.props?.cTabName === 'chat' ? (
                  <View style={{ flex: 1 }}>
                    {/* <View>
                    <Text style={[styles.titleActiveStyle, { padding: 10 }]}>{this.props?.groupDetail?.title}</Text>
                  </View> */}
                    {/* <View style={styles.newCategory}>
                    <FlatList
                      data={this?.state?.groupDetailA?.subgroups || []}
                      horizontal
                      renderItem={this.renderNewCategory}
                      getItemLayout={(data, index) => ({
                        length: 100,
                        offset: 100 * index,
                        index,
                      })}
                      ref={ScrollViewRef}
                      keyExtractor={(item) => item.id}
                      contentContainerStyle={
                        styles.newCategoryScroll
                      }
                      showsHorizontalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          refreshing={isRefreshing}
                          onRefresh={handleRefreshCatagory}
                        />
                      }
                    />
                  </View> */}
                    <View style={styles.tabHeader}>
                      {/* <TouchableOpacity style={[styles.holdBtn]} onPress={() => this.setState({ isGroupPopup: true })}>
                      <Icon4 name="bowling" style={styles.holdBtnIcon} />
                    </TouchableOpacity> */}
                      <TouchableOpacity
                        style={[styles.buttonStyle, this.state.tabName == 'general' ? styles.selectTabStyle : null]}
                        onLongPress={() => this.setState({ isGroupPopup: true })}
                        onPress={() => {
                          this.setState({
                            tabName: 'general',
                            // tabGroupId: this?.state?.groupId,
                            chatId: this?.props?.route?.params?.chat_id,
                            groupId: this?.props?.route?.params?.groupId,
                          });
                          this?.props?.navigation?.setParams({
                            subTabName: 'general',
                          });

                          this.getChatDetail(this.props?.route?.params?.chat_id);
                          this.getMessageList(this.props?.route?.params?.chat_id, this.state.page);
                          this.getReadChat(this.props?.route?.params?.chat_id);
                          this.handleGroupDetailId(this?.state?.groupId);
                          this.handleGroupDetail(this.state.groupId);
                        }}
                      >
                        <ScrollView contentContainerStyle={[styles.ScrollView, { padding: 10 }]}>
                          {/* <Icon4 name="bowling" style={styles.holdBtnIcon} /> */}
                          <Image source={IMAGES.categories_icon} style={[styles.holdBtnImg]} resizeMode={'contain'} />
                          {/* <Text style={[styles.titleStyle, this.state.tabName == 'general' ? styles.titleActiveStyle : null]}>General</Text> */}
                        </ScrollView>
                      </TouchableOpacity>
                      <FlatList
                        // data={this?.state?.groupDetailA?.subgroups || []}
                        data={this?.props?.groupDetailA?.subgroups || []}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ref={this?.groupRed}
                        getItemLayout={(data, index) => ({
                          length: 100,
                          offset: 100 * index,
                          index,
                        })}
                        contentContainerStyle={{ paddingLeft: 15 }}
                        renderItem={({ item, index }) => (
                          <View>
                            {this?.props?.route?.params?.isArchived === true ? (
                              <TouchableOpacity
                                style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                onPress={() => {
                                  this.setState({
                                    tabName: item?.title,
                                    subIndex: index,
                                    tabGroupId: item?.id,
                                    chatId: item?.chat_id,
                                    tabChatId: item?.chat_id,
                                    channel: item?.channel,
                                  });
                                  this?.groupRed?.current.scrollToIndex({
                                    index: index,
                                    viewPosition: 0.5,
                                  });
                                  this?.props?.navigation?.setParams({
                                    subTabName: item?.title,
                                    subIndex: index,
                                  });
                                  this.offUserEvent();
                                  setTimeout(() => {
                                    this.connectionChat(item?.channel);
                                    this.getChatDetail(item?.chat_id);
                                    this.handleGroupDetailId(item?.id);
                                    this.getReadChat(item?.chat_id);
                                    this.getMessageList(item?.chat_id, this.state.page);
                                  }, 500);
                                }}
                              >
                                <View style={{ padding: 10, flexDirection: 'row' }}>
                                  {item?.is_private === 1 ? (
                                    <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                  ) : null}
                                  <Text style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}>
                                    {item?.title?.length > 6 ? item?.title.slice(0, 6).concat('...') : item?.title}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <View>
                                {item?.isArchive === 0 && (
                                  <>
                                    <TouchableOpacity
                                      style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                      onPress={() => {
                                        this.setState({
                                          tabName: item?.title,
                                          subIndex: index,
                                          tabGroupId: item?.id,
                                          chatId: item?.chat_id,
                                          tabChatId: item?.chat_id,
                                          channel: item?.channel,
                                        });
                                        this?.groupRed?.current.scrollToIndex({
                                          index: index,
                                          viewPosition: 0.5,
                                          animated: true,
                                        });
                                        this?.props?.navigation?.setParams({
                                          subTabName: item?.title,
                                          subIndex: index,
                                        });
                                        this.offUserEvent();
                                        setTimeout(() => {
                                          this.connectionChat(item?.channel);
                                          // this.offUserEvent();
                                          this.getChatDetail(item?.chat_id);
                                          this.handleGroupDetailId(item?.id);
                                          this.getReadChat(item?.chat_id);
                                          this.getMessageList(item?.chat_id, this.state.page);
                                        }, 500);
                                      }}
                                    >
                                      <View style={{ padding: 10, flexDirection: 'row' }}>
                                        {item?.is_private === 1 ? (
                                          <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                        ) : null}
                                        <Text
                                          style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}
                                        >
                                          {item?.title?.length > 6 && this?.state?.tabName !== item?.title
                                            ? item?.title.slice(0, 6).concat('...')
                                            : item?.title}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                        keyExtractor={(id, index) => index.toString()}
                      />
                    </View>
                    {/* <TouchableOpacity
                      style={{ position: 'absolute', backgroundColor: 'green', bottom: 50, zIndex: 99 }}
                      onPress={() => this.setState({ modalForSubGroup: true })}
                    >
                      <Text style={{ color: 'black' }}>Click For PopUp {this?.state?.tabGroupId}</Text>
                    </TouchableOpacity> */}
                    <Modal animationType="slide" transparent={true} visible={this.state.modalForSubGroup}>
                      <View style={styles.eventModalContainer}>
                        <View style={styles.modalView}>
                          <TouchableOpacity onPress={() => this.handleSubGroupModal(1)}>
                            <Text style={[styles.eventModalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>
                              Choose Moderators
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.eventcellSeprator} />

                          <TouchableOpacity onPress={() => this.handleSubGroupModal(2)}>
                            <Text style={styles.eventModalText}>Allow All</Text>
                          </TouchableOpacity>
                          <View style={styles.eventcellSeprator} />

                          <TouchableOpacity onPress={() => this.handleSubGroupModal(3)}>
                            <Text style={styles.eventModalText}>Just me for now</Text>
                          </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.eventModalView, { marginTop: 15 }]}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                modalForSubGroup: false,
                              })
                            }
                          >
                            <Text style={[styles.eventModalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>Delete</Text>
                          </TouchableOpacity>
                        </View> */}
                      </View>
                    </Modal>
                    {/* <View style={styles.ScrollView}> */}

                    {this.state.videoURL && this.state.isFullScreen ? (
                      <View
                        style={{
                          // flex: 1,
                          backgroundColor: 'black',
                          zIndex: 1000,
                          height: '90%',
                          top: 0,
                        }}
                      >
                        <View style={[styles.headerLeft, { top: Responsive.getWidth(3), left: Responsive.getWidth(4) }]}>
                          <TouchableOpacity onPress={() => this.setState({ isFullScreen: false })}>
                            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.headerBody}></View>

                        <Video
                          source={{ uri: this.state.videoURL }}
                          style={{
                            flex: 1,
                          }}
                          resizeMode="contain"
                          fullscreen={this.state.isFullScreen}
                          controls={true}
                          onError={e => console.log('loading error', e)}
                        />
                      </View>
                    ) : null}
                    <View style={[styles.msgContainer, { position: 'relative' }]}>
                      {this?.props?.message?.data?.length !== 0 ? (
                        <FlatList
                          // ref={this.flatListRef}
                          contentContainerStyle={[styles.ScrollView]}
                          keyboardShouldPersistTaps="handled"
                          onEndReached={() => {
                            if (
                              (this?.props?.message?.total_pages !== 1) & !this.state.isMoreLoading &&
                              this?.props?.message?.total_count !== this.props?.message?.data.length
                            ) {
                              this.setState({ loading: true });
                              this.getMessageList();
                            }
                          }}
                          // onStartReached={() => {}}
                          data={this.props.message?.data || []}
                          inverted
                          ListHeaderComponent={() => this.handleTypingView()}
                          renderItem={(item, index) => this._renderSwipeFrontItemGroup(item, index)}
                          keyExtractor={item => item?.id}
                        />
                      ) : (
                        <View style={{ flex: 1 }}>
                          {this?.props?.message?.data ? (
                            <>
                              <NoDataFound
                                title="Nothing to see"
                                text="You don’t have any chats created yet"
                                titleColor={theme?.colors?.GRAY_50}
                                textColor={theme?.colors?.GRAY_100}
                                titleFontSize={20}
                              />
                            </>
                          ) : null}
                        </View>
                      )}
                      {/* Start @ User List */}
                      {this.state.isAtShow ? (
                        <FlatList
                          data={this?.state?.members}
                          keyboardShouldPersistTaps="handled"
                          // inverted
                          renderItem={({ item }) => (
                            <TouchableOpacity style={styles.atItemRow} onPress={() => this.setState({ isAtShow: false })}>
                              <Image source={{ uri: item?.user_image }} style={[styles.atUserImg]} />
                              <Text style={[styles.atUserName]}>{item?.user_name}</Text>
                            </TouchableOpacity>
                          )}
                          // keyExtractor={item => item.id}
                          contentContainerStyle={[styles.atFlatlistInner]}
                          style={[styles.atFlatlist]}
                        />
                      ) : null}
                      {/* End @ User List */}
                    </View>
                    {/* </View> */}
                    <View style={styles.chatFooter}>
                      {this.state.imagePick ? (
                        <View
                          style={{
                            position: 'relative',
                            height: 50,
                            width: 50,
                          }}
                        >
                          <Image
                            source={{ uri: this.state.imagePick.uri }}
                            style={{
                              height: '100%',
                              width: '100%',
                            }}
                          />
                          <TouchableOpacity
                            style={{ position: 'absolute', right: 2, top: 2 }}
                            onPress={() => {
                              this.setState({ imagePick: null });
                            }}
                          >
                            <Image source={IMAGES.closeIcon} style={{ height: 20, width: 20 }} />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      {chatDetail?.is_block === 1 ? (
                        <View style={[styles.footerIconRow, { height: Responsive.getHeight(13) }]}>
                          <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>The group has been blocked temporary by Admin.</Text>
                        </View>
                      ) : (
                        <View>
                          <View style={styles.inputContainer}>
                            {this.state.msgReply === true ? (
                              <View style={styles.dmMsgRow}>
                                <View style={styles.dmMsgTxtView}>
                                  <Text style={[styles.dmMsgTxt]}>{`Replying to ${this.state.replyData.name}`}</Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.dmMsgIconBtn}
                                  onPress={() => this.setState({ msgReply: false, message: '', msgId: '' })}
                                >
                                  <Image source={IMAGES.closeIcon} style={styles.dmMsgIcon} />
                                </TouchableOpacity>
                              </View>
                            ) : null}

                            {!this.state.pollText && (
                              <Mentions
                                ref={this.textInputRef}
                                value={this.state.message}
                                users={this?.props?.chatDetail?.members}
                                onChange={text => {
                                  this.setState({ message: text });
                                  if (text.length && !this.state.alreadyTyping) {
                                    this.setState({
                                      alreadyTyping: true,
                                    });

                                    if (!this.timeoutForTyping2) {
                                      this.timeoutForTyping2 = setTimeout(() => {
                                        this.setState({
                                          alreadyTyping: false,
                                        });
                                        clearTimeout(this.timeoutForTyping2);
                                        this.timeoutForTyping2 = null;
                                      }, 6000);
                                    }

                                    clearTimeout(this.timeoutForTyping);
                                    this.timeoutForTyping = setTimeout(() => {
                                      this.setState({
                                        isUserTyping: false,
                                      });
                                      this.userTyping(0);
                                    }, 8000);

                                    if (!this.sixtySecondsTimer) {
                                      this.sixtySecondsTimer = setTimeout(() => {
                                        this.setState({
                                          isUserTyping: false,
                                          sixtySecondsExceeded: true,
                                        });
                                        this.userTyping(0);
                                        clearTimeout(this.sixtySecondsTimer);
                                      }, 60000);
                                    }

                                    this.userTyping(1);
                                  } else {
                                    this.setState({
                                      sixtySecondsExceeded: false,
                                    });
                                  }

                                  if (!text.length) {
                                    if (this.sixtySecondsTimer) {
                                      clearTimeout(this.sixtySecondsTimer);
                                      this.sixtySecondsTime = null;
                                    }
                                  }
                                }}
                                inputStyle={styles.msgInput}
                                theme={theme}
                              />
                              // <TextInput
                              //   ref={this.textInputRef}
                              //   placeholder="Drop a message"
                              //   value={this.state.message}
                              //   style={styles.msgInput}
                              //   placeholderTextColor={theme?.colors?.GRAY_300}
                              //   onChangeText={text => this.onChangeText(text)}
                              //   onContentSizeChange={event => {
                              //     this.setState({ height: event.nativeEvent.contentSize.height });
                              //   }}
                              // />
                            )}
                          </View>
                          <>
                            {this.state.pollText ? (
                              <View style={styles.pllTxtContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <TextInput
                                    ref={this.textInputRef}
                                    placeholder="Drop a message"
                                    value={this.state.question}
                                    style={styles.msgInput}
                                    placeholderTextColor={theme?.colors?.GRAY_300}
                                    onChangeText={text =>
                                      this.setState({
                                        question: text,
                                      })
                                    }
                                  />
                                  <Icon
                                    name="close"
                                    style={[styles.footerIcon, { marginTop: 8 }]}
                                    onPress={() => this.setState({ pollText: false })}
                                  />
                                </View>
                                {this?.state?.Option?.map((item, index) => (
                                  <TouchableOpacity style={styles.pollTextProgress}>
                                    <TextInput
                                      ref={this.textInputRef}
                                      placeholder="Options"
                                      value={this.state.Option[index]}
                                      style={[styles.msgInput, { width: '100%' }]}
                                      placeholderTextColor={theme?.colors?.GRAY_300}
                                      onChangeText={text => {
                                        this.handleChangeOption(text, index);
                                      }}
                                    />
                                  </TouchableOpacity>
                                ))}

                                {/* <Text style={styles.pollProgressTxt}>Ligh Gray</Text> */}
                                {/* <Text style={styles.pollProgressTxt}>23</Text> */}

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <Text style={styles.pollVoteTxt}>Poll expires in 24 hours</Text>
                                  {this?.state?.Option.length < 5 ? (
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (this?.state?.Option.length < 5) {
                                          this.setState({ Option: [...this?.state?.Option, ''] });
                                        }
                                      }}
                                    >
                                      <Text style={styles.pollOptionText}>+ Add </Text>
                                    </TouchableOpacity>
                                  ) : null}
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                  <Switch
                                    trackColor={{ false: theme?.colors?.GRAY_300, true: theme?.colors?.WHITE }}
                                    thumbColor={this.state.isEnabled ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={this.toggleSwitch}
                                    value={this?.state?.isEnabled}
                                  />
                                  <Text style={[styles.pollOptionText, { color: theme?.colors?.WHITE, marginLeft: 10 }]}>Hide results</Text>
                                </View>
                              </View>
                            ) : null}

                            <View style={styles.footerIconRow}>
                              <View style={styles.footerIconColLeft}>
                                <TouchableOpacity style={styles.footerIconBtn}>
                                  <Icon2 name="image" style={[styles.footerIcon]} onPress={() => this.setState({ isShowPicker: true })} />
                                </TouchableOpacity>
                                {this.props?.chatDetail?.members?.length === 2 ||
                                this?.props?.chatDetail?.admin?.id === this.props?.userData?.userInfo?.id ? (
                                  <>
                                    <TouchableOpacity
                                      style={styles.footerIconBtn}
                                      onPress={() =>
                                        this.props.navigation.navigate('CREATE_TASK', {
                                          groupId: this?.state?.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
                                        })
                                      }
                                    >
                                      <Icon name="calendar-outline" style={styles.footerIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.footerIconBtn}
                                      onPress={() => this.setState({ pollText: true, message: '' })}
                                    >
                                      <Icon3 name="graph-horizontal" style={styles.footerIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.footerIconBtn}
                                      onPress={() =>
                                        this.props.navigation.navigate('NEW_TASK', {
                                          groupId: this?.state?.tabName === 'general' ? this.state.groupId : this.state.tabGroupId,
                                        })
                                      }
                                    >
                                      <Icon name="checkbox-outline" style={styles.footerIcon} />
                                    </TouchableOpacity>
                                  </>
                                ) : (
                                  this.props.chatDetail?.members?.map(val =>
                                    val?.user_id === this?.props?.userData?.userInfo?.id && val?.is_moderator === 1 ? (
                                      <>
                                        <TouchableOpacity
                                          style={styles.footerIconBtn}
                                          onPress={() => this.props.navigation.navigate('CREATE_TASK', { groupId: this.state.tabGroupId })}
                                        >
                                          <Icon name="calendar-outline" style={styles.footerIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={styles.footerIconBtn}
                                          onPress={() => this.setState({ pollText: true, message: '' })}
                                        >
                                          <Icon3 name="graph-horizontal" style={styles.footerIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          style={styles.footerIconBtn}
                                          onPress={() => this.props.navigation.navigate('NEW_TASK', { groupId: this.state.tabGroupId })}
                                        >
                                          <Icon name="checkbox-outline" style={styles.footerIcon} />
                                        </TouchableOpacity>
                                      </>
                                    ) : null,
                                  )
                                )}

                                {this?.state?.tabName === 'general' ? (
                                  this?.props?.chatDetail?.members?.length === 2 ||
                                  this?.props?.chatDetail?.admin?.id === this?.props?.userData?.userInfo?.id ? (
                                    <TouchableOpacity
                                      style={styles.footerIconBtn}
                                      onPress={() =>
                                        this.props.navigation.push('NEW_CATEGORY', {
                                          groupTitle: this?.state?.groupTitle,
                                          // selectUser: this?.state?.selectUser,
                                          detail: this?.state?.groupCreated ? this?.state?.detail : this?.state?.detail?.members,
                                          groupId: this?.state?.groupId,
                                          handelNewTab: this.handelNewTab,
                                        })
                                      }
                                    >
                                      <Icon2 name="hash" style={styles.footerIcon} />
                                    </TouchableOpacity>
                                  ) : (
                                    this?.props?.chatDetail?.members?.map(val =>
                                      val.user_id === this?.props?.userData?.userInfo?.id && val.is_moderator === 1 ? (
                                        <TouchableOpacity
                                          style={styles.footerIconBtn}
                                          onPress={() =>
                                            this.props.navigation.push('NEW_CATEGORY', {
                                              groupTitle: this?.state?.groupTitle,
                                              // selectUser: this?.state?.selectUser,
                                              detail: this?.state?.groupCreated ? this?.state?.detail : this?.state?.detail?.members,
                                              groupId: this?.state?.groupId,
                                              handelNewTab: this.handelNewTab,
                                            })
                                          }
                                        >
                                          <Icon2 name="hash" style={styles.footerIcon} />
                                        </TouchableOpacity>
                                      ) : null,
                                    )
                                  )
                                ) : null}
                              </View>
                              <View style={styles.footerIconColRight}>
                                {this.state?.message?.trim() !== '' || this.state.imagePick !== '' ? (
                                  <TouchableOpacity style={styles.footerLeftIconBtn} onPress={() => this.sendGroupMessage()}>
                                    <Icon2 name="send" style={[styles.footerLeftIcon]} />
                                  </TouchableOpacity>
                                ) : this.state.question !== '' && this.state.Option?.every(value => value?.length > 0) ? (
                                  <TouchableOpacity style={styles.footerLeftIconBtn} onPress={() => this.createPoll()}>
                                    <Icon2 name="send" style={[styles.footerLeftIcon]} />
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                            </View>
                          </>
                        </View>
                      )}
                    </View>
                    {this._renderPickerPopup()}
                    {this._renderGroupPopup()}
                  </View>
                ) : // ) : this.state.tabTopName === 'event' ? (
                this?.props?.cTabName === 'event' ? (
                  this?.state?.isLoaderEvent === false ? (
                    <>
                      <View style={styles.tabHeader}>
                        <TouchableOpacity
                          style={[styles.buttonStyle, this.state.tabName == 'general' ? styles.selectTabStyle : null]}
                          onLongPress={() => this.setState({ isGroupPopup: true })}
                          onPress={() => {
                            this.setState({
                              tabName: 'general',
                              // tabGroupId: this?.state?.groupId,
                              chatId: this?.props?.route?.params?.chat_id,
                              groupId: this?.props?.route?.params?.groupId,
                            });
                            this?.props?.navigation?.setParams({
                              subTabName: 'general',
                            });

                            this.getChatDetail(this.props?.route?.params?.chat_id);
                            this.getMessageList(this.props?.route?.params?.chat_id, this.state.page);
                            this.getReadChat(this.props?.route?.params?.chat_id);
                            this.handleGroupDetailId(this?.state?.groupId);
                            this.handleGroupDetail(this.state.groupId);
                          }}
                        >
                          <ScrollView contentContainerStyle={[styles.ScrollView, { padding: 10 }]}>
                            {/* <Icon4 name="bowling" style={styles.holdBtnIcon} /> */}
                            <Image source={IMAGES.categories_icon} style={[styles.holdBtnImg]} resizeMode={'contain'} />
                            {/* <Text style={[styles.titleStyle, this.state.tabName == 'general' ? styles.titleActiveStyle : null]}>General</Text> */}
                          </ScrollView>
                        </TouchableOpacity>
                        <FlatList
                          // data={this?.state?.groupDetailA?.subgroups || []}
                          data={this?.props?.groupDetailA?.subgroups || []}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          ref={this?.groupRed}
                          getItemLayout={(data, index) => ({
                            length: 100,
                            offset: 100 * index,
                            index,
                          })}
                          contentContainerStyle={{ paddingLeft: 15 }}
                          renderItem={({ item, index }) => (
                            <View>
                              {this?.props?.route?.params?.isArchived === true ? (
                                <TouchableOpacity
                                  style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                  onPress={() => {
                                    this.setState({
                                      tabName: item?.title,
                                      subIndex: index,
                                      tabGroupId: item?.id,
                                      chatId: item?.chat_id,
                                      tabChatId: item?.chat_id,
                                      channel: item?.channel,
                                    });
                                    this?.groupRed?.current.scrollToIndex({
                                      index: index,
                                      viewPosition: 0.5,
                                    });
                                    this?.props?.navigation?.setParams({
                                      subTabName: item?.title,
                                      subIndex: index,
                                    });
                                    this.offUserEvent();
                                    setTimeout(() => {
                                      this.connectionChat(item?.channel);
                                      this.getChatDetail(item?.chat_id);
                                      this.handleGroupDetailId(item?.id);
                                      this.getReadChat(item?.chat_id);
                                      this.getMessageList(item?.chat_id, this.state.page);
                                    }, 500);
                                  }}
                                >
                                  <View style={{ padding: 10, flexDirection: 'row' }}>
                                    {item?.is_private === 1 ? (
                                      <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                    ) : null}
                                    <Text style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}>
                                      {item?.title?.length > 6 ? item?.title.slice(0, 6).concat('...') : item?.title}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View>
                                  {item?.isArchive === 0 && (
                                    <>
                                      <TouchableOpacity
                                        style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                        onPress={() => {
                                          this.setState({
                                            tabName: item?.title,
                                            subIndex: index,
                                            tabGroupId: item?.id,
                                            chatId: item?.chat_id,
                                            tabChatId: item?.chat_id,
                                            channel: item?.channel,
                                          });
                                          this?.groupRed?.current.scrollToIndex({
                                            index: index,
                                            viewPosition: 0.5,
                                            animated: true,
                                          });
                                          this?.props?.navigation?.setParams({
                                            subTabName: item?.title,
                                            subIndex: index,
                                          });
                                          this.offUserEvent();
                                          setTimeout(() => {
                                            this.connectionChat(item?.channel);
                                            // this.offUserEvent();
                                            this.getChatDetail(item?.chat_id);
                                            this.handleGroupDetailId(item?.id);
                                            this.getReadChat(item?.chat_id);
                                            this.getMessageList(item?.chat_id, this.state.page);
                                          }, 500);
                                        }}
                                      >
                                        <View style={{ padding: 10, flexDirection: 'row' }}>
                                          {item?.is_private === 1 ? (
                                            <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                          ) : null}
                                          <Text
                                            style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}
                                          >
                                            {item?.title?.length > 6 && this?.state?.tabName !== item?.title
                                              ? item?.title.slice(0, 6).concat('...')
                                              : item?.title}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    </>
                                  )}
                                </View>
                              )}
                            </View>
                          )}
                          ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                          keyExtractor={(id, index) => index.toString()}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        {
                          <CalendarPicker
                            weekdays={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
                            onDateChange={date => this.getEventTaskForDate(date)}
                            textStyle={styles.calendarTextStyle}
                            todayTextStyle={styles.todayTextStyle}
                            todayBackgroundColor={theme?.colors?.RED_500}
                            dayLabelsWrapper={{
                              borderBottomWidth: 0,
                              borderTopWidth: 0,
                            }}
                            selectedDayColor={theme?.colors?.RED_500}
                            selectedDayTextColor={theme?.colors?.WHITE}
                            monthTitleStyle={styles.monthTitleStyle}
                            yearTitleStyle={styles.monthTitleStyle}
                            previousTitle={<Image source={IMAGES.prevArrow} style={styles.arrowStyle} />}
                            nextTitle={<Image source={IMAGES.nextArrow} style={styles.arrowStyle} />}
                            customDayHeaderStyles={customPickerStyle}
                            // enableDateChange
                            // minDate={dateFormat}
                          />
                        }
                        {this?.props?.eventListID?.length ? (
                          <>
                            <FlatList
                              data={this?.props?.eventListID || []}
                              keyExtractor={item => item?.id}
                              ui
                              // refreshing={this?.state?.isRefreshing}
                              onEndReachedThreshold={0.5}
                              showsVerticalScrollIndicator={false}
                              // refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />}
                              renderItem={({ item, index }) => {
                                // console.log("item form event ====>", item?.media)
                                // console.log("------>" , item?.media[item?.media.length - 1]?.url);
                                return item.isTask ? (
                                  <View style={{ flex: 1 }}>
                                    <Swipeout
                                      right={
                                        item?.createdBy?.id === this?.props?.userData?.userInfo?.id
                                          ? [
                                              {
                                                text: (
                                                  <Image
                                                    style={
                                                      item?.createdBy?.id !== this?.props?.userData?.userInfo?.id
                                                        ? [COMMON_STYLE.imageStyle(6), { tintColor: 'gray' }]
                                                        : COMMON_STYLE.imageStyle(6)
                                                    }
                                                    source={IMAGES.deleteNewIcon}
                                                  />
                                                ),
                                                backgroundColor: theme?.colors?.GRAY_1000,
                                                onPress: () => this.handleDeleteTask(item?.id),
                                                disabled: item?.createdBy?.id !== this?.props?.userData?.userInfo?.id,
                                              },
                                              {
                                                text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                                backgroundColor: theme?.colors?.GRAY_1000,
                                                onPress: () => this.handleEditTask(item?.id),
                                              },
                                            ]
                                          : [
                                              {
                                                text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.report} />,
                                                backgroundColor: theme?.colors?.GRAY_1000,
                                                onPress: () => this.handleReportTask(item?.id),
                                              },
                                            ]
                                      }
                                      autoClose={true}
                                      backgroundColor={theme?.colors?.GRAY_1000}
                                      style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
                                    >
                                      <ListItem.Accordion
                                        content={
                                          <View style={{ flex: 1 }}>
                                            <ListItem.Content>
                                              <View style={styles.ListItemAccordion}>
                                                <TouchableOpacity
                                                  style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                                                  onPress={() => this.handleTasks(item.id)}
                                                >
                                                  <Image
                                                    source={item?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                                    style={[styles.listIcon]}
                                                  />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.body} onPress={() => this.handleTaskDetail(item?.id)}>
                                                  <Text style={styles.h6}>{item?.title}</Text>
                                                  <View style={styles.meta}>
                                                    {item?.assigned_group_title ? (
                                                      <View style={styles.metaItem}>
                                                        <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                        <Text style={styles.thirteenGrayStyle}>{item?.assigned_group_title}</Text>
                                                      </View>
                                                    ) : null}
                                                    {item?.assigned_user_name ? (
                                                      <View style={styles.metaItem}>
                                                        <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                        <Text style={styles.thirteenGrayStyle}>{item?.assigned_user_name}</Text>
                                                      </View>
                                                    ) : null}
                                                    <View style={styles.metaItem}>
                                                      <Image source={IMAGES.calendarIcon} style={styles.metaIcon} />
                                                      <Text style={styles.thirteenGrayStyle}>
                                                        {/* {moment(item.date).format('MMMM DD')} {item.time === '' ? '' : 'at ' + item.time} */}
                                                        {moment(item.date).format('MMMM DD')} {item.time ? 'at' + item.time : ''}
                                                      </Text>
                                                    </View>
                                                  </View>
                                                </TouchableOpacity>
                                                {item?.subtasks?.length !== 0 ? (
                                                  <TouchableOpacity style={styles.right} onPress={() => this.onChangeExpand(item?.id)}>
                                                    <Image
                                                      source={this.state.openExpand === item?.id ? IMAGES.upArrow : IMAGES.downArrow}
                                                      style={styles.listIcon}
                                                    />
                                                  </TouchableOpacity>
                                                ) : null}
                                                {item?.createdBy?.id === this?.props?.userData?.userInfo?.id ? null : (
                                                  <TouchableOpacity style={styles.right} onPress={() => this.handleReportTask(item?.id)}>
                                                    <Image
                                                      source={IMAGES.report}
                                                      style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }}
                                                    />
                                                  </TouchableOpacity>
                                                )}
                                              </View>
                                            </ListItem.Content>
                                          </View>
                                        }
                                        isExpanded={this.state.openExpand === item?.id}
                                        containerStyle={[styles.listItem, styles.borderBottomNull]}
                                        noIcon={true}
                                      >
                                        {item?.subtasks?.map(val => {
                                          return (
                                            <View style={[styles.listItem, styles.listItemBg, styles.subListItem, { marginTop: 0 }]}>
                                              <TouchableOpacity
                                                style={[styles.left, { marginRight: 0 }]}
                                                onPress={() => this.handleTasks(val.id, item?.id)}
                                              >
                                                <Image
                                                  source={val?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                                  style={styles.subListIcon}
                                                />
                                              </TouchableOpacity>
                                              <View style={[styles.body, { paddingLeft: 10 }]}>
                                                <Text style={styles.h6}>{val?.title}</Text>
                                              </View>
                                            </View>
                                          );
                                        })}
                                      </ListItem.Accordion>
                                    </Swipeout>
                                  </View>
                                ) : item.isEvent ? (
                                  <EventCard
                                    item={item}
                                    navigation={this?.props?.navigation}
                                    groupName={this?.state?.groupTitle}
                                    subGroupName={this?.state?.tabName}
                                  />
                                ) : // <View style={{ flex: 1 }}>
                                //   <Swipeout
                                //     right={
                                //       item?.user_id === this?.props?.userData?.userInfo?.id && [
                                //         {
                                //           text: <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} />,
                                //           backgroundColor: theme?.colors?.GRAY_1000,
                                //           onPress: () => this.handleDeleteEvent(item?.id),
                                //         },
                                //         {
                                //           text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                //           backgroundColor: theme?.colors?.GRAY_1000,
                                //           onPress: () => this.handleEditEvent(item?.id),
                                //         },
                                //       ]
                                //     }
                                //     autoClose={true}
                                //     backgroundColor={theme?.colors?.GRAY_1000}
                                //     style={{ paddingHorizontal: 20 }}
                                //   >
                                //     <TouchableOpacity style={styles.eventItem} onPress={() => this.handleEventDetail(item?.id, index)}>
                                //       {/* { item?.media?.length  && item?.media[item?.media?.length - 1]?.url == '' ? (  */}

                                //       <View style={styles.eventImageView}>
                                //         <Image
                                //           source={item?.media?.length ? { uri: item?.media[item?.media.length - 1]?.url } : IMAGES.avtar}
                                //           style={styles.eventImage}
                                //         />
                                //         {/* <Image source={IMAGES.gradient_layer} style={styles.gradientLayer} /> */}
                                //       </View>
                                //       {/* ) : null}  */}

                                //       <LinearGradient
                                //         colors={['transparent', 'rgba(26, 31, 33,0.7)', theme?.colors?.GRAY_1000]}
                                //         style={styles.eventContent}
                                //       >
                                //         <View style={styles.eventContentTop}>
                                //           {item?.user_id === this?.props?.userData?.userInfo?.id ? (
                                //             <View />
                                //           ) : (
                                //             <TouchableOpacity onPress={() => this.handleReportEvent(item?.id)}>
                                //               <Image
                                //                 source={IMAGES.report}
                                //                 style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }}
                                //               />
                                //             </TouchableOpacity>
                                //           )}

                                //           <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme?.colors?.WHITE }]}>
                                //             <Text style={[styles.smallBtnText, { color: theme?.colors?.GRAY_900 }]}>
                                //               {/* {item.date !== '' ? moment(item.date).format('MMM d') : moment().format('MMM d')} */}
                                //               {moment(item?.date).format('MMM DD')}
                                //             </Text>
                                //           </TouchableOpacity>
                                //         </View>
                                //         <View style={styles.eventContentRow}>
                                //           <View style={styles.body}>
                                //             <Text style={styles.eventTitle} numberOfLines={1}>
                                //               {item.title}
                                //             </Text>
                                //             {/* <MyCustomText item={item} section={section.index} handleTaskDetail={this.handleEventDetail} /> */}
                                //             {!item?.is_fullday ? (
                                //               <Text style={styles.eventText}>
                                //                 {this.handleStartTime(item?.start_time)} -{' '}
                                //                 {item?.end_time ? this.handleEndTime(item?.end_time) : null}
                                //               </Text>
                                //             ) : (
                                //               <Text style={styles.eventText}>Fullday</Text>
                                //             )}
                                //           </View>

                                //           <View style={styles.right}>
                                //             {item?.is_participate === '' && (
                                //               <TouchableOpacity
                                //                 style={styles.smallBtn}
                                //                 onPress={() => this.handleGoing(item, section.index)}
                                //               >
                                //                 <Text style={styles.smallBtnText}>Going</Text>
                                //               </TouchableOpacity>
                                //             )}
                                //             {item?.is_participate === 'Yes' && (
                                //               <TouchableOpacity
                                //                 style={[styles.smallBtn, { backgroundColor: '#86D190' }]}
                                //                 onPress={() => this.handleGoing(item, section.index)}
                                //               >
                                //                 <Text style={styles.smallBtnText}>I'm going</Text>
                                //               </TouchableOpacity>
                                //             )}
                                //             {item?.is_participate === 'No' && (
                                //               <TouchableOpacity
                                //                 style={[styles.smallBtn, { backgroundColor: '#FC5401' }]}
                                //                 onPress={() => this.handleGoing(item, section.index)}
                                //               >
                                //                 <Text style={styles.smallBtnText}>I'm not going</Text>
                                //               </TouchableOpacity>
                                //             )}
                                //             {item?.is_participate === 'Maybe' && (
                                //               <TouchableOpacity
                                //                 style={[styles.smallBtn, { backgroundColor: '#FEDC01' }]}
                                //                 onPress={() => this.handleGoing(item, section.index)}
                                //               >
                                //                 <Text style={[styles.smallBtnText, { color: theme?.colors?.BLACK }]}>Maybe</Text>
                                //               </TouchableOpacity>
                                //             )}
                                //           </View>
                                //         </View>
                                //       </LinearGradient>
                                //     </TouchableOpacity>
                                //   </Swipeout>
                                // </View>
                                null;
                              }}
                              contentContainerStyle={styles.eventScroll}
                              // renderSectionHeader={({ section: { title } }) => <Text style={styles.eventHeaderTitle}>{title}</Text>}
                            />
                          </>
                        ) : (
                          <NoDataFound
                            title="Nothing to see"
                            text="You don’t have any Event yet"
                            titleColor={theme?.colors?.GRAY_50}
                            textColor={theme?.colors?.GRAY_100}
                            titleFontSize={20}
                            source={IMAGES.calendar_no_data}
                            imageWidth={169}
                            imageHeight={123}
                          />
                        )}
                        {/* {
                        this?.props?.taskListId ? 
                          <FlatList
                          data={this?.props?.taskListId || []}
                          keyExtractor={item => item.id}
                          renderItem={({ item }) => {
                            return (
                              <View style={{ flex: 1 }}>
                                <Swipeout
                                  right={
                                    item?.createdBy?.id === this?.props?.userData?.userInfo?.id
                                      ? [
                                          {
                                            text: (
                                              <Image
                                                style={
                                                  item?.createdBy?.id !== this?.props?.userData?.userInfo?.id
                                                    ? [COMMON_STYLE.imageStyle(6), { tintColor: 'gray' }]
                                                    : COMMON_STYLE.imageStyle(6)
                                                }
                                                source={IMAGES.deleteNewIcon}
                                              />
                                            ),
                                            backgroundColor: theme?.colors?.GRAY_1000,
                                            onPress: () => this.handleDeleteTask(item?.id),
                                            disabled: item?.createdBy?.id !== this?.props?.userData?.userInfo?.id,
                                          },
                                          {
                                            text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                            backgroundColor: theme?.colors?.GRAY_1000,
                                            onPress: () => this.handleEditTask(item?.id),
                                          },
                                        ]
                                      : [
                                          {
                                            text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.report} />,
                                            backgroundColor: theme?.colors?.GRAY_1000,
                                            onPress: () => this.handleReportTask(item?.id),
                                          },
                                        ]
                                  }
                                  autoClose={true}
                                  backgroundColor={theme?.colors?.GRAY_1000}
                                  style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
                                >
                                  <ListItem.Accordion
                                    content={
                                      <View style={{ flex: 1 }}>
                                        <ListItem.Content>
                                          <View style={styles.ListItemAccordion}>
                                            <TouchableOpacity
                                              style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                                              onPress={() => this.handleTasks(item.id)}
                                            >
                                              <Image
                                                source={item?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                                style={[styles.listIcon]}
                                              />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.body} onPress={() => this.handleTaskDetail(item?.id)}>
                                              <Text style={styles.h6}>{item?.title}</Text>
                                              <View style={styles.meta}>
                                                {item?.assigned_group_title ? (
                                                  <View style={styles.metaItem}>
                                                    <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                    <Text style={styles.thirteenGrayStyle}>{item?.assigned_group_title}</Text>
                                                  </View>
                                                ) : null}
                                                {item?.assigned_user_name ? (
                                                  <View style={styles.metaItem}>
                                                    <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                    <Text style={styles.thirteenGrayStyle}>{item?.assigned_user_name}</Text>
                                                  </View>
                                                ) : null}
                                                <View style={styles.metaItem}>
                                                  <Image source={IMAGES.calendarIcon} style={styles.metaIcon} />
                                                  <Text style={styles.thirteenGrayStyle}>
                                                    {moment(item.date).format('MMMM DD')} {item.time === '' ? '' : 'at ' + item.time}
                                                  </Text>
                                                </View>
                                              </View>
                                            </TouchableOpacity>
                                            {item?.subtasks?.length !== 0 ? (
                                              <TouchableOpacity style={styles.right} onPress={() => this.onChangeExpand(item?.id)}>
                                                <Image
                                                  source={this.state.openExpand === item?.id ? IMAGES.upArrow : IMAGES.downArrow}
                                                  style={styles.listIcon}
                                                />
                                              </TouchableOpacity>
                                            ) : null}
                                            {item?.createdBy?.id === this?.props?.userData?.userInfo?.id ? null : (
                                              <TouchableOpacity style={styles.right} onPress={() => this.handleReportTask(item?.id)}>
                                                <Image
                                                  source={IMAGES.report}
                                                  style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }}
                                                />
                                              </TouchableOpacity>
                                            )}
                                          </View>
                                        </ListItem.Content>
                                      </View>
                                    }
                                    isExpanded={this.state.openExpand === item?.id}
                                    containerStyle={[styles.listItem, styles.borderBottomNull]}
                                    noIcon={true}
                                  >
                                    {item?.subtasks?.map(val => {
                                      return (
                                        <View style={[styles.listItem, styles.listItemBg, styles.subListItem, { marginTop: 0 }]}>
                                          <TouchableOpacity
                                            style={[styles.left, { marginRight: 0 }]}
                                            onPress={() => this.handleTasks(val.id, item?.id)}
                                          >
                                            <Image
                                              source={val?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                              style={styles.subListIcon}
                                            />
                                          </TouchableOpacity>
                                          <View style={[styles.body, { paddingLeft: 10 }]}>
                                            <Text style={styles.h6}>{val?.title}</Text>
                                          </View>
                                        </View>
                                      );
                                    })}
                                  </ListItem.Accordion>
                                </Swipeout>
                              </View>
                            );
                          }}
                          /> :null
                    } */}

                        {/* <TouchableOpacity style={[styles.fabButton]} onPress={() => this.props.navigation.navigate('NEW_TASK')}>
                <Image source={IMAGES.addTask} style={styles.fabButtonIcon} />
              </TouchableOpacity> */}

                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={this.state.modalVisible}
                          onRequestClose={() => {
                            this.setState({
                              modalVisible: !this.state.modalVisible,
                            });
                          }}
                        >
                          <View style={styles.eventModalContainer}>
                            <View style={styles.modalView}>
                              <TouchableOpacity onPress={() => this.handleParticipate('Yes')}>
                                <Text style={styles.eventModalText}>Yes</Text>
                              </TouchableOpacity>
                              <View style={styles.eventcellSeprator} />

                              <TouchableOpacity onPress={() => this.handleParticipate('No')}>
                                <Text style={styles.eventModalText}>No</Text>
                              </TouchableOpacity>
                              <View style={styles.eventcellSeprator} />

                              <TouchableOpacity onPress={() => this.handleParticipate('Maybe')}>
                                <Text style={styles.eventModalText}>Maybe</Text>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.eventModalView, { marginTop: 15 }]}>
                              <TouchableOpacity
                                onPress={() =>
                                  this.setState({
                                    modalVisible: false,
                                  })
                                }
                              >
                                <Text style={[styles.eventModalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>Delete</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>

                        <View style={styles.chatFooter}>
                          <View style={styles.footerIconRow}>
                            <View style={styles.footerIconColLeft}>
                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => {
                                  // this.setState({
                                  //   tabTopName: 'chat',
                                  // });
                                  this?.props?.CurrentTabName('chat');
                                }}
                              >
                                <Icon2 name="message-square" style={[styles.footerIcon]} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => this.props.navigation.navigate('CREATE_TASK', { groupId: this.state.tabGroupId })}
                              >
                                <Icon name="calendar-outline" style={styles.footerIcon} />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.footerIconBtn}>
                                <Icon3 name="graph-horizontal" style={styles.footerIcon} />
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => this.props.navigation.navigate('NEW_TASK', { groupId: this.state.tabGroupId })}
                              >
                                <Icon name="checkbox-outline" style={styles.footerIcon} />
                              </TouchableOpacity>
                              {/* <TouchableOpacity
                      style={styles.footerIconBtn}
                      onPress={() =>
                        this.props.navigation.navigate('NEW_CATEGORY', {
                          groupTitle: this?.state?.groupTitle,
                          // selectUser: this?.state?.selectUser,
                          detail: this?.state?.detail,
                          groupId: this?.state?.groupId,
                        })
                      }
                    >
                      <Icon2 name="hash" style={styles.footerIcon} />
                    </TouchableOpacity> */}
                            </View>
                            <View style={styles.footerIconColRight} />
                          </View>
                        </View>
                      </View>
                    </>
                  ) : null
                ) : this?.props?.cTabName === 'task' ? (
                  // ) : this.state.tabTopName === 'task' ? (
                  <View style={{ flex: 1 }}>
                    {this?.props?.taskListId ? (
                      <View style={{ flex: 1 }}>
                        {this?.props?.taskListId?.length != 0 ? (
                          <FlatList
                            data={this?.props?.taskListId || []}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {
                              return (
                                <View style={{ flex: 1 }}>
                                  <Swipeout
                                    right={
                                      item?.createdBy?.id === this?.props?.userData?.userInfo?.id
                                        ? [
                                            {
                                              text: (
                                                <Image
                                                  style={
                                                    item?.createdBy?.id !== this?.props?.userData?.userInfo?.id
                                                      ? [COMMON_STYLE.imageStyle(6), { tintColor: 'gray' }]
                                                      : COMMON_STYLE.imageStyle(6)
                                                  }
                                                  source={IMAGES.deleteNewIcon}
                                                />
                                              ),
                                              backgroundColor: theme?.colors?.GRAY_1000,
                                              onPress: () => this.handleDeleteTask(item?.id),
                                              disabled: item?.createdBy?.id !== this?.props?.userData?.userInfo?.id,
                                            },
                                            {
                                              text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                              backgroundColor: theme?.colors?.GRAY_1000,
                                              onPress: () => this.handleEditTask(item?.id),
                                            },
                                          ]
                                        : [
                                            {
                                              text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.report} />,
                                              backgroundColor: theme?.colors?.GRAY_1000,
                                              onPress: () => this.handleReportTask(item?.id),
                                            },
                                          ]
                                    }
                                    autoClose={true}
                                    backgroundColor={theme?.colors?.GRAY_1000}
                                    style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
                                  >
                                    <ListItem.Accordion
                                      content={
                                        <View style={{ flex: 1 }}>
                                          <ListItem.Content>
                                            <View style={styles.ListItemAccordion}>
                                              <TouchableOpacity
                                                style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                                                onPress={() => this.handleTasks(item.id)}
                                              >
                                                <Image
                                                  source={item?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                                  style={[styles.listIcon]}
                                                />
                                              </TouchableOpacity>
                                              <TouchableOpacity style={styles.body} onPress={() => this.handleTaskDetail(item?.id)}>
                                                <Text style={styles.h6}>{item?.title}</Text>
                                                <View style={styles.meta}>
                                                  {item?.assigned_group_title ? (
                                                    <View style={styles.metaItem}>
                                                      <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                      <Text style={styles.thirteenGrayStyle}>{item?.assigned_group_title}</Text>
                                                    </View>
                                                  ) : null}
                                                  {item?.assigned_user_name ? (
                                                    <View style={styles.metaItem}>
                                                      <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                                      <Text style={styles.thirteenGrayStyle}>{item?.assigned_user_name}</Text>
                                                    </View>
                                                  ) : null}
                                                  <View style={styles.metaItem}>
                                                    <Image source={IMAGES.calendarIcon} style={styles.metaIcon} />
                                                    <Text style={styles.thirteenGrayStyle}>
                                                      {moment(item.date).format('MMMM DD')} {item.time === '' ? '' : 'at ' + item.time}
                                                    </Text>
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                              {item?.subtasks?.length !== 0 ? (
                                                <TouchableOpacity style={styles.right} onPress={() => this.onChangeExpand(item?.id)}>
                                                  <Image
                                                    source={this.state.openExpand === item?.id ? IMAGES.upArrow : IMAGES.downArrow}
                                                    style={styles.listIcon}
                                                  />
                                                </TouchableOpacity>
                                              ) : null}
                                              {item?.createdBy?.id === this?.props?.userData?.userInfo?.id ? null : (
                                                <TouchableOpacity style={styles.right} onPress={() => this.handleReportTask(item?.id)}>
                                                  <Image
                                                    source={IMAGES.report}
                                                    style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }}
                                                  />
                                                </TouchableOpacity>
                                              )}
                                            </View>
                                          </ListItem.Content>
                                        </View>
                                      }
                                      isExpanded={this.state.openExpand === item?.id}
                                      containerStyle={[styles.listItem, styles.borderBottomNull]}
                                      noIcon={true}
                                    >
                                      {item?.subtasks?.map(val => {
                                        return (
                                          <View style={[styles.listItem, styles.listItemBg, styles.subListItem, { marginTop: 0 }]}>
                                            <TouchableOpacity
                                              style={[styles.left, { marginRight: 0 }]}
                                              onPress={() => this.handleTasks(val.id, item?.id)}
                                            >
                                              <Image
                                                source={val?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                                style={styles.subListIcon}
                                              />
                                            </TouchableOpacity>
                                            <View style={[styles.body, { paddingLeft: 10 }]}>
                                              <Text style={styles.h6}>{val?.title}</Text>
                                            </View>
                                          </View>
                                        );
                                      })}
                                    </ListItem.Accordion>
                                  </Swipeout>
                                </View>
                              );
                            }}
                            renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeaderTitle}>{title}</Text>}
                          />
                        ) : (
                          <View style={{ flex: 1 }}>
                            {/* {!this?.props?.taskListId?.data?.length != 0 &&
                          (!this?.props?.taskListId?.data?.[0]?.data?.length ||
                            !this?.props?.taskListId?.data?.[1]?.data?.length ||
                            !this?.props?.taskListId?.data?.[2]?.data?.length) ? ( */}
                            <NoDataFound
                              title="Nothing to see"
                              text="You don’t have any Tasks yet"
                              titleColor={theme?.colors?.GRAY_50}
                              textColor={theme?.colors?.GRAY_100}
                              titleFontSize={20}
                              source={IMAGES.noChatImage}
                              imageWidth={205}
                              imageHeight={156}
                            />
                            {/* ) */}
                            {/* : null} */}
                          </View>
                        )}

                        <View style={styles.chatFooter}>
                          <View style={styles.footerIconRow}>
                            <View style={styles.footerIconColLeft}>
                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => {
                                  this.setState({
                                    // tabTopName: 'chat',
                                    isEvent: false,
                                    isTask: false,
                                  });
                                  this?.props?.CurrentTabName('chat');
                                }}
                              >
                                <Icon2 name="message-square" style={[styles.footerIcon]} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => this.props.navigation.navigate('CREATE_TASK', { groupId: this.state.tabGroupId })}
                              >
                                <Icon name="calendar-outline" style={styles.footerIcon} />
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.footerIconBtn}>
                                <Icon3 name="graph-horizontal" style={styles.footerIcon} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.footerIconBtn}
                                onPress={() => this.props.navigation.navigate('NEW_TASK', { groupId: this.state.tabGroupId })}
                              >
                                <Icon name="checkbox-outline" style={styles.footerIcon} />
                              </TouchableOpacity>
                              {/* <TouchableOpacity
                      style={styles.footerIconBtn}
                      onPress={() =>
                        this.props.navigation.navigate('NEW_CATEGORY', {
                          groupTitle: this?.state?.groupTitle,
                          // selectUser: this?.state?.selectUser,
                          detail: this?.state?.detail,
                          groupId: this?.state?.groupId,
                        })
                      }
                    >
                      <Icon2 name="hash" style={styles.footerIcon} />
                    </TouchableOpacity> */}
                            </View>
                            <View style={styles.footerIconColRight} />
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : this?.props?.cTabName === 'polls' ? (
                  // ) : this.state.tabTopName === 'polls' ? (
                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.pollTabRow}>
                        <TouchableOpacity
                          style={this.state.pollTab === 'activePoll' ? styles.pollTabBtnActive : styles.pollTabBtn}
                          onPress={() => this.setState({ pollTab: 'activePoll' })}
                        >
                          <Text style={this.state.pollTab === 'activePoll' ? styles.pollTabTxtActive : styles.pollTabTxt}>
                            Active Polls
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={this.state.pollTab === 'compeleted' ? styles.pollTabBtnActive : styles.pollTabBtn}
                          onPress={() => this.setState({ pollTab: 'compeleted' })}
                        >
                          <Text style={this.state.pollTab === 'compeleted' ? styles.pollTabTxtActive : styles.pollTabTxt}>Completed</Text>
                        </TouchableOpacity>
                      </View>

                      {this.state.pollTab === 'activePoll' ? (
                        <FlatList
                          refreshControl={
                            <RefreshControl
                              tintColor={theme?.colors?.WHITE}
                              refreshing={this.state.isRefreshing}
                              onRefresh={() => this.onRefresh()}
                            />
                          }
                          data={this?.props?.pollList?.data || []}
                          contentContainerStyle={{ padding: 15 }}
                          onEndReached={() => {
                            if (
                              (this?.props?.pollList?.total_pages !== 1) & !this.state.isMoreLoading &&
                              this?.props?.pollList?.total_count !== this.props?.pollList?.data.length
                            ) {
                              this.setState({ loading: true });
                              this.getPollList();
                            }
                          }}
                          renderItem={({ item, index }) =>
                            item?.is_complete === 0 && (
                              <TouchableOpacity
                                style={[styles.pollCard, { marginTop: 15 }]}
                                onPress={() => this.props.navigation.navigate('POLL', { pollId: item?.id })}
                              >
                                <View style={styles.polluserRow}>
                                  <Image source={{ uri: item?.createdBy?.image }} style={styles.polluserImg} />
                                  {this.props.userData?.userInfo?.id === item?.createdBy?.id ? (
                                    <Text style={styles.polluserTxt}>
                                      Asked by <Text style={styles.polluserTxtInner}> You</Text>
                                    </Text>
                                  ) : (
                                    <Text style={styles.polluserTxt}>
                                      Asked by <Text style={styles.polluserTxtInner}>{item?.createdBy?.name}</Text>
                                    </Text>
                                  )}
                                </View>
                                <View style={styles.pollVoteRow}>
                                  <Text style={styles.pollVoteTxt}>Created in {item?.group_title}</Text>
                                </View>
                                <Text style={styles.pollCardTitle}>{item?.question}</Text>
                                {item?.options?.map(option =>
                                  item?.createdBy?.id === this.props.userData.userInfo.id ? (
                                    <TouchableOpacity
                                      disabled={item?.is_answered === 1 && true}
                                      // style={styles.pollProgress}
                                      onPress={() => {
                                        this.pollVote(item?.id, option?.id);
                                      }}
                                    >
                                      {option?.isMyAnswer === 1 ? (
                                        <View style={styles.pollProgress}>
                                          <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={[styles.pollProgressTxt]}>{option?.answer}</Text>

                                            <Image source={IMAGES.checkIcon2} style={{ marginLeft: 5, height: 20, width: 20, zIndex: 1 }} />
                                          </View>
                                          <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                          <View
                                            style={[
                                              styles.pollProgressView,
                                              { width: `${String(option?.vote_percentage).split('.')[0]}%` },
                                            ]}
                                          />
                                        </View>
                                      ) : (
                                        <View style={styles.pollProgress}>
                                          <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={[styles.pollProgressTxt]}>{option?.answer}</Text>
                                          </View>
                                          <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                          <View
                                            style={[
                                              styles.pollProgressView,
                                              { width: `${String(option?.vote_percentage).split('.')[0]}%` },
                                            ]}
                                          />
                                        </View>
                                      )}
                                    </TouchableOpacity>
                                  ) : item?.is_hide_result && item?.is_everyone_voted ? (
                                    <TouchableOpacity
                                      disabled={item?.is_answered === 1 && true}
                                      // style={styles.pollProgress}
                                      onPress={() => {
                                        this.pollVote(item?.id, option?.id);
                                      }}
                                    >
                                      {option?.isMyAnswer === 1 ? (
                                        <View style={styles.pollProgress}>
                                          <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={[styles.pollProgressTxt]}>{option?.answer}</Text>

                                            <Image source={IMAGES.checkIcon2} style={{ marginLeft: 5, height: 20, width: 20, zIndex: 1 }} />
                                          </View>
                                          <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                          <View
                                            style={[
                                              styles.pollProgressView,
                                              { width: `${String(option?.vote_percentage).split('.')[0]}%` },
                                            ]}
                                          />
                                        </View>
                                      ) : (
                                        <View style={styles.pollProgress}>
                                          <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <Text style={[styles.pollProgressTxt]}>{option?.answer}</Text>
                                          </View>
                                          <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                          <View
                                            style={[
                                              styles.pollProgressView,
                                              { width: `${String(option?.vote_percentage).split('.')[0]}%` },
                                            ]}
                                          />
                                        </View>
                                      )}
                                    </TouchableOpacity>
                                  ) : (
                                    <TouchableOpacity
                                      disabled={item?.is_answered === 1 && true}
                                      // style={styles.pollProgress}
                                      onPress={() => {
                                        this.pollVote(item?.id, option?.id);
                                      }}
                                    >
                                      <View style={styles.pollProgress}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={[styles.pollProgressTxt]}>{option?.answer}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ),
                                )}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <View style={styles.pollVoteRow}>
                                    <Text style={styles.pollVoteTxt}>Posted on {`${moment(item?.created_at).format('L')}`}</Text>
                                    {item?.total_votes !== 0 ? (
                                      <Text style={styles.pollVoteTxt}>
                                        {item?.total_votes} {item?.total_votes === 1 ? 'Vote' : 'Votes'}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View>
                                    {this.props.userData?.userInfo?.id === item?.createdBy?.id ? null : (
                                      <TouchableOpacity onPress={() => this.handleReportPoll(item?.id)}>
                                        <Image source={IMAGES.report} style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }} />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )
                          }
                          ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                          keyExtractor={(id, index) => index.toString()}
                        />
                      ) : (
                        <FlatList
                          refreshControl={
                            <RefreshControl
                              tintColor={theme?.colors?.WHITE}
                              refreshing={this.state.isRefreshing}
                              onRefresh={() => this.onRefresh()}
                            />
                          }
                          data={this?.props?.pollList?.data || []}
                          contentContainerStyle={{ padding: 15 }}
                          onEndReached={() => {
                            if (
                              (this?.props?.pollList?.total_pages !== 1) & !this.state.isMoreLoading &&
                              this?.props?.pollList?.total_count !== this.props?.pollList?.data.length
                            ) {
                              this.setState({ loading: true });
                              this.getPollList();
                            }
                          }}
                          renderItem={({ item, index }) =>
                            item?.is_complete === 1 && (
                              <TouchableOpacity
                                style={[styles.pollCard, { marginTop: 15 }]}
                                onPress={() => this.props.navigation.navigate('POLL', { pollId: item?.id })}
                              >
                                <View style={styles.polluserRow}>
                                  <Image source={{ uri: item?.createdBy?.image }} style={styles.polluserImg} />
                                  {this.props.userData?.userInfo?.id === item?.createdBy?.id ? (
                                    <Text style={styles.polluserTxt}>
                                      Asked by<Text style={styles.polluserTxtInner}> You</Text>
                                    </Text>
                                  ) : (
                                    <Text style={styles.polluserTxt}>
                                      Asked by <Text style={styles.polluserTxtInner}>{item?.createdBy?.name}</Text>
                                    </Text>
                                  )}
                                </View>
                                <View style={styles.pollVoteRow}>
                                  <Text style={styles.pollVoteTxt}>Created in {item?.group_title}</Text>
                                </View>
                                <Text style={styles.pollCardTitle}>{item?.question}</Text>

                                {item?.options?.map(option => (
                                  <TouchableOpacity
                                    disabled={true}
                                    // style={styles.pollProgress}
                                    onPress={() => {
                                      this.pollVote(item?.id, option?.id);
                                    }}
                                  >
                                    {option?.isMyAnswer === 1 ? (
                                      <View style={styles.pollProgress}>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                          <Text style={[styles.pollProgressTxt, { paddingRight: 0 }]}>{option?.answer}</Text>
                                          <Image source={IMAGES.checkIcon2} style={{ height: 20, width: 20, zIndex: 1 }} />
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </View>
                                    ) : (
                                      <View style={styles.pollProgress}>
                                        <View style={{ flex: 1 }}>
                                          <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                        </View>
                                        <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                        <View
                                          style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                        />
                                      </View>
                                    )}
                                  </TouchableOpacity>
                                ))}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <View style={styles.pollVoteRow}>
                                    <Text style={styles.pollVoteTxt}>Posted on {`${moment(item?.created_at).format('L')}`}</Text>
                                    {item?.total_votes !== 0 ? (
                                      <Text style={styles.pollVoteTxt}>
                                        {item?.total_votes} {item?.total_votes === 1 ? 'Vote' : 'Votes'}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View>
                                    {this.props.userData?.userInfo?.id === item?.createdBy?.id ? null : (
                                      <TouchableOpacity onPress={() => this.handleReportPoll(item?.id)}>
                                        <Image source={IMAGES.report} style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }} />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )
                          }
                          ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                          keyExtractor={(id, index) => index.toString()}
                        />
                      )}
                    </View>

                    {this?.props?.chatDetail?.members?.length === 2 ? (
                      <TouchableOpacity
                        style={styles.fabButton}
                        onPress={() => {
                          this?.props?.CurrentTabName('chat');
                          this.setState({ pollText: true });
                        }}
                      >
                        {/* <TouchableOpacity style={styles.fabButton} onPress={() => {this.setState({ tabTopName: 'chat', pollText: true })}}> */}
                        <Image source={IMAGES.addPoll} style={styles.fabButtonIcon} />
                      </TouchableOpacity>
                    ) : (
                      this?.props?.chatDetail?.members?.map(val =>
                        val?.user_id === this?.props?.userData?.userInfo?.id && val?.is_moderator === 1 ? (
                          <TouchableOpacity
                            style={styles.fabButton}
                            onPress={() => {
                              this?.props?.CurrentTabName('chat');
                              this.setState({ pollText: true });
                            }}
                          >
                            {/* <TouchableOpacity style={styles.fabButton} onPress={() => {this.setState({ tabTopName: 'chat', pollText: true })}}> */}
                            <Image source={IMAGES.addPoll} style={styles.fabButtonIcon} />
                          </TouchableOpacity>
                        ) : null,
                      )
                    )}
                  </View>
                ) : this?.props?.cTabName === 'categoryEvent' ? (
                  this?.state?.isLoaderEvent === false ? (
                    this?.props?.eventListID?.length ? (
                      <>
                        <View style={styles.tabHeader}>
                          <TouchableOpacity
                            style={[styles.buttonStyle, this.state.tabName == 'general' ? styles.selectTabStyle : null]}
                            onLongPress={() => this.setState({ isGroupPopup: true })}
                            onPress={() => {
                              this.setState({
                                tabName: 'general',
                                // tabGroupId: this?.state?.groupId,
                                chatId: this?.props?.route?.params?.chat_id,
                                groupId: this?.props?.route?.params?.groupId,
                              });
                              this?.props?.navigation?.setParams({
                                subTabName: 'general',
                              });

                              this.getChatDetail(this.props?.route?.params?.chat_id);
                              this.getMessageList(this.props?.route?.params?.chat_id, this.state.page);
                              this.getReadChat(this.props?.route?.params?.chat_id);
                              this.handleGroupDetailId(this?.state?.groupId);
                              this.handleGroupDetail(this.state.groupId);
                            }}
                          >
                            <ScrollView contentContainerStyle={[styles.ScrollView, { padding: 10 }]}>
                              {/* <Icon4 name="bowling" style={styles.holdBtnIcon} /> */}
                              <Image source={IMAGES.categories_icon} style={[styles.holdBtnImg]} resizeMode={'contain'} />
                              {/* <Text style={[styles.titleStyle, this.state.tabName == 'general' ? styles.titleActiveStyle : null]}>General</Text> */}
                            </ScrollView>
                          </TouchableOpacity>
                          <FlatList
                            // data={this?.state?.groupDetailA?.subgroups || []}
                            data={this?.props?.groupDetailA?.subgroups || []}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ref={this?.groupRed}
                            getItemLayout={(data, index) => ({
                              length: 100,
                              offset: 100 * index,
                              index,
                            })}
                            contentContainerStyle={{ paddingLeft: 15 }}
                            renderItem={({ item, index }) => (
                              <View>
                                {this?.props?.route?.params?.isArchived === true ? (
                                  <TouchableOpacity
                                    style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                    onPress={() => {
                                      this.setState({
                                        tabName: item?.title,
                                        subIndex: index,
                                        tabGroupId: item?.id,
                                        chatId: item?.chat_id,
                                        tabChatId: item?.chat_id,
                                        channel: item?.channel,
                                      });
                                      this?.groupRed?.current.scrollToIndex({
                                        index: index,
                                        viewPosition: 0.5,
                                      });
                                      this?.props?.navigation?.setParams({
                                        subTabName: item?.title,
                                        subIndex: index,
                                      });
                                      this.offUserEvent();
                                      setTimeout(() => {
                                        this.connectionChat(item?.channel);
                                        this.getChatDetail(item?.chat_id);
                                        this.handleGroupDetailId(item?.id);
                                        this.getReadChat(item?.chat_id);
                                        this.getMessageList(item?.chat_id, this.state.page);
                                      }, 500);
                                    }}
                                  >
                                    <View style={{ padding: 10, flexDirection: 'row' }}>
                                      {item?.is_private === 1 ? (
                                        <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                      ) : null}
                                      <Text style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}>
                                        {item?.title?.length > 6 ? item?.title.slice(0, 6).concat('...') : item?.title}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View>
                                    {item?.isArchive === 0 && (
                                      <>
                                        <TouchableOpacity
                                          style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                          onPress={() => {
                                            this.setState({
                                              tabName: item?.title,
                                              subIndex: index,
                                              tabGroupId: item?.id,
                                              chatId: item?.chat_id,
                                              tabChatId: item?.chat_id,
                                              channel: item?.channel,
                                            });
                                            this?.groupRed?.current.scrollToIndex({
                                              index: index,
                                              viewPosition: 0.5,
                                              animated: true,
                                            });
                                            this?.props?.navigation?.setParams({
                                              subTabName: item?.title,
                                              subIndex: index,
                                            });
                                            this.offUserEvent();
                                            setTimeout(() => {
                                              this.connectionChat(item?.channel);
                                              // this.offUserEvent();
                                              this.getChatDetail(item?.chat_id);
                                              this.handleGroupDetailId(item?.id);
                                              this.getReadChat(item?.chat_id);
                                              this.getMessageList(item?.chat_id, this.state.page);
                                            }, 500);
                                          }}
                                        >
                                          <View style={{ padding: 10, flexDirection: 'row' }}>
                                            {item?.is_private === 1 ? (
                                              <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                            ) : null}
                                            <Text
                                              style={[
                                                styles.titleStyle,
                                                this.state.tabName == item?.title ? styles.titleActiveStyle : null,
                                              ]}
                                            >
                                              {item?.title?.length > 6 && this?.state?.tabName !== item?.title
                                                ? item?.title.slice(0, 6).concat('...')
                                                : item?.title}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      </>
                                    )}
                                  </View>
                                )}
                              </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                            keyExtractor={(id, index) => index.toString()}
                          />
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <ScrollView>
                            <FlatList
                              data={this.props.eventListID || []}
                              renderItem={(item, index) => {
                                return (
                                  <EventCard
                                    item={item?.item?.event}
                                    containerStyle={{ marginHorizontal: Responsive.getWidth(5) }}
                                    navigation={this?.props?.navigation}
                                    groupName={this?.state?.groupTitle}
                                    subGroupName={this?.state?.tabName}
                                  />
                                );
                              }}
                            />
                          </ScrollView>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.tabHeader}>
                          <TouchableOpacity
                            style={[styles.buttonStyle, this.state.tabName == 'general' ? styles.selectTabStyle : null]}
                            onLongPress={() => this.setState({ isGroupPopup: true })}
                            onPress={() => {
                              this.setState({
                                tabName: 'general',
                                // tabGroupId: this?.state?.groupId,
                                chatId: this?.props?.route?.params?.chat_id,
                                groupId: this?.props?.route?.params?.groupId,
                              });
                              this?.props?.navigation?.setParams({
                                subTabName: 'general',
                              });

                              this.getChatDetail(this.props?.route?.params?.chat_id);
                              this.getMessageList(this.props?.route?.params?.chat_id, this.state.page);
                              this.getReadChat(this.props?.route?.params?.chat_id);
                              this.handleGroupDetailId(this?.state?.groupId);
                              this.handleGroupDetail(this.state.groupId);
                            }}
                          >
                            <ScrollView contentContainerStyle={[styles.ScrollView, { padding: 10 }]}>
                              {/* <Icon4 name="bowling" style={styles.holdBtnIcon} /> */}
                              <Image source={IMAGES.categories_icon} style={[styles.holdBtnImg]} resizeMode={'contain'} />
                              {/* <Text style={[styles.titleStyle, this.state.tabName == 'general' ? styles.titleActiveStyle : null]}>General</Text> */}
                            </ScrollView>
                          </TouchableOpacity>
                          <FlatList
                            // data={this?.state?.groupDetailA?.subgroups || []}
                            data={this?.props?.groupDetailA?.subgroups || []}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ref={this?.groupRed}
                            getItemLayout={(data, index) => ({
                              length: 100,
                              offset: 100 * index,
                              index,
                            })}
                            contentContainerStyle={{ paddingLeft: 15 }}
                            renderItem={({ item, index }) => (
                              <View>
                                {this?.props?.route?.params?.isArchived === true ? (
                                  <TouchableOpacity
                                    style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                    onPress={() => {
                                      this.setState({
                                        tabName: item?.title,
                                        subIndex: index,
                                        tabGroupId: item?.id,
                                        chatId: item?.chat_id,
                                        tabChatId: item?.chat_id,
                                        channel: item?.channel,
                                      });
                                      this?.groupRed?.current.scrollToIndex({
                                        index: index,
                                        viewPosition: 0.5,
                                      });
                                      this?.props?.navigation?.setParams({
                                        subTabName: item?.title,
                                        subIndex: index,
                                      });
                                      this.offUserEvent();
                                      setTimeout(() => {
                                        this.connectionChat(item?.channel);
                                        this.getChatDetail(item?.chat_id);
                                        this.handleGroupDetailId(item?.id);
                                        this.getReadChat(item?.chat_id);
                                        this.getMessageList(item?.chat_id, this.state.page);
                                      }, 500);
                                    }}
                                  >
                                    <View style={{ padding: 10, flexDirection: 'row' }}>
                                      {item?.is_private === 1 ? (
                                        <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                      ) : null}
                                      <Text style={[styles.titleStyle, this.state.tabName == item?.title ? styles.titleActiveStyle : null]}>
                                        {item?.title?.length > 6 ? item?.title.slice(0, 6).concat('...') : item?.title}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View>
                                    {item?.isArchive === 0 && (
                                      <>
                                        <TouchableOpacity
                                          style={[styles.buttonStyle, this.state.tabName == item?.title ? styles.selectTabStyle : null]}
                                          onPress={() => {
                                            this.setState({
                                              tabName: item?.title,
                                              subIndex: index,
                                              tabGroupId: item?.id,
                                              chatId: item?.chat_id,
                                              tabChatId: item?.chat_id,
                                              channel: item?.channel,
                                            });
                                            this?.groupRed?.current.scrollToIndex({
                                              index: index,
                                              viewPosition: 0.5,
                                              animated: true,
                                            });
                                            this?.props?.navigation?.setParams({
                                              subTabName: item?.title,
                                              subIndex: index,
                                            });
                                            this.offUserEvent();
                                            setTimeout(() => {
                                              this.connectionChat(item?.channel);
                                              // this.offUserEvent();
                                              this.getChatDetail(item?.chat_id);
                                              this.handleGroupDetailId(item?.id);
                                              this.getReadChat(item?.chat_id);
                                              this.getMessageList(item?.chat_id, this.state.page);
                                            }, 500);
                                          }}
                                        >
                                          <View style={{ padding: 10, flexDirection: 'row' }}>
                                            {item?.is_private === 1 ? (
                                              <Image source={IMAGES.mini} style={[styles.subListIcon, { marginRight: 5 }]} />
                                            ) : null}
                                            <Text
                                              style={[
                                                styles.titleStyle,
                                                this.state.tabName == item?.title ? styles.titleActiveStyle : null,
                                              ]}
                                            >
                                              {item?.title?.length > 6 && this?.state?.tabName !== item?.title
                                                ? item?.title.slice(0, 6).concat('...')
                                                : item?.title}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      </>
                                    )}
                                  </View>
                                )}
                              </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                            keyExtractor={(id, index) => index.toString()}
                          />
                        </View>
                        <NoDataFound
                          title="Nothing to see"
                          text="You don’t have any Event yet"
                          titleColor={theme?.colors?.GRAY_50}
                          textColor={theme?.colors?.GRAY_100}
                          titleFontSize={20}
                        />
                      </>
                    )
                  ) : null
                ) : null}
              </KeyboardAwareScrollView>
            </View>
          ) : null}

          <ImageView
            images={this?.state?.images || []}
            imageIndex={this?.state?.visible?.index}
            visible={this?.state?.visible?.visible}
            onRequestClose={() => this.setState({ visible: false })}
            backgroundColor="black"
            HeaderComponent={() => (
              <SafeAreaView>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => this.setState({ visible: false })}>
                      <Image source={IMAGES.backArrow} style={styles.headerIcon} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerBody}></View>
                </View>
              </SafeAreaView>
            )}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.replyModal}
            onRequestClose={() => {
              this.setState({
                replyModal: !this.state.replyModal,
              });
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ replyModal: false })}>
              <View style={[styles.modalContainer, { alignItems: 'flex-end' }]}>
                <View
                  style={[
                    styles.modalView,
                    {
                      maxWidth: 200,
                      paddingHorizontal: 0,
                      backgroundColor: theme?.colors?.GRAY_300,
                      paddingVertical: Responsive.getWidth(2),
                    },
                  ]}
                >
                  <View style={[styles.replyModalTextRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.modalText}>{moment(this?.state?.replyTime, ['h:mm A']).utc().format('h:mm A')}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this?.textInputRef?.current?.focus();
                      this.setState({ replyModal: false, msgReply: true });
                    }}
                    style={styles.replyModalTextRow}
                  >
                    <Text style={styles.modalText}>Reply</Text>
                    {/* <Icon name={'star'} style={styles.modalText} /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.getConnectionDetails(this?.state?.replyData.id);
                      this.setState({
                        replyModal: false,
                      });
                    }}
                    style={[styles.replyModalTextRow]}
                  >
                    <Text style={styles.modalText}>DM Reply </Text>
                    {/* <Icon name={'star'} style={styles.modalText} /> */}
                  </TouchableOpacity>

                  {this?.state.isCopyMsg ? (
                    <TouchableOpacity
                      onPress={() => {
                        // Clipboard.setString(this?.state?.replyPoll);
                        Clipboard.setString(this?.state?.replyMessage);
                        this.setState({
                          replyModal: false,
                          isCopyMsg: false,
                        });
                      }}
                      style={[styles.replyModalTextRow]}
                    >
                      <Text style={styles.modalText}>Copy</Text>
                      {/* <Icon name={'star'} style={styles.modalText} /> */}
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => {
                      // this.getConnectionDetails(this?.state?.replyData.id);
                      this.setState({ replyModal: false, modalForReportMessage: true });
                    }}
                    style={[styles.replyModalTextRow, { borderBottomWidth: 0 }]}
                  >
                    <Text style={styles.modalText}>Report</Text>
                    {/* <Icon name={'star'} style={styles.modalText} /> */}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* STRAT REPORT MODAL */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalForReportMessage}
            onRequestClose={() => {
              this.setState({
                modalForReportMessage: false,
              });
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ modalForReportMessage: false })}>
              <KeyboardAwareScrollView
                // keyboardDismissMode="none"
                keyboardShouldPersistTaps="handled"
                bounces={false}
                contentContainerStyle={{ flex: 1 }}
                // extraScrollHeight={Responsive.getHeight(8)}
                enableAutomaticScroll={true}
                enableOnAndroid={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.reportModalContainer}>
                  <View style={styles.reportModalView}>
                    <View style={styles.modalTopLine} />
                    <Text style={[styles.modalTitle2]}>Report Message</Text>
                    <Text style={[styles.inputLebal]}>Report</Text>
                    <TextInput
                      placeholder="Enter your reason here"
                      style={styles.reportInput}
                      onChangeText={text =>
                        this.setState({
                          reportText: text.trim(),
                        })
                      }
                    />
                    <Button
                      style={styles.marginTop}
                      buttonStyle={styles.button}
                      title={'Submit'}
                      titleStyle={styles.buttonText}
                      onPress={() => (this?.state?.reportText.trim() ? this?.onReportMessageHandler() : null)}
                    />
                    <Button
                      style={styles.marginTop}
                      buttonStyle={[styles.button, { backgroundColor: 'grey' }]}
                      title={'Cancel'}
                      titleStyle={styles.buttonText}
                      onPress={() => this.setState({ modalForReportMessage: false })}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
          </Modal>
          {/* STRAT REPORT MODAL */}

          <LikeUserModal
            visible={this?.state?.likeModal}
            userList={this?.state?.likeUserList}
            likeMessage={this?.state?.likeMessage}
            inVisible={() => this.setState({ likeModal: false })}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.addToCalendarEvent}
            onRequestClose={() => {
              this.setState({
                addToCalendarEvent: !this.state.addToCalendarEvent,
              });
            }}
          >
            <View style={styles.addToCalenderModal}>
              <View style={styles.calendarView}>
                <TouchableOpacity
                  onPress={() => {
                    this.addToCalendarEvent(),
                      this.setState({
                        addToCalendarEvent: false,
                      });
                  }}
                >
                  <Text style={styles.modalText}>Add to Calendar</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.modalView, { marginTop: 15 }]}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      addToCalendarEvent: false,
                    })
                  }
                >
                  <Text style={[styles.modalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state?.redState?.userData,
    groupDetail: state?.groupState?.groupDetail,
    message: state?.groupState?.message,
    eventListID: state?.eventState?.eventListID,
    taskListId: state?.dashboardState?.taskListId,
    chatDetail: state?.groupState?.chatDetail,
    pollList: state?.pollState?.pollList,
    groupDetailA: state?.groupState?.groupDetailA,
    cTabName: state?.groupState?.cTabName,
    dashboardList: state?.dashboardState?.dashboardList,
    chatDetails: state?.groupState?.chatDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationScreen);
const customPickerStyles = theme =>
  StyleSheet.create({
    inputIOS: {
      color: theme?.colors?.WHITE,
      // fontSize: Responsive.getWidth(23),
    },
    inputAndroid: {
      color: theme?.colors?.WHITE,
      // paddingLeft: Responsive.getWidth(35),
      // width: Responsive.getWidth(50),
    },
  });
