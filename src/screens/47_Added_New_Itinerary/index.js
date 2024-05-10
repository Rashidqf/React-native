import React, { Component, createRef, useRef } from 'react';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { AppContext } from '../../themes/AppContextProvider';
import { SafeAreaWrapper } from '@components';
import { Button, Input, Switch } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IMAGES, COMMON_STYLE } from '@themes';
import { style } from './style';
import { Formik } from 'formik';
import { Responsive } from '@helpers';
import { FONTS } from '@themes';
import Sheet from '../../components/sheet';
import { COLORS } from '../../themes/colors';
import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';

import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callApi } from '@apiCalls';
import { API_DATA } from '@constants';
import moment from 'moment';
import * as Yup from 'yup';
import { localize } from '@languages';
import Swipeout from 'react-native-swipeout';

const dateFormat = new Date();
export class AddedNewItineraryScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerTitle: () => {
        return <Text style={COMMON_STYLE.textStyle(14, COLORS.GRAY_100, 'BOLD', 'center')}>{this?.props?.route?.params?.item?.title}</Text>;
      },
      headerRight: () => (
        <Button
          buttonStyle={COMMON_STYLE.headerButtonStyle}
          type={'clear'}
          icon={<Image source={IMAGES.visible} style={COMMON_STYLE.imageStyle(6, COLORS?.ORANGE_200)} />}
          // onPress={() => this.props.navigation('New_Itinerary_Details')}
          onPress={() => this?.props?.navigation?.navigate('New_Itinerary_Details', { id: this?.props?.route?.params?.item?.id })}
        />
      ),
    });
    this.state = {
      sheetOpen: false,
      switchReminder: false,
      switchDay: false,
      switchColor: false,
      is_reminder: 0,
      selectedStartDate: null,
      time: new Date(),
      endTime: new Date(),
      switchDate: false,
      switchTime: true,
      switchEndTime: false,
      switchStartTime: false,
      toggleSwitch: false,
      toggleColor: false,
      deletePopup: false,
      setEventName: [],
    };
  }
  static contextType = AppContext;
  formikRef = createRef();
  ScrollViewRef = createRef();
  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
    value === true ? this.setState({ reminderColor: false }) : null;
    value === false ? this.setState({ reminderColor: true }) : null;
  }
  eventSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    description: Yup.string().required('Please enter description'),
    location: Yup.string().required('Please choose your location'),
    // date: Yup.string().required('Please select date'),
    image: Yup.mixed().test('fileType', 'Only JPEG, PNG, and JPG image types are allowed', value => {
      if (value) {
        const splittedValues = value?.split('.');
        const supportedFormats = ['jpeg', 'png', 'jpg'];
        return supportedFormats.includes(splittedValues?.[splittedValues?.length - 1]);
      }
      return true;
    }),
    // start_time: Yup.string().when('is_fullday', {
    //   is: 0,
    //   then: Yup.string()
    //     .test('not empty', 'Please select start time', function (value) {
    //       return !!value;
    //     })
    //     .test('start_time_test', 'Start time must be before end time', function (value) {
    //       const { end_time } = this.parent;
    //       return moment(value, 'HH:mm A').isSameOrBefore(moment(end_time, 'HH:mm A'));
    //     }),
    // }),
    // end_time: Yup.string().when('is_fullday', {
    //   is: 0,
    //   then: Yup.string()
    //     .test('not empty', 'Please select end time', function (value) {
    //       return !!value;
    //     })
    //     .test('end_time_test', 'End time must be after start time', function (value) {
    //       const { start_time } = this.parent;
    //       return moment(value, 'HH:mm A').isAfter(moment(start_time, 'HH:mm A'));
    //     }),
    //   // then: Yup.string().required('Please select end time'),
    // }),
    reminder_minute: Yup.string().when('is_reminder', {
      is: 1,
      then: Yup.string().required('Please select reminder time'),
    }),
  });
  initialValues = {
    title: '',
    description: '',
    is_fullday: 0,
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    reminder_minute: '',
    image: '',
    is_reminder: 0,
    tasks: [],
    toggleSwitch: this?.state?.toggleSwitch,
  };

  onDateChange(date, setFieldValue) {
    setFieldValue('date', date);
    this.setState({ switchDay: false });
  }

  onStartTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('hh:mm A');
    this.setState({
      time: time,
    });
    setFieldValue('start_time', timeDate);
  }

  onEndTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('hh:mm A');
    this.setState({
      endTime: time,
    });
    setFieldValue('end_time', timeDate);
  }
  daySwitch(value, setFieldValue, values) {
    Keyboard.dismiss();
    setFieldValue('is_fullday', value ? 1 : 0);
    // this.setState({ switchTime: true });
    value === true ? this.setState({ switchTime: false, switchColor: false }) : null;
    value === false ? this.setState({ switchTime: true, switchColor: true }) : null;
  }
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
    this.props.navigation.navigate('UPDATE_SUB_TASK', {
      subTaskId,
      inputField: values?.subtasks,
      setFieldValue,
    });
  };
  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
    value === true ? this.setState({ reminderColor: false }) : null;
    value === false ? this.setState({ reminderColor: true }) : null;
  }
  onSubmit = async (values, actions) => {
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    const startTimeUpdate = moment(values.start_time, ['h:mm A']).utc().format('HH:mm:ss');
    const endTimeUpdate = moment(values.end_time, ['h:mm A']).utc().format('HH:mm:ss');

    const updateToggleSwitch = values?.toggleSwitch === true ? 1 : 0;
    var today = Math.round(new Date().getTime() / 1000);
    let tempId = Math.round(new Date().getTime() / 1000);
    const array = [];
    this?.props?.route?.params?.selected?.map(item => array.push(item?.user_id));
    try {
      let item = {};
      values?.tasks?.forEach((v, index) => {
        const subdate = moment(v.date).format('MM/DD/yyyy');
        item = {
          ...item,
          [`tasks[${index}][title]`]: v.title,
          [`tasks[${index}][description]`]: v.description,
          [`tasks[${index}][date]`]: subdate,
          [`tasks[${index}][time]`]: v.time,
          [`tasks[${index}][assigned_user_id]`]: v.assigned_user_id || '',
          [`tasks[${index}][assign_all]`]: v.assign_all,
        };
      });
      let params = {
        url: API_DATA.EVENTADD,
        data: {
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          is_itinerary: 1,
          itinerary_id: this?.props?.route?.params?.item?.id,
          // date: dateDate,
          is_private: updateToggleSwitch,
          // start_time: values.is_fullday !== 1 ? startTimeUpdate : '',
          // end_time: values.is_fullday !== 1 ? endTimeUpdate : '',
          location: values.location,
          latitude: values.latitude || '1.1',
          longitude: values.longitude || '-1.1',
          is_reminder: values.is_reminder,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.groupId ? this?.state?.groupId : '',
          temp_id: tempId,
          share_user_ids: this.state?.toggleSwitch === true ? array.toString() : '',
          [`media[0]`]:
            values.image !== ''
              ? {
                  uri: values.image,
                  name: today + 'Img.jpg',
                  type: 'image/jpg',
                }
              : '',
          ...item,
        },
      };
      console.log('params ====>', params);
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.EVENTADD];

            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              actions.resetForm({ values: this.initialValues });
              this.setState({ setEventName: [...this.state?.setEventName, resp?.data] });
              // this?.props?.saveEventAdd(resp.data);
              actions.setSubmitting(false);
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
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const dateFormat = new Date();
    const { selectedStartDate } = this.state;
    const customPickerStyle = customPickerStyles(theme);
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';

    let customDayHeaderStyles = [];

    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });

    return (
      <>
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={{ height: '100%', width: '100%' }}
            extraScrollHeight={50}
            enableAutomaticScroll={true}
            enableOnAndroid={false}
          >
            <Formik
              initialValues={this.initialValues}
              onSubmit={this.onSubmit}
              validationSchema={this.eventSchema}
              enableReinitialize
              innerRef={this.formikRef}
            >
              {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                if (!this?.props?.route?.params?.handleSubmit) {
                  this.props.navigation.setParams({ handleSubmit });
                }
                return (
                  <>
                    <ScrollView
                      ref={this.ScrollViewRef}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={[
                        styles.ScrollView,
                        {
                          paddingBottom: 40,
                        },
                      ]}
                      nestedScrollEnabled={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      <Sheet
                        isOpen={this.state.sheetOpen}
                        setClose={() => this.setState({ sheetOpen: false })}
                        setFieldValue={setFieldValue}
                        multiple={false}
                      />
                      <View style={{ marginTop: 100 }}>
                        <ScrollView horizontal={true}>
                          <View style={styles.tabContianer}>
                            <TouchableOpacity style={[styles.tabItem]}>
                              <Text style={styles.tabItemText}>{this?.props?.route?.params?.item?.title}</Text>
                            </TouchableOpacity>
                            {this?.state?.setEventName ? (
                              <FlatList
                                horizontal={true}
                                keyboardShouldPersistTaps="handled"
                                data={this.state.setEventName}
                                renderItem={({ item, index }) => {
                                  return (
                                    <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
                                      <Text style={styles.tabItemText}>{item?.title}</Text>
                                    </TouchableOpacity>
                                  );
                                }}
                                keyExtractor={item => item.index}
                                // style={{ height: 120 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                              />
                            ) : null}
                          </View>
                        </ScrollView>
                      </View>
                      <View style={styles.eventList}>
                        <Input
                          placeholder="What’s the event?"
                          placeholderTextColor={theme?.colors?.GRAY_100}
                          value={values.title || ''}
                          style={[styles.searchInput, { color: theme?.colors?.GRAY_100, fontSize: 20 }]}
                          onChangeText={handleChange('title')}
                          inputContainerStyle={[styles.searchInputContainerStyle, { borderBottomWidth: 0 }]}
                          inputStyle={[styles.searchInputStyle, { paddingLeft: Responsive.getWidth(4) }]}
                          errorStyle={{ position: 'absolute', opacity: 0 }}
                          // placeholderTextColor="#635E5C"
                        />
                        <TouchableOpacity style={[styles.eventListBtn]} onPress={() => this.setState({ deletePopup: true })}>
                          <Image source={IMAGES.deleteNewIcon} style={styles.eventListIcon} />
                        </TouchableOpacity>
                      </View>
                      {errors.title && touched.title && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.title}</Text>
                      )}
                      <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                        <View style={[styles.left]}>
                          <Image source={IMAGES.notes} style={{ height: 24, width: 24 }} resizeMode={'stretch'} />
                        </View>
                        <View style={[styles.body, { marginLeft: -Responsive.getWidth(2) }]}>
                          <Input
                            value={values.description || ''}
                            onChangeText={handleChange('description')}
                            placeholder="Add a note"
                            placeholderTextColor={theme?.colors?.GRAY_100}
                            style={[styles.searchInput, { paddingLeft: 0, color: theme?.colors?.GRAY_300, fontFamily: FONTS.BOLD }]}
                            multiline={true}
                            inputContainerStyle={[
                              styles.searchInputContainerStyle,
                              { borderBottomWidth: 0, height: Responsive.getWidth(10), paddingLeft: 0 },
                            ]}
                            inputStyle={[{ height: '100%', paddingLeft: 0 }]}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                          />
                        </View>
                      </TouchableOpacity>
                      {errors.description && touched.description && (
                        <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>{errors.description}</Text>
                      )}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => this.setState({ sheetOpen: true })}
                      >
                        {/* <TouchableOpacity style={styles.listItem} onPress={() => this.handleOpenImage()}> */}
                        <View style={styles.left}>
                          <Image source={IMAGES.photo} style={styles.listIcon} />
                        </View>

                        {values.image ? (
                          <Image
                            source={values.image ? { uri: values.image } : IMAGES.backArrow}
                            style={{ height: 100, width: 150, borderRadius: 10 }}
                          />
                        ) : (
                          <View style={styles.body}>
                            <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Add event photo</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {errors.image && touched.image && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.image}</Text>
                      )}
                      {/* <TouchableOpacity style={[styles.listItem, { flexDirection: 'column', borderBottomWidth: 0 }]}>
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
                            {this.state.openDate == false
                              ? errors.date &&
                                touched.date && (
                                  <Text style={[styles.errorText, { paddingTop: Responsive.getWidth(2) }]}>{errors.date}</Text>
                                )
                              : null}
                          </View>
                          <View style={styles.right}>
                            <TouchableOpacity onPress={() => this.setState({ switchDate: true })}>
                              <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                            </TouchableOpacity>
                           
                          </View>
                        </View>
                        {errors.date && touched.date && this?.state?.switchDate === false && (
                          <Text style={[styles.errorText, { width: '100%' }]}>{errors.date}</Text>
                        )}
                      </TouchableOpacity> */}
                      {/* {this.state.switchDate ? (
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
                      ) : null} */}
                      {/* <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          Keyboard.dismiss();
                          // this.setState({ switchTime: false });
                        }}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.clockIcon} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>All Day</Text>
                        </View>
                        <View style={styles.right}>
                          <Switch
                            // style={{ backgroundColor: theme?.colors?.GRAY_800, borderRadius: 15 }}
                            value={Boolean(values.is_fullday || 0)}
                            // thumbColor={this.state.switchColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                            color={theme?.colors?.RED_500}
                            onValueChange={day => this.daySwitch(day, setFieldValue)}
                          />
                        </View>
                      </TouchableOpacity> */}
                      {/* {this.state.switchTime ? (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <TouchableOpacity
                            style={[styles.listItem, { borderBottomWidth: 0, flexDirection: 'column' }]}
                            onPress={() => {
                              this.setState({ switchStartTime: !this.state.switchStartTime });
                            }}
                          >
                            <View style={styles.right}>
                              <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD, marginLeft: 25 }]}>
                                {values.start_time ? values.start_time : 'Start Time'}
                              </Text>
                            </View>
                            {errors.start_time && touched.start_time && (
                              <Text style={[styles.errorText, { marginTop: 0 }]}>{errors.start_time}</Text>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.listItem, { borderBottomWidth: 0, flexDirection: 'column' }]}
                            onPress={() => {
                              this.setState({ switchEndTime: !this.state.switchEndTime });
                            }}
                          >
                            <View style={styles.right}>
                              <Text style={[styles.h6, { color: theme?.colors?.GRAY_100 }]}>
                                {values.end_time !== '' ? values.end_time : 'End Time'}
                              </Text>
                            </View>
                            {errors.end_time && touched.end_time && (
                              <Text style={[styles.errorText, { marginTop: 0 }]}>{errors.end_time}</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      ) : null} */}
                      {/* {this.state.switchStartTime ? (
                        <View style={styles.datePickerView}>
                          <DatePicker
                            mode="time"
                            open={true}
                            date={this.state.time}
                            onDateChange={time => this.onStartTimeChange(time, setFieldValue)}
                            // onDateChange={time => setFieldValue('time', time)}
                            textColor={theme?.colors?.WHITE}
                          />
                        </View>
                      ) : null} */}
                      {/* {this.state.switchEndTime ? (
                        <View style={styles.datePickerView}>
                          <DatePicker
                            mode="time"
                            open={true}
                            date={this.state.endTime}
                            onDateChange={time => this.onEndTimeChange(time, setFieldValue)}
                            // onDateChange={time => setFieldValue('end_time', time)}
                            textColor={theme?.colors?.WHITE}
                          />
                        </View>
                      ) : null} */}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
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
                            placeholder="Add location"
                            placeholderTextColor={theme?.colors?.GRAY_100}
                            style={[styles.noBorderInputTxt, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}
                            inputContainerStyle={styles.noBorderInputContainer}
                            inputStyle={styles.noBorderInput}
                            onChangeText={handleChange('location')}
                            editable={false}
                            value={values.location || ''}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                            // placeholderTextColor="#635E5C"
                          />
                        </View>
                        <View style={styles.right}>
                          <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                        </View>
                      </TouchableOpacity>
                      {errors.location && touched.location && (
                        <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>{errors.location}</Text>
                      )}
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
                            value={Boolean(values.is_reminder || 0)}
                            // thumbColor={this.state.reminderColor === 'true' ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
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
                                { label: '15 min before', value: '15' },
                                { label: '30 min before', value: '30' },
                                { label: '45 min before', value: '45' },
                                { label: '60 min before', value: '60' },
                              ]}
                              value={values.reminder_minute}
                              // placeholderTextColor="black"
                              style={customPickerStyle}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : null}
                      {errors.reminder_minute && touched.reminder_minute && (
                        <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>
                          {errors.reminder_minute}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          Keyboard.dismiss();
                        }}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.add_task_event} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Task</Text>
                        </View>
                      </TouchableOpacity>
                      {values?.tasks?.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <View style={{}}>
                              <Swipeout
                                right={
                                  [
                                    // {
                                    //   text: (
                                    //     <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} resizeMode={'contain'} />
                                    //   ),
                                    //   backgroundColor: 'rgba(52, 52, 52, 0.3)',
                                    //   onPress: () => this.handleDeleteSubTask(index, setFieldValue, values),
                                    // },
                                    // {
                                    //   text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                    //   backgroundColor: 'rgba(52, 52, 52, 0.3)',
                                    //   onPress: () => this.handleCreateSubTask(item?.id, setFieldValue, values),
                                    // },
                                  ]
                                }
                                autoClose={true}
                                backgroundColor={'rgba(52, 52, 52, 0.3)'}
                                style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
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
                                    style={[styles.h6, { paddingLeft: Responsive.getWidth(8), color: theme?.colors?.WHITE }]}
                                  >
                                    {item?.title}
                                  </Text>
                                </View>
                              </Swipeout>
                            </View>
                          </React.Fragment>
                        );
                      })}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          // this?.props?.navigation.navigate('NEW_TASK');
                          this.props.navigation.navigate('Create_Itinerary_Task', {
                            tasks: values.tasks,
                            setFieldValue,
                            groupId: this?.state?.groupId,
                            eventDate: moment(values.date).format('MM/DD/yyyy'),
                            isItinerary: false,
                          });
                        }}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.add_task_event} style={[styles.listIcon, { opacity: 0 }]} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.ORANGE_200, fontFamily: FONTS.BASE }]}>
                            <Image source={IMAGES.plusIcon} style={[{ width: 15, height: 15, tintColor: theme?.colors?.ORANGE_200 }]} />
                            {'  '}Add task
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.stickyButton}>
                        <TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
                          <View
                            style={{
                              backgroundColor: COLORS.BLACK_50,
                              height: 30,
                              width: 30,
                              borderRadius: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Image source={IMAGES.plusIcon} style={[styles.listIcon, { tintColor: theme?.colors?.PURPLE_500 }]} />
                          </View>
                          <Text style={{ color: theme?.colors?.WHITE, fontSize: 14, fontFamily: FONTS.BOLD, marginLeft: 8 }}>
                            Add event
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.draftButton}
                          onPress={() => {
                            this?.props?.navigation?.navigate('TAB_NAVIGATOR');

                            this.props.showToast(localize('SUCCESS'), 'Itinerary saved');
                          }}
                        >
                          <Text style={{ color: theme?.colors?.WHITE, fontSize: 14, fontFamily: FONTS.BOLD }}>Save as draft</Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>
                  </>
                );
              }}
            </Formik>
          </KeyboardAwareScrollView>
        </ImageBackground>
        <Modal animationType="slide" transparent={true} visible={this.state.deletePopup}>
          <TouchableWithoutFeedback onPress={() => this.setState({ deletePopup: false })}>
            <View style={styles.safeAreaStyle}>
              <View style={styles.alertBoxStyle}>
                <Button
                  title={'Delete Event'}
                  titleStyle={[styles.btnTitleStyle]}
                  buttonStyle={[styles.btn, styles.btnOrange]}
                  onPress={() => {
                    this.formikRef.current?.resetForm();
                    this.setState({ deletePopup: false });
                  }}
                />
                <Button
                  title={'Close'}
                  titleStyle={[styles.btnTitleStyle, { color: theme?.colors?.ORANGE_200 }]}
                  buttonStyle={[styles.btn, styles.btnOutlineOrange]}
                  onPress={() => this.setState({ deletePopup: false })}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  }
}

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

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AddedNewItineraryScreen);
