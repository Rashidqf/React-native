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
  Platform,
  Keyboard,
  Alert,
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

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button, Input, Switch } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';

import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import { AppContext } from '../../themes/AppContextProvider';

const dateFormat = new Date();
class UpdateTaskScreen extends React.Component {
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
      taskDetails: null,
      from: null,
      groupTask: this?.props?.route?.params?.groupTask,
      tabGroupId: this?.props?.route?.params?.tabGroupId,
      oldTaskEnable: this?.props?.route?.params?.oldTaskEnable,
      assigned_group: '',
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
    title: Yup.string().required(),
    description: Yup.string(),
    date: Yup.string().required(),
  });

  onTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('HH:mm:ss');
    this.setState({
      time: time,
    });
    setFieldValue('time', timeDate);
  }
  // onDateCalender(date, setFieldValue) {
  //   const timeDate = moment(time).format('HH:mm:ss');
  //   this.setState({
  //     time: time,
  //   });
  //   console.log('time...', timeDate);
  //   setFieldValue('time', timeDate);
  // }

  componentDidMount() {
    this.handleTaskDetail();
  }
  getTaskList = filters => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      // this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
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
                  // console.log('resp?.data[item]', resp?.data[item]);
                  // if (resp?.data[item]?.length) {
                  data.push({ title: keysValues[item], data: resp?.data[item] });
                  // }
                  // this?.setState({
                  //   oldTaskEnable: false,
                  // });
                }
              });
              this?.props?.saveTaskList({ data });
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
  handleTaskDetail = () => {
    try {
      const params = {
        url: API_DATA.TASKDETAIL,
        data: {
          id: this.props.route.params.taskId,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKDETAIL];
            if (resp.success) {
              // this.props.saveTaskDetail(resp.data);
              this.setState({
                taskDetails: resp.data,
                inputField: resp.data.subtasks,
                assigned_group: resp?.data?.assigned_group_id,
                from: resp.data.assigned_group_id ? 'group' : resp.data.assigned_user_id ? 'user' : '',
              });
              this?.props?.navigation?.setParams({
                selected: resp.data.assigned_group_id || resp.data.assigned_user_id,
                groupTitle: resp.data.assigned_group_title || resp.data.assigned_user_name || 'Assign to a user or group',
                from: resp.data.assigned_group_id ? 'group' : resp.data.assigned_user_id ? 'user' : '',
              });
              if (resp.data.date) {
                this.setState({
                  openDate: true,
                });
              }
              if (resp.data.time) {
                this.setState({
                  openTime: true,
                });
              }
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
  };
  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      // this.props.showLoading(true);
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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }
  onUpdateSubmit = values => {
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    const timeUpdate = moment(values.time).format('H:mm:ss');
    try {
      let item = {};
      values?.subtasks?.forEach((v, index) => {
        const timeSub = moment(v.time, ['h:mm A']).format('H:mm:ss');
        const dateSub = moment(v.date).format('MM/DD/yyyy');

        item = {
          ...item,
          [`subtasks[${index}][title]`]: v.title,
          [`subtasks[${index}][description]`]: v.description,
          [`subtasks[${index}][date]`]: v.date ? dateSub : '' || '',
          [`subtasks[${index}][time]`]: v.time ? timeSub : '' || '',
        };
        if (v.id) {
          item = {
            ...item,
            [`subtasks[${index}][id]`]: v.id,
          };
        }
        if (v.assigned_user_id) {
          item = {
            ...item,
            [`subtasks[${index}][assigned_user_id]`]: v.assigned_user_id,
          };
        }
        if (this?.props?.route?.params?.from === 'user') {
          item = {
            ...item,
            [`subtasks[${index}][assigned_user_id]`]: this?.props?.route?.params?.selected,
          };
        }
        if (this?.props?.route?.params?.from === 'group') {
          item = {
            ...item,
            [`subtasks[${index}][assigned_group_id]`]: this?.props?.route?.params?.selected,
          };
        }
        // if (v.assigned_group_id) {
        //   item = {
        //     ...item,
        //     [`subtasks[${index}][assigned_group_id]`]: v.assigned_group_id,
        //   };
        // }
      });
      let params = {
        url: API_DATA.TASKUPDATE,
        data: {
          id: this?.state?.taskDetails?.id,
          title: values.title,
          description: values.description,
          date: dateDate,
          time: values.time ? moment(values.time, ['h:mm A']).format('HH:mm:ss') : '' || '',
          ...item,
        },
      };

      if (this.props.route.params.selected) {
        params.data = {
          ...params.data,
          [`assigned_${this?.props?.route?.params?.from}_id`]: this.props.route.params.selected || '',
        };
      }
      if (this.state?.assigned_group) {
        params.data = {
          ...params.data,
          [`assigned_group_id`]: this.state?.assigned_group || '',
          // assigned_group_id: this.props.route.params.selected || '',
          // assigned_user_id: this.props.route.params.selected || '',
        };
      }

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKUPDATE];
            if (resp?.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);

              // this?.props?.saveTaskUpdate(resp.data, this?.state?.taskDetails?.id);
              this.props.showLoading(false);
              this.getTaskList(this?.state?.oldTaskEnable);
              if (this?.state?.groupTask) {
                this.getTaskListId();
              }
              this.getDashboardList();
              this.props.navigation.goBack();
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
          group_id: this?.state?.tabGroupId,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
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
    Keyboard.dismiss();
    this.props.navigation.navigate('NEW_SUB_TASK', { subtasks: values?.subtasks, setFieldValue });
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

  // handleRemoveSubtasks = (index, setFieldValue, subValues) => {
  //   Alert.alert(localize('APP_NAME'), 'Are you sure want to delete this sub task?', [
  //     {
  //       text: 'No',
  //       onPress: () => {
  //         console.log('No Pressed');
  //       },
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'Yes',
  //       onPress: () => {
  //         const values = [...subValues.subtasks];
  //         values.splice(index, 1);
  //         setFieldValue('subtasks', values);
  //  this.setState({
  //     inputField: values,
  //   });
  //    checkForLastEmptyField();
  //    values.length === index;
  //       },
  //     },
  //   ]);
  // };

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
                    const values = [...subValues.subtasks];
                    values.splice(index, 1);
                    setFieldValue('subtasks', values);
                    this.props.saveTaskDelete(taskId);
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
          } catch (e) {
            console.log('catch error >>>', e);
          }
        },
      },
    ]);
  };

  handleEditSubTask = (subTaskId, setFieldValue, values) => {
    this.props.navigation.navigate('UPDATE_SUB_TASK', {
      subTaskId,
      inputField: values?.subtasks,
      setFieldValue,
      selectedGroup: this?.props?.route?.params?.selected,
    });
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const dateFormat = new Date();
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    let customDayHeaderStyles = [];

    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });

    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
        <KeyboardAvoidingView
          style={styles.KeyboardAvoidingView}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          enabled
          keyboardVerticalOffset={120}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollView}
            nestedScrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          >
            {this.state.taskDetails ? (
              <Formik
                initialValues={{
                  title: this?.state?.taskDetails?.title,
                  description: this?.state?.taskDetails?.description,
                  date: this?.state?.taskDetails?.date,
                  // date: '',
                  time: this?.state?.taskDetails?.time,
                  // time: moment(this?.state?.taskDetails?.time, ['h:mm A']).format('H:i:s'),
                  subtasks: this?.state?.taskDetails?.subtasks,
                  assigned_group_id: this.state.taskDetails.assigned_group_id,
                  assigned_group_title: this.state.taskDetails.assigned_group_title,
                  assigned_user_id: this.state.taskDetails.assigned_user_id,
                  assigned_user_name: this.state.taskDetails.assigned_user_name,
                }}
                onSubmit={this.onUpdateSubmit}
                validationSchema={this.taskSchema}
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
                      <View style={styles.searchControl}>
                        <Input
                          value={values.title}
                          onChangeText={handleChange('title')}
                          placeholder="What’s the task?"
                          style={[styles.searchInput, { fontWeight: 'bold', color: theme?.colors?.GRAY_300 }]}
                          inputContainerStyle={styles.searchInputContainerStyle}
                          inputStyle={styles.searchInputStyle}
                          errorStyle={{ position: 'absolute', opacity: 0 }}
                        />
                      </View>
                      {/* <>
                      <TouchableOpacity style={styles.listItem}>
                        <View style={styles.left}>
                          <Image source={IMAGES.notes} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_200 }]}>Add a note</Text>
                          <Input
                            value={values.description}
                            onChangeText={handleChange('description')}
                            placeholder="Add a note"
                            style={styles.searchInput}
                            inputContainerStyle={[
                              styles.searchInputContainerStyle,
                              { borderBottomWidth: 0, height: Responsive.getWidth(10) },
                            ]}
                            multiline={true}
                            inputStyle={styles.searchInputStyle}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                          />
                        </View>
                      </TouchableOpacity>
                      </> */}
                      <TouchableOpacity style={[styles.listItem, { flexDirection: 'column' }]}>
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
                              style={[styles.searchInput, { paddingLeft: 0, color: theme?.colors?.GRAY_300 }]}
                              multiline={true}
                              inputContainerStyle={[
                                styles.searchInputContainerStyle,
                                { borderBottomWidth: 0, height: Responsive.getWidth(10), paddingLeft: 0 },
                              ]}
                              inputStyle={[{ height: 50, paddingLeft: 0, paddingTop: Responsive.getWidth(3) }]}
                              errorStyle={{ position: 'absolute', opacity: 0 }}
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.listItem}>
                        <View style={styles.left}>
                          <Image source={IMAGES.EVENTS_TAB} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <TouchableOpacity
                            onPress={() => {
                              {
                                this.setState({ switchDate: !this.state.switchDate });
                                Keyboard.dismiss();
                              }
                            }}
                          >
                            <Text style={values.date === '' ? [styles.h6, { top: 7 }] : styles.h6}>Date</Text>
                            <Text style={styles.selectedText}>
                              {values.date === ''
                                ? ''
                                : moment(dateFormat).format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                ? 'Today'
                                : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                ? 'Tommorow'
                                : moment(values.date).format('MM/DD/yyyy')}
                            </Text>
                          </TouchableOpacity>
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
                      </TouchableOpacity>
                      {this.state.switchDate ? (
                        <CalendarPicker
                          weekdays={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
                          onDateChange={date => setFieldValue('date', date)}
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
                          // initialDate={new Date()}
                          minDate={dateFormat}
                        />
                      ) : null}
                      <TouchableOpacity style={styles.listItem}>
                        <View style={styles.left}>
                          <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <TouchableOpacity
                            onPress={() => {
                              {
                                this.setState({ switchTime: !this.state.switchTime });
                                Keyboard.dismiss();
                              }
                            }}
                          >
                            <Text style={values.time === '' ? [styles.h6] : styles.h6}>Time</Text>
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
                              Keyboard.dismiss();
                              this.setState({ openTime: switchTime, switchTime, switchDate: false });
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
                        style={styles.listItem}
                        // disabled={this?.state?.groupTask}
                        onPress={() =>
                          this.props.navigation.navigate('ASSIGN_GROUP', {
                            selected: this?.props?.route?.params?.selected,
                            groupTitle: this?.props?.route?.params?.groupTitle,
                            isCreate: false,
                            from: this.state.from,
                            groupId: this?.state?.assigned_group,
                            userId: values.assigned_user_id,
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
                                ? [(styles.h6, { color: theme?.colors?.GRAY_200 })]
                                : [(styles.h6, { color: theme?.colors?.GRAY_200 })]
                            }
                          >
                            {this?.props?.route?.params?.groupTitle}
                          </Text>
                        </View>
                        <View style={styles.right}>
                          <Image source={IMAGES.rightArrow} style={styles.listArrowIcon} />
                        </View>
                      </TouchableOpacity>
                      {this?.state?.taskDetails?.subtasks?.length ? (
                        <TouchableOpacity style={[styles.listItem, styles.borderBottomNull]}>
                          <View style={styles.left}>
                            <Image source={IMAGES.subtask} style={styles.listIcon} />
                          </View>
                          <View style={styles.body}>
                            <Text style={styles.h6}>Subtasks</Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
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
                            <View
                              style={[
                                styles.subtasksView,
                                {
                                  height: 50,
                                  justifyContent: 'center',
                                },
                              ]}
                            >
                              <Swipeout
                                right={[
                                  {
                                    text: (
                                      <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} resizeMode={'contain'} />
                                    ),
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleRemoveSubtasks(index, setFieldValue, values, item?.id),
                                  },
                                  {
                                    text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} resizeMode={'contain'} />,
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleEditSubTask(item?.id, setFieldValue, values),
                                  },
                                ]}
                                autoClose={true}
                                backgroundColor={theme?.colors?.GRAY_1000}
                              >
                                <View>
                                  <Text style={styles.h6}>{item?.title}</Text>
                                </View>
                              </Swipeout>
                            </View>
                          </React.Fragment>
                        );
                      })}
                      <TouchableOpacity
                        style={[styles.listItem, styles.borderBottomNull]}
                        onPress={() => this.handleAddSubGroup(values, setFieldValue)}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.plusIcon} style={[styles.listIcon, { tintColor: theme?.colors?.PURPLE_500 }]} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.PURPLE_500 }]}>Add subtask</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.subtasksView}>
                        {/* <TouchableOpacity onPress={() => handleSubmit(values)}>
                      <View style={styles.body}>
                        <Text style={[styles.h6, { color: theme?.colors?.PURPLE_500 }]}>Save</Text>
                      </View>
                    </TouchableOpacity> */}
                      </View>
                    </>
                  );
                }}
              </Formik>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    taskDetail: state?.dashboardState?.taskDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(UpdateTaskScreen);
