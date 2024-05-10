import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
  Keyboard,
  Alert,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Swipeout from 'react-native-swipeout';
import RNPickerSelect from 'react-native-picker-select';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES, FONTS } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button, Input, Switch } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../../themes/AppContextProvider';

const dateFormat = new Date();
class NewTaskScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      time: new Date(),
      switchDate: false,
      openDate: false,
      switchTime: false,
      openTime: false,
      inputField: [],
      assignToAll: false,
      reminderColor: false,
      showPicker: false,
      from: null,
      groupId: this?.props?.route?.params?.groupId,
      oldTaskEnable: this?.props?.route?.params?.oldTaskEnable,
      setFieldValue: this?.props?.route?.params?.setFieldValue,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static contextType = AppContext;

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  taskSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    description: Yup.string(),
    date: Yup.string().required('Please select date'),
    // subtasks: Yup.string().required('Please Craete at least one sub task'),
  });

  onTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('HH:mm:ss');
    this.setState({
      time: time,
    });
    setFieldValue('time', timeDate);
  }

  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
    value === true ? this.setState({ reminderColor: false }) : null;
    value === false ? this.setState({ reminderColor: true }) : null;
  }

  initialValues = {
    title: '',
    description: '',
    date: '',
    // date: '',
    time: '',
    subtasks: [],
    is_reminder: 0,
    reminder_minute: '',
  };

  // componentDidMount() {
  //   // this.onSubmit();
  //   this.props.navigation.setParams({ onSubmit: this.onSubmit });
  // }
  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      // this.props.showLoading(true);
      callApi([params], this?.props?.userData?.access_token)
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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  getTaskList = filters => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      callApi([params], this?.props?.userData?.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKLIST];
            if (resp.success) {
              const keysValues = {
                pastTasks: '',

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
                if (filters && item === 'pastTasks') {
                  data.push({ title: keysValues[item], data: resp?.data[item] });
                  // this?.setState({
                  //   oldTaskEnable: true,
                  // });
                } else if (!filters && item !== 'pastTasks') {
                  console.log('resp?.data[item]', resp?.data[item]);
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
  addToCalendarTask = id => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          task_id: id,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.ADD_TO_CALENDAR];
              if (resp.success) {
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

  onSubmit = values => {
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    let tempId = Math.round(new Date().getTime() / 1000);
    try {
      let item = {};
      values?.subtasks?.forEach((v, index) => {
        subdate = moment(v.date).format('MM/DD/yyyy');
        item = {
          ...item,
          [`subtasks[${index}][title]`]: v.title,
          [`subtasks[${index}][description]`]: v.description,
          [`subtasks[${index}][date]`]: subdate,
          [`subtasks[${index}][time]`]: v.time,
        };
        if (this?.state?.groupId) {
          item = {
            ...item,
            [`subtasks[${index}][assigned_group_id]`]: this?.state?.groupId || this?.props?.route?.params?.selected,
          };
        }
        if (v.assigned_user_id) {
          item = {
            ...item,
            [`subtasks[${index}][assigned_user_id]`]: v.assigned_user_id,
          };
        }
        if (v.assigned_group_id) {
          item = {
            ...item,
            [`subtasks[${index}][assigned_group_id]`]: v.assigned_group_id,
          };
        }
      });

      let params = {
        url: API_DATA.TASKADD,
        data: {
          title: values.title,
          description: values.description ? values.description : '',
          date: this.state.openDate && dateDate,
          time: values.time,
          is_reminder: values.is_reminder,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          ...item,
          temp_id: tempId,
        },
      };
      if (this?.props?.route?.params?.selectedTask) {
        params.data = {
          ...params.data,
          [`assigned_user_id`]: this?.props?.route?.params?.selectedTask || '',
          [`assigned_user_name`]: this?.props?.route?.params?.userNameTask || '',
        };
      }
      // this.state.setFieldValue('tasks', [params.data]);

      const taskObj = {
        task: {
          title: values.title,
          description: values.description ? values.description : '',
          date: this.state.openDate && dateDate,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          time: values.time,
          ...item,
        },
        sender: {
          ...this?.props?.userData?.userInfo,
        },
        tempId,
        event_id: '',
        event: [],
        task_id: '',
        poll_id: '',
        poll: [],
        message: '',
        like_count: 0,
        is_liked: 0,
      };

      {
        this.state?.groupId !== '' && this?.props?.saveEventInChat(taskObj);
      }

      if (this?.props?.route?.params?.selected) {
        params.data = {
          ...params.data,
          [`assigned_${this?.props?.route?.params?.from}_id`]: this?.props?.route?.params?.selected || '',
          // assigned_group_id: this.props.route.params.selected || '',
          // assigned_user_id: this.props.route.params.selected || '',
        };
      }
      if (this.state?.groupId) {
        params.data = {
          ...params.data,
          [`assigned_group_id`]: this.state?.groupId || '',
          // assigned_group_id: this.props.route.params.selected || '',
          // assigned_user_id: this.props.route.params.selected || '',
        };
      }
      this.props.showLoading(true);
      console.log('task params', params);
      callApi([params], this?.props?.userData?.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKADD];
            if (resp.success) {
              console.log('res task', resp);
              this?.props?.navigation.goBack();
              this?.props?.saveTaskAdd(resp.data);
              this.props.showLoading(false);
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.getTaskList(this?.state?.oldTaskEnable);
              this.addToCalendarTask(resp.data.id);
              if (this?.state?.groupId) {
                this?.props?.CurrentTabName('task');
                this.getTaskListId();
              }
              this.getDashboardList();
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

  getTaskListId = () => {
    try {
      const params = {
        url: API_DATA.TASKLISTGROUPID,
        data: {
          group_id: this?.state?.groupId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKLISTGROUPID];
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

  checkForLastEmptyField = () => {
    const values = [...this.state.inputField];
    const lastField = values[values.length - 1];
    const isLastFieldEmpty = !lastField.title.length;

    return isLastFieldEmpty;
  };

  handleAddSubGroup = (values, setFieldValue) => {
    this?.props?.navigation.navigate('NEW_SUB_TASK', {
      subtasks: values?.subtasks,
      setFieldValue,
      groupId: this?.state?.groupId,
      selectedgroup: this?.props?.route?.params?.selected,
    });
    // Keyboard.dismiss();
    // const values = [...this.state.inputField];
    // if (this.state.inputField.length === 0 || !this.checkForLastEmptyField()) {
    //   values.push({ title: '' });
    //   this.setState({
    //     inputField: values,
    //   });
    //   // setInputFields(values);
    // }
  };

  handleInputChange = (text, index, type, setFieldValue) => {
    const values = [...this.state.inputField];
    if (type === 'title') {
      values[index].title = text;
    }
    this.setState({
      inputField: values,
    });
    setFieldValue('subtasks', values);
  };

  handleDeleteSubTask = (index, setFieldValue, subValues) => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this sub task?', [
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
          const values = [...subValues.subtasks];
          values.splice(index, 1);
          setFieldValue('subtasks', values);
        },
      },
    ]);
  };

  handleCreateSubTask = (subTaskId, setFieldValue, values) => {
    this?.props?.navigation.navigate('UPDATE_SUB_TASK', {
      subTaskId,
      inputField: values?.subtasks,
      setFieldValue,
    });
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const dateFormat = new Date();
    const { selectedStartDate } = this.state;

    const startDate = selectedStartDate ? selectedStartDate?.toString() : '';

    let customDayHeaderStyles = [];
    const customPickerStyle = customPickerStyles(theme);
    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'height' : 'height'}
            enabled
            // keyboardVerticalOffset={120}
          >
            {/* <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.ScrollView}
            nestedScrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          > */}
            <Formik initialValues={this.initialValues} onSubmit={this.onSubmit} validationSchema={this.taskSchema}>
              {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                if (!this?.props?.route?.params?.handleSubmit) {
                  this?.props?.navigation.setParams({ handleSubmit });
                }
                // if (this?.props?.route?.params?.isValid !== isValid) {
                //   this.props.navigation.setParams({ isValid });
                // }
                return (
                  <View style={{ flex: 1 }}>
                    <View style={styles.searchControl}>
                      <Input
                        value={values.title}
                        onChangeText={handleChange('title')}
                        placeholder="What’s the task?"
                        placeholderTextColor={theme?.colors?.GRAY_100}
                        style={[styles.searchInput, { color: theme?.colors?.GRAY_100, fontSize: 20 }]}
                        // inputContainerStyle={styles.searchInputContainerStyle}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        inputStyle={[styles.searchInputStyle, { textAlignVertical: 'center', paddingLeft: Responsive.getWidth(3.5) }]}
                        errorStyle={{ position: 'absolute', opacity: 0 }}
                      />
                      {errors.title && touched.title && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(6), paddingBottom: Responsive.getWidth(3) }]}>
                          {errors.title}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity style={[styles.listItem, { flexDirection: 'column', borderBottomWidth: 0 }]}>
                      <View style={styles.listItem2}>
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
                            style={[styles.searchInput, { paddingLeft: 0, fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}
                            multiline={true}
                            inputContainerStyle={[
                              styles.searchInputContainerStyle,
                              { borderBottomWidth: 0, height: Responsive.getWidth(10), paddingLeft: 0 },
                            ]}
                            inputStyle={[{ height: '100%', paddingLeft: 0, paddingTop: Responsive.getWidth(3) }]}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                          />
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.listItem, { flexDirection: 'column', borderBottomWidth: 0 }]}>
                      <View style={styles.listItem2}>
                        <View style={styles.left}>
                          <Image source={IMAGES.event_icon} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ switchDate: !this.state.switchDate, switchTime: false });
                              Keyboard.dismiss();
                            }}
                          >
                            <Text
                              style={
                                values.date === ''
                                  ? [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                                  : [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                              }
                            >
                              Date
                            </Text>
                            {this.state.openDate ? (
                              <Text style={styles.selectedText}>
                                {values.date === ''
                                  ? ''
                                  : moment().format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                  ? 'Today'
                                  : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                  ? 'Tommorow'
                                  : moment(values.date).format('MM/DD/yyyy')}
                              </Text>
                            ) : null}
                          </TouchableOpacity>
                          {/* {this.state.openDate == false
                          ? errors.date &&
                            touched.date && <Text style={[styles.errorText, { paddingTop: Responsive.getWidth(2) }]}>{errors.date}</Text>
                          : null} */}
                        </View>
                        <View style={styles.right}>
                          <Switch
                            value={this.state.openDate}
                            color={theme?.colors?.RED_500}
                            disabled={this.state.openDate === true && this.state.switchDate}
                            onValueChange={switchDate => {
                              Keyboard.dismiss();
                              this.setState({ openDate: switchDate, switchDate, switchTime: false });
                            }}
                          />
                        </View>
                      </View>
                      {errors.date && touched.date && this?.state?.switchDate === false && (
                        <Text style={[styles.errorText, { width: '100%' }]}>{errors.date}</Text>
                      )}
                    </TouchableOpacity>
                    {this.state.switchDate ? (
                      <CalendarPicker
                        weekdays={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
                        onDateChange={date => {
                          setFieldValue('date', date);
                          this.setState({ openDate: true, switchDate: false });
                        }}
                        // onDateChange={date => this.onDateCalender(date, setFieldValue)}
                        textStyle={styles.calendarTextStyle}
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
                        minDate={dateFormat}
                      />
                    ) : null}
                    <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                      <View style={styles.left}>
                        <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                      </View>
                      <View style={[styles.body]}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ switchTime: !this.state.switchTime, switchDate: false });
                            Keyboard.dismiss();
                          }}
                        >
                          <Text
                            style={
                              values.time === ''
                                ? [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                                : [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                            }
                          >
                            Time
                          </Text>
                          {this.state.openTime ? (
                            <>
                              {values.time ? (
                                <Text style={styles.selectedText}>{moment(values.time, ['h:mm A']).format('hh:mm A')}</Text>
                              ) : null}
                            </>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                      <View style={styles.right}>
                        <Switch
                          value={this.state.openTime}
                          color={theme?.colors?.RED_500}
                          disabled={this.state.openTime === true && this.state.switchTime}
                          onValueChange={switchTime => {
                            this.setState({ openTime: switchTime, switchTime, switchDate: false });
                            Keyboard.dismiss();
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                    {this.state.switchTime ? (
                      <View style={styles.datePickerView}>
                        <DatePicker
                          mode="time"
                          open={true}
                          date={this.state.time}
                          onDateChange={time => this.onTimeChange(time, setFieldValue)}
                          // onDateChange={time => setFieldValue('time', time)}
                          textColor={theme?.colors?.WHITE}
                        />
                      </View>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.listItem, { borderBottomWidth: 0 }]}
                      // disabled={this?.state?.groupId}
                      onPress={() =>
                        this?.props?.navigation.navigate('ASSIGN_GROUP', {
                          selected: this?.props?.route?.params?.selected,
                          groupTitle: this?.props?.route?.params?.groupTitle,
                          from: this.state.from,
                          isCreate: true,
                          groupId: this.state.groupId,
                        })
                      }
                    >
                      <View style={styles.left}>
                        <Image source={IMAGES.usersGroup} style={styles.listIcon} />
                      </View>
                      <View style={styles.body}>
                        <Text
                          style={
                            this?.props?.route?.params?.selected === undefined
                              ? [(styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100, fontSize: 16 })]
                              : [(styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100, fontSize: 16 })]
                          }
                        >
                          {this?.state?.groupId
                            ? 'selected'
                            : !this?.props?.route?.params?.selected
                            ? ' Assign'
                            : this?.props?.route?.params?.groupTitle}
                        </Text>
                      </View>
                      <View style={styles.right}>
                        <Image source={IMAGES.rightArrow} style={styles.listArrowIcon} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                      <View style={styles.left}>
                        <Image source={{}} style={styles.listIcon} />
                      </View>
                      <View style={[styles.body]}>
                        <TouchableOpacity
                          onPress={() => {
                            Keyboard.dismiss();
                          }}
                        >
                          <Text
                            style={
                              values.time === ''
                                ? [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                                : [styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]
                            }
                          >
                            Assign to everyone
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.right}>
                        <Switch
                          value={this.state.assignToAll}
                          color={theme?.colors?.RED_500}
                          // disabled={this.state.openTime}
                          onValueChange={switchValue => {
                            this.setState({ assignToAll: switchValue });
                            Keyboard.dismiss();
                          }}
                        />
                      </View>
                    </TouchableOpacity>

                    {/* Reminder */}
                    <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                      <View style={styles.left}>
                        <Image source={IMAGES.bellIcon} style={styles.listIcon} />
                      </View>
                      <View style={styles.body}>
                        <Text style={[styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}>Reminder</Text>
                      </View>
                      <View style={styles.right}>
                        <Switch
                          // style={{ backgroundColor: theme?.colors?.GRAY_800, borderRadius: 15 }}
                          value={Boolean(values.is_reminder)}
                          // thumbColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                          color={theme?.colors?.RED_500}
                          onValueChange={switchReminder => this.reminderSwitch(switchReminder, setFieldValue)}
                        />
                      </View>
                    </TouchableOpacity>

                    {values.is_reminder === 1 ? (
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => this.setState({ showPicker: !this.state.showPicker })}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.bellIcon} style={[styles.listIcon]} />
                        </View>
                        <View style={styles.body}>
                          <Text style={styles.h6}>Send</Text>
                        </View>
                        {/* {this.state.showPicker === true ? ( */}
                        <View style={{ position: 'relative' }}>
                          <RNPickerSelect
                            useNativeDriver={true}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: 'Select Time', value: '' }}
                            onValueChange={val => {
                              setFieldValue('reminder_minute', val), Keyboard.dismiss();
                            }}
                            items={[
                              { label: 'At time of event', value: '1' },
                              { label: '5 min before', value: '5' },
                              { label: '10 min before', value: '10' },
                              { label: '15 min before', value: '15' },
                              { label: '30 min before', value: '30' },
                              { label: '1 hour before', value: '60' },
                              { label: '2 hours before', value: '120' },
                              { label: '1 day before', value: '1440' },
                              { label: '2 days before', value: '2880' },
                              { label: '1 week before', value: '10080' },
                            ]}
                            value={values.reminder_minute}
                            // placeholderTextColor="black"
                            style={customPickerStyle}
                          />
                        </View>

                        {/* ) : null} */}

                        {/* {values.reminder_minute !== '' ? (
                            <TouchableOpacity>
                              <Text style={styles.h6}>mins before</Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                this.setState({ showPicker: !this.state.showPicker });
                              }}
                            >
                              <Text style={styles.h6}>Select Time</Text>
                            </TouchableOpacity>
                          )} */}
                      </TouchableOpacity>
                    ) : null}
                    {errors.reminder_minute && touched.reminder_minute && (
                      <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>
                        {errors.reminder_minute}
                      </Text>
                    )}

                    {/* Reminder */}

                    <TouchableOpacity style={[styles.listItem, styles.borderBottomNull, { borderBottomWidth: 0 }]}>
                      <View style={styles.left}>
                        <Image source={IMAGES.subtask} style={styles.listIcon} />
                      </View>
                      <View style={styles.body}>
                        <Text style={[styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}>Subtasks</Text>
                      </View>
                    </TouchableOpacity>
                    {/* {this.state.inputField.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <View style={[styles.subtasksView]}>
                            <View style={{ flexDirection: 'row', width: '80%' }}>
                              <Input
                                placeholder=""
                                style={styles.subtaskInput}
                                inputContainerStyle={styles.subtaskContainerStyle}
                                inputStyle={styles.subtaskInputStyle}
                                leftIcon={<Image source={IMAGES.uncheck} style={styles.checkboxStyle} />}
                                errorStyle={{ position: 'absolute', opacity: 0 }}
                                selectionColor={'#FC5401'}
                                value={item.title}
                                autoFocus
                                // onChangeText={text => handleChange('subtasks', text)}
                                onChangeText={text => this.handleInputChange(text, index, 'title', setFieldValue)}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  this.handleRemoveSubtasks(index);
                                }}
                                style={[styles.listItem, styles.borderBottomNull]}
                              >
                                <Text style={[styles.listIcon, { color: 'white', fontSize: 30 }]}>-</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </React.Fragment>
                      );
                    })} */}
                    {values?.subtasks?.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          <View style={[styles.addedTaskView]}>
                            <Swipeout
                              right={[
                                {
                                  text: <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} resizeMode={'contain'} />,
                                  backgroundColor: theme?.colors?.GRAY_1000,
                                  onPress: () => this.handleDeleteSubTask(index, setFieldValue, values),
                                },
                                {
                                  text: <Icon name="edit" style={styles.sidenotHiddenColIcon} />,
                                  backgroundColor: theme?.colors?.GRAY_1000,
                                  onPress: () => this.handleCreateSubTask(item?.id, setFieldValue, values),
                                },
                              ]}
                              autoClose={true}
                              backgroundColor={theme?.colors?.GRAY_1000}
                              style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
                            >
                              <View style={{ flexDirection: 'column', paddingVertical: 15 }}>
                                <Text style={[styles.h6, { paddingLeft: Responsive.getWidth(8) }]}>{item?.title}</Text>
                              </View>
                            </Swipeout>
                            {/* <View style={{ flexDirection: 'row', width: '80%' }}>
                              <Input
                                placeholder=""
                                style={styles.subtaskInput}
                                inputContainerStyle={styles.subtaskContainerStyle}
                                inputStyle={styles.subtaskInputStyle}
                                leftIcon={<Image source={IMAGES.uncheck} style={styles.checkboxStyle} />}
                                errorStyle={{ position: 'absolute', opacity: 0 }}
                                selectionColor={'#FC5401'}
                                value={item?.title}
                                // onChangeText={text => handleChange('subtasks', text)}
                                onChangeText={text => this.handleInputChange(text, index, 'title', setFieldValue)}
                              />
                              {console.log('dfjhdjfhdfg', item)}
                           
                              <TouchableOpacity
                                onPress={() => {
                                  this.handleDeleteSubTask(index, setFieldValue, values);
                                }}
                                style={[styles.listItem, styles.borderBottomNull]}
                              >
                                <Text style={[styles.listIcon, { color: 'white', fontSize: 30 }]}>-</Text>
                              </TouchableOpacity>
                            </View> */}
                          </View>
                        </React.Fragment>
                      );
                    })}

                    <View style={styles.subtasksView}>
                      <TouchableOpacity
                        style={[styles.listItem, styles.borderBottomNull]}
                        onPress={() => this.handleAddSubGroup(values, setFieldValue)}
                      >
                        <View style={[styles.left, { marginLeft: 30 }]}>
                          <Image source={IMAGES.plusIcon} style={[styles.listIcon, { tintColor: theme?.colors?.PURPLE_500 }]} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.PURPLE_500 }]}>Add subtask</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            </Formik>
            {/* </ScrollView> */}
          </KeyboardAvoidingView>
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
export default connect(mapStateToProps, mapDispatchToProps)(NewTaskScreen);

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
