import {
  Alert,
  Text,
  View,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Linking,
  FlatList,
} from 'react-native';
import React, { Component, createRef } from 'react';
import Swipeout from 'react-native-swipeout';

import { COMMON_DATA, API_DATA } from '@constants';
import * as Yup from 'yup';
import moment from 'moment';
import { AppContext } from '../../themes/AppContextProvider';
import { SafeAreaWrapper } from '@components';
import { Button, Input, Switch } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IMAGES } from '@themes';
import { style } from './style';
import { localize } from '@languages';
import { Formik, useFormikContext } from 'formik';
import { Responsive } from '@helpers';
import { FONTS, COMMON_STYLE } from '@themes';
import Sheet from '../../components/sheet';
import { COLORS } from '../../themes/colors';
import RNPickerSelect from 'react-native-picker-select';

import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { callApi } from '@apiCalls';

export class NewItineraryScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () =>
        this?.props?.route?.params?.isEdit ? (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.submitform()}>
            <Text style={COMMON_STYLE.headerBtnTextStyle}>Update</Text>
          </TouchableOpacity>
        ) : null,
    });
    this.state = {
      sheetOpen: false,
      switchReminder: false,
      switchDay: false,
      switchColor: false,
      is_reminder: 0,
      switchTime: true,
      switchEndTime: false,
      switchStartTime: false,
      toggleSwitch: false,
      toggleColor: false,
      time: new Date(),
      endTime: new Date(),
      reminderColor: false,
      itineraryDetails: this?.props?.itineraryDetails,
      groupId: this?.props?.route?.params?.groupId,
      setEventData: [{ title: 'Event 1' }, { title: 'Event 2' }, { title: 'Event 3' }, { title: 'Event 4' }],
    };
    this.onDateChange = this.onDateChange.bind(this);

    // this.focusSubscriber = null;
  }

  static contextType = AppContext;
  formikRef = createRef();
  ScrollViewRef = createRef();
  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
    value === true ? this.setState({ reminderColor: false }) : null;
    value === false ? this.setState({ reminderColor: true }) : null;
  }

  submitform = () => {
    this?.formikRef?.current?.handleSubmit();
  };
  componentDidMount() {
    if (this?.props?.route?.params?.isEdit) this.getItineraryDetails();
  }
  componentWillUnmount() { }

  updateItinerary = values => {
    var today = Math.round(new Date().getTime() / 1000);
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    const startTimeUpdate = moment(values.start_time, ['h:mm A']).utc().format('HH:mm:ss');
    const endTimeUpdate = moment(values.end_time, ['h:mm A']).utc().format('HH:mm:ss');

    try {
      let params = {
        url: API_DATA.UPDATE_ITINERARY,
        data: {
          id: this?.props?.route?.params?.id,
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          location: values.location,
          date: dateDate,
          start_time: values.is_fullday !== 1 ? startTimeUpdate : '',
          end_time: values.is_fullday !== 1 ? endTimeUpdate : '',
          latitude: values.latitude || '1.1',
          longitude: values.longitude || '-1.1',
          is_reminder: values.is_reminder.toString(),
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.groupId ? this?.state?.groupId : '',
          [`media[0]`]: values.image
            ? {
              uri: values.image,
              name: today + 'Img.jpg',
              type: 'image/jpg',
            }
            : '',
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.UPDATE_ITINERARY];
            if (resp.success) {
              const iList = this.props.itineraryList.itinerary.map(item => (item.id === resp?.data?.id ? { ...resp?.data } : item));
              this?.props?.getItineraryList({ itinerary: iList });
              this?.props?.saveItineraryDetails(resp?.data);
              console.log('itenary data', resp);
              this?.props?.navigation?.goBack();
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
  getItineraryDetails = values => {
    try {
      let params = {
        url: API_DATA.ITINERARY_DETAILS,
        data: {
          id: this?.props.route?.params?.id,
        },
      };

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.ITINERARY_DETAILS];
            if (resp.success) {
              this.setState({ itineraryDetails: resp?.data });

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

  eventSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
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
    start_time: Yup.string().when('is_fullday', {
      is: 0,
      then: Yup.string()
        .test('not empty', 'Please select start time', function (value) {
          return !!value;
        })
        .test('start_time_test', 'Start time must be before end time', function (value) {
          const { end_time } = this.parent;
          return moment(value, 'HH:mm A').isSameOrBefore(moment(end_time, 'HH:mm A'));
        })
        .nullable(),
    }),
    end_time: Yup.string().when('is_fullday', {
      is: 0,
      then: Yup.string()
        .test('not empty', 'Please select end time', function (value) {
          return !!value;
        })
        .test('end_time_test', 'End time must be after start time', function (value) {
          const { start_time } = this.parent;
          return moment(value, 'HH:mm A').isAfter(moment(start_time, 'HH:mm A'));
        })
        .nullable(),
      // then: Yup.string().required('Please select end time'),
    }),
    reminder_minute: Yup.string().when('is_reminder', {
      is: 1,
      then: Yup.string().required('Please select reminder time'),
    }),
  });

  onDateChange(date, setFieldValue) {
    setFieldValue('date', date);
    this.setState({ switchDay: false });
  }

  minDateTask = values => {
    const dateArray = values?.tasks?.map(item => moment(item?.date).format('MM/DD/yyyy'));
    const sorted = dateArray?.sort((a, b) => moment(a.settledDate) - moment(b.settledDate));
    const minDate = sorted[0];
    return new Date(minDate);
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
  onStartTimeChange(time, setFieldValue) {
    const timeDate = moment(time).format('hh:mm A');
    this.setState({
      time: time,
    });
    setFieldValue('start_time', timeDate);
  }
  handleCreateSubTask = (subTaskId, setFieldValue, values) => {
    this.props.navigation.navigate('UPDATE_SUB_TASK', {
      subTaskId,
      inputField: values?.subtasks,
      setFieldValue,
    });
  };
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

  handleAddTask = (values, setFieldValue) => {
    this.props.navigation.navigate('Create_Itinerary_Task', {
      tasks: values.tasks,
      setFieldValue,
      groupId: this?.state?.groupId,
      eventDate: moment(values.date).format('MM/DD/yyyy'),
      isItinerary: true,
    });
  };
  saveDraft = values => {
    var today = Math.round(new Date().getTime() / 1000);
    const dateDate = moment(new Date()).format('MM/DD/yyyy');
    const startTimeUpdate = moment(values.start_time, ['h:mm A']).utc().format('HH:mm:ss');
    const endTimeUpdate = moment(values.end_time, ['h:mm A']).utc().format('HH:mm:ss');
    console.log('date', dateDate);
    try {
      // let item = {};
      const tasks = [];
      values?.tasks?.forEach((v, index) => {
        const subdate = moment(v.date).format('MM/DD/yyyy');

        tasks.push({
          title: v.title,
          description: v.description,
          date: subdate,
          time: v.time,
          assigned_user_id: v.assigned_user_id?.toString() || '',
          assigned_group_id: v.assigned_group_id?.toString() || '',
          assign_all: v.assign_all,
        });
      });
      const params = {
        url: API_DATA.ADD_ITINERARY,
        data: {
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          location: values.location,
          date: dateDate,
          start_time: values.is_fullday !== 1 ? startTimeUpdate : '',
          end_time: values.is_fullday !== 1 ? endTimeUpdate : '',
          latitude: values.latitude || '1.1',
          longitude: values.longitude || '-1.1',
          is_reminder: values.is_reminder.toString(),
          moderator_ids: this?.props?.route?.params?.moderatorId?.toString() || '',
          guest_connection_ids:
            this?.props?.route?.params?.selected == undefined ||
              this?.props?.route?.params?.selected == null ||
              this?.props?.route?.params?.selected == ''
              ? ''
              : this?.props?.route?.params?.selected.map(val => val.user_id).join(','),
          guest_group_ids: this.props?.route?.params?.from === 'group' ? this?.props?.route?.params?.selected : ' ',
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.groupId ? this?.state?.groupId : '',
          [`media[0]`]: values.image
            ? {
              uri: values.image,
              name: today + 'Img.jpg',
              type: 'image/jpg',
            }
            : '',
          // ...item,
          tasks,
        },
      };
      console.log('itinary API', params.data);
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.ADD_ITINERARY];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this?.props?.navigation.navigate('Added_New_Itinerary', {
                item: resp?.data,
              });
              this.props.showLoading(false);
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(error => {
          this.props.showLoading(false);
        });
    } catch (e) {
      console.log('catch error >>> ', e);
    }
  };
  render() {
    const { theme } = this.context;

    const styles = style(theme);
    const dateFormat = new Date();
    let customDayHeaderStyles = [];
    const customPickerStyle = customPickerStyles(theme);
    customDayHeaderStyles.push({
      style: { backgroundColor: '#000' },
      textStyle: { color: '#000' }, // sets the font color
    });

    const initialValues = this?.props?.route?.params?.isEdit
      ? {
        title: this?.state?.itineraryDetails?.title,
        description: this?.state?.itineraryDetails?.description,
        location: this?.state?.itineraryDetails?.location,
        latitude: this?.state?.itineraryDetails?.latitude,
        longitude: this?.state?.itineraryDetails?.longitude,
        is_reminder: this?.state?.itineraryDetails?.is_reminder,
        reminder_minute: this?.state?.itineraryDetails?.reminder_minute,
        start_time: this?.state?.itineraryDetails?.start_time || '',
        end_time: this?.state?.itineraryDetails?.end_time || '',
        // image: this?.state?.itineraryDetails?.media[0]?.url,
        guest_connection_ids: this.state?.itineraryDetails ? this?.state?.itineraryDetails?.guests[0]?.user_id : '',
        guest_group_ids: this?.state?.itineraryDetails ? this?.state?.itineraryDetails?.guests[0]?.group_id : '',

        groupId: this?.props?.route?.params?.groupId,
        moderator_ids: this?.state?.itineraryDetails?.moderators[0]?.user_id,
        date: this?.state?.itineraryDetails?.date,
        is_fullday: this?.state?.itineraryDetails?.is_fullday,
        tasks: this?.state?.itineraryDetails?.tasks,
      }
      : {
        title: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        is_reminder: 0,
        reminder_minute: '',
        start_time: '',
        end_time: '',
        media: '',
        guest_ids: '',
        groupId: this?.props?.route?.params?.groupId ? this?.props?.route?.params?.groupId : '',
        moderator_ids: '',
        date: '',
        is_fullday: 0,
        tasks: [],
      };
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            bounces={false}
            contentContainerStyle={{ height: '100%', width: '100%' }}
            extraScrollHeight={50}
            enableAutomaticScroll={true}
            enableOnAndroid={false}
          >
            <ScrollView horizontal>
              <View style={styles.tabContianer}>
                {this?.props?.route?.params?.isEdit && this?.state?.itineraryDetails ? (
                  <TouchableOpacity style={[styles.tabItem]}>
                    <Text style={styles.tabItemText}>{this?.state?.itineraryDetails?.title}</Text>
                  </TouchableOpacity>
                ) : null}

                {this?.props?.route?.params?.isEdit ? (
                  <FlatList
                    horizontal={true}
                    keyboardShouldPersistTaps="handled"
                    data={this?.state?.itineraryDetails?.events}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={[styles.tabItem, styles.tabItemActive]}
                          onPress={() => {
                            this.props.navigation.navigate('UPDATE_EVENT', {
                              Id: item?.id,
                              isItinerary: true,
                            });
                          }}
                        >
                          <Text style={styles.tabItemText}>{item.title}</Text>
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

            <Formik
              enableReinitialize
              innerRef={this.formikRef}
              initialValues={initialValues}
              onSubmit={this?.props?.route?.params?.isEdit ? this.updateItinerary : this.saveDraft}
              validationSchema={this.eventSchema}
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
                          paddingBottom: 150,
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

                      {/* styles is commented bcoz its note working */}
                      {/* <View style={[styles.searchControl, { borderBottomWidth: 0, borderColor: 'rgba(255, 255, 255, 0.08)' }]}> */}
                      <View>
                        <Input
                          placeholder="Itinerary Name"
                          placeholderTextColor={theme?.colors?.GRAY_100}
                          value={values.title}
                          style={[styles.searchInput, { color: theme?.colors?.GRAY_100, fontSize: 20 }]}
                          onChangeText={handleChange('title')}
                          inputContainerStyle={[styles.searchInputContainerStyle, { borderBottomWidth: 0 }]}
                          inputStyle={[styles.searchInputStyle, { paddingLeft: Responsive.getWidth(4) }]}
                          errorStyle={{ position: 'absolute', opacity: 0 }}
                        // placeholderTextColor="#635E5C"
                        />
                      </View>
                      {errors.title && touched.title && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.title}</Text>
                      )}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          this.props.navigation.navigate('Itinerary_Description_Screen');
                        }}
                      >
                        <View style={[styles.left]}>
                          <Image source={IMAGES.notes} style={[styles.listIcon, { marginTop: -Responsive.getWidth(2) }]} />
                        </View>
                        <View style={[styles.body, { marginLeft: -Responsive.getWidth(2) }]}>
                          <Input
                            value={values.description}
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
                            <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Add itinerary photo</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      {errors.image && touched.image && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.image}</Text>
                      )}
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          Keyboard.dismiss();
                          this.setState({ switchDay: !this.state.switchDay });
                        }}
                      >
                        <View style={styles.left}>
                          <Image source={IMAGES.event_icon} style={styles.listIcon} />
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Date</Text>
                          {values.date ? (
                            <Text style={styles.selectedText}>
                              {values.date === ''
                                ? ''
                                : moment().format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                  ? 'Today'
                                  : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(values.date).format('MM/DD/yyyy')
                                    ? 'Tomorrow'
                                    : moment(values.date).format('MM/DD/yyyy')}
                            </Text>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                      {errors.date && touched.date && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(7) }]}>{errors.date}</Text>
                      )}

                      {this.state.switchDay ? (
                        <CalendarPicker
                          weekdays={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
                          onDateChange={date => this.onDateChange(date, setFieldValue)}
                          textStyle={styles.calendarTextStyle}
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

                      <TouchableOpacity
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
                            value={Boolean(values.is_fullday)}
                            // thumbColor={this.state.switchColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                            color={theme?.colors?.RED_500}
                            onValueChange={day => this.daySwitch(day, setFieldValue)}
                          />
                        </View>
                      </TouchableOpacity>
                      {!values?.is_fullday ? (
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
                      ) : null}
                      {this.state.switchStartTime ? (
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
                      ) : null}
                      {this.state.switchEndTime ? (
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
                      ) : null}

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
                            inputContainerStyle={[styles.noBorderInputContainer, { borderBottomWidth: 0, borderBottom: 0 }]}
                            inputStyle={styles.noBorderInput}
                            onChangeText={handleChange('location')}
                            editable={false}
                            value={values.location}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                          />
                          {/* <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Add location</Text> */}
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
                            value={Boolean(values.is_reminder)}
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
                              placeholder={{ label: 'Select Time' }}
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

                          {/* ) : null} */}
                        </TouchableOpacity>
                      ) : null}
                      {errors.reminder_minute && touched.reminder_minute && (
                        <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>
                          {errors.reminder_minute}
                        </Text>
                      )}
                      {/* {console.log('L-->')} */}
                      <TouchableOpacity
                        disabled={this?.props?.route?.params?.isEdit}
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          Keyboard.dismiss();
                          this?.props?.navigation.navigate('Choose_Moderator_Screen', {
                            moderatorId: this?.state?.itineraryDetails
                              ? this?.state?.itineraryDetails?.moderators[0]?.user?.id
                              : this?.props?.route?.params?.moderatorId,
                            moderatorName: this?.state?.itineraryDetails
                              ? this?.state?.itineraryDetails?.moderators[0]?.user?.name
                              : this?.props?.route?.params?.moderatorName,
                          });
                        }}
                      >
                        <View style={styles.left}>
                          {this?.state?.itineraryDetails ? (
                            this?.state?.itineraryDetails?.moderators[0]?.user?.name ? (
                              <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                            ) : null
                          ) : (
                            <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                          )}
                        </View>
                        {/* {console.log('itinarary -===>', values)} */}
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>
                            {this?.state?.itineraryDetails
                              ? this?.state?.itineraryDetails?.moderators[0]?.user?.name || ''
                              : this?.props?.route?.params?.moderatorId
                                ? this?.props?.route?.params?.moderatorName
                                : 'Choose moderator'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this?.props?.route?.params?.isEdit}
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          this?.props?.navigation.navigate('Choose_Guest_Screen', {
                            selected: this?.props?.route?.params?.selected,
                            groupTitle: this?.props?.route?.params?.groupTitle,
                            moderatorId: this?.props?.route?.params?.moderatorId,
                            moderatorName: this?.props?.route?.params?.moderatorName,
                            setFieldValue,
                          });
                        }}
                      >
                        <View style={styles.left}>
                          {this?.state?.itineraryDetails ? (
                            this.state?.itineraryDetails?.guests[0]?.group_id ? (
                              this?.state?.itineraryDetails?.guests[0]?.group?.title ? (
                                <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                              ) : null
                            ) : this?.state?.itineraryDetails?.guests[0]?.user?.name ? (
                              <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                            ) : null
                          ) : (
                            <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                          )}
                        </View>
                        <View style={styles.body}>
                          <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>
                            {/* {this?.state?.itineraryDetails
                              ? this.state?.itineraryDetails?.guests[0]?.group_id
                                ? this?.state?.itineraryDetails?.guests[0]?.group?.title || ""
                                : this?.state?.itineraryDetails?.guests[0]?.user?.name || ""
                              : this?.props?.route?.params?.selected
                              ? this?.props?.route?.params?.groupTitle
                              : 'Choose Guest'} */}
                            {this?.props?.route?.params?.groupTitle
                              ? this?.props?.route?.params?.groupTitle
                              : this?.props?.route?.params?.selected
                                ? this?.props?.route?.params?.selected.map(val => val.user_name).join(', ')
                                : 'Choose Guest'}

                            {/* {this?.props?.route?.params?.selected ? this?.props?.route?.params?.groupTitle : 'Choose Guest'} */}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {this?.props?.route?.params?.isEdit && values?.tasks?.length === 0 ? null : (
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
                      )}

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
                      {this?.props?.route?.params?.isEdit ? null : (
                        <TouchableOpacity
                          style={[styles.listItem, { borderBottomWidth: 0 }]}
                          onPress={() => this.handleAddTask(values, setFieldValue)}
                        >
                          <View style={styles.left}>
                            <Image source={IMAGES.add_task_icon} style={styles.listIcon} />
                          </View>
                          <View style={styles.body}>
                            <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>Add Task</Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      {this?.props?.route?.params?.isEdit ? null : (
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
                          <TouchableOpacity style={styles.draftButton} onPress={handleSubmit}>
                            <Text style={{ color: theme?.colors?.WHITE, fontSize: 14, fontFamily: FONTS.BOLD }}>Save as draft</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </ScrollView>
                  </>
                );
              }}
            </Formik>
          </KeyboardAwareScrollView>
        </SafeAreaWrapper>
      </ImageBackground>
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
    itineraryList: state?.dashboardState?.itineraryList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(NewItineraryScreen);
