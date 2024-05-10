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
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES } from '@themes';

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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppContext } from '../../themes/AppContextProvider';

const dateFormat = new Date();
class UpdateEventTask extends React.Component {
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
      fromTask: null,
      subTitle: '',
      subDescrption: '',
      subDate: moment().format('MM/DD/yyyy'),
      subTime: '',
      subFrom: null,
      subSelected: '',
      oldTasks: [...this.props.route.params.inputField],
      setFieldValue: this?.props?.route?.params?.setFieldValue,
      //   selectedTask: [],
      //   userNameTask: '',
      newIndex: 0,
      subTaskId: this?.props?.route?.params?.subTaskId,
      groupId: this?.props?.route?.params?.groupId,
      eventDate: this?.props?.route?.params?.eventDate,
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
    assigned_user_id: Yup.string().required('Please select a user to assign this task'),
  });

  onTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('HH:mm:ss');
    this.setState({
      time: time,
    });
    setFieldValue('time', timeDate);
  }

  componentDidMount() {
    const cloneSubEditData = [...this.state.oldTasks];
    const subFindEditIndex = this.state.oldTasks.findIndex(val => val.id === Number(this.state.subTaskId));

    this.setState({
      newIndex: subFindEditIndex,
    });
    if (this?.state?.oldTasks[this?.state?.newIndex]?.time) {
      this.setState({
        openTime: true,
      });
    }
    if (this?.state?.oldTasks[this?.state?.newIndex]?.date) {
      this.setState({
        openDate: true,
      });
    }
    if (subFindEditIndex !== -1) {
      this?.props?.navigation?.setParams({
        subSelected: cloneSubEditData[subFindEditIndex].assigned_user_id,
        subGroupTitle: cloneSubEditData[subFindEditIndex].assigned_user_name || 'Assign to a user or group',
        subFrom: cloneSubEditData[subFindEditIndex].assigned_user_id ? 'user' : 'user',
      });
    }
  }

  // onDateCalender(date, setFieldValue) {
  //   const timeDate = moment(time).format('HH:mm:ss');
  //   this.setState({
  //     time: time,
  //   });
  //   console.log('time...', timeDate);
  //   setFieldValue('time', timeDate);
  // }

  checkForLastEmptyField = () => {
    const values = [...this.state.inputField];
    const lastField = values[values.length - 1];
    const isLastFieldEmpty = !lastField.title.length;

    return isLastFieldEmpty;
  };

  handleAddSubGroup = () => {
    Keyboard.dismiss();
    const values = [...this.state.inputField];
    if (this.state.inputField.length === 0 || !this.checkForLastEmptyField()) {
      values.push({ title: '' });
      this.setState({
        inputField: values,
      });
      // setInputFields(values);
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
              this.props.saveDashboard(resp.data, resp.total_task_count);
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

  handleRemoveSubtasks = index => {
    const values = [...this.state.inputField];
    // console.log('values..', values.splice(index, 1));
    values.splice(index, 1);
    this.setState({
      inputField: values,
    });
    // checkForLastEmptyField();
    // values.length === index;
  };

  handleSubmit = values => {
    const cloneSubData = [...this.state.oldTasks];
    const subFindIndex = this.state.oldTasks.findIndex(val => val.id === Number(this.state.subTaskId));
    if (subFindIndex !== -1) {
      cloneSubData[subFindIndex] = {
        ...cloneSubData[subFindIndex],
        title: values.title,
        description: values.description,
        date: moment(values.date).format('MM/DD/yyyy'),
        time: values.time,
        assigned_user_id: values.assigned_user_id,
        assigned_user_name: values.assigned_user_name,
      };
    }
    this.state.setFieldValue('tasks', cloneSubData);
    this.props.navigation.goBack();
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const { img, width, height } = this.props;
    const { container } = style;
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ScrollView}
            nestedScrollEnabled={false}
            keyboardShouldPersistTaps="handled"
          >
            <Formik
              initialValues={{
                title: inputField?.title,
                description: inputField?.description,
                date: inputField?.date,
                // date: '',
                time: inputField?.time,
                assigned_user_id: inputField?.assigned_user_id,
                assigned_user_name: inputField?.assigned_user_name,
              }}
              onSubmit={this.handleSubmit}
              validationSchema={this.taskSchema}
              enableReinitialize
            >
              {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                if (!this?.props?.route?.params?.handleSubmit) {
                  this.props.navigation.setParams({ handleSubmit });
                }
                return (
                  <>
                    <View style={styles.searchControl}>
                      <Input
                        value={values.title}
                        onChangeText={handleChange('title')}
                        placeholder="What’s the sub task?"
                        style={[styles.searchInput, { fontWeight: 'bold', color: theme?.colors?.GRAY_300 }]}
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
                    <TouchableOpacity style={[styles.listItem, { flexDirection: 'column' }]}>
                      <View style={styles.listItem2}>
                        <View style={styles.left}>
                          <Image source={IMAGES.notes} style={{ ...STYLES.imageStyle(5) }} resizeMode={'stretch'} />
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
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.listItem, { flexDirection: 'column' }]}>
                      <View style={styles.listItem2}>
                        <View style={styles.left}>
                          <Image source={IMAGES.EVENTS_TAB} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <TouchableOpacity
                            onPress={() => {
                              Keyboard.dismiss();
                              this.setState({ switchDate: !this.state.switchDate, switchTime: false });
                            }}
                          >
                            <Text style={values.date === '' ? [styles.h6] : styles.h6}>Date</Text>
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
                      {errors.date && touched.date && <Text style={[styles.errorText, { width: '100%' }]}>{errors.date}</Text>}
                    </TouchableOpacity>
                    {this.state.switchDate ? (
                      <CalendarPicker
                        weekdays={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
                        onDateChange={date => {
                          this.setState({ openDate: true, switchDate: false });
                          setFieldValue('date', date);
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
                        // initialDate={new Date()}
                        minDate={dateFormat}
                        maxDate={this?.state?.eventDate}
                      />
                    ) : null}
                    <TouchableOpacity style={styles.listItem}>
                      <View style={styles.left}>
                        <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                      </View>
                      <TouchableOpacity
                        style={styles.body}
                        onPress={() => {
                          Keyboard.dismiss();
                          this.setState({ switchTime: !this.state.switchTime, switchDate: false });
                        }}
                      >
                        <Text style={values.date === '' ? [styles.h6, { top: Responsive.getWidth(2.5) }] : styles.h6}>Time</Text>
                        {values.time ? <Text style={styles.selectedText}>{moment(values.time, ['h:mm A']).format('hh:mm A')}</Text> : null}
                      </TouchableOpacity>
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
                    <View>
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() =>
                          this.props.navigation.navigate('Assign_User_Screen', {
                            selectedTask: values?.assigned_user_id,
                            userNameTask: values?.assigned_user_name,
                            from: this.state.fromTask,
                            isCreateTask: false,
                            setFieldValue,
                            groupId: this?.state?.groupId,
                          })
                        }
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.usersGroup} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <Text
                            style={
                              this?.props?.route?.params?.subSelected === undefined
                                ? [(styles.h6, { color: theme?.colors?.GRAY_200 })]
                                : [(styles.h6, { color: theme?.colors?.GRAY_200 })]
                            }
                          >
                            {/* {this?.props?.route?.params?.userNameTask === ''
                              ? 'Assign User'
                              : this?.props?.route?.params?.userNameTask
                              ? this?.props?.route?.params?.userNameTask
                              : values.assigned_user_name} */}
                            {values.assigned_user_name ? values.assigned_user_name : 'Assign to a user'}
                          </Text>
                        </View>
                        <View style={styles.right}>
                          <Image source={IMAGES.rightArrow} style={styles.listArrowIcon} />
                        </View>
                      </TouchableOpacity>
                      {errors.assigned_user_id && touched.assigned_user_id && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(6), paddingBottom: Responsive.getWidth(3) }]}>
                          {errors.assigned_user_id}
                        </Text>
                      )}
                    </View>
                  </>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaWrapper>
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdateEventTask);
