import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatListList,
  SectionList,
  TextInput,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, FONTS } from '@themes';

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
import Icon from 'react-native-vector-icons/Feather';
import { AppContext } from '../../themes/AppContextProvider';
import { UserModal } from '@components';

class NewItineraryDetailsScreen extends React.Component {
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
      eventList: [],
      itineraryDetails: this?.props?.itineraryDetails,
    };
  }
  static contextType = AppContext;

  getItineraryDetails = values => {
    try {
      let params = {
        url: API_DATA.ITINERARY_DETAILS,
        data: {
          id: this?.props?.route?.params?.id,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.ITINERARY_DETAILS];
            if (resp.success) {
              // this.setState({ itineraryDetails: resp?.data });
              this?.props?.saveItineraryDetails(resp?.data);
              const eventList = resp?.data?.events?.reduce((acc, cur) => {
                const dateIndex = acc.findIndex(item => moment(item.title).format('DD/MM/YYYY') === moment(cur.date).format('DD/MM/YYYY'));

                let newAcc = [...acc];
                if (dateIndex > -1) {
                  newAcc[dateIndex].data = [...newAcc[dateIndex].data, cur];
                } else {
                  newAcc.push({
                    title: cur?.date,
                    data: [cur],
                  });
                }

                return newAcc;
              }, []);
              this.setState({ eventList: eventList });

              // this.props.showToast(localize('SUCCESS'), resp.message);

              // this.props.showLoading(false);
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(err => {
          this.props.showLoading(false);
        });
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };
  publishItinerary = values => {
    try {
      let params = {
        url: API_DATA.PUBLISH_ITINERARY,
        data: {
          id: this?.props?.route?.params?.id,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.PUBLISH_ITINERARY];
            if (resp.success) {
              this?.props?.navigation?.navigate('TAB_NAVIGATOR');

              this.props.showToast(localize('SUCCESS'), resp.message);
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(err => {
          this.props.showLoading(false);
        });
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };
  componentDidMount() {
    this.getItineraryDetails();
  }

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
  handlePress = (id, itemIndex) => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          event_id: id,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              this.setState({ isLoading: false });
              if (resp.success) {
                console.log('item index ===>', resp);
                const updatedSections = [...this?.state?.eventList];

                updatedSections.data[itemIndex].is_calendar = 0;

                this.setState({
                  eventList: updatedSections,
                });
                console.log('updated scetion ', updatedSections);
                // this.props?.addToEvent(id)
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

  openMap = (location, latitude, longitude) => {
    const dAddr = `${latitude},${longitude}`;
    const company = Platform.OS === 'ios' ? 'apple' : 'google';
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${location}`);
    // Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${location}`);
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const itineraryDetail = this.props?.itineraryDetails;
    const userData = this?.props?.userData;

    return (
      <View style={{ flex: 1, marginLeft: 0, marginRight: 0, backgroundColor: theme?.colors?.BLACK }}>
        <View style={[styles.eventContainer, { flex: 1 }]}>
          <View style={styles.eventItem}>
            <TouchableOpacity style={styles.eventImageView}>
              {/* {itineraryDetail?.media ? <Image source={IMAGES.eventImage} style={styles.eventImage} /> : null} */}
              {itineraryDetail?.media[itineraryDetail?.media?.length - 1]?.url != '' ? (
                <Image source={{ uri: itineraryDetail?.media[itineraryDetail?.media?.length - 1]?.url }} style={styles.eventImage} />
              ) : (
                <Image source={IMAGES.upload_img_placeholder} style={styles.eventImage} />
              )}

              <LinearGradient
                colors={['transparent', 'rgba(26, 31, 35,0.2)', 'rgba(26, 31, 35,0.7)', theme?.colors?.BLACK]}
                style={styles.eventContent}
              >
                <View style={styles.eventContentTop}>
                  <TouchableOpacity style={styles.headerBtnStyle} onPress={() => this.props.navigation.goBack()}>
                    <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
                  </TouchableOpacity>
                  {itineraryDetail?.is_published === 0 ? (
                    <>
                      {userData?.userInfo?.id === itineraryDetail?.user_id && (
                        <TouchableOpacity
                          style={[styles.smallBtn, { backgroundColor: theme?.colors?.ORANGE_200 }]}
                          onPress={() => this?.publishItinerary()}
                        >
                          <Text style={[styles.smallBtnText, { color: theme?.colors?.WHITE }]}>Publish</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : null}
                </View>
                <View style={styles.eventContentRow}>
                  <View style={[styles.body, { flexDirection: 'row' }]}>
                    <Icon name={'clipboard'} size={25} color={theme?.colors?.PURPLE_500} />
                    <View style={{ flex: 1, paddingLeft: Responsive.getWidth(3) }}>
                      <Text style={styles.eventTitle}>{itineraryDetail?.title}</Text>
                      <Text style={styles.eventText}>{moment(itineraryDetail?.date).format('dddd, MMMM D')}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.ScrollView} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              <View style={[styles.listItem, { alignItems: 'flex-start' }]}>
                {console.log('itineraryDetailitineraryDetail', JSON.stringify(itineraryDetail))}
                <Image source={IMAGES.image1} style={styles.listUserImg} />
                <Text style={[styles.listItemTxt, { paddingTop: 5 }]}>
                  {itineraryDetail?.user?.name} <Text style={[styles.listItemTxtIn]}>created this itinerary</Text>
                </Text>
              </View>
              <View style={styles.listItem}>
                <Image source={IMAGES.mapPin} style={styles.listItemIcon} resizeMode={'stretch'} />
                <TouchableOpacity
                  onPress={() => this.openMap(itineraryDetail?.location, itineraryDetail?.latitude, itineraryDetail?.longitude)}
                >
                  <Text style={styles.listItemTxt}>
                    {itineraryDetail?.location}
                    {'\n'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.listItem}>
                <Image source={IMAGES.notes} style={[styles.listItemIcon]} resizeMode={'stretch'} />
                <Text style={styles.listItemTxt}>{itineraryDetail?.description}</Text>
              </View>
              {itineraryDetail?.is_reminder === 1 ? (
                <View style={styles.listItem}>
                  <Image source={IMAGES.bellIcon} style={[styles.listItemIcon]} resizeMode={'stretch'} />
                  <Text style={styles.listItemTxt}>15 minutes before event</Text>
                </View>
              ) : null}

              {this?.state?.eventList?.length != 0 ? (
                <SectionList
                  scrollEnabled={false}
                  sections={this?.state?.eventList || []}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  nestedScrollEnabled={true}
                  renderItem={({ item, section, index }) => (
                    <View style={styles.eventItem2}>
                      {/* <Image source={IMAGES.eventImage} style={styles.eventItemImg} /> */}
                      {item?.media[item?.media?.length - 1]?.url != '' ? (
                        <Image source={{ uri: item?.media[item?.media?.length - 1]?.url }} style={styles.eventItemImg} />
                      ) : (
                        <Image source={IMAGES.upload_img_placeholder} style={styles.eventItemImg} />
                      )}
                      <View style={styles.eventContent2}>
                        <Image source={IMAGES.image1} style={styles.eventUserImg} />
                        <Text style={styles.eventItemDate}>{moment(item?.date).format('ddd, MMMM D')}</Text>
                        <Text style={styles.eventItemTitle}>{item?.title}</Text>
                        {item?.start_time ? <Text style={styles.eventItemTime}>{item?.time}</Text> : null}
                        <Text style={styles.eventItemName}>
                          <Icon name={'clipboard'} size={15} color={theme?.colors?.PURPLE_500} />
                          {'  '}
                          {itineraryDetail?.title}
                        </Text>
                      </View>

                      {userData?.userInfo?.id === itineraryDetail?.user_id && (
                        <TouchableOpacity
                          style={[
                            styles.smallBtn,
                            { backgroundColor: theme?.colors?.PURPLE_500, position: 'absolute', top: 5, right: 5, height: 25, width: 60 },
                          ]}
                          onPress={() => {
                            this.props.navigation.navigate('UPDATE_EVENT', {
                              Id: item?.id,
                              isItinerary: true,
                            });
                          }}
                        >
                          <Text style={[styles.smallBtnText, { color: theme?.colors?.WHITE }]}>Edit</Text>
                        </TouchableOpacity>
                      )}
                      {console.log('item?.===>', index)}
                      {/* {
                      item?.is_calendar !== 1 ?  */}
                      {/* <TouchableOpacity onPress={() => this.handlePress(item?.id,index )}>
                      <Text style={{color:"white"}}>
  click
                      </Text>
                      </TouchableOpacity> */}
                      {/* :null
                    } */}
                    </View>
                  )}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.SectionListTitle}>{moment(title).format('dddd,  MMMM D')}</Text>
                  )}
                />
              ) : null}
              {itineraryDetail?.guests?.length ? (
                <View style={[styles.listItem, { marginTop: Responsive.getWidth(5) }]}>
                  <Image source={IMAGES.userIcon} style={styles.listItemIcon} />

                  <Text style={styles.listItemTxt}>
                    {itineraryDetail?.guests?.length} Guests{'\n'}
                    {/* <Text style={[styles.listItemTxtIn]}>1 yes, 2 no, 1 maybe</Text> */}
                  </Text>
                </View>
              ) : null}

              <FlatList
                bounces={false}
                data={itineraryDetail?.guests || []}
                numColumns={4}
                contentContainerStyle={{ marginTop: 30 }}
                renderItem={({ item }) => {
                  return (
                    <View style={{ paddingLeft: Responsive.getWidth(10) }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.getConnectionDetails(item?.group?.user_id);
                          this.setState({ userModal: true });
                        }}
                      >
                        <View style={[styles.listItem, { alignItems: 'flex-start' }]}>
                          <Image source={IMAGES.image1} style={styles.listUserImg} />
                          <View style={{ paddingLeft: Responsive.getWidth(2) }}>
                            <Text style={[styles.listItemTxt, { paddingLeft: 0 }]}>{item?.group?.title || item?.user?.name}</Text>
                            {/* <Text style={[styles.listItemTxtIn]}>Event organizer</Text> */}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              {userData?.userInfo?.id === itineraryDetail?.user_id && (
                <View style={styles.stickyButton}>
                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => {
                      this?.props?.navigation.push('New_Itinerary', {
                        isEdit: true,
                        id: this?.props?.route?.params?.id,
                      });
                    }}
                  >
                    <Text style={{ color: theme?.colors?.WHITE, fontSize: 14, fontFamily: FONTS.BOLD, marginLeft: 8 }}>Edit</Text>
                  </TouchableOpacity>
                  {!itineraryDetail?.is_published ? (
                    <TouchableOpacity
                      style={styles.draftButton}
                      onPress={() => {
                        this?.props?.navigation?.navigate('TAB_NAVIGATOR');
                        this.props.showToast(localize('SUCCESS'), 'Itinerary saved');
                      }}
                    >
                      <Text style={{ color: theme?.colors?.WHITE, fontSize: 14, fontFamily: FONTS.BOLD }}>Save as draft</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
          </ScrollView>
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
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    eventDetail: state?.eventState?.eventDetail,
    itineraryDetails: state?.dashboardState?.itineraryDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(NewItineraryDetailsScreen);
