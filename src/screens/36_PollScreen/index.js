import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Switch,
  ImageBackground
} from 'react-native';

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

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { callApi } from '@apiCalls';
import onShare from '../../utils/deepLinking';

import { API_DATA } from '@constants';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import moment from 'moment';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import Icon2 from 'react-native-vector-icons/Feather';
import { UserModal } from '@components';
import { AppContext } from '../../themes/AppContextProvider';

let echo;
class PollScreen extends React.Component {
  constructor(props) {
    super(props);
    this.textInputRef = React.createRef();

    this.state = {
      pollId: this.props?.route?.params?.pollId,
      isLoading: true,
      question: this?.props?.pollDetail?.question,
      isEdit: false,
      modalVisible: false,
      userDetail: '',
      isEnabled: this?.props?.pollDetail?.is_hide_result === 1 ? true : false,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getPollDetails();
    this.pollVoterList();
    this.pollVoteConnection();
  }

  pollVoteConnection = () => {
    echo = new Echo({
      host: 'https://sortapp.mobileapphero.com:6001',
      broadcaster: 'socket.io',
      client: socketio,
    });

    echo.channel(`pollvote`).listen('.UserEvent', this.onPollEvent);

    echo.connector.socket.on('connect', function () {
      // console.log('connected', echo.socketId());
    });
    echo.connector.socket.on('disconnect', function () { });
    echo.connector.socket.on('reconnecting', function (attemptNumber) { });
    echo.connector.socket.on('error', function () { });
  };
  componentWillUnmount() {
    this.offPollEvent();
  }

  offPollEvent = () => {
    echo.connector.socket.off('connect');
    echo.connector.socket.off('conndisconnectect');
    echo.connector.socket.off('reconnecting');
    echo.disconnect();
  };
  getPollDetails() {
    try {
      const params = {
        url: API_DATA.POLLDETAILS,
        data: {
          id: this.state.pollId,
        },
      };
      if (this.state.isLoading) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.POLLDETAILS];
              this.setState({ isLoading: false });
              if (resp.success) {
                this.props.savePollDetail(resp.data);
              } else {
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

  onPollEvent = data => {
    // if (!data?.votes?.some(item => item.user_id === this.props.userData.userInfo.id)) {
    //   this.props.savePollVoteInChatFromServer({ ...data, is_answered: 0 });
    // } else {
    this.props.savePollVoteInChatFromServer(data);
    // }
    this.props.savePollVoteServer(data, 'pollDetails');
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
                // this?.props?.savePollVote(pollId, optionId, 'pollDetails');
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
    } catch (e) { }
  };

  pollVoterList = () => {
    try {
      const params = {
        url: API_DATA.POLLVOTERS,
        data: {
          id: this.state.pollId,
          // option_id: optionId,
        },
      };

      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.POLLVOTERS];
              if (resp.success) {
                this?.props?.saveVoterList(resp?.data);
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
    } catch (e) { }
  };

  pollDelete = pollId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this poll?', [
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
              url: API_DATA.POLLDELETE,
              data: {
                id: pollId,
              },
            };
            this.props.showLoading(true);
            setTimeout(() => {
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.POLLDELETE];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this.props.navigation.goBack();

                      this.props.savePollDeleteInChat(pollId);
                      this.props.savePollDelete(pollId);

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
        },
      },
    ]);
  };

  pollUpdate = pollId => {
    const question = this?.state?.question?.trim() !== '' ? this?.state?.question?.trim() : this?.props?.pollDetail?.question;
    try {
      const params = {
        url: API_DATA.POLLUPDATE,
        data: {
          id: pollId,
          question: this.state.question !== '' ? this.state.question : this?.props?.pollDetail?.question,
          is_hide_result: this?.state?.isEnabled ? 1 : 0,
        },
      };
      console.log('datea', params);
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.POLLUPDATE];
              this.setState({ isEdit: false });
              if (resp.success) {
                this?.props?.savePollUpdateInChat(pollId, question), this.props.showToast(localize('SUCCESS'), resp.message);
                this?.props?.savePollUpdate(pollId, question), this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) { }
  };

  getConnectionDetails = friendId => {
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
                this.setState({ userDetail: resp.data[0] });
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) { }
  };

  handleUserBlock = connectionId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this user?', [
      {
        text: 'No',
        onPress: () => { },
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
            } catch (e) { }
          }, 1000);
        },
      },
    ]);
  };
  handleChatBlock = chatId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this person?', [
      {
        text: 'No',
        onPress: () => { },
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
            } catch (e) { }
          }, 1000);
        },
      },
    ]);
  };

  toggleSwitch = () => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to change results show status?', [
      {
        text: 'No',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          this.setState({
            isEnabled: !this.state.isEnabled,
          });
        },
      },
    ]);
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}></SafeAreaWrapper>
        </ImageBackground>
      );
    }
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={{ flex: 1 }}>
            {/* <View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
                <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{'Poll'}</Text>
              </View>
              {this.state.isEdit === true ? (
                <TouchableOpacity
                  style={styles.headerRight}
                  onPress={() => {
                    this.pollUpdate(this?.props?.pollDetail?.id);
                  }}
                >
                  <Text style={styles.headerAddBtnTxt}>{'Done'}</Text>
                </TouchableOpacity>
              ) : this?.props?.userData?.userInfo?.id === this?.props?.pollDetail?.createdBy?.id ? (
                <TouchableOpacity style={styles.headerRight} onPress={() => this.setState({ isEdit: true })}>
                  <Text style={styles.headerAddBtnTxt}>{'Edit'}</Text>
                </TouchableOpacity>
              ) : null}
            </View> */}
            <View style={styles.pollContainer}>
              {/* {this?.props?.pollDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? (
              <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => {
                    this.pollDelete(this?.props?.pollDetail?.id);
                  }}
                >
                  <Image style={[COMMON_STYLE.imageStyle(6), { tintColor: 'gray' }]} source={IMAGES.deleteNewIcon} />
                </TouchableOpacity>
              </View>
            ) : null} */}

              {this.state.isEdit ? (
                <TextInput
                  ref={this.textInputRef}
                  placeholder={this?.props?.pollDetail?.question}
                  value={this?.state?.question}
                  style={styles.pollCardTitle}
                  placeholderTextColor={theme?.colors?.GRAY_100}
                  autoFocus
                  onChangeText={text =>
                    this.setState({
                      question: text,
                    })
                  }
                />
              ) : (
                <Text style={styles.pollCardTitle}>{this?.props?.pollDetail?.question}</Text>
              )}

              {/* <Text style={styles.pollCardTitle}>{this?.props?.pollDetail?.question}</Text> */}
              {this?.props?.userData?.userInfo?.id === this?.props?.pollDetail?.createdBy?.id ? (
                <Text style={[styles.pollCardSubTitle, { marginBottom: 0 }]}>You have created this poll. </Text>
              ) : (
                <Text style={[styles.pollCardSubTitle, { marginBottom: 0 }]}>Asked by {this?.props?.pollDetail?.createdBy?.name}</Text>
              )}
              <Text style={styles.pollCardSubTitle}>Created in {this?.props?.pollDetail?.group_title}</Text>

              {this?.props?.pollDetail?.options.map(option =>
                this?.props?.pollDetail?.createdBy?.id === this.props.userData.userInfo.id ? (
                  <TouchableOpacity
                    disabled={this?.props?.pollDetail?.is_answered === 1 && true}
                    style={styles.pollProgress}
                    onPress={() => {
                      this.pollVote(this?.props?.pollDetail?.id, option?.id);
                      this.pollVoteConnection(this?.props?.pollDetail?.id);
                    }}
                  >
                    <Text style={styles.pollProgressTxt}>
                      {option?.answer} {option?.isMyAnswer === 1 && <Icon name="check" style={[styles.pollProgressTxt]} />}
                    </Text>

                    <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>

                    <View style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]} />
                  </TouchableOpacity>
                ) : this?.props?.pollDetail?.is_hide_result && this?.props?.pollDetail?.is_everyone_voted ? (
                  <TouchableOpacity
                    disabled={this?.props?.pollDetail?.is_answered === 1 && true}
                    style={styles.pollProgress}
                    onPress={() => {
                      this.pollVote(this?.props?.pollDetail?.id, option?.id);
                      this.pollVoteConnection(this?.props?.pollDetail?.id);
                    }}
                  >
                    <Text style={styles.pollProgressTxt}>
                      {option?.answer} {option?.isMyAnswer === 1 && <Icon name="check" style={[styles.pollProgressTxt]} />}
                    </Text>

                    <Text style={styles.pollProgressTxt}>{`${String(option?.vote_percentage).split('.')[0]}%`}</Text>

                    <View style={[styles.pollProgressView, { width: `${String(option?.vote_percentage).split('.')[0]}%` }]} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={this?.props?.pollDetail?.is_answered === 1 && true}
                    style={styles.pollProgress}
                    onPress={() => {
                      this.pollVote(this?.props?.pollDetail?.id, option?.id);
                      this.pollVoteConnection(this?.props?.pollDetail?.id);
                    }}
                  >
                    <Text style={styles.pollProgressTxt}>{option?.answer}</Text>
                  </TouchableOpacity>
                ),
              )}
              {console.log('sitch', this?.state?.isEnabled)}
              {this.state.isEdit ? (
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
              ) : null}

              <View style={styles.pollVoteRow}>
                <Text style={styles.pollVoteTxt}>
                  Polled on {`${moment(this?.props?.pollDetail?.created_at).format('L')}`} .
                  {this?.props?.pollDetail?.is_complete === 0 ? null : ' Voting has ended'}
                </Text>
                {this?.props?.pollDetail?.total_votes !== 0 ? (
                  <Text style={styles.pollVoteTxt}>
                    {this?.props?.pollDetail?.total_votes} {this?.props?.pollDetail?.total_votes === 1 ? 'total vote' : 'total votes'}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.voterContainer}>
              {this?.props?.votersList?.length ? <Text style={styles.secTitle}>Voters</Text> : null}

              <FlatList
                // ref={this.flatListRef}
                contentContainerStyle={[styles.ScrollView]}
                keyboardShouldPersistTaps="handled"
                data={this.props.votersList || []}
                renderItem={item => (
                  <>
                    <TouchableOpacity
                      style={[styles.polluserRow]}
                      onPress={() => {
                        this.getConnectionDetails(item?.item?.user_id);
                        this.setState({ modalVisible: true });
                      }}
                    >
                      <Image source={{ uri: item?.item?.user_image }} style={styles.polluserImg} />
                      <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={styles.polluserTxt}>{item?.item?.user_name}</Text>
                        <Text style={styles.polluserTxt2}>Voted {item?.item?.option_answer}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
                keyExtractor={item => item.user_id}
              />
            </View>
            {this?.props?.pollDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? (
              <TouchableOpacity
                style={styles.fabButton}
                onPress={() => {
                  this.pollDelete(this?.props?.pollDetail?.id);
                }}
              >
                <Image source={IMAGES.deleteNewIcon} style={[styles.fabButtonIcon, { tintColor: theme?.colors?.WHITE }]} />
              </TouchableOpacity>
            ) : null}
            {this.state.modalVisible && this.state.userDetail !== '' ? (
              <UserModal
                visible={this.state.modalVisible}
                inVisible={() => this.setState({ modalVisible: false })}
                userDetails={this.state.userDetail}
                chat_id={this.state.userDetail.chat_id}
                sendMessage={false}
                onPressSendMsg={() =>
                  this?.props?.navigation?.replace('SINGAL_CHAT', {
                    profileDetail: this?.state?.userDetail,
                    is_block: this?.state?.userDetail?.is_block,
                  })
                }
                onPressSharedSidenote={() =>
                  this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.userDetail?.chat_id })
                }
                onPressBlock={() =>
                  this.state?.profileDetail?.chat_id
                    ? this.handleChatBlock(this.state?.userDetail?.chat_id)
                    : this.handleUserBlock(this.state?.userDetail?.connection_id)
                }
                onPressInvite={() => onShare(this?.props?.userData?.userInfo?.invitation_url)}
                onPressAddtoSidenote={() => this?.props?.navigation?.replace('ADD_SIDENOTE', { userData: this?.state?.userDetail })}
              />
            ) : null}
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    myConnections: state?.dashboardState?.myConnections,
    pollDetail: state?.pollState?.pollDetail,
    votersList: state?.pollState?.votersList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(PollScreen);
