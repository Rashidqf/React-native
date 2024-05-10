import React, { createRef } from 'react';

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
  Keyboard,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES, FONTS } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { Button, Input, Switch } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import { HeaderView } from '@components';
import Sheet from '../../components/sheet';

import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';

import { callApi } from '@apiCalls';
import { API_DATA } from '@constants';
import { values } from 'core-js/core/array';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { loadPartialConfig } from '@babel/core';
import { AppContext } from '../../themes/AppContextProvider';

class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      startTime: new Date(),
      endTime: new Date(),
      switchReminder: false,
      switchDay: false,
      switchTime: true,
      sheetOpen: false,
      switchEndTime: false,
      switchStartTime: false,
      eventDetails: null,
      isTaskCreate: false,
      showMore: false,
      setTime: false,
      setEndTime: false,
      toggleSwitch: false,
      openPrivate: false,
      toggleColor: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static contextType = AppContext;

  scrollViewRef = createRef();

  componentDidMount() {
    this.handleEventDetail();
  }
  onDateChange(date, setFieldValue) {
    setFieldValue('date', date);
    this.setState({ switchDay: false });
  }

  onStartTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('hh:mm A');
    this.setState({
      time: time,
      setTime: true,
    });
    setFieldValue('start_time', timeDate);
  }

  onEndTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('hh:mm A');
    this.setState({
      endTime: time,
      setEndTime: true,
    });
    setFieldValue('end_time', timeDate);
  }

  daySwitch(value, setFieldValue, values) {
    Keyboard.dismiss();
    setFieldValue('is_fullday', value ? 1 : 0);
    value === true ? this.setState({ switchTime: false }) : null;
    value === false ? this.setState({ switchTime: true }) : null;
  }
  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
  }
  eventSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    description: Yup.string().required('Please enter description'),
    is_fullday: Yup.string().required('Please select the date'),
    date: Yup.string().required('Please select date'),
    location: Yup.string().required('Please choose your location'),

    start_time: Yup.string().when('is_fullday', {
      is: 0,
      then: Yup.number()
        .test('not empty', 'Please select start time', function (value) {
          return;
        })
        .test('start_time_test', 'Start time must be before end time', function (value) {
          const { end_time } = this.parent;
          return moment(value, 'HH:mm').isSameOrBefore(moment(end_time, 'HH.mm'));
        }),
    }),
    end_time: Yup.string().when('is_fullday', {
      is: 0,
      then: Yup.number()
        .test('not empty', 'Please select end time', function (value) {
          return;
          // return !!value;
        })
        .test('end_time_test', 'End time must be after start time', function (value) {
          const { start_time } = this.parent;
          return moment(value, 'HH:mm').isAfter(moment(start_time, 'HH.mm'));
        }),
      // then: Yup.string().required('Please select end time'),
    }),
    reminder_minute: Yup.string().when('is_reminder', {
      is: 1,
      then: Yup.string().test('len', 'Please select reminder time', val => Number(val) > 0),
    }),
  });
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
                    if (resp?.data[item]?.length) {
                      data.push({ title: keysValues[item], data: resp?.data[item] });
                    }
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

  handleEventDetail = () => {
    try {
      const params = {
        url: API_DATA.EVENTDETAIL,
        data: {
          id: this.props.route.params.eventId ? this.props.route.params.eventId : this?.props?.route?.params?.Id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTDETAIL];
              if (resp.success) {
                // this.props.saveEventDetail(resp.data);
                this.setState({
                  eventDetails: resp.data,
                });
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

  onUpdateSubmit = values => {
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    const startTimeUpdate = this.state?.setTime
      ? moment(values.start_time, ['h:mm A']).utc().format('HH:mm:ss')
      : moment(values.start_time, ['h:mm A']).format('HH:mm:ss');
    const endTimeUpdate = this.state?.setEndTime
      ? moment(values.end_time, ['h:mm A']).utc().format('HH:mm:ss')
      : moment(values.end_time, ['h:mm A']).format('HH:mm:ss');
    var today = Math.round(new Date().getTime() / 1000);

    const array = [];
    this?.props?.route?.params?.selected?.map(item => array.push(item?.user_id));
    // const imagePath = {
    //     uri: values.media.url,
    //     type: values.media.type,
    //     name: image.path.split('/').pop(),
    //   },
    try {
      let item = {};
      values?.tasks?.forEach((v, index) => {
        const timeSub = moment(v.time, ['h:mm A']).format('H:mm:ss');
        const dateSub = moment(v.date).format('MM/DD/yyyy');

        item = {
          ...item,
          [`tasks[${index}][title]`]: v.title,
          [`tasks[${index}][description]`]: v.description,
          [`tasks[${index}][date]`]: v.date ? dateSub : '' || '',
          [`tasks[${index}][time]`]: v.time ? timeSub : '' || '',
          [`tasks[${index}][assigned_user_id]`]: v.assigned_user_id,
        };
        if (!v.isCreate) {
          item = {
            ...item,
            [`tasks[${index}][id]`]: v.id,
          };
        }
        // item = {
        //   ...item,
        //   [`tasks[${index}][id]`]: v.id,
        // };
        // if (!this?.state?.isTaskCreate) {
        // }
      });
      let params = {
        url: API_DATA.EVENTUPDATE,
        data: {
          id: this?.state?.eventDetails?.id,
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          date: dateDate,
          is_private: values?.is_private,
          end_time: values?.end_time ? endTimeUpdate : '',
          start_time: values?.start_time ? startTimeUpdate : '',
          location: values.location || values.location.data.description,
          latitude: values.latitude || '1.1',
          longitude: values.longitude ? values.longitude : '-1.1',
          is_reminder: values.is_reminder,
          moderator_ids: this?.props?.route?.params?.moderatorId || '',

          guest_connection_ids: this.props?.route?.params?.from === 'user' ? this?.props?.route?.params?.selected : '',
          guest_group_ids: this.props?.route?.params?.from === 'group' ? this?.props?.route?.params?.selected : ' ',

          share_user_ids: values.is_private === 1 ? array.toString() : '',
          [`media[0]`]: values.image
            ? { uri: values.image, name: today + 'Img.jpg', type: 'image/jpg' }
            : values?.media?.url !== undefined
            ? { uri: values?.media?.url, name: today + 'Img.jpg', type: 'image/jpg' }
            : '',
          // [`media[0]`]: values.media.url,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.eventDetails?.group_id ? this?.state?.eventDetails?.group_id : '',
          ...item,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTUPDATE];
              if (resp?.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                this.getCalendarDataDay();
                this?.props?.updateMonthlyEvent(this?.state?.eventDetails?.id, resp?.data);
                // this?.props?.saveTaskUpdate(resp.data, this?.state?.taskDetails?.id);
                this?.props?.saveEventUpdate(resp?.data, this?.state?.eventDetails?.id);
                this.props.showLoading(false);
                this.getEventList();
                this.getDashboardList();
                {
                  this.props.route.params.Id ? this.props.navigation.navigate('TAB_NAVIGATOR') : this.props.navigation.goBack();
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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  getCalendarDataDay = data => {
    try {
      const params = {
        url: API_DATA.USER_CALENDAR_DAY,
        data: {
          date: this?.props?.route?.params?.currentDate
            ? this?.props?.route?.params?.currentDate?.dateString
            : moment(new Date()).format('YYYY-MM-DD'),
        },
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
  handleRemoveSubtasks = (index, setFieldValue, subValues, taskId) => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this task?', [
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
              url: API_DATA.EVENTTASKDELETE,
              data: {
                id: taskId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.EVENTTASKDELETE];
                  if (resp.success) {
                    const values = [...subValues.tasks];
                    values.splice(index, 1);
                    setFieldValue('tasks', values);
                    this.props.eventTaskDelete(taskId, resp?.data);
                    // this.getDashboardList();
                    this.props.showLoading(false);
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
        },
      },
    ]);
  };

  handleEditSubTask = (subTaskId, setFieldValue, values) => {
    this?.setState({
      isTaskCreate: false,
    });
    this.props.navigation.navigate('Update_Event_Task', {
      subTaskId,
      inputField: values?.tasks,
      setFieldValue,
      groupId: this?.state?.eventDetails?.group_id,
      eventDate: moment(values.date).format('MM/DD/yyyy'),
      // selectedGroup: this?.props?.route?.params?.selected,
    });
  };
  handleAddSubGroup = (values, setFieldValue) => {
    Keyboard.dismiss();
    this?.setState({
      isTaskCreate: true,
    });
    this.props.navigation.navigate('Create_Event_Task', {
      tasks: values?.tasks,
      setFieldValue,
      groupId: this?.state?.eventDetails?.group_id,
      eventDate: moment(values.date).format('MM/DD/yyyy'),
    });
  };

  minDateTask = values => {
    const dateArray = values?.tasks?.map(item => moment(item?.date).format('MM/DD/yyyy'));
    const sorted = dateArray.sort((a, b) => moment(a.settledDate) - moment(b.settledDate));

    const minDate = sorted[0];

    return new Date(minDate);
  };
  handleStartTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };
  handleEndTime = item => {
    return moment.utc(item, ['h:mm A']).local().format('hh:mm A');
  };
  handlePrivate = (values, setFieldvalue) => {
    this.setState({ toggleSwitch: values });
    this.scrollViewRef?.current?.scrollToEnd({ animated: true });
    if (values === true) {
      this.setState({ openPrivate: true, toggleColor: false });
    } else {
      this.setState({ openPrivate: false, toggleColor: true });
    }
    setFieldvalue('is_private', values ? 1 : 0);
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const dateFormat = new Date();
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    let customDayHeaderStyles = [];
    const customPickerStyle = customPickerStyles(theme);
    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 90 }}>
          <KeyboardAwareScrollView
            keyboardDismissMode="interactive"
            // keyboardShouldPersistTaps="always"
            bounces={false}
            contentContainerStyle={{ height: '100%', width: '100%' }}
            extraScrollHeight={50}
            enableAutomaticScroll={true}
            enableOnAndroid={false}
          >
            <ScrollView
              ref={this.scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ScrollView}
              nestedScrollEnabled={false}
              keyboardShouldPersistTaps="handled"
            >
              {this?.state?.eventDetails ? (
                <Formik
                  initialValues={{
                    title: this?.state?.eventDetails?.title,
                    description: this?.state?.eventDetails?.description,
                    is_fullday: this?.state?.eventDetails?.is_fullday,
                    date: this?.state?.eventDetails?.date,
                    start_time: this.state?.eventDetails?.start_time || '',
                    end_time: this.state?.eventDetails?.end_time || '',
                    location: this.state?.eventDetails?.location,
                    reminder_minute: this.state?.eventDetails?.reminder_minute,
                    media: this.state?.eventDetails?.media[this.state?.eventDetails?.media?.length - 1],
                    is_reminder: this.state?.eventDetails?.is_reminder,
                    tasks: this?.state?.eventDetails?.tasks,
                    is_private: this?.state?.eventDetails?.is_private,
                  }}
                  // onSubmit={() => this.onUpdateSubmit}
                  onSubmit={this.onUpdateSubmit}
                  validationSchema={this.eventSchema}
                >
                  {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                    if (!this?.props?.route?.params?.handleSubmit) {
                      this.props.navigation.setParams({ handleSubmit });
                    }
                    if (this?.props?.route?.params?.isValid !== isValid) {
                      this.props.navigation.setParams({ isValid });
                    }

                    return (
                      <>
                        <View>
                          <Sheet
                            isOpen={this.state.sheetOpen}
                            setClose={() => this.setState({ sheetOpen: false })}
                            setFieldValue={setFieldValue}
                            multiple={false}
                          />
                          <View style={[styles.searchControl, { borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }]}>
                            <Input
                              placeholder="What’s the event?"
                              value={values.title}
                              style={[styles.searchInput, { color: theme?.colors?.GRAY_300 }]}
                              onChangeText={handleChange('title')}
                              inputContainerStyle={[styles.searchInputContainerStyle, { borderBottomWidth: 0 }]}
                              inputStyle={[styles.searchInputStyle]}
                              errorStyle={{ position: 'absolute', opacity: 0 }}
                              placeholderTextColor={theme?.colors?.GRAY_300}
                            />
                            {errors.title && touched.title && (
                              <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(2.2) }]}>
                                {errors.title}
                              </Text>
                            )}
                          </View>
                          <TouchableOpacity style={styles.listItem} onPress={() => this.setState({ sheetOpen: true })}>
                            <View style={styles.left}>
                              <Image source={IMAGES.photo} style={styles.listIcon} />
                            </View>
                            {values.image && (
                              <Image
                                source={values.image ? { uri: values.image } : values.image}
                                style={{ height: 100, width: 150, borderRadius: 10 }}
                              />
                            )}
                            {values.image ? null : values.media ? (
                              <Image
                                source={values.media.url ? { uri: values.media.url } : null}
                                style={{ height: 100, width: 150, borderRadius: 10 }}
                              />
                            ) : (
                              <View style={styles.body}>
                                <Text style={[styles.h6, { color: theme?.colors?.GRAY_200 }]}>Add event photo</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                          {errors.image && touched.image && (
                            <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.image}</Text>
                          )}
                          <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ switchDay: !this.state.switchDay });
                            }}
                          >
                            <View style={styles.left}>
                              <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Text style={styles.h6}>Date</Text>
                              {/* {this.state.switchDay ? ( */}
                              <Text style={styles.selectedText}>
                                {values.date === ''
                                  ? ''
                                  : moment().format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                  ? 'Today'
                                  : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                  ? 'Tommorow'
                                  : moment(values.date).format('MM/DD/yyyy')}
                              </Text>
                              {/* ) : null} */}
                            </View>
                          </TouchableOpacity>
                          {this.state.switchDay ? (
                            <CalendarPicker
                              weekdays={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
                              onDateChange={date => this.onDateChange(date, setFieldValue)}
                              textStyle={styles.calendarTextStyle}
                              extStyle={styles.calendarTextStyle}
                              // todayBackgroundColor={theme?.colors?.RED_500}
                              todayTextStyle={styles.todayTextStyle}
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
                              customDayHeaderStyles={customDayHeaderStyles}
                              enableDateChange
                              // initialDate={new Date()}
                              minDate={this?.minDateTask(values) || dateFormat}
                            />
                          ) : null}
                          <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ switchDay: true });
                            }}
                          >
                            <View style={styles.left}>
                              <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Text style={styles.h6}>All Day</Text>
                            </View>
                            <View style={styles.right}>
                              <Switch
                                value={Boolean(values.is_fullday)}
                                color={theme?.colors?.RED_500}
                                onValueChange={day => this.daySwitch(day, setFieldValue)}
                              />
                            </View>
                          </TouchableOpacity>
                          {values.is_fullday === 0 ? (
                            <View>
                              <TouchableOpacity
                                style={styles.listItem}
                                onPress={() => {
                                  // {
                                  //   values.start_time === ''
                                  //     ? this.setState({ switchStartTime: true })
                                  this.setState({ switchStartTime: !this.state.switchStartTime });
                                  // }
                                }}
                              >
                                <View style={[styles.body, { padding: 10 }]}>
                                  <Text style={styles.h6}>Start Time</Text>
                                </View>
                                <View style={styles.right}>
                                  {/* <Text style={styles.h6}>Start Time</Text> */}
                                  {!this.state.setTime ? (
                                    <Text style={styles.h6}>
                                      {values.start_time ? this.handleStartTime(values.start_time) : 'Start Time'}
                                    </Text>
                                  ) : (
                                    <Text style={styles.h6}>{values.start_time ? values.start_time : 'Start Time'}</Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                              {errors.start_time && touched.start_time && (
                                <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>
                                  {errors.start_time}
                                </Text>
                              )}

                              {this.state.switchStartTime ? (
                                <View style={styles.datePickerView}>
                                  <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => this.setState({ switchStartTime: false })}
                                  ></TouchableOpacity>

                                  <DatePicker
                                    mode="time"
                                    open={true}
                                    date={this.state.startTime}
                                    onDateChange={time => this.onStartTimeChange(time, setFieldValue)}
                                    // onDateChange={time => setFieldValue('time', time)}
                                    textColor={theme?.colors?.WHITE}
                                  />
                                </View>
                              ) : null}

                              <TouchableOpacity
                                style={styles.listItem}
                                onPress={() => {
                                  this.setState({ switchEndTime: !this.state.switchEndTime });
                                }}
                              >
                                <View style={[styles.body, { padding: 10 }]}>
                                  <Text style={styles.h6}>End Time</Text>
                                </View>
                                <View style={styles.right}>
                                  {!this.state.setEndTime ? (
                                    <Text style={styles.h6}>{values.end_time ? this.handleEndTime(values.end_time) : 'End Time'}</Text>
                                  ) : (
                                    <Text style={styles.h6}>{values.end_time ? values.end_time : 'End Time'}</Text>
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : null}
                          {errors.end_time && touched.end_time && (
                            <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>{errors.end_time}</Text>
                          )}
                          {this.state.switchEndTime ? (
                            <View style={styles.datePickerView}>
                              <DatePicker
                                mode="time"
                                open={true}
                                date={this.state.endTime}
                                onDateChange={time => this.onEndTimeChange(time, setFieldValue)}
                                // onDateChange={time => setFieldValue('time', time)}
                                textColor={theme?.colors?.WHITE}
                              />
                            </View>
                          ) : null}
                          <TouchableOpacity
                            style={styles.listItem}
                            onPress={() =>
                              this.props.navigation.navigate('LOCATION_SEARCH', {
                                setFieldTouched,
                                setFieldValue,
                              })
                            }
                          >
                            <View style={styles.left}>
                              <Image source={IMAGES.mapPin} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Input
                                placeholder="Add Location"
                                placeholderTextColor={theme?.colors?.GRAY_200}
                                style={[
                                  styles.searchInput,
                                  { borderBottomWidth: 0, borderBottomColor: theme?.colors?.GRAY_1000, color: theme?.colors?.GRAY_300 },
                                ]}
                                onChangeText={handleChange('location')}
                                editable={false}
                                // style={styles.noBorderInputTxtRight}
                                inputContainerStyle={styles.noBorderInputContainerRight}
                                inputStyle={styles.noBorderInputRight}
                                value={values?.location ? values?.location : values?.location?.data?.description}
                                errorStyle={{ position: 'absolute', opacity: 0 }}
                                // placeholderTextColor="#635E5C"
                              />
                            </View>
                            <View style={styles.right}>
                              <Image source={IMAGES.rightArrow} style={styles.listArrowIcon} />
                            </View>
                          </TouchableOpacity>

                          {!this?.props?.route?.params?.isItinerary ? (
                            <>
                              {this?.state?.eventDetails?.moderators ? (
                                this?.state?.eventDetails?.moderators[0]?.name ? (
                                  <TouchableOpacity disabled={true} style={[styles.listItem, { borderBottomWidth: 0 }]}>
                                    <View style={styles.left}>
                                      <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                                    </View>
                                    <View style={styles.body}>
                                      <Text style={[styles.h6]}>
                                        {this?.state?.eventDetails?.moderators
                                          ? this?.state?.eventDetails?.moderators[0]?.name || ''
                                          : 'Choose moderator'}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : null
                              ) : (
                                <TouchableOpacity disabled={true} style={[styles.listItem, { borderBottomWidth: 0 }]}>
                                  <View style={styles.left}>
                                    <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                                  </View>
                                  <View style={styles.body}>
                                    <Text style={[styles.h6]}>
                                      {this?.state?.eventDetails?.moderators
                                        ? this?.state?.eventDetails?.moderators[0]?.name || ''
                                        : 'Choose moderator'}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              )}
                              {this?.state?.eventDetails?.guests?.group?.length ? (
                                this?.state?.eventDetails?.guests?.group[0]?.title ? (
                                  <TouchableOpacity disabled={true} style={[styles.listItem, { borderBottomWidth: 0 }]}>
                                    <View style={styles.left}>
                                      <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                                    </View>
                                    <View style={styles.body}>
                                      <Text style={[styles.h6]}>
                                        {this?.state?.eventDetails?.guests?.group?.length
                                          ? this?.state?.eventDetails?.guests?.group[0]?.title
                                          : this?.state?.eventDetails?.guests?.userConnection?.length
                                          ? this?.state?.eventDetails?.guests?.userConnection[0]?.name
                                          : ''}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : null
                              ) : this?.state?.eventDetails?.guests?.userConnection?.length ? (
                                this?.state?.eventDetails?.guests?.userConnection[0]?.name ? (
                                  <TouchableOpacity disabled={true} style={[styles.listItem, { borderBottomWidth: 0 }]}>
                                    <View style={styles.left}>
                                      <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                                    </View>
                                    <View style={styles.body}>
                                      <Text style={[styles.h6]}>
                                        {this?.state?.eventDetails?.guests?.group?.length
                                          ? this?.state?.eventDetails?.guests?.group[0]?.title || ''
                                          : this?.state?.eventDetails?.guests?.userConnection?.length
                                          ? this?.state?.eventDetails?.guests?.userConnection[0]?.name || ''
                                          : ''}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                ) : null
                              ) : null}
                            </>
                          ) : null}

                          <TouchableOpacity style={styles.listItem}>
                            <View style={styles.left}>
                              <Image source={IMAGES.bellIcon} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Text style={styles.h6}>Reminder</Text>
                            </View>
                            <View style={styles.right}>
                              <Switch
                                value={Boolean(values.is_reminder)}
                                color={theme?.colors?.RED_500}
                                onValueChange={switchReminder => this.reminderSwitch(switchReminder, setFieldValue)}
                              />
                            </View>
                          </TouchableOpacity>
                          {values.is_reminder === 1 ? (
                            <TouchableOpacity style={styles.listItem}>
                              <View style={styles.left}>
                                <Image source={IMAGES.bellIcon} style={styles.listIcon} />
                              </View>
                              <View style={styles.body}>
                                <Text style={styles.h6}>Send </Text>
                              </View>
                              <View>
                                <RNPickerSelect
                                  // useNativeDriver={true}
                                  useNativeAndroidPickerStyle={false}
                                  placeholder={{ label: 'Select Time', value: 0 }}
                                  onValueChange={val => setFieldValue('reminder_minute', val)}
                                  items={[
                                    // { label: '15 min before', value: 15 },
                                    // { label: '30 min before', value: 30 },
                                    // { label: '45 min before', value: 45 },
                                    // { label: '60 min before', value: 60 },
                                    { label: 'At time of event', value: 1 },
                                    { label: '5 min before', value: 5 },
                                    { label: '10 min before', value: 10 },
                                    { label: '15 min before', value: 15 },
                                    { label: '30 min before', value: 30 },
                                    { label: '1 hour before', value: 60 },
                                    { label: '2 hours before', value: 120 },
                                    { label: '1 day before', value: 1440 },
                                    { label: '2 days before', value: 2880 },
                                    { label: '1 week before', value: 10080 },
                                  ]}
                                  value={values.reminder_minute}
                                  // placeholderTextColor="black"
                                  style={customPickerStyle}
                                />
                              </View>
                              {/* {values.reminder_minute !== '' && <Text style={styles.h6}>mins before</Text>} */}
                            </TouchableOpacity>
                          ) : null}
                          {errors.reminder_minute && touched.reminder_minute && (
                            <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>
                              {errors.reminder_minute}
                            </Text>
                          )}
                          <TouchableOpacity style={styles.listItem}>
                            <View style={[styles.left]}>
                              <Image source={IMAGES.notes} style={{ ...STYLES.imageStyle(5.5) }} resizeMode={'stretch'} />
                            </View>
                            <View style={[styles.body, { marginLeft: -Responsive.getWidth(2) }]}>
                              {/* <Text style={[styles.h6, { color: theme?.colors?.GRAY_200 }]}>Add a note</Text> */}
                              <Input
                                value={values.description}
                                onChangeText={handleChange('description')}
                                placeholder="Add a note"
                                placeholderTextColor={theme?.colors?.GRAY_100}
                                style={[styles.searchInput, { paddingLeft: 0, color: theme?.colors?.GRAY_300 }]}
                                multiline={true}
                                inputContainerStyle={[
                                  styles.searchInputContainerStyle,
                                  { borderBottomWidth: 0, height: Responsive.getWidth(10), paddingLeft: 0 },
                                ]}
                                inputStyle={[{ height: '100%', paddingLeft: 0, paddingTop: Responsive.getWidth(3) }]}
                                errorStyle={{ position: 'absolute', opacity: 0 }}
                              />
                              {errors.description && touched.description && (
                                <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(2.2) }]}>
                                  {errors.description}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                          {/* {this?.state?.eventDetails?.group_id === '' ? (
                            <TouchableOpacity style={styles.listItem}>
                              <View style={styles.left}>
                                <Icon4 name="lock-outline" style={styles.privateIcon} />
                              </View>
                              <View style={styles.body}>
                                <Text style={styles.h6}>Make Private</Text>
                              </View>
                              <View style={styles.right}>
                                <Switch
                                  value={Boolean(values.is_private)}
                                  thumbColor={this.state.toggleColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                                  //   trackColor={theme?.colors?.WHITE}
                                  color={theme?.colors?.RED_500}
                                  onValueChange={value => this.handlePrivate(value, setFieldValue)}
                                />
                              </View>
                            </TouchableOpacity>
                          ) : null} */}
                          {values?.tasks?.map((item, index) => {
                            return (
                              <React.Fragment key={index}>
                                <View style={[styles.addedTaskView]}>
                                  <Swipeout
                                    right={[
                                      {
                                        text: <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} />,
                                        backgroundColor: theme?.colors?.GRAY_1000,
                                        onPress: () => this.handleRemoveSubtasks(index, setFieldValue, values, item?.id),
                                      },
                                      {
                                        text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                        backgroundColor: theme?.colors?.GRAY_1000,
                                        onPress: () => this.handleEditSubTask(item?.id, setFieldValue, values),
                                      },
                                    ]}
                                    autoClose={true}
                                    backgroundColor={theme?.colors?.GRAY_1000}
                                  >
                                    <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                                      <Text
                                        numberOfLines={this?.state?.showMore ? null : 1}
                                        onTextLayout={e => {
                                          if (e.nativeEvent.lines.length >= 1) {
                                            this?.setState({
                                              showMoreButtonVisible: true,
                                            });
                                          }
                                        }}
                                        style={[styles.h6, { paddingLeft: Responsive.getWidth(8) }]}
                                      >
                                        {item?.title}
                                      </Text>
                                    </View>
                                  </Swipeout>
                                </View>
                              </React.Fragment>
                            );
                          })}
                          {this?.state?.eventDetails?.group_id ? (
                            <TouchableOpacity style={styles.listItem} onPress={() => this.handleAddSubGroup(values, setFieldValue)}>
                              <Text style={{ color: '#86D190' }}>Assign a task to members</Text>
                            </TouchableOpacity>
                          ) : null}
                          {this.state.openPrivate === true || values.is_private === 1 ? (
                            <TouchableOpacity
                              style={styles.listItem}
                              onPress={() =>
                                this.props?.navigation.navigate('Share_With_User', {
                                  title: '',
                                  selected: this?.state?.eventDetails?.shares,
                                  isUpdate: true,
                                  eventId: this?.state?.eventDetails?.id,
                                })
                              }
                            >
                              <Text style={{ color: '#86D190' }}>Share With</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </>
                    );
                  }}
                </Formik>
              ) : null}
            </ScrollView>
          </KeyboardAwareScrollView>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen);

const customPickerStyles = theme =>
  StyleSheet.create({
    inputIOS: {
      color: theme?.colors?.WHITE,
      fontSize: Responsive.getWidth(4),
    },
    inputAndroid: {
      color: theme?.colors?.WHITE,
      paddingLeft: Responsive.getWidth(35),
      // width: Responsive.getWidth(30),
    },
  });
