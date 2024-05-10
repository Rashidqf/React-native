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
  Platform,
  ImageBackground,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  SectionList,
  Alert,
  BackHandler,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import ImagePicker from 'react-native-image-crop-picker';
import { convertTimeStamp } from '@utils';
import NoDataFound from '../../components/noDataFound';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import ImageView from 'react-native-image-viewing';
import Clipboard from '@react-native-community/clipboard';
import { AppContext } from '../../themes/AppContextProvider';
import Hyperlink from 'react-native-hyperlink';
import AnimatedLottieView from 'lottie-react-native';
import Video from 'react-native-video';

let echo;

class OneToOneConversationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.flatListRef = React.createRef();
    this.textInputRef = React.createRef();
    this.state = {
      sidenotViewData: [{}],

      channel: this?.props?.route?.params?.channel,
      chatId: this?.props?.route?.params?.chat_id,
      message: '',
      imagePick: '',
      isShowPicker: false,
      like: 0,
      separator: false,
      separatorDate: '',
      loading: false,
      currentPage: 1,
      isRefresh: false,
      modalVisible: false,
      subIndex: null,
      messageDetails: [],
      page: 1,
      userProfile: this?.props?.route?.params?.profileDetail,
      tempId: '',
      images: [],
      visible: { index: 0, visible: false },
      chatDetail: '',
      state: this?.props?.route?.params?.state,
      msgReply: false,
      msgId: this?.props?.route?.params?.msgId,
      replyMessage: this?.props?.route?.params?.replyMessage,
      replyPoll: this?.props?.route?.params?.replyPoll,
      replyEvent: this?.props?.route?.params?.replyEvent,
      replyTask: this?.props?.route?.params?.replyTask,
      replyMedia: this?.props?.route?.params?.replyMedia,
      is_block: this?.props?.route?.params?.is_block,
      isUserTyping: false,
      typingUserData: null,
      alreadyTyping: false,
      sixtySecondsExceeded: false,
      videoURL: '',
      isFullScreen: true,
    };
  }
  static contextType = AppContext;

  timeoutForTyping = null;
  timeoutForTyping2 = null;
  sixtySecondsTimer = null;

  componentDidMount() {
    // this.handleGroupDetail();

    this.connectionChat();
    this.props.stateClear();
    setTimeout(() => {
      this.getMessageList();
    }, 1000);
    this.getChatDetail();
    // this.onImageEffect();
    this.getReadChat(this.state.userProfile.chat_id);
    if (this.props.route?.params?.fromChatProfile === true) {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
  }

  onImageEffect = () => {
    if (this?.state?.chatDetail?.media) {
      const finalArr = this?.state?.chatDetail?.media?.map(val => {
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

  getChatDetail = () => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: this.state.userProfile.chat_id,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              if (resp.success) {
                this.setState({ chatDetail: resp?.data });
                this.onImageEffect();
                this.props.getChatDetail(resp?.data);
              } else {
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
        contentType: 'application/json',
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
  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
        contentType: 'application/json',
      };

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
                // this.getChatList();
                this.getDashboardList();
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
  userTyping(typing) {
    try {
      const params = {
        url: API_DATA.USERTYPING,
        data: {
          is_typing: typing,
          chat_id: this.state.userProfile.chat_id,
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
  getMessageList = (chat_Id, page) => {
    const chat_id = chat_Id !== undefined ? chat_Id : this.state.userProfile.chat_id;
    try {
      const params = {
        url: `${API_DATA.MESSAGELIST}?page=${this.state.currentPage}`,
        data: {
          chat_id: this.state.userProfile.chat_id,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token).then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[`${API_DATA.MESSAGELIST}?page=${this.state.currentPage}`];
            if (resp.success) {
              if (this.state.currentPage === 1) {
                this.setState({ messageDetails: resp });
                this.props.messageList(resp);
              } else {
                this.props.messageListLoadMore(resp);
                this.setState({ isMoreLoading: false });
              }
              this.setState({
                currentPage: this.state.currentPage + 1,
                isRefresh: false,
              });
              // const data = [];
              // resp.data.forEach((element, index) => {
              //   const postCreateDate = moment(element.message_at);
              //   const nowDate = moment(resp.data[index + 1]?.message_at);
              //   const diffTime = nowDate.diff(postCreateDate, 'days');
              //   if (diffTime > 0) {
              //     console.log(diffTime);
              //     data.push({ separator: true, separatorDate: nowDate });
              //  s   data.push(element);
              //     // this.setState({ separator: true, separatorDate: nowDate });
              //   } else {
              //     data.push(element);
              //   }
              // });
              // this.props.messageList({
              //   ...resp,
              //   data,
              // });
            } else {
              // this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        }, 500);
      }, 500);
    } catch (e) {}
  };

  onUserEvent = data => {
    let tempId = Math.round(new Date().getTime() / 1000);
    if (data.type === 'new_message') {
      const replyMedia = data?.tag_media === '' ? '' : JSON.parse(data?.tag_media);

      if (this.props.userData.userInfo.id !== data.sender.id) {
        this?.props?.appendGroupMessage({ ...data, is_liked: 0, is_read: 1, tag_media: replyMedia });
        this?.setState({
          images: [{ uri: data?.media[0] }, ...this.state.images],
        });
        this.getReadChat(data.chat_id);
      } else {
        this?.props?.updateCreateGroupMessage(this.state.tempId, data.message_id, data.chat_id, data);
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

  connectionChat = () => {
    echo = new Echo({
      host: 'https://sortapp.mobileapphero.com:6001',
      broadcaster: 'socket.io',
      client: socketio,
    });
    const Channel = this.state.userProfile.channel !== undefined && this.state.userProfile.channel;
    echo.channel(Channel).listen('.UserEvent', this.onUserEvent);
    echo.connector.socket.on('connect', function () {
      console.log('connected', echo.socketId());
    });
    echo.connector.socket.on('disconnect', function () {});
    echo.connector.socket.on('reconnecting', function (attemptNumber) {});
    echo.connector.socket.on('error', function () {});
  };

  componentWillUnmount() {
    this.userTyping(0);
    echo.connector.socket.off('connect');
    echo.connector.socket.off('conndisconnectect');
    echo.connector.socket.off('reconnecting');
    echo.disconnect();
    // this.offUserEvent();
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

  sendMessage = () => {
    const tempId = Math.round(new Date().getTime() / 1000);
    try {
      const params = {
        url: API_DATA.ONETOONEMSGSEND,
        data: this.state.imagePick
          ? {
              connection_id: this.state.userProfile?.connection_id,
              message: this.state.message.trim(),
              tag_message_id: this.state.msgId !== undefined ? this.state.msgId : '',
              ['medias[0]']: this.state.imagePick,
            }
          : {
              connection_id: this.state.userProfile?.connection_id,
              tag_message_id: this.state.msgId !== undefined ? this.state.msgId : '',
              message: this.state.message.trim(),
            },
      };

      const messageObj = this.state.imagePick
        ? {
            media: [this.state.imagePick.uri],
            message: this.state.message.trim(),
            tempId,
            tag_message: this?.state.replyMessage !== false && this?.state.replyMessage !== undefined ? this?.state.replyMessage : '',
            tag_media: this?.state.replyMedia !== [] && this?.state.replyMedia !== undefined ? this?.state.replyMedia : '',
            is_liked: 0,
            sender: {
              ...this.props?.userData?.userInfo,
            },
            poll: this.state.replyPoll ? this.state.replyPoll : [],
            event: this.state.replyEvent ? this.state.replyEvent : [],
            task: this.state.replyTask ? this.state.replyTask : [],
          }
        : {
            message: this.state.message.trim(),
            tempId,
            tag_message: this?.state.replyMessage !== false && this?.state.replyMessage !== undefined ? this?.state.replyMessage : '',
            tag_media: this?.state.replyMedia !== [] && this?.state.replyMedia !== undefined ? this?.state.replyMedia : '',
            is_liked: 0,
            sender: {
              ...this.props?.userData?.userInfo,
            },
            poll: this.state.replyPoll ? this.state.replyPoll : [],
            event: this.state.replyEvent ? this.state.replyEvent : [],
            task: this.state.replyTask ? this.state.replyTask : [],
          };
      this.setState({ tempId: tempId });
      this.props.createGroupMessage(messageObj);
      this.userTyping(0);
      setTimeout(() => {
        this.setState({
          imagePick: '',
          replyMessage: '',
          replyMedia: [],
          replyEvent: '',
          replyPoll: '',
          replyTask: '',
          sixtySecondsExceeded: false,
        });
        console.log('params one to one', params);
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            let resp = response[API_DATA.ONETOONEMSGSEND];

            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ONETOONEMSGSEND];
              console.log('res one to one', resp);
              if (resp.success) {
                // this?.props?.createGroupMessage(resp.data);
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
    this.setState({ message: '' });
  };

  msgLike = item => {
    let msgId = item.message_id;
    let like = item.is_liked;
    try {
      const params = {
        url: API_DATA.MSGLIKE,
        data: {
          message_id: msgId,
          is_like: like === 0 ? 1 : 0,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              this?.props?.messageLike(msgId);

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
          });
      }, 500);
    } catch (e) {}
  };

  deleteMessage = msgId => {
    try {
      const params = {
        url: API_DATA.MESSAGEDELETE,
        data: {
          message_id: msgId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.MESSAGEDELETE];
              this?.props?.messageDelete(msgId);
              this.getChatList();
              this.getDashboardList();
              if (resp.success) {
                this?.props?.showLoading(false);
              } else {
                // this?.props?.showErrorAlert(localize('ERROR'), resp.message);
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
  handleStartTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };
  handleEndTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };

  _renderSwipeFrontItemGroup = ({ item, index }) => {
    const { theme } = this.context;
    const styles = style(theme);
    const mediaIndex = this?.state?.images?.findIndex(v => {
      return v.uri === item?.media?.[0] || v === item?.images?.[0];
    });
    const rightSwipeOut = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewRight]}>
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
        onPress: () => Clipboard.setString(item?.message),
      },
      {
        text: (
          <TouchableOpacity
            style={[styles.groupWipeoutBtnViewRight]}
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
          <View style={[styles.groupWipeoutBtnViewRight, styles.radiusRight]}>
            <Icon name="arrow-undo-outline" style={styles.swipeIcons} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this.setState({ msgId: item?.message_id, replyMessage: item?.message, replyMedia: item?.media });
        },
      },
    ];
    const rightSwipeWithOutCopy = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewRight]}>
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
            style={[styles.groupWipeoutBtnViewRight]}
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
          <View style={[styles.groupWipeoutBtnViewRight, styles.radiusRight]}>
            <Icon name="arrow-undo-outline" style={styles.swipeIcons} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this.setState({ msgId: item?.message_id, replyMessage: item?.message, replyMedia: item?.media });
        },
      },
    ];
    const leftSwipeOut = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewLeft, styles.radiusLeft]}>
            <Icon name="arrow-redo-outline" style={styles.swipeIcons} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this.setState({ msgId: item?.message_id, replyMessage: item?.message, replyMedia: item?.media });
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
          <View style={[styles.groupWipeoutBtnViewLeft]}>
            <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: theme?.colors?.WHITE }]} source={IMAGES.copy} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => Clipboard.setString(item?.message),
      },
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewLeft]}>
            <Text style={styles.msgTimeTxt}>
              {' '}
              {'sent at '}
              {convertTimeStamp(item?.message_at)}
            </Text>
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {},
      },
    ];
    const LeftSwipeOutWithOutCopy = [
      {
        text: (
          <View style={[styles.groupWipeoutBtnViewLeft, styles.radiusLeft]}>
            <Icon name="arrow-redo-outline" style={styles.swipeIcons} />
          </View>
        ),
        backgroundColor: theme?.colors?.TRANSPARENT,
        onPress: () => {
          this.setState({ msgId: item?.message_id, replyMessage: item?.message, replyMedia: item?.media });
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
          <View style={[styles.groupWipeoutBtnViewLeft]}>
            <Text style={styles.msgTimeTxt}>
              {' '}
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
          <View style={styles.msgContainer}>
            <Swipeout
              right={item?.sender?.id === this.props.userData.userInfo.id ? (item?.message ? rightSwipeOut : rightSwipeWithOutCopy) : null}
              left={item?.sender?.id !== this.props.userData.userInfo.id ? (item?.message ? leftSwipeOut : LeftSwipeOutWithOutCopy) : null}
              autoClose={true}
              backgroundColor={theme?.colors?.TRANSPARENT}
            >
              {this.props.userData.userInfo.id !== item?.sender?.id && (
                <View>
                  {/* START MSG LEFT SIDE */}
                  {item?.message !== '' ? (
                    <View style={styles.msgContainerLeft}>
                      <View style={styles.msgRow}>
                        <View style={styles.senderImgWrap}>
                          <Image source={{ uri: item?.sender?.image }} style={styles.userImg} />
                        </View>
                        <View style={styles.msgTxtBox}>
                          <Text style={styles.msgTimeTxt}>{item?.sender?.name}</Text>
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
                            ) : item?.tag_media?.length ? (
                              <TouchableOpacity style={styles.shareImgView}>
                                <Image
                                  source={item?.tag_media[0] ? { uri: item?.tag_media[0] } : { uri: item?.images[0] }}
                                  style={styles.shareImg}
                                />
                              </TouchableOpacity>
                            ) : item?.poll?.length !== 0 ? (
                              <TouchableOpacity style={styles.pollCard}>
                                <Text style={[styles.chatPollCardTitle]}>{item?.poll?.question}</Text>
                                {item?.poll?.options?.map(option => (
                                  <TouchableOpacity disabled={true} style={styles.pollProgress}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                      <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                    </View>
                                    <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                    <View
                                      style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                    />
                                  </TouchableOpacity>
                                ))}
                              </TouchableOpacity>
                            ) : item?.event?.length !== 0 ? (
                              <TouchableOpacity style={styles.eventView}>
                                <View style={styles.eventDateView}>
                                  <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                                  <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                                </View>
                                <View style={styles.eventDetail}>
                                  <Text style={styles.eventTitle2}>
                                    {item?.event?.title.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
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
                            ) : item?.task?.length !== 0 ? (
                              <TouchableOpacity style={[styles.typeMsgTxt, { flexDirection: 'row' }]}>
                                <View style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}>
                                  <Image
                                    source={item?.task.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                    style={[styles.listIcon]}
                                  />
                                </View>

                                <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>{item?.task?.title}</Text>
                              </TouchableOpacity>
                            ) : null}
                            <TouchableOpacity
                              onLongPress={() => {
                                this.setState({ msgId: item?.message_id, replyMessage: item?.message });
                              }}
                            >
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: '#2980b9',
                                }}
                              >
                                <Text style={styles.typeMsgInnerTxt2Left}>{item?.message}</Text>
                              </Hyperlink>
                            </TouchableOpacity>
                          </View>
                        </View>
                        {item?.like_count !== 0 && item?.like_count > -1 ? (
                          <View style={styles.msgLikeViewLeft}>
                            <View style={[styles.msgLikeBtn]}>
                              <Icon name="heart" style={styles.likeIcon2} />
                              {/* <Text style={[styles.likeCountTxt]}>
                          {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                        </Text> */}
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {item?.media?.length ? (
                    <View style={styles.msgContainerLeft}>
                      <View style={styles.msgRow}>
                        <View style={[styles.msgTxtBox, { marginLeft: 0 }]}>
                          {item?.tag_message !== '' ? (
                            <Text style={styles.typeMsgTxt}>
                              {item?.tag_message?.replace(/ *\([^)]*\)*/g, '').replace(/[\[\]']+/g, '')}
                            </Text>
                          ) : item?.tag_media?.length ? (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onPress={() => {
                                this.setState({ visible: { index: mediaIndex, visible: true } });
                              }}
                            >
                              <Image
                                source={item?.tag_media[0] ? { uri: item?.tag_media[0] } : { uri: item?.images[0] }}
                                style={styles.shareImg}
                              />
                            </TouchableOpacity>
                          ) : item?.poll?.length !== 0 ? (
                            <TouchableOpacity style={styles.pollCard}>
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: '#2980b9',
                                }}
                              >
                                <Text style={[styles.chatPollCardTitle]}>{item?.poll?.question}</Text>
                              </Hyperlink>
                              {item?.poll?.options?.map(option => (
                                <TouchableOpacity disabled={true} style={styles.pollProgress}>
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                  </View>
                                  <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                  <View style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]} />
                                </TouchableOpacity>
                              ))}
                            </TouchableOpacity>
                          ) : item?.event?.length !== 0 ? (
                            <TouchableOpacity style={styles.eventView}>
                              <View style={styles.eventDateView}>
                                <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                                <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                              </View>
                              <View style={styles.eventDetail}>
                                <Text style={styles.eventTitle2}>
                                  {item?.event?.title.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
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
                          ) : item?.task?.length !== 0 ? (
                            <TouchableOpacity style={[styles.typeMsgTxt, { flexDirection: 'row' }]}>
                              <View style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10), marginTop: 10 }]}>
                                <Image
                                  source={item?.task.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                  style={[styles.listIcon]}
                                />
                              </View>

                              <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>{item?.task?.title}</Text>
                            </TouchableOpacity>
                          ) : null}
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
                          <View style={styles.replyBtnRow}>
                            {/* <Text style={styles.replyBtnTxt} onPress={() => {}}>
                          {'Reply'}
                        </Text> */}
                            {/* <Text style={styles.replyBtnTxt} onPress={() => { }}>{'Hide replies'}</Text> */}
                          </View>
                        </View>
                        {item?.like_count ? (
                          <View style={styles.msgLikeViewLeft}>
                            <TouchableOpacity
                              style={[styles.msgLikeBtn]}
                              onPress={() => {
                                this.msgLike(item);
                              }}
                            >
                              {item?.like_count !== 0 && item?.like_count > -1 ? <Icon name="heart" style={styles.likeIcon2} /> : null}
                              <Text style={[styles.likeCountTxt]}>
                                {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ) : null}
                  {item?.mediaVideos?.length ? (
                    <>
                      <View style={styles.msgContainerLeft}>
                        <View style={styles.msgRow}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                videoURL: item.mediaVideos[0],
                                isFullScreen: true,
                              });
                            }}
                            style={styles.shareImgView}
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
                  {/* End Msg Left Side */}
                </View>
              )}

              {this.props.userData.userInfo.id === item?.sender?.id && (
                <View>
                  {/* Start Msg Right Side */}
                  {item?.message !== '' ? (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        {item?.like_count !== 0 && item?.like_count > -1 ? (
                          <View style={styles.msgLikeViewRight}>
                            <View style={[styles.msgLikeBtn]}>
                              <Icon name="heart" style={styles.likeIcon2} />
                              {/* <Text style={[styles.likeCountTxt]}>
                            {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                          </Text> */}
                            </View>
                          </View>
                        ) : null}
                        <View style={[styles.msgTxtBox, { marginRight: 0 }]}>
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
                            ) : item?.tag_media?.length ? (
                              <TouchableOpacity style={styles.shareImgView2}>
                                <Image
                                  source={item?.tag_media[0] ? { uri: item?.tag_media[0] } : { uri: item?.images[0] }}
                                  style={styles.shareImg}
                                />
                              </TouchableOpacity>
                            ) : item?.poll?.length !== 0 ? (
                              <TouchableOpacity style={styles.pollCard}>
                                <Hyperlink
                                  linkDefault={true}
                                  linkStyle={{
                                    color: '#2980b9',
                                  }}
                                >
                                  <Text style={[styles.chatPollCardTitle]}>{item?.poll?.question}</Text>
                                </Hyperlink>
                                {item?.poll?.options?.map(option => (
                                  <TouchableOpacity disabled={true} style={styles.pollProgress}>
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                      <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                    </View>
                                    <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                    <View
                                      style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]}
                                    />
                                  </TouchableOpacity>
                                ))}
                              </TouchableOpacity>
                            ) : item?.event?.length !== 0 ? (
                              <TouchableOpacity style={styles.eventView}>
                                <View style={styles.eventDateView}>
                                  <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                                  <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                                </View>
                                <View style={styles.eventDetail}>
                                  <Text style={styles.eventTitle2}>
                                    {item?.event?.title.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
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
                            ) : item?.task?.length !== 0 ? (
                              <TouchableOpacity style={[styles.typeMsgTxt, { flexDirection: 'row' }]}>
                                <View style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10), marginTop: 10 }]}>
                                  <Image
                                    source={item?.task.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                    style={[styles.listIcon]}
                                  />
                                </View>

                                <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>{item?.task?.title}</Text>
                              </TouchableOpacity>
                            ) : null}
                            <Hyperlink
                              linkDefault={true}
                              linkStyle={{
                                color: '#2980b9',
                              }}
                            >
                              <Text style={styles.typeMsgInnerTxt2}>{item?.message}</Text>
                            </Hyperlink>
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {item?.media?.length ? (
                    <View style={styles.msgContainerRight}>
                      <View style={styles.msgRow}>
                        {item?.like_count !== 0 && item?.like_count > -1 ? (
                          <View style={styles.msgLikeViewRight}>
                            <View style={[styles.msgLikeBtn]}>
                              {item?.like_count !== 0 && item?.like_count > -1 ? <Icon name="heart" style={styles.likeIcon2} /> : null}
                              {/* <Text style={[styles.likeCountTxt]}>
                            {item?.like_count !== 0 && item?.like_count > -1 ? item?.like_count : null}
                          </Text> */}
                            </View>
                          </View>
                        ) : null}

                        <View style={[styles.msgTxtBox, { marginRight: 0 }]}>
                          {item?.tag_message !== '' ? (
                            <Hyperlink
                              linkDefault={true}
                              linkStyle={{
                                color: '#2980b9',
                              }}
                            >
                              <Text style={styles.typeMsgTxt}>
                                {item?.tag_message?.replace(/ *\([^)]*\)*/g, '').replace(/[\[\]']+/g, '')}
                              </Text>
                            </Hyperlink>
                          ) : item?.tag_media?.length ? (
                            <TouchableOpacity
                              style={styles.shareImgView}
                              onPress={() => this.setState({ visible: { index: mediaIndex, visible: true } })}
                            >
                              <Image
                                source={item?.tag_media[0] ? { uri: item?.tag_media[0] } : { uri: item?.images[0] }}
                                style={styles.shareImg}
                              />
                            </TouchableOpacity>
                          ) : item?.poll?.length !== 0 ? (
                            <TouchableOpacity style={styles.pollCard}>
                              <Hyperlink
                                linkDefault={true}
                                linkStyle={{
                                  color: '#2980b9',
                                }}
                              >
                                <Text style={[styles.chatPollCardTitle]}>{item?.poll?.question}</Text>
                              </Hyperlink>
                              {item?.poll?.options?.map(option => (
                                <TouchableOpacity disabled={true} style={styles.pollProgress}>
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                  </View>
                                  <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                  <View style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]} />
                                </TouchableOpacity>
                              ))}
                            </TouchableOpacity>
                          ) : item?.event?.length !== 0 ? (
                            <TouchableOpacity style={styles.eventView}>
                              <View style={styles.eventDateView}>
                                <Text style={styles.eventDateTxt1}>{moment(item?.event?.date).format('MMM')}</Text>
                                <Text style={styles.eventDateTxt2}>{moment(item?.event?.date).format('DD')}</Text>
                              </View>
                              <View style={styles.eventDetail}>
                                <Text style={styles.eventTitle2}>
                                  {item?.event?.title.length > 15 ? item?.event?.title.slice(0, 15).concat('...') : item?.event?.title}
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
                          ) : item?.task?.length !== 0 ? (
                            <TouchableOpacity style={[styles.typeMsgTxt, { flexDirection: 'row' }]}>
                              <View style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}>
                                <Image
                                  source={item?.task.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                  style={[styles.listIcon]}
                                />
                              </View>

                              <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>{item?.task?.title}</Text>
                            </TouchableOpacity>
                          ) : null}
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
                          <View style={styles.replyBtnRow}>
                            {/* <Text style={styles.replyBtnTxt} onPress={() => {}}>
                          {'Reply'}
                        </Text> */}
                            {/* <Text style={styles.replyBtnTxt} onPress={() => { }}>{'Hide replies'}</Text> */}
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {item?.mediaVideos?.length ? (
                    <>
                      <View style={styles.msgContainerRight}>
                        <View style={[styles.msgRow]}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                videoURL: item.mediaVideos[0],
                                isFullScreen: true,
                              });
                            }}
                            style={styles.shareImgView}
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
                  {/* End Msg Right Side */}
                </View>
              )}
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
                {'Choose Images/Videos'}
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
          compressImageMaxWidth: 600,
          compressImageMaxHeight: 600,
          //   cropping: Platform.OS === 'ios' ? true : true,
          //   compressImageQuality: 0.8,
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
    // this.getChatDetail(),
    this.setState({
      // profilePic: image.path,
      imagePick: {
        uri: image.path,
        type: image.mime,
        name: image.path.split('/').pop(),
      },
      images: [{ uri: image.path }, ...this.state.images],
    });
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

  handleTypingView() {
    return (
      <View>
        {this.state?.typingUserData ? (
          <AnimatedLottieView
            autoPlay
            source={require('./typing.json')}
            loop={true}
            speed={1}
            style={{ justifyContent: 'center', alignContent: 'center', width: 60, height: 50 }}
            autoSize={false}
          />
        ) : (
          <></>
        )}
      </View>
    );
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const replyMessage = this?.state.replyMessage ? this?.state.replyMessage : '';
    const chatDetail = this?.props?.chatDetail;
    const sender = this.state.userProfile.sender !== undefined ? JSON.parse(this?.state?.userProfile?.sender) : '';
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.screenBG}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={0}
            style={{ flex: 1 }}
            // keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.navigate('TAB_NAVIGATOR')}>
                <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
              </TouchableOpacity>

              <View style={[styles.headerCenter]}>
                {this?.props?.route?.params?.notification === true ? (
                  <Text style={styles.headerCenterTitle}>{sender.name}</Text>
                ) : (
                  <Text style={styles.headerCenterTitle}>
                    {this.state?.userProfile.user_name
                      ? this.state?.userProfile?.user_name
                      : this.state?.userProfile?.title
                      ? this.state?.userProfile?.title
                      : this.state?.userProfile?.name}
                  </Text>
                )}
                {/* <Text style={styles.headerCenterTitle}>
                {this.state?.userProfile.user_name ? this.state?.userProfile?.user_name : this.state?.userProfile?.title}
              </Text> */}
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={[styles.headerRightImgWrap]}
                  onPress={() => {
                    this.state.userProfile?.connection_id == '' || this.state.userProfile?.connection_id == undefined
                      ? Alert.alert('You are not connected')
                      : this.props.navigation.navigate('CHAT_PROFILE', {
                          privateChat: true,
                          chatId: this.state.userProfile.chat_id,
                          userName:
                            this.state.userProfile.sender !== undefined
                              ? sender.name
                              : this.state?.userProfile.user_name
                              ? this.state?.userProfile?.user_name
                              : this.state?.userProfile?.title
                              ? this.state?.userProfile?.title
                              : this.state?.userProfile?.name,
                          userImage: this.state.userProfile.image,
                          state: this?.state?.state,
                        });
                  }}
                >
                  {this?.props?.route?.params?.notification === true ? (
                    <Image source={{ uri: sender.image }} style={[styles.headerRightImg, { borderRadius: 20 }]} />
                  ) : (
                    <Image
                      source={{ uri: this.state.userProfile.user_image ? this.state.userProfile.user_image : this.state.userProfile.image }}
                      style={[styles.headerRightImg, { borderRadius: 20 }]}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.msgContainer}>
              {this?.props?.message?.data?.length !== 0 ? (
                <>
                  <FlatList
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
                    data={this.props.message?.data || []}
                    inverted
                    ListHeaderComponent={() => this.handleTypingView()}
                    renderItem={(item, index) => this._renderSwipeFrontItemGroup(item, index)}
                  />
                </>
              ) : (
                <>
                  {this?.props?.message?.data ? (
                    <NoDataFound
                      title="Nothing to see"
                      text="You don’t have any chats created yet"
                      titleColor={'#C8BCBC'}
                      textColor={'#847D7B'}
                      titleFontSize={20}
                    />
                  ) : null}
                </>
              )}
            </View>
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

              <View style={styles.inputContainer}>
                {this.state.userProfile?.connection_id !== '' ? (
                  <View>
                    {chatDetail?.is_block === 1 || this.state.is_block === 1 ? (
                      <View style={[styles.dmMsgRow]}>
                        <Text style={[styles.dmMsgTxt]}>As you have blocked this chat, you will not able to send message.</Text>
                      </View>
                    ) : (
                      <View>
                        {replyMessage !== '' && replyMessage ? (
                          <View style={styles.dmMsgRow}>
                            <Text style={[styles.dmMsgTxt]}>{replyMessage}</Text>
                            <Icon
                              name="close"
                              style={[styles.dmMsgIcon]}
                              onPress={() => this.setState({ msgReply: false, message: '', replyMessage: '' })}
                            />
                          </View>
                        ) : this.state.replyPoll !== '' && this.state.replyPoll ? (
                          <View style={styles.dmMsgRow}>
                            <TouchableOpacity
                              style={styles.pollCard}
                              onPress={() => this.props.navigation.navigate('POLL', { pollId: item?.poll?.id })}
                            >
                              <Text style={[styles.chatPollCardTitle]}>{this?.state?.replyPoll?.question}</Text>
                              {this?.state?.replyPoll.options?.map(option => (
                                <TouchableOpacity disabled={true} style={styles.pollProgress}>
                                  <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                                  </View>
                                  <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>
                                  <View style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]} />
                                </TouchableOpacity>
                              ))}
                            </TouchableOpacity>
                            <Icon
                              name="close"
                              style={[styles.dmMsgIcon]}
                              onPress={() =>
                                this.setState({
                                  msgReply: false,
                                  message: '',
                                  replyPoll: '',
                                })
                              }
                            />
                          </View>
                        ) : this.state.replyEvent !== '' && this.state.replyEvent ? (
                          <View style={styles.dmMsgRow}>
                            <TouchableOpacity style={styles.eventView}>
                              <View style={styles.eventDateView}>
                                <Text style={styles.eventDateTxt1}>{moment(this?.state?.replyEvent.date).format('MMM')}</Text>
                                <Text style={styles.eventDateTxt2}>{moment(this?.state?.replyEvent.date).format('DD')}</Text>
                              </View>
                              <View style={styles.eventDetail}>
                                <Text style={styles.eventTitle2}>
                                  {this?.state?.replyEvent.title.length > 15
                                    ? this?.state?.replyEvent.title.slice(0, 15).concat('...')
                                    : this?.state?.replyEvent?.title}
                                </Text>
                                <Text style={styles.eventSubjectTxt}>
                                  {this?.state?.replyEvent.description?.length > 8
                                    ? this?.state?.replyEvent.description.slice(0, 8).concat('...')
                                    : this?.state?.replyEvent.description}
                                </Text>
                                <Text style={styles.eventDate}>
                                  {moment(this?.state?.replyEvent.date).format('ddd')},
                                  {this?.state?.replyEvent.start_time !== ''
                                    ? `${this.handleStartTime(this?.state?.replyEvent.start_time)}-${this.handleEndTime(
                                        this?.state?.replyEvent.end_time,
                                      )}`
                                    : ' Fullday'}
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <Icon
                              name="close"
                              style={[styles.dmMsgIcon]}
                              onPress={() =>
                                this.setState({
                                  msgReply: false,
                                  message: '',
                                  replyEvent: '',
                                })
                              }
                            />
                          </View>
                        ) : this.state.replyTask !== '' && this.state.replyTask ? (
                          <View style={[styles.dmMsgRow]}>
                            <TouchableOpacity style={[styles.typeMsgTxt, { flexDirection: 'row' }]}>
                              <View style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}>
                                <Image
                                  source={this.state.replyTask.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                  style={[styles.listIcon]}
                                />
                              </View>

                              <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>{this.state.replyTask.title}</Text>
                            </TouchableOpacity>
                            <Icon
                              name="close"
                              style={[styles.dmMsgIcon]}
                              onPress={() =>
                                this.setState({
                                  msgReply: false,
                                  message: '',
                                  replyTask: '',
                                })
                              }
                            />
                          </View>
                        ) : null}
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
                        {this.state.replyMedia !== undefined && this.state.replyMedia.length !== 0 && (
                          <View
                            style={{
                              position: 'relative',
                              height: 50,
                              width: 50,
                            }}
                          >
                            <Image
                              source={{ uri: this.state.replyMedia[0] }}
                              style={{
                                height: '100%',
                                width: '100%',
                              }}
                            />
                            <TouchableOpacity
                              style={{ position: 'absolute', right: 2, top: 2 }}
                              onPress={() => {
                                this.setState({ replyMedia: [] });
                              }}
                            >
                              <Image source={IMAGES.closeIcon} style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                          </View>
                        )}

                        <TextInput
                          ref={this.textInputRef}
                          placeholder="Drop a message"
                          value={this.state.message}
                          style={styles.msgInput}
                          placeholderTextColor={theme?.colors?.GRAY_300}
                          multiline={true}
                          onChangeText={text => {
                            this.setState({ message: text, isUserTyping: true });
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
                          onContentSizeChange={event => {
                            this.setState({ height: event.nativeEvent.contentSize.height });
                          }}
                        />

                        <View style={styles.footerIconRow}>
                          <View style={styles.footerIconColLeft}>
                            <TouchableOpacity style={styles.footerIconBtn}>
                              <Icon2 name="image" style={[styles.footerIcon]} onPress={() => this.setState({ isShowPicker: true })} />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.footerIconColRight}>
                            {this.state.message.trim() !== '' || this.state.imagePick !== '' ? (
                              <TouchableOpacity style={styles.footerLeftIconBtn} onPress={() => this.sendMessage()}>
                                <Icon2 name="send" style={[styles.footerLeftIcon]} />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={[styles.footerIconRow, { height: Responsive.getHeight(13) }]}>
                    <Text style={[styles.typeMsgTxt, { borderWidth: 0 }]}>As you are not connected, can not send direct message.</Text>
                  </View>
                )}
              </View>
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
            </View>
            {this._renderPickerPopup()}

            {/* </SafeAreaWrapper> */}
          </KeyboardAvoidingView>
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
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OneToOneConversationScreen);
