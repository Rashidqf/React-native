import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  ImageBackground,
  SafeAreaView,
  RefreshControl,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES, COMMON_STYLE, COLORS } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import Icon from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';
import { compareDate } from '../../utils/validations';
import moment from 'moment';
class InboxConnections extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle}>
            {/* <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Chat</Text> */}
            <Image source={IMAGES.more} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        );
      },
      headerTitle: () => {
        return (
          <Text style={COMMON_STYLE.textStyle(14, COLORS.GRAY_100, 'BOLD', 'center')}>{`Inbox: ${
            this?.state?.currentTab === 'connection'
              ? 'Connections'
              : this?.state?.currentTab === 'sidenote'
              ? 'Sidenotes'
              : this?.state?.currentTab === 'event'
              ? 'Events'
              : this?.state?.currentTab === 'task'
              ? 'Task'
              : ''
          }`}</Text>
        );
      },
    });

    this.state = {
      isVisible: true,
      checked: true,
      modalShow: false,
      sidenoteModalshow: false,
      eventModalShow: false,
      taskModalShow: false,
      isMoreLoading: false,
      connectId: null,
      hideConnection: null,
      currentTab: 'connection',
      sidenoteCurrentPage: 1,
      connectionCurrentPage: 1,
      eventCurrentPage: 1,
      taskCurrentPage: 1,
      pinnedUserPage: 1,
      eventId: '',
      taskId: '',
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentIndex: 0,
      connectionList: [],
      monthList: [],
      pinnedConnection: [
        { id: 0, img: IMAGES.image1, name: 'Jazmine M', blueDote: 1, redDote: 1 },
        { id: 1, img: IMAGES.image1, name: 'Marybeth L', blueDote: 1 },
        { id: 2, img: IMAGES.image1, name: 'Jeff G', redDote: 1 },
      ],

      taskList: [
        {
          id: 0,
          taskTitle: 'Pick up cake from Publix',
          userImg: IMAGES.image1,
          name: 'Bryan J',
          hours: 'Today',
          day: 'Tues, June 7',
          time: '7:30pm - 9:45pm',
          sidenoteName: 'Sidenote Name',
          sidenoteCategory: 'Category',
        },
      ],
    };
  }

  static contextType = AppContext;

  componentDidMount() {
    this.getConnectionData(1);
    this.getMonthList();
    // this.getEventList(this.state?.currentMonth, 1);
    // this.getTaskList(this.state?.currentMonth, 1);
    this.getPinnedUserList(1);
  }
  getCurrentYear = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    this.setState({
      currentYear: year,
      currentMonth: month,
    });
    return year, month;
  };

  getConnectionData = page => {
    try {
      const params = {
        url: API_DATA.CONNECTIONS_LIST,
        data: {
          page: page || this.state?.connectionCurrentPage,
        },
      };
      this.props.showLoading(true);

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CONNECTIONS_LIST];

              this.setState({ isLoading: false, isRefreshing: false });

              if (resp.success) {
                // console.log('responce', resp);
                if (this.state?.connectionCurrentPage === 1) {
                  this.props.saveConnectionList(resp);
                } else {
                  this.props?.saveConnectionListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  connectionCurrentPage:
                    resp?.total_pages === this.state.connectionCurrentPage ? resp?.total_pages : this.state.connectionCurrentPage + 1,
                });
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
  };

  onRefresh() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getConnectionData(1);
    }, 500);
  }
  onRefresh2() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getSideNotesData(1);
    }, 500);
  }
  onEventRefresh() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getEventList(this.state.currentMonth, 1);
    }, 500);
  }
  onTaskRefresh() {
    this.setState({ isRefreshing: true });
    setTimeout(() => {
      this.getTaskList(this.state.currentMonth, 1);
      this.getMonthList();
    }, 500);
  }
  handleConnectConnections = () => {
    try {
      const params = {
        url: API_DATA.ACCEPTFRIEND,
        data: {
          invitation_id: this.state.connectId,
        },
      };
      this.props.showLoading(true);

      //  console.log(" this.state.connectId" ,  this.state.connectId, params)
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_LIST];
              this.setState({ isLoading: false });

              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                this.props?.removeConnection(this.state?.connectId);
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
  };

  handleConnectionHide = data => {
    try {
      const params = {
        url: API_DATA.ACCEPTFRIEND,
        data: {
          invitation_id: data?.id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.ACCEPTFRIEND];
              this.setState({ isLoading: false });

              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                this.props?.removeConnection(data?.id);
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
  };

  handleAccept = () => {
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_JOIN,
        data: {
          invitation_id: this.state.connectId,
          is_accept: 1,
        },
      };
      this.props.showLoading(true);
      this.setState({
        sidenoteModalshow: false,
      });
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_JOIN];
              this.setState({ isLoading: false });
              if (resp.success) {
                this.props.removeCard(this.state.connectId);
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
  handleArchive = data => {
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_JOIN,
        data: {
          invitation_id: data,
          is_accept: 0,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_JOIN];

              this.setState({ isLoading: false });
              if (resp.success) {
                this.props.removeCard(data);
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
  getEventList = (data, page) => {
    try {
      const params = {
        url: API_DATA.MONTH_EVENT_LIST,
        data: {
          monthYear: `${data + '-' + this.state.currentYear}`,
          page: page ? page : this.state.eventCurrentPage,
        },
      };
      {
        page === 1 || (this.state?.eventCurrentPage === 1 && this.props?.saveMonthlyEventList(null));
      }
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MONTH_EVENT_LIST];
              this.setState({ isLoading: false, isRefreshing: false });
              this.props.showLoading(false);

              if (resp.success) {
                if (page === 1 || this.state.eventCurrentPage === 1) {
                  this.props?.saveMonthlyEventList(resp);
                } else {
                  this?.props?.saveMonthlyEventListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  eventCurrentPage: this.state.eventCurrentPage + 1,
                });
              } else {
                this.props.showLoading(false);

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
  addToCalendarEvent = data => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          event_id: this?.state?.eventId,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              if (resp.success) {
                this.getEventList(this.state.currentMonth, 1);
                this.getMonthList();
                this?.props?.addToCalenderEvent(this?.state?.eventId);
                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
              }
              this?.props?.showLoading(false);
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };
  addToCalendarTask = data => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          task_id: this?.state?.taskId,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              console.log('task resp ', resp);
              if (resp.success) {
                this?.props?.addToCalenderTask(this?.state?.taskId);
                this.props.hideCalendarButton();
                this?.props?.(this?.state?.taskId);
                this.props.showToast(localize('SUCCESS'), resp.message);
              }
            });
            this?.props?.showLoading(false);
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  getMonthList = () => {
    fetch(`${API_DATA.BASE_URL}/${API_DATA.MONTHLY_COUNT}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.userData.access_token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this?.setState({ isRefreshing: false, monthList: res?.data });
        this.props.showLoading(false);
      })
      .catch(e => {
        this?.setState({ isRefreshing: false });

        this.props.showLoading(false);

        console.log('catch error =>>>>', e);
      });
  };
  getTaskList(data, page) {
    try {
      const params = {
        url: API_DATA.MONTH_TASK_LIST,
        data: {
          monthYear: `${data + '-' + this.state.currentYear}`,
          page: page ? page : this.state.taskCurrentPage,
        },
      };

      this.props.showLoading(true);

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MONTH_TASK_LIST];
              this.setState({ isLoading: false });
              if (resp.success) {
                if (page === 1 || this.state.taskCurrentPage === 1) {
                  this.props?.saveMonthlyTaskList(resp);
                } else {
                  this?.props?.saveMonthlyTaskListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  taskCurrentPage: this.state.taskCurrentPage + 1,
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
  }
  handleEventDetail = (eventId, index) => {
    this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId, Index: index });
  };

  handleTaskDetail = taskId => {
    console.log('taskId ===>', taskId);
    this?.props?.navigation?.navigate('TASK_DETAIL', { taskId });
  };

  getSideNotesData = page => {
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_LIST,
        data: {
          page: page || this.state?.sidenoteCurrentPage,
        },
      };
      this.props.showLoading(true);

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_LIST];
              // console.log('responce', resp);
              this.setState({ isLoading: false, isRefreshing: false });

              if (resp.success) {
                if (this.state?.sidenoteCurrentPage === 1) {
                  this.props.saveSidenoteList(resp);
                } else {
                  this.props?.saveSidenoteListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  sidenoteCurrentPage:
                    resp?.total_pages === this.state.sidenoteCurrentPage ? resp?.total_pages : this.state.sidenoteCurrentPage + 1,
                });
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
  };

  getPinnedUserList = page => {
    try {
      const params = {
        url: API_DATA.PINNED_USER_LIST,
        data: {
          monthYear: `${this.state?.currentMonth + '-' + this.state.currentYear}`,
          page: page ? page : this.state?.pinnedUserPage,
        },
      };

      this.props.showLoading(true);
      console.log('ftydfyg', params);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.PINNED_USER_LIST];
              this.setState({ isLoading: false });
              if (resp.success) {
                if (this.state?.pinnedUserPage === 1) {
                  this.props.savePinnedUser(resp);
                } else {
                  this.props.savePinnedUserLoadMore(resp);
                }
                this.setState({
                  pinnedUserPage: this.state.pinnedUserPage + 1,
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

  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={styles.iconTabNav}>
            <TouchableOpacity
              style={styles.iconTabBtn}
              onPress={() => {
                this.setState({ currentTab: 'connection' });
                this.getConnectionData(1);
              }}
            >
              <Image
                source={IMAGES.link_circle_icon}
                style={[styles.iconTabIcon, this?.state?.currentTab === 'connection' && styles.iconTabIconActive]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconTabBtn}
              onPress={() => {
                this.setState({ currentTab: 'sidenote' });
                this.getSideNotesData(1);
              }}
            >
              <Image
                source={IMAGES.chat_name_icon}
                style={[styles.iconTabIcon, this?.state?.currentTab === 'sidenote' && styles.iconTabIconActive]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconTabBtn}
              onPress={() => {
                this.setState({ currentTab: 'event' });
                this.getEventList(this.state?.currentMonth, 1);
              }}
            >
              <Image
                source={IMAGES.calendar_icon2}
                style={[styles.iconTabIcon, this?.state?.currentTab === 'event' && styles.iconTabIconActive]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconTabBtn}
              onPress={() => {
                this.setState({ currentTab: 'task' });
                this.getTaskList(this.state?.currentMonth, 1);
              }}
            >
              <Image
                source={IMAGES.task_icon2}
                style={[styles.iconTabIcon, this?.state?.currentTab === 'task' && styles.iconTabIconActive]}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            {this.state.currentTab === 'connection' ? (
              this.props.connectionList?.data?.length ? (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={this?.props?.connectionList?.data || []}
                    renderItem={({ item, index }) => {
                      // console.log("item", item.user.id);
                      // console.log("item" , item)
                      return (
                        <View style={styles.listItem}>
                          <Image source={item?.user?.img} style={styles.listItemUimg} />
                          <View style={styles.listItemContent}>
                            <Text style={styles.listItemTitle}>{item?.user?.name}</Text>
                            <Text style={styles.sidenoteCountTxt}>in {item.mutual_group} Sidenotes together</Text>
                            <View style={styles.listBtnRow}>
                              <TouchableOpacity
                                style={styles.btnOrange}
                                onPress={() => this.setState({ modalShow: true, connectId: item.id })}
                              >
                                <Text style={styles.btnOrangeTxt}>Connect</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.btnOutlineGray} onPress={() => this.handleConnectionHide(item)}>
                                <Text style={styles.btnOutlineGrayTxt}>Hide</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        tintColor={theme?.colors?.WHITE}
                        onRefresh={() => this.onRefresh()}
                      />
                    }
                    onEndReached={() => {
                      if (
                        this?.props?.connectionList?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.connectionList?.total_count !== this.props?.connectionList?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getConnectionData(this.state.connectionCurrentPage);
                      }
                    }}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.flatlistContentContainerStyle}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} />}
                  />
                </View>
              ) : (
                <NoDataFound
                  title="Nothing to see"
                  text="You don’t have any Connections"
                  titleColor={theme?.colors?.GRAY_50}
                  textColor={theme?.colors?.GRAY_100}
                  titleFontSize={20}
                  source={IMAGES.noChatImage}
                  imageWidth={205}
                  imageHeight={156}
                />
              )
            ) : this.state.currentTab === 'sidenote' ? (
              this.props.sidenoteList?.data?.length ? (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={this.props?.sidenoteList?.data || []}
                    renderItem={({ item }) => {
                      return (
                        <View style={styles.listItem}>
                          <Image source={{ uri: item.group.image }} style={styles.listItemUimg} />
                          <View style={[styles.listItemContent, { marginLeft: 10 }]}>
                            <View style={{ flexDirection: 'row' }}>
                              <View style={{ flex: 1 }}>
                                <Text style={styles.listItemTitle} numberOfLines={1}>
                                  {item.group.title}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Image source={{ uri: item.user.image }} style={styles.userImg} />
                                  <Text style={styles.userImgName} numberOfLines={1}>
                                    {item.user.name}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.multipleImgsView}>
                                {/* {item.group.members[0].user.image ? (
                                  <> */}
                                <Image source={{ uri: item.group.members[0].user.image }} style={styles.multipleImgs1} />
                                <Image source={{ uri: item.group.members[0].user.image }} style={styles.multipleImgs2} />
                                <Image source={{ uri: item.group.members[0].user.image }} style={styles.multipleImgs3} />
                                {/* </>
                                ) : null} */}

                                {item.group.total_members && item.group.total_members > 0 && (
                                  <View style={styles.multipleImgsCount}>
                                    <Text style={styles.multipleImgsCountTxt}>+{item.group.total_members}</Text>
                                  </View>
                                )}
                              </View>
                              {/* <View style={styles.multipleImgsView}>
                              {item?.group?.members?.length > 2 ? (
                                <>
                                  <Image source={{ uri: item?.group?.members[0]?.user?.image }} style={styles.multipleImgs1} />
                                  <Image source={{ uri: item?.group?.members[1]?.user?.image }} style={styles.multipleImgs2} />
                                  <Image source={{ uri: item?.group?.members[2]?.user?.image }} style={styles.multipleImgs3} />
                                </>
                              ) : (
                                <View style={styles.sidenotImgCol}>
                                  <Image
                                    source={item?.image ? { uri: item?.image } : IMAGES.image}
                                    style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10, marginLeft: 20 }}
                                  />
                                </View>
                              )}
                            </View> */}
                            </View>
                            <View style={[styles.listBtnRow, { marginTop: 0 }]}>
                              <TouchableOpacity
                                style={styles.btnOrange}
                                onPress={() => this.setState({ sidenoteModalshow: true, connectId: item?.id })}
                              >
                                <Text style={styles.btnOrangeTxt}>Accept</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.btnOutlineGray}>
                                <Text style={styles.btnOutlineGrayTxt} onPress={() => this.handleArchive(item?.id)}>
                                  Archive
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        tintColor={theme?.colors?.WHITE}
                        onRefresh={() => this.onRefresh2()}
                      />
                    }
                    onEndReached={() => {
                      if (
                        this?.props?.sidenoteList?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.sidenoteList?.total_count !== this.props?.sidenoteList?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getSideNotesData(this.state.sidenoteCurrentPage);
                      }
                    }}
                    contentContainerStyle={styles.flatlistContentContainerStyle}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} />}
                  />
                </View>
              ) : (
                <NoDataFound
                  title="Nothing to see"
                  text="You don’t have any Sidenotes"
                  titleColor={theme?.colors?.GRAY_50}
                  textColor={theme?.colors?.GRAY_100}
                  titleFontSize={20}
                  source={IMAGES.noChatImage}
                  imageWidth={205}
                  imageHeight={156}
                />
              )
            ) : this.state.currentTab === 'event' ? (
              <View style={{ flex: 1 }}>
                <View>
                  <FlatList
                    data={this.state.monthList}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={index === this?.state?.currentIndex ? styles.monthItemActive : styles.monthItem}
                          onPress={() => {
                            this.getEventList(item?.monthNumber, 1);
                            this.setState({ currentMonth: item.monthNumber, taskCurrentPage: 1, currentIndex: index });
                          }}
                        >
                          <Text style={index === this?.state?.currentIndex ? styles.monthItemTxtActive : styles.monthItemTxt}>
                            {item.month} {item.month ? <Text>{item.events !== 0 ? '(' + item?.events + ')' : ''}</Text> : null}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    style={{ marginTop: Responsive.getWidth(4) }}
                    showsVerticalScrollIndicator={false}
                    horizontal={true}
                  />
                </View>
                <View>
                  <FlatList
                    data={this.props?.pinnedUser?.data || []}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity style={styles.pinnedItem}>
                          <Image source={item.to_user?.image ? { uri: item.to_user?.image } : IMAGES.image} style={styles.pinnedItemImg} />
                          <Text style={styles.pinnedItemName} numberOfLines={1}>
                            {item.to_user?.name}
                          </Text>
                          <View style={styles.pinnedDotsRow}>
                            {item.event > 0 ? <View style={styles.blueDote} /> : null}
                            {item.task > 0 ? <View style={styles.redDote} /> : null}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    onEndReached={() => {
                      if (
                        this?.props?.pinnedUser?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.pinnedUser?.total_count !== this.props?.pinnedUser?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getPinnedUserList(this.state?.currentMonth, this.state.pinnedUserPage);
                      }
                    }}
                    style={{ marginTop: Responsive.getWidth(4) }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={{ paddingLeft: Responsive.getWidth(2) }}
                    ItemSeparatorComponent={() => <View style={styles.hItemSepratorStyle} />}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={this?.props?.monthlyEventList?.data || []}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        tintColor={theme?.colors?.WHITE}
                        onRefresh={() => this.onEventRefresh()}
                      />
                    }
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={styles.eventListItem}
                          onPress={() => {
                            this.handleEventDetail(item?.id, index);
                          }}
                        >
                          <View style={styles.eventImgView2}>
                            <Image
                              source={item?.media?.length ? { uri: item.media[item?.media?.length - 1]?.url } : IMAGES?.image}
                              style={styles.eventImg2}
                            />

                            {!item?.is_calendar ? (
                              <TouchableOpacity
                                style={[item?.is_itinerary ? styles.eventItineraryBtn : styles.eventCalendarBtn]}
                                onPress={() => this.setState({ eventModalShow: true, eventId: item?.id })}
                              >
                                <Image source={IMAGES.calAddIcon} style={styles.eventCalendarBtnIcon} />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          <View style={styles.eventListItemContent}>
                            {console.log('item.user', item)}
                            <View style={styles.eventUsrRow2}>
                              <Image
                                source={item?.createdBy?.image ? { uri: item?.createdBy?.image } : IMAGES?.image}
                                style={styles.eventUsrImg2}
                              />
                              <Text style={styles.eventUsrName2} numberOfLines={1}>
                                {item?.createdBy?.name}
                              </Text>
                            </View>
                            <Text style={styles.hoursTxt}>{`${compareDate(item.date)}`}</Text>
                            <Text style={styles.dayTxt}>{moment(item.date).format('ddd, MMM D')}</Text>
                            <Text style={styles.eventTitle} numberOfLines={1}>
                              {item?.eventTitleIcon ? <Image source={item.eventTitleIcon} style={styles.eventTitleIcon} /> : null}
                              {item?.title}
                            </Text>
                            <Text style={styles.timeTxt}>{item.is_fullday ? 'Fullday' : moment(item.start_time).format('hh:mm A')}</Text>
                            {item?.chat_name !== '' || item?.chat_category !== '' ? (
                              <View style={styles.sidenoteRow}>
                                <Image source={IMAGES.CHATS_TAB} style={styles.sidenoteIcon} />
                                <Text style={styles.sidenoteTxt}>
                                  {' '}
                                  {`${item?.chat_name},`} {item?.chat_category}
                                </Text>
                              </View>
                            ) : item?.is_private === 1 ? (
                              <Image source={IMAGES.lock} style={styles.globeIcon} />
                            ) : item?.is_itinerary === 1 ? (
                              <View style={styles.sidenoteRow}>
                                <Image source={IMAGES.notes_icon} style={[styles.sidenoteIcon]} />
                                <Text style={styles.sidenoteTxt}> {item?.itinerary?.title}</Text>
                              </View>
                            ) : (
                              <Image source={IMAGES.globe_color_icon} style={styles.globeIcon} />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    onEndReached={() => {
                      if (
                        this?.props?.monthlyEventList?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.monthlyEventList?.total_count !== this.props?.monthlyEventList?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getEventList(this.state?.currentMonth, this.state.eventCurrentPage);
                      }
                    }}
                    contentContainerStyle={styles.flatlistContentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} />}
                  />
                </View>
              </View>
            ) : this.state.currentTab === 'task' ? (
              <View style={{ flex: 1 }}>
                <View>
                  <FlatList
                    data={this.state.monthList}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={index === this?.state?.currentIndex ? styles.monthItemActive : styles.monthItem}
                          onPress={() => {
                            this.getTaskList(item?.monthNumber, 1);
                            this.setState({ currentMonth: item.monthNumber, taskCurrentPage: 1, currentIndex: index });
                          }}
                        >
                          <Text style={index === this?.state?.currentIndex ? styles.monthItemTxtActive : styles.monthItemTxt}>
                            {item.month} {item.month ? <Text>{item.tasks !== 0 ? '(' + item?.tasks + ')' : ''}</Text> : null}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    style={{ marginTop: Responsive.getWidth(4) }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                  />
                </View>
                <View>
                  <FlatList
                    data={this?.props?.pinnedUser?.data || []}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity style={styles.pinnedItem}>
                          <Image source={item.to_user?.image ? { uri: item.to_user?.image } : IMAGES.image} style={styles.pinnedItemImg} />
                          <Text style={styles.pinnedItemName} numberOfLines={1}>
                            {item.to_user?.name}
                          </Text>
                          <View style={styles.pinnedDotsRow}>
                            {item.event > 0 ? <View style={styles.blueDote} /> : null}
                            {item.task > 0 ? <View style={styles.redDote} /> : null}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    onEndReached={() => {
                      if (
                        this?.props?.pinnedUser?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.pinnedUser?.total_count !== this.props?.pinnedUser?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getPinnedUserList(this.state?.currentMonth, this.state.pinnedUserPage);
                      }
                    }}
                    style={{ marginTop: Responsive.getWidth(4) }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={{ paddingLeft: Responsive.getWidth(2) }}
                    ItemSeparatorComponent={() => <View style={styles.hItemSepratorStyle} />}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={this?.props?.monthlyTaskList?.data || []}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.isRefreshing}
                        tintColor={theme?.colors?.WHITE}
                        onRefresh={() => this.onTaskRefresh()}
                      />
                    }
                    renderItem={({ item, index }) => {
                      {
                        console.log('time ', item);
                      }
                      return (
                        <TouchableOpacity style={styles.listItem} onPress={() => this.handleTaskDetail(item?.id)}>
                          <View style={styles.listItemContent}>
                            <View style={styles.eventUsrRow}>
                              <Image
                                source={item?.createdBy?.image ? { uri: item?.createdBy?.image } : IMAGES.image}
                                style={styles.eventUsrImg}
                              />
                              <Text style={styles.eventUsrName} numberOfLines={1}>
                                {item?.createdBy?.name}
                              </Text>
                            </View>
                            <Text style={styles.taskTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                            {item?.assigned_group_title ? (
                              <View style={styles.sidenoteRow}>
                                <Image source={IMAGES.notes_icon} style={styles.sidenoteIcon2} />
                                <Text style={styles.sidenoteTxt}> {item?.assigned_group_title}</Text>
                              </View>
                            ) : null}
                            {item?.is_calendar ? null : (
                              <TouchableOpacity
                                style={styles.calendarBtn}
                                onPress={() => this.setState({ taskModalShow: true, taskId: item?.id })}
                              >
                                <Image source={IMAGES.calAddIcon} style={styles.calendarBtnIcon} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    onEndReached={() => {
                      if (
                        this?.props?.monthlyTaskList?.total_pages !== 1 &&
                        !this.state.isMoreLoading &&
                        this?.props?.monthlyTaskList?.total_count !== this.props?.monthlyTaskList?.data.length
                      ) {
                        this.setState({ isMoreLoading: true });
                        this.getTaskList(this.state?.currentMonth, this.state.taskCurrentPage);
                      }
                    }}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.flatlistContentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} />}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </SafeAreaWrapper>

        {/* Start Connection Modal */}
        <Modal animationType="slide" transparent={true} visible={this.state.modalShow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ modalShow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.modalContainer}>
              <View style={styles.modalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.modalbodyBg}>
                  <View style={styles.modalSafeAreaView}>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text
                        style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}
                        onPress={() => this.handleConnectConnections()}
                      >
                        Confirm connection
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ modalShow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* END Connection Modal */}
        <Modal animationType="slide" transparent={true} visible={this.state.sidenoteModalshow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ sidenoteModalshow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.sidenoteModalContainer}>
              <View style={styles.sidenoteModalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.sidenoteModalbodyBg}>
                  <View style={styles.sidenoteModalSafeAreaView}>
                    <TouchableOpacity style={styles.sidenoteModalBtn} onPress={() => this.handleAccept()}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}>Join this sidenote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sidenoteModalBtn} onPress={() => this.setState({ sidenoteModalshow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={this.state.eventModalShow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ eventModalShow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.eventModalContainer}>
              <View style={styles.eventModalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.eventModalbodyBg}>
                  <View style={styles.eventModalSafeAreaView}>
                    <TouchableOpacity
                      style={[styles.eventModalBtn]}
                      onPress={() => {
                        this.addToCalendarEvent(), this.setState({ eventModalShow: false });
                      }}
                    >
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.BLUE_100, 'BASE')}>Add to Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eventModalBtn} onPress={() => this.setState({ eventModalShow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal animationType="slide" transparent={true} visible={this.state.taskModalShow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ taskModalShow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.taskModalContainer}>
              <View style={styles.taskModalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.taskModalbodyBg}>
                  <View style={styles.taskModalSafeAreaView}>
                    <TouchableOpacity
                      style={[styles.taskModalBtn]}
                      onPress={() => {
                        this.addToCalendarTask(), this.setState({ taskModalShow: false });
                      }}
                    >
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}>Add to Calendar</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.taskModalBtn}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Archive</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.taskModalBtn} onPress={() => this.setState({ taskModalShow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    myConnections: state?.dashboardState?.myConnections,
    chatDetail: state?.groupState?.chatDetail,
    groupList: state?.dashboardState?.groupList,
    monthlyEventList: state?.eventState?.monthlyEventList,
    sidenoteList: state?.eventState?.sidenoteList,
    monthlyTaskList: state?.eventState?.monthlyTaskList,
    connectionList: state?.eventState?.connectionList,
    pinnedUser: state?.eventState?.pinnedUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(InboxConnections);
