import React, { createRef } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  TouchableOpacityBase,
  Keyboard,
  StyleSheet,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment, { min } from 'moment';
import ImagePicker from 'react-native-image-crop-picker';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES, FONTS } from '@themes';

//import languages
import { localize } from '@languages';

import Swipeout from 'react-native-swipeout';
import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { Button, Input, Switch } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';

import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import { HeaderView, ImageSlider } from '@components';
import Sheet from '../../components/sheet';
import RNPickerSelect from 'react-native-picker-select';

import { callApi } from '@apiCalls';
import { API_DATA } from '@constants';
import { TOUCHABLE_STATE } from 'react-native-gesture-handler/lib/typescript/components/touchables/GenericTouchable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../../themes/AppContextProvider';

class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      startTime: new Date(),
      time: new Date(),
      endTime: new Date(),
      timeEnd: new Date(),
      switchReminder: false,
      switchDay: false,
      switchColor: false,
      sheetOpen: false,
      switchTime: true,
      switchEndTime: false,
      switchStartTime: false,
      currentLongitude: '1.1',
      currentLatitude: '-1.1',
      locationStatus: '',
      reminderColor: false,
      groupId: this?.props?.route?.params?.groupId || '',
      showPicker: false,
      message: '',
      showMore: false,
      selectedUser: [],
      title: '',
      toggleSwitch: false,
      openPrivate: false,
      toggleColor: false,
      moderatorId: '',
      moderatorName: '',
      groupTitle: '',
      isDraft: '',
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  static contextType = AppContext;

  formikRef = createRef();
  ScrollViewRef = createRef();
  getOneTimeLocation() {
    this.setState({ locationStatus: 'Getting Location ...' });
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        this.setState({ locationStatus: 'You are Here' });

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        this.setState({ currentLongitude: currentLongitude });

        //Setting Longitude state
        this.setState({ currentLatitude: currentLatitude });
      },
      error => {
        this.setState({ locationStatus: error.message });
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      this.getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          this.getOneTimeLocation();
        } else {
          this.setState({ locationStatus: 'Permission Denied' });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  componentDidMount() {
    this.requestLocationPermission();
  }

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
  reminderSwitch(value, setFieldValue, values) {
    setFieldValue('is_reminder', value ? 1 : 0);
    value === true ? this.setState({ reminderColor: false }) : null;
    value === false ? this.setState({ reminderColor: true }) : null;
  }

  initialValues = {
    groupId: this?.props?.route?.params?.groupId || '',
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

  handleOpenImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      //   cropping: true,
    }).then(image => {});
  };

  onSubmit = values => {
    const dateDate = moment(values.date).format('MM/DD/yyyy');
    const startTimeUpdate = moment(values.start_time, ['h:mm A']).utc().format('HH:mm:ss');
    const endTimeUpdate = moment(values.end_time, ['h:mm A']).utc().format('HH:mm:ss');

    const updateToggleSwitch = values?.toggleSwitch === true ? 1 : 0;
    var today = Math.round(new Date().getTime() / 1000);
    let tempId = Math.round(new Date().getTime() / 1000);
    const array = [];
    this?.props?.route?.params?.selectedUser?.map(item => array.push(item?.user_id));
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
          [`tasks[${index}][assigned_user_id]`]: v.assigned_user_id,
          [`tasks[${index}][assign_all]`]: v.assign_all,
        };
      });
      let params = {
        url: API_DATA.EVENTADD,
        data: {
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          date: values?.date !== '' ? dateDate : '',
          is_private: updateToggleSwitch,
          start_time: values.is_fullday !== 1 ? (values?.start_time !== '' ? startTimeUpdate : '') : '',
          end_time:
            values.is_fullday !== 1 && (this?.props?.route?.params?.groupId !== undefined || this?.props?.route?.params?.groupId !== '')
              ? values?.end_time !== ''
                ? endTimeUpdate
                : ''
              : '',
          location: values.location,
          latitude: values.latitude || '1.1',
          longitude: values.longitude || '-1.1',
          is_reminder: values.is_reminder,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.groupId ? this?.state?.groupId : '',
          moderator_ids: this?.props?.route?.params?.moderatorId || '',
          is_draft: this?.state?.groupId !== '' ? 0 : this?.state?.isDraft === 'draft' ? 1 : this?.state?.isDraft === 'post' ? 0 : 0,
          guest_connection_ids:
            this?.props?.route?.params?.selected == undefined ||
            this?.props?.route?.params?.selected == null ||
            this?.props?.route?.params?.selected == ''
              ? ''
              : this?.props?.route?.params?.selected.map(val => val.user_id).join(','),
          guest_group_ids: this.props?.route?.params?.from === 'group' ? this?.props?.route?.params?.selected : ' ',

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
      console.log('evenrtb5itu vjkdfnhy  ===>', params);
      const eventObj = {
        event: {
          title: values.title,
          description: values.description,
          is_fullday: values.is_fullday,
          date: dateDate,
          start_time: values.is_fullday !== 1 ? startTimeUpdate : '',
          end_time:
            values.is_fullday !== 1 && (this?.props?.route?.params?.groupId !== undefined || this?.props?.route?.params?.groupId !== '')
              ? endTimeUpdate
              : '',
          location: values.location,
          latitude: values.latitude || '1.1',
          longitude: values.longitude || '-1.1',
          is_reminder: values.is_reminder,
          reminder_minute: values.is_reminder === 1 ? values.reminder_minute : '',
          group_id: this?.state?.groupId ? this?.state?.groupId : '',
          is_private: updateToggleSwitch,
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
        sender: {
          ...this.props?.userData?.userInfo,
        },
        tempId,
        event_id: '',
        poll_id: '',
        poll: [],
        task: [],
        message: '',
        like_count: 0,
        is_liked: 0,
      };

      {
        this.state?.groupId !== '' && this?.props?.saveEventInChat(eventObj);
      }
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.EVENTADD];

            if (resp.success) {
              this?.addToCalendarEvent(resp.data.id);
              this.getDashboardList();
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.props.navigation.goBack();
              this?.props?.saveEventAdd(resp.data);
              if (this.state?.groupId) {
                this?.props?.CurrentTabName('event');
                this?.getEventListId();
              }
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

  addToCalendarEvent = id => {
    try {
      const params = {
        url: API_DATA.ADD_TO_CALENDAR,
        data: {
          event_id: id,
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

  getEventListId = () => {
    try {
      const params = {
        url: API_DATA.EVENTLISTID,
        data: {
          group_id: this.state.groupId,
        },
      };

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTLISTID];
              this.setState({ isLoading: false });
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
                Object.keys(resp?.data)?.forEach((item, index) => {
                  if (item !== 'pastEvents') {
                    if (resp?.data[item]?.length) {
                      data.push({ title: keysValues[item], data: resp?.data[item], index: index });
                    }
                  }
                });
                this?.props?.eventListId({ data });
                // this?.props?.saveEventList({ data });
                this?.setState({
                  isRefreshing: false,
                  isLoaderEvent: false,
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

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  componentDidUpdate(prevState, prevProps) {
    if (prevProps.startTime !== this.state.time) {
      this.formikRef.current?.setFieldValue('start_time', this.state.time);
    }
  }

  eventSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    description: Yup.string().required('Please enter description'),
    location: Yup.string().required('Please choose your location'),
    date: Yup.string().required('Please select date'),
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
      then: Yup.string().test('not empty', 'Please select start time', function (value) {
        return !!value;
      }),
      // .test('start_time_test', 'Start time must be before end time', function (value) {
      //   const { end_time } = this.parent;
      //   return moment(value, 'HH:mm A').isSameOrBefore(moment(end_time, 'HH:mm A'));
      // }),
    }),
    groupId: Yup.string(),
    end_time: Yup.string().when(['is_fullday', 'groupId'], {
      is: (is_fullday, groupId) => {
        // return groupId !== '' || groupId !== undefined || is_fullday == 0;
        return groupId ? groupId !== '' || groupId !== undefined : is_fullday == 0;
      },
      then: Yup.string()
        .notRequired()
        .test('end_time_test', 'End time must be after start time', function (endTime) {
          const startTime = this.resolve(Yup.ref('start_time'));

          // If start time is not provided, end time is considered valid
          if (!startTime) {
            return true;
          }
          const startTimeMoment = moment(startTime, 'HH:mm A');
          const endTimeMoment = moment(endTime, 'HH:mm A');

          // Check if end time is later than start time
          return !endTime || endTimeMoment.isAfter(startTimeMoment);
        }),
      // otherwise: () => Yup.notRequired(),
      // then: Yup.string().required('Please select end time'),
    }),
    reminder_minute: Yup.string().when('is_reminder', {
      is: 1,
      then: Yup.string().required('Please select reminder time'),
    }),
  });

  draftSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    // image: Yup.mixed()
    //   .required('Please provide image')
    //   .test('fileType', 'Only JPEG, PNG, and JPG image types are allowed', value => {
    //     if (value) {
    //       const splittedValues = value?.split('.');
    //       const supportedFormats = ['jpeg', 'png', 'jpg'];
    //       return supportedFormats.includes(splittedValues?.[splittedValues?.length - 1]);
    //     }
    //     return true;
    //   }),
  });

  handleAddTask = (values, setFieldValue) => {
    this.props.navigation.navigate('Create_Event_Task', {
      tasks: values.tasks,
      setFieldValue,
      groupId: this?.state?.groupId,
      eventDate: moment(values.date).format('MM/DD/yyyy'),
    });
  };

  handleCreateSubTask = (subTaskId, setFieldValue, values) => {
    this.props.navigation.navigate('Update_Event_Task', {
      subTaskId,
      inputField: values?.tasks,
      setFieldValue,
      groupId: this?.state?.groupId,
      eventDate: moment(values.date).format('MM/DD/yyyy'),
    });
  };

  minDateTask = values => {
    const dateArray = values?.tasks?.map(item => moment(item?.date).format('MM/DD/yyyy'));
    const sorted = dateArray.sort((a, b) => moment(a.settledDate) - moment(b.settledDate));
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
          const values = [...subValues.tasks];
          values.splice(index, 1);
          setFieldValue('tasks', values);
        },
      },
    ]);
  };
  handlePrivate = (values, setFieldvalue) => {
    this.setState({ toggleSwitch: values });
    this.ScrollViewRef?.current?.scrollToEnd({ animated: true });
    if (values === true) {
      this.setState({ openPrivate: true, toggleColor: false });
    } else {
      this.setState({ openPrivate: false, toggleColor: true });
    }
    setFieldvalue('toggleSwitch', values);
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
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAwareScrollView
            // keyboardDismissMode="interactive"
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
              validationSchema={this.state?.isDraft === 'draft' ? this.draftSchema : this.eventSchema}
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
                      <View style={[styles.searchControl, { borderColor: 'rgba(255, 255, 255, 0.08)' }]}>
                        <Input
                          placeholder="What’s the event?"
                          placeholderTextColor={theme?.colors?.GRAY_100}
                          value={values.title}
                          style={[styles.searchInput, { color: theme?.colors?.WHITE, fontSize: 20 }]}
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
                      <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                        <View style={[styles.left]}>
                          <Image source={IMAGES.notes} style={{ ...STYLES.imageStyle(5.5) }} resizeMode={'stretch'} />
                        </View>
                        <View style={[styles.body, { marginLeft: -Responsive.getWidth(2) }]}>
                          <Input
                            value={values.description}
                            onChangeText={handleChange('description')}
                            placeholder="Add a note"
                            placeholderTextColor={theme?.colors?.GRAY_200}
                            style={[styles.searchInput, { paddingLeft: 0, color: theme?.colors?.WHITE, fontFamily: FONTS.BOLD }]}
                            multiline={true}
                            inputContainerStyle={[
                              styles.searchInputContainerStyle,
                              { borderBottomWidth: 0, height: Responsive.getWidth(10), paddingLeft: 0 },
                            ]}
                            inputStyle={[{ height: '100%', paddingLeft: 0, paddingTop: Responsive.getWidth(3) }]}
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
                      {this.state.switchTime ? (
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
                        style={[styles.listItem, { paddingVertical: Responsive.getWidth(2), borderBottomWidth: 0 }]}
                        onPress={() =>
                          this.props.navigation.navigate('LOCATION_SEARCH', {
                            setFieldTouched,
                            setFieldValue,
                          })
                        }
                      >
                        <View style={[styles.left]}>
                          <Image source={IMAGES.mapPin} style={styles.listIcon} />
                        </View>
                        <View style={[styles.body, { marginLeft: -Responsive.getWidth(2) }]}>
                          <Input
                            placeholder="Add location"
                            placeholderTextColor={theme?.colors?.GRAY_100}
                            style={[styles.noBorderInputTxt, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}
                            inputContainerStyle={styles.noBorderInputContainer}
                            inputStyle={styles.noBorderInput}
                            onChangeText={handleChange('location')}
                            editable={false}
                            value={values.location}
                            errorStyle={{ position: 'absolute', opacity: 0 }}
                            // placeholderTextColor="#635E5C"
                          />
                        </View>
                        <View style={styles.right}>
                          <Image source={IMAGES.rightArrow} style={[styles.listArrowIcon, { tintColor: theme?.colors?.GRAY_100 }]} />
                        </View>
                      </TouchableOpacity>
                      {errors.location && touched.location && (
                        <Text style={[styles.errorText, { marginTop: 0, paddingLeft: Responsive.getWidth(7) }]}>{errors.location}</Text>
                      )}
                      {this.state?.groupId ? null : (
                        <View>
                          <TouchableOpacity
                            style={[styles.listItem, { borderBottomWidth: 0 }]}
                            onPress={() => {
                              Keyboard.dismiss();
                              this?.props?.navigation.navigate('Choose_Moderator_Screen', {
                                moderatorId:
                                  this?.state?.moderatorId !== '' ? this?.state?.moderatorId : this?.props?.route?.params?.moderatorId,
                                moderatorName:
                                  this?.state?.moderatorName !== ''
                                    ? this?.state?.moderatorName
                                    : this?.props?.route?.params?.moderatorName,
                                selected: this?.props?.route?.params?.selected,
                                groupTitle: this?.props?.route?.params?.groupTitle,
                                isEvent: true,
                              });
                            }}
                          >
                            <View style={styles.left}>
                              <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>
                                {this?.props?.route?.params?.moderatorId ? this?.props?.route?.params?.moderatorName : 'Choose moderator'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.listItem, { borderBottomWidth: 0 }]}
                            onPress={() => {
                              Keyboard.dismiss();
                              this?.props?.navigation.navigate('Choose_Guest_Screen', {
                                selected: this?.props?.route?.params?.selected,
                                groupTitle: this?.props?.route?.params?.groupTitle,
                                moderatorId: this?.props?.route?.params?.moderatorId,
                                moderatorName: this?.props?.route?.params?.moderatorName,
                                setFieldValue,
                                isEvent: true,
                              });
                            }}
                          >
                            <View style={styles.left}>
                              <Image source={IMAGES.add_moderator} style={styles.listIcon} />
                            </View>
                            <View style={styles.body}>
                              <Text style={[styles.h6, { color: theme?.colors?.GRAY_100, fontFamily: FONTS.BOLD }]}>
                                {/* {this?.props?.route?.params?.groupTitle ? this?.props?.route?.params?.groupTitle : 'Choose Guest'} */}
                                {this?.props?.route?.params?.groupTitle
                                  ? this?.props?.route?.params?.groupTitle
                                  : this?.props?.route?.params?.selected
                                  ? this?.props?.route?.params?.selected.map(val => val.user_name).join(', ')
                                  : 'Choose Guest'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
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
                            <Image source={IMAGES.send_icon} style={[styles.listIcon, { ...STYLES.imageStyle(4.5) }]} />
                          </View>
                          <View style={styles.body}>
                            <Text style={[styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}>Send</Text>
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

                      {values?.tasks?.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <View style={[styles.addedTaskView]}>
                              <Swipeout
                                right={[
                                  {
                                    text: (
                                      <Image style={[COMMON_STYLE.imageStyle(6)]} source={IMAGES.deleteNewIcon} resizeMode={'contain'} />
                                    ),
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleDeleteSubTask(index, setFieldValue, values),
                                  },
                                  {
                                    text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleCreateSubTask(item?.id, setFieldValue, values),
                                  },
                                ]}
                                autoClose={true}
                                backgroundColor={theme?.colors?.GRAY_1000}
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
                      {/* {!this?.state?.groupId ? (
                        <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]}>
                          <View style={styles.left}>
                            <Icon4 name="lock-outline" style={styles.privateIcon} />
                          </View>
                          <View style={styles.body}>
                            <Text style={[styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}>Make Private</Text>
                          </View>
                          <View style={styles.right}>
                            <Switch
                              value={values.toggleSwitch}
                              // thumbColor={this.state.toggleColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                              // trackColor={theme?.colors?.WHITE}
                              // style={{ backgroundColor: theme?.colors?.GRAY_800, borderRadius: 15 }}
                              // color={theme?.colors?.RED_500}
                              onValueChange={value => this.handlePrivate(value, setFieldValue)}
                            />
                          </View>
                        </TouchableOpacity>
                      ) : null} */}
                      {this?.state?.groupId ? (
                        // <TouchableOpacity
                        //   style={[styles.listItem, { borderBottomWidth: 0 }]}
                        //   onPress={() => this.handleAddTask(values, setFieldValue)}
                        // >
                        //   <Text style={{ color: '#86D190' }}>Add Task</Text>
                        // </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.listItem, { borderBottomWidth: 0 }]}
                          onPress={() => this.handleAddTask(values, setFieldValue)}
                        >
                          <View style={styles.left}>
                            <Image source={IMAGES.add_task_icon} style={styles.listIcon} />
                          </View>
                          <View style={styles.body}>
                            <Text style={[styles.h6, { fontFamily: FONTS.BOLD, color: theme?.colors?.GRAY_100 }]}>Add Task</Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                      {this.state.openPrivate === true ? (
                        <TouchableOpacity
                          style={[styles.listItem, { borderBottomWidth: 0 }]}
                          onPress={() =>
                            this.props?.navigation.navigate('Share_With_User', {
                              title: this?.state?.title,
                              selectedUser: this?.state?.selectedUser,
                            })
                          }
                        >
                          <Text style={{ color: '#86D190' }}>Share With</Text>
                        </TouchableOpacity>
                      ) : null}
                      {/* <TouchableOpacity
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
                      <TouchableOpacity
                        style={[styles.listItem, { borderBottomWidth: 0 }]}
                        onPress={() => {
                          Keyboard.dismiss();
                        }}
                      >
                        <View style={[styles.body, { justifyContent: 'center' }]}>
                          <Text
                            style={{
                              color: theme?.colors?.ORANGE_200,
                              fontFamily: FONTS.BASE,
                              fontSize: 16,
                              marginLeft: 30,
                              marginTop: -20,
                              alignItems: 'center',
                            }}
                          >
                            {' '}
                            <Text
                              style={{
                                color: theme?.colors?.ORANGE_200,
                                fontFamily: FONTS.BASE,
                                fontSize: 30,
                                lineHeight: 30,
                                alignItems: 'center',
                              }}
                            >
                              +{' '}
                            </Text>
                            Add task
                          </Text>
                        </View>
                      </TouchableOpacity> */}
                      <View style={styles.stickyButton}>
                        <TouchableOpacity
                          style={styles.postButton}
                          onPress={() => {
                            this.setState({
                              isDraft: 'post',
                            });
                            setTimeout(() => {
                              handleSubmit();
                            }, 0);
                          }}
                        >
                          <Text style={{ color: theme?.colors?.WHITE, fontSize: 14 }}>Post</Text>
                        </TouchableOpacity>
                        {this?.state?.groupId === '' ? (
                          <TouchableOpacity
                            style={styles.draftButton}
                            onPress={() => {
                              this.setState({
                                isDraft: 'draft',
                              });
                              setTimeout(() => {
                                handleSubmit();
                              }, 0);
                            }}
                          >
                            <Text style={{ color: theme?.colors?.WHITE, fontSize: 14 }}>Save as draft</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
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
      // fontSize: Responsive.getWidth(23),
    },
    inputAndroid: {
      color: theme?.colors?.WHITE,
      // paddingLeft: Responsive.getWidth(35),
      // width: Responsive.getWidth(50),
    },
  });
