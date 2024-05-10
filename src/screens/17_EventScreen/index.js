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
  Alert,
  Modal,
  RefreshControl,
  ImageBackground,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Calendar from 'react-native-calendars/src/calendar';
import { DateData } from 'react-native-calendars';

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

//import style
import { style } from './style';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import NoDataFound from '../../components/noDataFound';
import LinearGradient from 'react-native-linear-gradient';
import { compareDate } from '../../utils/validations';
import { AppContext } from '../../themes/AppContextProvider';
import { Responsive } from '@helpers';

class EventScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      eventDetails: null,
      selected: [],
      going: '',
      isRefreshing: false,
      user: {},
      modalVisible: false,
      date: new Date(),
      openExpand: [],
      listIndex: '',
      isLoading: true,
      calendarData: {},
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
      selectedDate: moment(new Date()).format('YYYY-MM-DD'),
      isCollapsed: true,
      isChecked: true,
      isCheckItem: true,
      isFooterVisible: false,
      taskId: '',
      openTaskId: null,
      selectSubTaskId: null,
      storeDate: '',
      selectedMonth: '',
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static contextType = AppContext;

  onChange(id) {
    let selected = this.state.selected;
    let find = selected.indexOf(id);

    if (find > -1) {
      selected.splice(find, 1);
    } else {
      selected.push(id);
    }

    this.setState({ selected });
  }
  componentDidMount() {
    // this.getEventList();
    this.getCalenderData();
    this?.props?.navigation?.setParams({
      getEventList: this.getEventList,
    });
    this.getTaskList(this?.state?.oldTaskEnable);
    this?.props?.navigation?.setParams({
      getTaskList: this.getTaskList,
    });
  }

  onDateChange(date) {
    this.setState({ date: date });
  }

  handleDayPress = data => {
    // make selected false and set one date to true.
    const result = Object.fromEntries(
      Object.entries(this.state.calendarData).map(([key, value]) => {
        return [key, { ...(value || {}), selected: key === data.dateString }];
      }),
    );

    // Set updated data to state.
    this.setState({ calendarData: result });

    // Call function for fetch date wise data
    this.setState({ storeDate: data });
    this.getCalendarDataDay(data);
  };

  onMonthChange = data => {
    console.log('onMonthChange', data);
    this?.setState({ selectedMonth: data });
    this.getCalenderData(data);
  };

  toggleCollapse = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  checkBox = () => {
    this.setState(prevState => ({
      isChecked: !prevState.isChecked,
    }));
  };

  subTaskListItem = subTaskTd => {
    this.setState(prevState => ({
      isCheckItem: !prevState.isCheckItem,
      selectSubTaskId: subTaskTd,
    }));
    try {
      const params = {
        url: API_DATA.TASKCOMPLETE,
        data: {
          id: subTaskTd,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKCOMPLETE];
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                // this.props.saveTaskListComplete(resp.data, taskID, parentId);
                // this.handleTaskDetail();
                this.getDashboardList();
                this.getTaskList();
                // this.props.saveTaskComplete(resp.data, taskID, state);
                // if (this.props.taskList) {
                // this.props.showToast(localize('SUCCESS'), resp.message);
                // this.props.saveTaskListComplete(resp.data, taskID, parentId, status);
                // }
                // this.props.saveTaskCompleteInChat(resp.data, taskID);

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
    } catch (error) {
      console.log('subtask api error', error);
    }
  };

  getCalenderData = async date => {
    try {
      const params = {
        url: API_DATA.USER_CALENDAR_MONTH,
        data: {
          monthYear: date ? `${date.month}-${date.year}` : `${this.state.currentMonth}-${this.state.currentYear}`,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(async response => {
            let resp = response[API_DATA.USER_CALENDAR_MONTH];
            if (resp.success) {
              this.props.showLoading(false);
              const event = { key: 'event', color: '#315EFF', selectedDotColor: '#FC5401' };
              const task = { key: 'task', color: '#FC5401', selectedDotColor: '#FC5401' };
              let data = {};

              resp.data.map((obj, index) => {
                if (obj.event > 0 && obj.task > 0) {
                  return (data = {
                    ...data,
                    [obj.date]: { dots: [event, task], selected: false, selectedColor: '#FC5401', disabled: false },
                  });
                } else if (obj.event > 0) {
                  return (data = { ...data, [obj.date]: { dots: [event], selected: false, selectedColor: '#FC5401', disabled: false } });
                } else if (obj.task > 0) {
                  return (data = { ...data, [obj.date]: { dots: [task], selected: false, selectedColor: '#FC5401', disabled: false } });
                }
              });

              // Set selected true if today date is exist
              const checkTodayDateExist = Object.keys(data).some(obj => obj === moment(new Date()).format('YYYY-MM-DD'));
              const todayDate = moment(new Date()).format('YYYY-MM-DD');
              const result = checkTodayDateExist ? { ...data, [todayDate]: { ...data[todayDate], selected: true } } : { ...data };
              this.setState({ calendarData: { ...result } });

              // if (Object.keys(data)[0]) {
              // this.getCalendarDataDay({ dateString: Object.keys(data)[0] });
              this.getCalendarDataDay({ dateString: date?.dateString });
              // } else {
              //   this.setState({ isLoading: false, isRefreshing: false });
              //   this.props.showLoading(false);
              //   this?.props?.saveEventList([]);
              // }
            } else {
              this.props.showLoading(false);
              this.setState({ isLoading: false, isRefreshing: false });
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          })
          .catch(err => {
            this.setState({ isLoading: false, isRefreshing: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      this.props.showLoading(false);
      console.log('catch error >>>', e);
    }
  };

  getCalendarDataDay = data => {
    try {
      const params = {
        url: API_DATA.USER_CALENDAR_DAY,
        data: { date: data ? data.dateString : moment(new Date()).format('YYYY-MM-DD') },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.USER_CALENDAR_DAY];

              this.setState({ isLoading: false });
              if (resp.success) {
                this?.props?.saveEventList([
                  ...resp?.data?.event?.map(item => ({ ...item, isEvent: true })),
                  ...resp?.data?.task?.map(item => ({ ...item, isTask: true })),
                ]);

                this?.setState({
                  isLoading: false,
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
              const { theme } = this.context;
              const styles = style(theme);
              if (resp.success) {
                // const keysValues = {
                //   pastEvents: 'Past',

                //   todayEvents: (
                //     <View style={styles.sectionHeader}>
                //       <Text style={styles.sectionHeaderTitle}>Today</Text>
                //     </View>
                //   ),
                //   tomorrowEvents: (
                //     <View style={[styles.sectionHeader]}>
                //       <Text style={styles.sectionHeaderTitle}>Tomorrow</Text>
                //     </View>
                //   ),
                //   futureEvents: (
                //     <View style={styles.sectionHeader}>
                //       <Text style={styles.sectionHeaderTitle}>Upcoming</Text>
                //     </View>
                //   ),
                // };
                // let data = [];
                // Object.keys(resp?.data)?.forEach((item, index) => {
                //   if (item !== 'pastEvents') {
                //     if (resp?.data[item]?.length) {
                //       data.push({
                //         title: keysValues[item],
                //         data: resp?.data[item],
                //         index: index,
                //         isFutureEvent: item === 'futureEvents' ? true : false,
                //       });
                //     }
                //   }
                // });
                this?.props?.saveEventList([
                  ...resp?.data?.event?.map(item => ({ ...item, isEvent: true })),
                  ...resp?.data?.task?.map(item => ({ ...item, isTask: true })),
                ]);
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

  handleRefresh = () => {
    this.setState({ isRefreshing: true });
    this.getEventList(), this.setState({ isRefreshing: false });
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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  getEventParticipate = item => {
    var userData = this.state.user;
    try {
      const params = {
        url: API_DATA.EVENTPARTICIPATE,
        data: {
          id: userData.id,
          user_id: this.props.userData?.userInfo?.id,
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
                if (this.state.going === 'Yes') {
                  this.props.showToast(localize('SUCCESS'), 'Checked-in successfully!');
                } else if (this.state.going === 'No') {
                  this.props.showToast(localize('SUCCESS'), 'Thanks for your feedback!');
                } else {
                  this.props.showToast(localize('SUCCESS'), 'Thanks for the acknowledgement!');
                }
                this?.props?.saveEventParticipate(resp, userData.id, this.state.going, this.state.listIndex);
                // this.getEventList();
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            // this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  handleEventDetail = (eventId, index) => {
    this.setState({ listIndex: index });
    this?.props?.navigation?.navigate('EVENT_DETAILS', { eventId, Index: index });
  };
  handleParticipate(value) {
    this.setState({ going: value, modalVisible: false });
    setTimeout(() => {
      this.getEventParticipate();
    }, 500);
  }

  handleEditEvent = eventId => {
    this.props.navigation.navigate('UPDATE_EVENT', {
      eventId,
      getEventList: this?.getEventList,
      isItinerary: false,
      currentDate: this.state.storeDate,
    });
  };
  handleGoing = (item, index) => {
    this.setState({ modalVisible: true, user: item, listIndex: index });
  };
  handleDeleteEvent = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this event?', [
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const params = {
              url: API_DATA.EVENTDELETE,
              data: {
                id: eventId,
              },
            };
            this.props.showLoading(true);
            setTimeout(async () => {
              callApi([params], this.props.userData.access_token)
                .then(async response => {
                  this.props.showLoading(false).then(async () => {
                    let resp = response[API_DATA.EVENTDELETE];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      await this.handleUpdateCalendarDot();
                      await this.getCalendarDataDay(this.state.storeDate);
                      await this.props.saveEventDelete(eventId);
                      await this.getDashboardList();

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

  handleUpdateCalendarDot = () => {
    console.log('handleUpdateCalendarDot 1111111111', this?.state?.selectedMonth);
    try {
      const params = {
        url: API_DATA.USER_CALENDAR_MONTH,
        data: {
          monthYear: `${this?.state?.selectedMonth?.month}-${this?.state?.selectedMonth?.year}`,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(async response => {
            let resp = response[API_DATA.USER_CALENDAR_MONTH];
            if (resp.success) {
              console.log('handleUpdateCalendarDot 2222222222', JSON.stringify(resp));
              this.props.showLoading(false);
              const event = { key: 'event', color: '#315EFF', selectedDotColor: '#FC5401' };
              const task = { key: 'task', color: '#FC5401', selectedDotColor: '#FC5401' };
              let data = {};

              resp.data.map((obj, index) => {
                if (obj.event > 0 && obj.task > 0) {
                  return (data = {
                    ...data,
                    [obj.date]: { dots: [event, task], selected: false, selectedColor: '#FC5401', disabled: false },
                  });
                } else if (obj.event > 0) {
                  return (data = { ...data, [obj.date]: { dots: [event], selected: false, selectedColor: '#FC5401', disabled: false } });
                } else if (obj.task > 0) {
                  return (data = { ...data, [obj.date]: { dots: [task], selected: false, selectedColor: '#FC5401', disabled: false } });
                }
              });

              const storedDate = moment(this?.state?.storeDate?.dateString).format('YYYY-MM-DD');
              const selectedDate = { ...data, [storedDate]: { ...data[storedDate], selected: true } };
              this.setState({ calendarData: { ...selectedDate } });

              // if (Object.keys(data)[0]) {
              // this.getCalendarDataDay({ dateString: Object.keys(data)[0] });
              // this.getCalendarDataDay({ dateString: date?.dateString });
              // } else {
              //   this.setState({ isLoading: false, isRefreshing: false });
              //   this.props.showLoading(false);
              //   this?.props?.saveEventList([]);
              // }
            } else {
              this.props.showLoading(false);
              this.setState({ isLoading: false, isRefreshing: false });
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          })
          .catch(err => {
            this.setState({ isLoading: false, isRefreshing: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      this.props.showLoading(false);
      console.log('catch error >>>', e);
    }
  };

  getTaskList = filters => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKLIST];
            const { theme } = this.context;

            const styles = style(theme);
            if (resp.success) {
              const keysValues = {
                pastTasks: '',

                todayTasks: 'Today',
                tomorrowTasks: 'Tomorrow',
                futureTasks: 'Upcoming',
              };
              let data = [];
              Object.keys(resp?.data)?.forEach(item => {
                if (filters && item === 'pastTasks') {
                  data.push({ title: keysValues[item], data: resp?.data[item] });
                  // this?.setState({
                  //   oldTaskEnable: true,
                  // });
                } else if (!filters && item !== 'pastTasks') {
                  // if (resp?.data[item]?.length) {
                  data.push({ title: keysValues[item], data: resp?.data[item] });
                  // }
                  // this?.setState({
                  //   oldTaskEnable: false,
                  // });
                }
              });
              this?.props?.saveTaskList({ data });
              this?.setState({
                isRefreshing: false,
                isLoader: false,
              });
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

  handleReport = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to report this?', [
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
          this.props.showToast(localize('SUCCESS'), 'Event reported successfully');
        },
      },
    ]);
  };
  onRefresh = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      // this.getEventList();
      this.getCalenderData(this?.state?.selectedMonth);
    }, 500);
  };

  handleStartTime = item => {
    footerVisibility;
    // return moment(item, ['h:mm A']).local().format('hh:mm A');
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };
  handleEndTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };

  footerVisibility = taskId => {
    this.setState(prevState => ({
      isFooterVisible: !prevState?.isFooterVisible,
      openTaskId: taskId,
    }));
  };
  footerVisibilityClose = taskId => {
    this.setState(prevState => ({
      isFooterVisible: false,
      openTaskId: taskId,
    }));
  };

  editTaskDetails = id => {
    this?.props?.navigation?.navigate('TASK_DETAIL', { taskId: this.state.taskId, currentDate: this.state.storeDate });
  };
  render() {
    console.log('this?.state?.storeDate', this?.state?.storeDate);
    const { theme } = this.context;
    const styles = style(theme);
    let eventList = this?.props?.eventList;
    const taskList = this?.props?.taskList?.data;
    const { openTaskId, isFooterVisible, selectSubTaskId } = this.state;
    // console.log('eventList eventList', eventList);
    const today = new Date();

    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const dateFormat = new Date();
    let customDayHeaderStyles = [];

    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });
    if (this.state.isLoading) {
      return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0 }}></SafeAreaWrapper>
        </ImageBackground>
      );
    }
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <ScrollView
            refreshControl={
              <RefreshControl tintColor={theme?.colors?.WHITE} refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />
            }
            style={{ flex: 1 }}
          >
            <Calendar
              weekdays={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
              onMonthChange={this.onMonthChange}
              onDayPress={this.handleDayPress}
              initialDate={moment(today).format('YYYY-MM-DD')}
              current={moment(today).format('YYYY-MM-DD')}
              markingType={'multi-dot'}
              markedDates={this.state.calendarData}
              disableAllTouchEventsForDisabledDays={true}
              disabledByDefault={true}
              style={{
                margin: 5,
                marginBottom: 12,
                backgroundColor: 'transparent',
              }}
              theme={{
                calendarBackground: 'transparent',
                monthTextColor: '#fff',
                textMonthFontSize: 18,
                textMonthFontWeight: 'bold',
                dayTextColor: 'red',
                textSectionTitleColor: '#ffffff',
                todayTextColor: theme?.colors?.RED_500,
                dayTextColor: '#ffffff',
                textDisabledColor: '#4F4C4B',
                arrowColor: theme?.colors?.RED_500,
                disabledArrowColor: '#4F4C4B',
                selectedDayTextColor: '#ffffff',
                selectedDayBackgroundColor: theme?.colors?.RED_500,
                'stylesheet.calendar.header': {
                  dayTextAtIndex0: {
                    color: 'blue',
                  },
                  dayTextAtIndex6: {
                    color: 'blue',
                  },
                },
              }}
            />

            {eventList?.length !== 0 ? (
              <View style={{ flex: 1 }}>
                {eventList ? (
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={eventList || []}
                      keyExtractor={item => item.id}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ flex: 1 }}>
                            {console.log('event media>>>>>>>>>', item?.eventData)}
                            {item.isEvent ? (
                              <Swipeout
                                right={
                                  item?.user_id === this?.props?.userData?.userInfo?.id
                                    ? [
                                        {
                                          text: <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} />,
                                          backgroundColor: 'transparent',
                                          onPress: () => this.handleDeleteEvent(item?.eventData?.id),
                                        },
                                        {
                                          text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                          backgroundColor: 'transparent',
                                          onPress: () => this.handleEditEvent(item?.eventData?.id),
                                        },
                                      ]
                                    : null
                                }
                                autoClose={true}
                                backgroundColor={'transparent'}
                                style={{ paddingHorizontal: Responsive.getWidth(5) }}
                              >
                                <EventCard
                                  containerStyle={{ marginHorizontal: 0 }}
                                  item={item?.eventData}
                                  navigation={this?.props?.navigation}
                                  fromCalendarScreen={true}
                                />
                              </Swipeout>
                            ) : (
                              <>
                                {/* <TouchableOpacity style={styles.taskView}>
                                  <Text style={styles.taskTitle}>Birthday Supplies</Text>
                                  <Text style={styles.taskDay}>4d</Text>
                                  <View style={styles.taskRow}>
                                    <Text style={styles.taskInTxt}>3:00 PM</Text>
                                    <Text style={styles.taskInTxtSep}>|</Text>
                                    <View style={styles.taskInRow}>
                                      <Image source={IMAGES.image1} style={styles.taskInImg} />
                                      <Text style={styles.taskInTxt}>Creator Name</Text>
                                    </View>
                                    <Text style={styles.taskInTxtSep}>|</Text>
                                    <View style={styles.taskInRow}>
                                      <Image source={IMAGES.chat_icon} style={styles.taskInIcon} />
                                      <Text style={styles.taskInTxt}>Chat Name Category</Text>
                                    </View>
                                    <Text style={styles.taskInTxtSep}>|</Text>
                                    <Text style={styles.taskInTxt}>1/2</Text>
                                    <Text style={styles.taskInTxtSep}>|</Text>
                                    <Text style={styles.taskInTxt}>Chat Name Category</Text>
                                  </View>
                                </TouchableOpacity> */}
                                <TouchableOpacity
                                  style={styles.ddContainer}
                                  onPress={() => {
                                    this.footerVisibility(item?.taskData?.id);
                                    this.setState({
                                      taskId: item?.taskData?.id,
                                    });
                                  }}
                                >
                                  <View style={[styles.ddItem]}>
                                    {item.user.image ? (
                                      <Image source={{ uri: item.user.image }} style={styles.eventUsrImg} />
                                    ) : (
                                      <Image source={IMAGES.image1} style={styles.eventUsrImg} />
                                    )}
                                    <View style={styles.ddItemContent}>
                                      <Text style={styles.ddItemTitle}>{item?.taskData?.title}</Text>
                                      {/* <View style={styles.sidenoteRow}>
                                      <Image source={IMAGES.new_sidenote2} style={styles.sidenoteIcon} />
                                      <Text style={styles.sidenoteTxt}>Sidenote name, Category</Text>
                                    </View> */}

                                      <View style={styles.arrowBtn}>
                                        <Image
                                          source={
                                            this.state.isFooterVisible === true && this.state.taskId === item?.taskData?.id
                                              ? IMAGES.upArrow
                                              : IMAGES.downArrow
                                          }
                                          style={styles.arrowBtnIcon}
                                        />
                                      </View>

                                      {this.state.isFooterVisible === true && this.state.taskId === item?.taskData?.id && (
                                        <TouchableOpacity
                                          style={styles.arrowBtn}
                                          onPress={() => {
                                            this.footerVisibilityClose(item?.taskData?.id);
                                          }}
                                        >
                                          <Image
                                            source={
                                              this.state.isFooterVisible === true && this.state.taskId === item?.taskData?.id
                                                ? IMAGES.upArrow
                                                : IMAGES.downArrow
                                            }
                                            style={styles.arrowBtnIcon}
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  </View>
                                  {this.state.taskId === item?.taskData?.id && openTaskId === item?.taskData?.id && isFooterVisible && (
                                    <>
                                      {/* <TouchableOpacity style={styles.checkBox} onPress={this.checkBox}>
                                <Image source={this.state.isChecked ? IMAGES.uncheckIcon : IMAGES.checkIcon} style={styles.checkBoxIcon} />
                                <Text style={styles.checkBoxTxt}>Task 1</Text>
                              </TouchableOpacity> */}
                                      <TouchableOpacity style={[styles.ddMenu]} onPress={this.editTaskDetails}>
                                        {/* <Image source={IMAGES.image1} style={styles.eventUsrImg} /> */}
                                        <View style={[styles.ddItemContent, { paddingLeft: 0 }]}>
                                          <Text style={styles.ddItemTitle}>{item?.taskData?.description}</Text>
                                          {/* {!this.state.isCollapsed && ( */}
                                          <View style={styles.ddBody}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              {/* <View style={styles.itemInfoRow}>
                                          <Image source={IMAGES.dashIcon} style={styles.itemInfoRowIcon} />
                                          <Text style={styles.itemInfoRowTxt}>Groomsmen</Text>
                                        </View> */}
                                              <View style={styles.itemInfoRow}>
                                                <Image source={IMAGES.event_icon} style={styles.itemInfoRowIcon} />
                                                <Text style={styles.itemInfoRowTxt}>
                                                  {item?.taskData?.date !== '' ? moment(item?.taskData?.date).format('MMM d') : ''}
                                                  {item?.taskData?.time !== '' ? ' at ' : ' '}

                                                  {item?.taskData?.time !== '' ? moment(item?.taskData?.time).format('hh:mm A') : ''}
                                                </Text>
                                              </View>
                                            </View>
                                            {item?.taskData?.subtasks?.map(subtask => (
                                              <TouchableOpacity
                                                style={styles.checkListItem}
                                                onPress={() => (subtask.is_complete === 0 ? this.subTaskListItem(subtask?.id) : null)}
                                              >
                                                {subtask.is_complete === 1 ? (
                                                  <Image source={IMAGES.check2} style={styles.checkListIcon} />
                                                ) : (
                                                  <Image
                                                    source={this.state.selectSubTaskId === subtask?.id ? IMAGES.check2 : IMAGES.uncheck}
                                                    style={styles.checkListIcon}
                                                  />
                                                )}
                                                <Text style={styles.checkListItemTxt}>{subtask?.title}</Text>
                                              </TouchableOpacity>
                                            ))}
                                            {/* <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                                        <Image
                                          source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                                          style={styles.checkListIcon}
                                        />
                                        <Text style={styles.checkListItemTxt}>List item</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                                        <Image
                                          source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                                          style={styles.checkListIcon}
                                        />
                                        <Text style={styles.checkListItemTxt}>List item</Text>
                                      </TouchableOpacity> */}
                                          </View>
                                          {/* )} */}
                                          {/* <TouchableOpacity style={styles.arrowBtn} onPress={this.toggleCollapse}>
                                      <Image
                                        source={this.state.isCollapsed ? IMAGES.downArrow : IMAGES.upArrow}
                                        style={styles.arrowBtnIcon}
                                      />
                                    </TouchableOpacity> */}
                                        </View>
                                      </TouchableOpacity>
                                    </>
                                  )}
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        );
                      }}
                      // ListFooterComponent={item => {
                      //   if (this.state.isFooterVisible) {
                      //     return (
                      //       <>
                      //         {/* <TouchableOpacity style={styles.checkBox} onPress={this.checkBox}>
                      //           <Image source={this.state.isChecked ? IMAGES.uncheckIcon : IMAGES.checkIcon} style={styles.checkBoxIcon} />
                      //           <Text style={styles.checkBoxTxt}>Task 1</Text>
                      //         </TouchableOpacity> */}
                      //         <TouchableOpacity style={styles.ddItem} onPress={this.editTaskDetails}>
                      //           {/* <Image source={IMAGES.image1} style={styles.eventUsrImg} /> */}
                      //           <View style={styles.ddItemContent}>
                      //             {/* <Text style={styles.ddItemTitle}>Pick up cake</Text> */}
                      //             {!this.state.isCollapsed && (
                      //               <View style={styles.ddBody}>
                      //                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      //                   <View style={styles.itemInfoRow}>
                      //                     <Image source={IMAGES.dashIcon} style={styles.itemInfoRowIcon} />
                      //                     <Text style={styles.itemInfoRowTxt}>Groomsmen</Text>
                      //                   </View>
                      //                   <View style={styles.itemInfoRow}>
                      //                     <Image source={IMAGES.event_icon} style={styles.itemInfoRowIcon} />
                      //                     <Text style={styles.itemInfoRowTxt}>Jun 12 at 4:30 PM</Text>
                      //                   </View>
                      //                 </View>
                      //                 <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                      //                   <Image
                      //                     source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                      //                     style={styles.checkListIcon}
                      //                   />
                      //                   <Text style={styles.checkListItemTxt}>List item</Text>
                      //                 </TouchableOpacity>
                      //                 <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                      //                   <Image
                      //                     source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                      //                     style={styles.checkListIcon}
                      //                   />
                      //                   <Text style={styles.checkListItemTxt}>List item</Text>
                      //                 </TouchableOpacity>
                      //               </View>
                      //             )}
                      //             <TouchableOpacity style={styles.arrowBtn} onPress={this.toggleCollapse}>
                      //               <Image
                      //                 source={this.state.isCollapsed ? IMAGES.downArrow : IMAGES.upArrow}
                      //                 style={styles.arrowBtnIcon}
                      //               />
                      //             </TouchableOpacity>
                      //           </View>
                      //         </TouchableOpacity>
                      //       </>
                      //     );
                      //   } else {
                      //     return null; // or an empty View if you don't want any footer when hidden
                      //   }
                      // }}
                      // ListFooterComponent={() => (
                      //   <>
                      //     <TouchableOpacity style={styles.checkBox} onPress={this.checkBox}>
                      //       <Image
                      //         source={this.state.isChecked ? IMAGES.uncheckIcon : IMAGES.checkIcon}
                      //         style={styles.checkBoxIcon}
                      //       />
                      //       <Text style={styles.checkBoxTxt}>Task 1</Text>
                      //     </TouchableOpacity>
                      //     <View style={styles.ddItem}>
                      //       {/* <Image source={IMAGES.image1} style={styles.eventUsrImg} /> */}
                      //       <View style={styles.ddItemContent}>
                      //         <Text style={styles.ddItemTitle}>Pick up cake</Text>
                      //         {!this.state.isCollapsed && (
                      //           <View style={styles.ddBody}>
                      //             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      //               <View style={styles.itemInfoRow}>
                      //                 <Image source={IMAGES.dashIcon} style={styles.itemInfoRowIcon} />
                      //                 <Text style={styles.itemInfoRowTxt}>Groomsmen</Text>
                      //               </View>
                      //               <View style={styles.itemInfoRow}>
                      //                 <Image source={IMAGES.event_icon} style={styles.itemInfoRowIcon} />
                      //                 <Text style={styles.itemInfoRowTxt}>Jun 12 at 4:30 PM</Text>
                      //               </View>
                      //             </View>
                      //             <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                      //               <Image
                      //                 source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                      //                 style={styles.checkListIcon}
                      //               />
                      //               <Text style={styles.checkListItemTxt}>List item</Text>
                      //             </TouchableOpacity>
                      //             <TouchableOpacity style={styles.checkListItem} onPress={this.checkListItem}>
                      //               <Image
                      //                 source={this.state.isCheckItem ? IMAGES.uncheck : IMAGES.check2}
                      //                 style={styles.checkListIcon}
                      //               />
                      //               <Text style={styles.checkListItemTxt}>List item</Text>
                      //             </TouchableOpacity>
                      //           </View>
                      //         )}
                      //         <TouchableOpacity style={styles.arrowBtn} onPress={this.toggleCollapse}>
                      //           <Image source={this.state.isCollapsed ? IMAGES.downArrow : IMAGES.upArrow} style={styles.arrowBtnIcon} />
                      //         </TouchableOpacity>
                      //       </View>
                      //     </View>
                      //   </>
                      // )}
                      ItemSeparatorComponent={() => <View style={{ width: '100%', height: Responsive.getWidth(3) }}></View>}
                      contentContainerStyle={[styles.eventScroll]}
                      // renderSectionHeader={({ section: { title } }) => <Text style={styles.eventHeaderTitle}>{title}</Text>}
                    />
                  </View>
                ) : (
                  <NoDataFound
                    title="Nothing to see"
                    text="You don’t have any Event yet"
                    titleColor={theme?.colors?.GRAY_50}
                    textColor={theme?.colors?.GRAY_100}
                    titleFontSize={20}
                    source={IMAGES.noChatImage}
                    imageWidth={205}
                    imageHeight={156}
                  />
                )}
              </View>
            ) : null}
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
          </ScrollView>
          <TouchableOpacity style={styles.fabButton} onPress={() => this.props.navigation.navigate('CREATE_TASK')}>
            <Image source={IMAGES.addEvent} style={styles.fabButtonIcon} />
          </TouchableOpacity>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    eventList: state?.eventState?.eventList,
    taskList: state?.dashboardState?.taskList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(EventScreen);
