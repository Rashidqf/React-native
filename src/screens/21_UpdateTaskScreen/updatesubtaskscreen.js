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

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

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
import { AppContext } from '../../themes/AppContextProvider';

const dateFormat = new Date();
class UpdateSubTaskScreen extends React.Component {
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
      subFrom: null,
      subSelected: '',
      oldSubtasks: [...this.props.route.params.inputField],
      setFieldValue: this.props.route.params.setFieldValue,
      subTaskId: this?.props?.route?.params?.subTaskId,
      newIndex: 0,
      selectedGroup: this?.props?.route?.params?.selectedGroup,
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
    const cloneSubEditData = [...this.state.oldSubtasks];
    const subFindEditIndex = this.state.oldSubtasks.findIndex(val => val.id === Number(this.state.subTaskId));
    this.setState({
      newIndex: subFindEditIndex,
    });
    if (this?.state?.oldSubtasks[this?.state?.newIndex]?.time) {
      this.setState({
        openTime: true,
      });
    }
    if (this?.state?.oldSubtasks[this?.state?.newIndex]?.date) {
      this.setState({
        openDate: true,
      });
    }
    if (subFindEditIndex !== -1) {
      this?.props?.navigation?.setParams({
        subSelected: cloneSubEditData[subFindEditIndex].assigned_group_id || cloneSubEditData[subFindEditIndex].assigned_user_id,
        subGroupTitle:
          cloneSubEditData[subFindEditIndex].assigned_group_title ||
          cloneSubEditData[subFindEditIndex].assigned_user_name ||
          'Assign to a user or group',
        subFrom: cloneSubEditData[subFindEditIndex].assigned_group_id ? 'group' : 'user',
      });
    }
  }

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
    const cloneSubData = [...this.state.oldSubtasks];
    const subFindIndex = this.state.oldSubtasks.findIndex(val => val.id === Number(this.state.subTaskId));
    if (subFindIndex !== -1) {
      cloneSubData[subFindIndex] = {
        ...cloneSubData[subFindIndex],
        title: values.title,
        description: values.description,
        date: moment(values.date).format('MM/DD/yyyy'),
        time: values.time,
      };

      let key = 'assigned_group_title';
      if (this?.props?.route?.params?.subFrom === 'user') {
        key = 'assigned_user_name';
      }
      if (this.props.route.params.subSelected) {
        cloneSubData[subFindIndex] = {
          ...cloneSubData[subFindIndex],
          [key]: values[key] || 'Assign to a user or group',
          [`assigned_user_id`]: this?.props?.route?.params?.subSelected,
          //   [`assigned_${this?.props?.route?.params?.subFrom}_id`]: this?.props?.route?.params?.subSelected,
        };
      } else {
        cloneSubData[subFindIndex] = {
          ...cloneSubData[subFindIndex],
          [key]: values[key] || 'Assign to a user or group',
          [`assigned_user_id`]: '',
        };
      }
    }
    this.state.setFieldValue('subtasks', cloneSubData);
    this.props.navigation.goBack();
  };

  render() {
    const inputField = this.state.oldSubtasks[this?.state?.newIndex];

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
            <Formik
              initialValues={{
                title: inputField?.title,
                description: inputField?.description,
                date: inputField?.date,
                // date: '',
                time: inputField?.time,
                // time: moment(inputField?.time, ['h:mm A']).format('H:i:s'),
                assigned_group_id: inputField?.assigned_group_id,
                assigned_group_title: inputField?.assigned_group_title,
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
                    <TouchableOpacity style={styles.listItem}>
                      <View style={styles.left}>
                        <Image source={IMAGES.notes} style={styles.listIcon} />
                      </View>
                      <View style={styles.body}>
                        {/* <Text style={[styles.h6, { color: theme?.colors?.GRAY_200 }]}>Add a note</Text> */}

                        <Input
                          value={values.description !== 'undefined' ? values.description : ''}
                          onChangeText={handleChange('description')}
                          placeholder="Add a note"
                          style={[styles.searchInput, { color: theme?.colors?.GRAY_300 }]}
                          inputContainerStyle={[
                            styles.searchInputContainerStyle,
                            { borderBottomWidth: 0, height: Responsive.getWidth(10) },
                          ]}
                          inputStyle={styles.searchInputStyle}
                          errorStyle={{ position: 'absolute', opacity: 0 }}
                        />
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
                              Keyboard.dismiss();
                              this.setState({ switchDate: !this.state.switchDate, switchTime: false });
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
                              Keyboard.dismiss();
                              this.setState({ switchTime: !this.state.switchTime, switchDate: false });
                            }
                          }}
                        >
                          <Text style={values.date === '' ? [styles.h6, { top: 5 }] : styles.h6}>Time</Text>
                          {values.time ? (
                            <Text style={styles.selectedText}>{moment(values.time, ['h:mm A']).format('hh:mm A')}</Text>
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
                    {this?.state?.selectedGroup ? (
                      <TouchableOpacity
                        style={styles.listItem}
                        // disabled={this?.state?.selectedGroup}
                        onPress={() =>
                          this.props.navigation.navigate('ASSIGN_SUB_GROUP', {
                            subSelected: this?.props?.route?.params?.subSelected,
                            subGroupTitle: this?.props?.route?.params?.subGroupTitle,
                            subIsCreate: false,
                            subFrom: this.state.subFrom,
                            groupId: this.state.selectedGroup,
                            inputField: inputField,
                            setFieldValue,
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
                            {'Selected'}
                            {/* {this?.props?.route?.params?.subSelected === undefined
                              ? ' Assign to a user or group'
                              : this?.props?.route?.params?.subGroupTitle} */}
                            {/* {this?.props?.route?.params?.subSelected === null ? 'Selected' : this?.props?.route?.params?.subGroupTitle} */}
                          </Text>
                        </View>
                        <View style={styles.right}>
                          <Image source={IMAGES.rightArrow} style={styles.listArrowIcon} />
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </>
                );
              }}
            </Formik>
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
export default connect(mapStateToProps, mapDispatchToProps)(UpdateSubTaskScreen);
