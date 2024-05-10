import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  SectionList,
  TextInput,
  Modal,
  Alert,
  Linking,
  Platform,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
// import { IMAGES, COMMON_STYLE, COLORS } from '@themes';
//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, COLORS } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { FlatList } from 'react-native-gesture-handler';

import LinearGradient from 'react-native-linear-gradient';

// import api functions
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/Feather';
import { UserModal } from '@components';
import { AppContext } from '../../themes/AppContextProvider';

class EventDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      time: new Date(),
      switchReminder: false,
      switchDay: false,
      going: '',
      modalVisible: false,
      Index: this.props?.route?.params?.Index,
      visible: { index: 0, visible: false },
      isLoader: true,
      images: [],
      userModal: false,
      profileDetail: '',
      eventModalShow: this?.props?.eventDetail?.is_calendar === 0 ? true : false,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static contextType = AppContext;

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  componentDidMount() {
    this.handleEventDetail();
  }

  onTimeChange(time) {
    this.setState({
      time: time,
    });
  }

  addToCalendarEvent = data => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          event_id: this.props.route.params.eventId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              if (resp.success) {
                this?.props?.addToCalenderEvent(this.props.route.params.eventId);
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
                Object.keys(resp?.data)?.forEach(item => {
                  if (item !== 'pastEvents') {
                    data.push({ title: keysValues[item], data: resp?.data[item] });
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
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  handleEventDetail = () => {
    try {
      const params = {
        url: API_DATA.EVENTDETAIL,
        data: {
          id: this.props.route.params.eventId,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTDETAIL];
              if (resp.success) {
                this.setState({
                  eventModalShow: resp?.data?.is_calendar ? false : true,
                });
                if (resp?.data?.media) {
                  const finalArr = resp?.data?.media?.map(val => {
                    const obj = {
                      uri: val.url,
                    };
                    return obj;
                  });

                  this.setState({
                    images: finalArr.reverse(),
                  });
                }
                this?.setState({
                  isLoader: false,
                });
                console.log('event details', resp.data);
                this.props.saveEventDetail(resp.data);
                this.getEventList();
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

  handleGoing = () => {
    this.setState({ modalVisible: true });
  };

  handleParticipate(value) {
    this.setState({ going: value, modalVisible: false });
    setTimeout(() => {
      this.getEventParticipate();
    }, 100);
  }

  handleTaskDetail = taskId => {
    this?.props?.navigation?.navigate('Event_Task_Detail', { taskId });
  };

  handleTasks = taskID => {
    try {
      const params = {
        url: API_DATA.EVENTTASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTTASKCOMPLETE];
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);

                this.props.saveEventTaskComplete(resp.data, taskID);
                // if (this.props.taskList) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                // }
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

  getEventParticipate = () => {
    try {
      const params = {
        url: API_DATA.EVENTPARTICIPATE,
        data: {
          id: this?.props?.eventDetail?.id,
          user_id: this?.props?.userData?.userInfo?.id,
          going: this?.state?.going,
        },
      };

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTPARTICIPATE];
              if (resp.success) {
                this?.props?.saveParticipate(resp, this?.state?.going);
                if (this.state.going === 'Yes') {
                  this.props.showToast(localize('SUCCESS'), 'Checked-in successfully!');
                } else if (this.state.going === 'No') {
                  this.props.showToast(localize('SUCCESS'), 'Thanks for your feedback!');
                } else {
                  this.props.showToast(localize('SUCCESS'), 'Thanks for the acknowledgement!');
                }
                // this.handleEventDetail();
                this?.props?.saveEventParticipate(resp, this?.props?.eventDetail?.id, this.state.going, this.state.Index, 'eventDetails');
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            // this.props.showLoading(false);
          });
      }, 500);
      // this.props.showLoading(true);
    } catch (e) {
      console.log('catch error >>>', e);
    }
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
              console.log('get details ', resp);
              if (resp.success) {
                this.setState({ profileDetail: resp.data[0] });
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

  openMap = (latitude, longitude, location) => {
    // const dAddr = `${latitude},${longitude}`;
    const company = Platform.OS === 'ios' ? 'apple' : 'google';
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${location}`);
    // Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`);
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const eventDetail = this?.props?.eventDetail;
    const Id = this?.props?.eventDetail?.id;
    const userData = this?.props?.userData;

    return (
      // <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
      <View style={{ flex: 1, backgroundColor: theme?.colors?.BLACK }}>
        {this?.state?.isLoader === false ? (
          <View style={[styles.eventContainer, { flex: 1 }]}>
            <View style={styles.eventItem}>
              <TouchableOpacity style={styles.eventImageView} onPress={() => this.setState({ visible: { index: 0, visible: true } })}>
                {!eventDetail?.media[eventDetail?.media?.length - 1]?.url == '' ? (
                  <Image source={{ uri: eventDetail?.media[eventDetail?.media?.length - 1]?.url }} style={styles.eventImage} />
                ) : (
                  <Image source={IMAGES.upload_img_placeholder} style={styles.eventImage} />
                )}

                <LinearGradient
                  colors={['rgba(26, 31, 35,0.1)', 'rgba(26, 31, 35,0.5)', 'rgba(26, 31, 35,0.9)', theme?.colors?.BLACK]}
                  style={styles.eventContent}
                >
                  <View style={styles.eventContentTop}>
                    <TouchableOpacity style={styles.headerBtnStyle} onPress={() => this.props.navigation.goBack()}>
                      <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
                    </TouchableOpacity>
                    {userData?.userInfo?.id === eventDetail?.user_id && (
                      <TouchableOpacity
                        style={[styles.smallBtn, { backgroundColor: theme?.colors?.PURPLE_500 }]}
                        onPress={() => {
                          this.props.navigation.navigate('UPDATE_EVENT', {
                            Id,
                            isItinerary: false,
                          });
                        }}
                      >
                        <Text style={[styles.smallBtnText, { color: theme?.colors?.WHITE }]}>Edit</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.eventContentRow}>
                    <View style={styles.body}>
                      {/* <Text style={styles.eventTitle}>{eventDetail?.title}</Text> */}
                      {eventDetail?.start_time?.length !== 0 ? (
                        <Text style={styles.eventText}>
                          {moment(eventDetail?.start_time, ['h:mm A']).utc().format('h:mm A')} -
                          {moment(eventDetail?.end_time, ['h:mm A']).utc().format('h:mm A')}
                          {/* {eventDetail?.start_time} - {eventDetail?.end_time} */}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.right}>
                      {eventDetail?.is_participate === '' && (
                        <TouchableOpacity style={styles.smallBtn} onPress={() => this.handleGoing()}>
                          <Text style={styles.smallBtnText}>Going</Text>
                        </TouchableOpacity>
                      )}
                      {eventDetail?.is_participate === 'Yes' && (
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#86D190' }]} onPress={() => this.handleGoing()}>
                          <Text style={styles.smallBtnText}>I'm going</Text>
                        </TouchableOpacity>
                      )}
                      {eventDetail?.is_participate === 'No' && (
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#FC5401' }]} onPress={() => this.handleGoing()}>
                          <Text style={styles.smallBtnText}>I'm not going</Text>
                        </TouchableOpacity>
                      )}
                      {eventDetail?.is_participate === 'Maybe' && (
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#FEDC01' }]} onPress={() => this.handleGoing()}>
                          <Text style={[styles.smallBtnText, { color: theme?.colors?.BLACK }]}>Maybe</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.ScrollView} nestedScrollEnabled={true}>
              <View style={styles.contentContainer}>
                <View style={[styles.listItem, { alignItems: 'flex-start' }]}>
                  <Icon name={'edit'} size={25} color={theme?.colors?.WHITE} />
                  <Text style={[styles.listItemTxt, { paddingTop: 5 }]}>{eventDetail?.title}</Text>
                </View>
                <View style={styles.listItem}>
                  <Image source={IMAGES.EVENTS_TAB} style={styles.listItemIcon} resizeMode={'stretch'} />
                  <Text style={styles.listItemTxt}>{moment(eventDetail?.date).format('MMMM D, YYYY')}</Text>
                </View>
                <TouchableOpacity onPress={() => this.openMap(eventDetail?.latitude, eventDetail?.longitude, eventDetail?.location)}>
                  <View style={styles.listItem}>
                    <Image source={IMAGES.mapPin} style={styles.listItemIcon} resizeMode={'stretch'} />
                    <Text style={styles.listItemTxt}>{eventDetail?.location}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.listItem}>
                  <Image source={IMAGES.notes} style={[styles.listItemIcon]} resizeMode={'stretch'} />
                  <Text style={styles.listItemTxt}>{eventDetail?.description}</Text>
                </View>
                <Text style={[styles.sectionHeaderTitle, { paddingBottom: Responsive.getWidth(3) }]}>Event Task</Text>
                {eventDetail?.tasks?.length
                  ? eventDetail?.tasks?.map(item => {
                      return (
                        // <View style={styles.listItem}>
                        <>
                          <View style={[styles.taskRow, { flexDirection: 'row', padding: 10 }]}>
                            <TouchableOpacity style={[styles.checkbox]} onPress={() => this.handleTasks(item?.id)}>
                              <Image
                                source={item?.is_complete !== 1 ? IMAGES.uncheckIcon2 : IMAGES.checkIcon2}
                                style={[styles.checkboxStyle]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginTop: 5 }} onPress={() => this.handleTaskDetail(item?.id)}>
                              <Text style={styles.listItemTxt}>{item?.title}</Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      );
                    })
                  : null}
                <View
                  style={[
                    styles.userRow,
                    {
                      paddingTop: Responsive.getWidth(3),
                      paddingLeft: Responsive.getWidth(0),
                      borderTopWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  ]}
                >
                  <View style={styles.imgRow}>
                    <TouchableOpacity
                      style={styles.imgBtn}
                      onPress={() => {
                        this.getConnectionDetails(eventDetail?.createdBy?.id);
                        this.setState({ userModal: true });
                      }}
                    >
                      <Image source={{ uri: eventDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                    </TouchableOpacity>
                    <Text
                      style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                    >{`${eventDetail?.createdBy?.name} has created this event`}</Text>
                  </View>
                </View>
                {eventDetail?.reminder_minute !== 0 ? (
                  <View style={[styles.listItem, { alignItems: 'center' }]}>
                    <Image source={IMAGES.bellIcon} style={styles.listItemIcon} resizeMode={'stretch'} />
                    <Text style={styles.listItemTxt}>{eventDetail?.reminder_minute} minutes before event</Text>
                  </View>
                ) : null}

                {eventDetail?.participants?.length !== 0 ? (
                  <View style={[styles.listItem, { marginBottom: Responsive.getWidth(3) }]}>
                    <Image source={IMAGES.userIcon} style={styles.listItemIcon} />
                    <View style={{ flex: 1, paddingLeft: Responsive.getWidth(4) }}>
                      <Text style={[styles.listItemTxt, { paddingLeft: 0 }]}>{eventDetail?.participants?.length} invitees</Text>
                      {eventDetail?.participants?.length !== 0 ? (
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                          <Text style={[styles.smallBtnText, { fontSize: 14, color: '#847D7B' }]}>
                            {eventDetail?.participants_count?.Yes} yes,{' '}
                          </Text>
                          <Text style={[styles.smallBtnText, { fontSize: 14, color: '#847D7B' }]}>
                            {eventDetail?.participants_count?.No} no,{' '}
                          </Text>
                          <Text style={[styles.smallBtnText, { fontSize: 14, color: '#847D7B' }]}>
                            {eventDetail?.participants_count?.Maybe} maybe
                          </Text>
                        </View>
                      ) : null}
                    </View>
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

                {eventDetail?.participants?.map(item => (
                  <View style={styles.userRow}>
                    <Image source={{ uri: item.user_image }} style={styles.userImg} />
                    <Text style={styles.userName}>{item.user_name}</Text>
                  </View>
                ))}
                {eventDetail?.is_private === 0 ? (
                  eventDetail?.createdBy?.id === userData?.userInfo?.id ? (
                    eventDetail?.shares?.length !== 0 ? (
                      <View style={[styles.listItem, { alignItems: 'center' }]}>
                        <Image source={IMAGES.userIcon} style={styles.listItemIcon} />
                        <Text style={styles.listItemTxt}>{eventDetail?.shares?.length} invitees</Text>
                      </View>
                    ) : null
                  ) : null
                ) : eventDetail?.shares?.length !== 0 ? (
                  <View style={[styles.listItem, { alignItems: 'center' }]}>
                    <Image source={IMAGES.userIcon} style={styles.listItemIcon} />
                    <Text style={styles.listItemTxt}>{eventDetail?.shares?.length} invitees</Text>
                  </View>
                ) : null}

                <View style={[styles.listItem]}>
                  <Image source={IMAGES.userIcon} style={[styles.listItemIcon, { opacity: 0 }]} />
                  <View style={{ flex: 1, paddingLeft: Responsive.getWidth(4) }}>
                    {eventDetail?.is_private === 0 ? (
                      eventDetail?.createdBy?.id === userData?.userInfo?.id ? (
                        <FlatList
                          data={eventDetail?.shares}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => {
                                this.getConnectionDetails(item?.user_id);
                                this.setState({ userModal: true });
                              }}
                            >
                              <View style={[styles.userRow, { paddingLeft: 0 }]}>
                                <Image source={{ uri: item.user_image }} style={styles.userImg} />
                                <View>
                                  <Text style={styles.userName}>{item.user_name}</Text>
                                  <Text style={styles.invitees}>{'invited'}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )}
                          nestedScrollEnabled={true}
                          keyExtractor={item => item?.index}
                          // contentContainerStyle={styles.eventScroll}
                        />
                      ) : null
                    ) : (
                      <FlatList
                        data={eventDetail?.shares}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => {
                              this.getConnectionDetails(item?.user_id);
                              this.setState({ userModal: true });
                            }}
                          >
                            <View style={styles.userRow}>
                              <Image source={{ uri: item.user_image }} style={styles.userImg} />
                              <View>
                                <Text style={styles.userName}>{item.user_name}</Text>
                                <Text style={styles.invitees}>{'invited'}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}
                        nestedScrollEnabled={true}
                        keyExtractor={item => item?.index}
                        // contentContainerStyle={styles.eventScroll}
                      />
                    )}
                  </View>
                </View>

                <Modal animationType="slide" transparent={true} visible={this.state.eventModalShow}>
                  <TouchableWithoutFeedback onPress={() => this.setState({ eventModalShow: false })}>
                    <View style={styles.eventModalContainer}>
                      <SafeAreaView style={styles.eventModalbody}>
                        {/* <ImageBackground source={IMAGES.onboardingScreen} style={styles.eventModalbodyBg}> */}
                        <TouchableOpacity
                          style={[styles.modalBtn, styles.bgBlue]}
                          onPress={() => {
                            this.addToCalendarEvent(), this.setState({ eventModalShow: false });
                          }}
                        >
                          <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE')}>Add to Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ eventModalShow: false })}>
                          <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Archive</Text>
                        </TouchableOpacity>
                        {/* </ImageBackground> */}
                      </SafeAreaView>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            </ScrollView>

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
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => this.handleParticipate('Yes')}>
                    <Text style={styles.modalText}>Yes</Text>
                  </TouchableOpacity>
                  <View style={styles.cellSeprator} />

                  <TouchableOpacity onPress={() => this.handleParticipate('No')}>
                    <Text style={styles.modalText}>No</Text>
                  </TouchableOpacity>
                  <View style={styles.cellSeprator} />

                  <TouchableOpacity onPress={() => this.handleParticipate('Maybe')}>
                    <Text style={styles.modalText}>Maybe</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.modalView, { marginTop: 15 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        modalVisible: false,
                      })
                    }
                  >
                    <Text style={[styles.modalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {this.state.userModal && this.state.profileDetail !== '' ? (
              <UserModal
                visible={this.state.userModal}
                inVisible={() => this.setState({ userModal: false })}
                userDetails={this.state.profileDetail}
                sendMessage={false}
                chat_id={this.state.profileDetail.chat_id}
                onPressSendMsg={() =>
                  this?.props?.navigation?.replace('SINGAL_CHAT', {
                    profileDetail: this?.state?.profileDetail,
                    is_block: this?.state?.profileDetail?.is_block,
                  })
                }
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
          </View>
        ) : null}
      </View>
      // </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    eventDetail: state?.eventState?.eventDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsScreen);
