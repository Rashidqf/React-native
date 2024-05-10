import React, { createRef } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

// import api functions
import { callApi } from '@apiCalls';

//import storage functions
import { StorageOperation } from '@storage';

import { Responsive } from '@helpers';

import { SafeAreaWrapper } from '@components';
import NoDataFound from '../../components/noDataFound';

//import style
import { style } from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppContext } from '../../themes/AppContextProvider';

class NewCategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
      toggleSwitch: false,
      openPrivate: false,
      selectedMember: [],
      memberTitle: '',
      groupName: this?.props?.route?.params?.groupTitle,
      selectUser: this?.props?.route?.params?.selectUser,
      detail: this?.props?.route?.params?.detail,
      groupId: this?.props?.route?.params?.groupId,
      handelNewTab: this?.props?.route?.params?.handelNewTab,
    };
  }
  static contextType = AppContext;

  formikRef = createRef();

  initialValues = {
    title: '',
    toggleSwitch: this?.state?.toggleSwitch,
    user_ids: [],
  };

  sidenoteSchema = Yup.object().shape({
    title: Yup.string().required('Please enter title'),
    user_ids: Yup.array().when('toggleSwitch', {
      is: true,
      then: Yup.array().min(1, 'Please select members'),
    }),
  });

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  onSubmit = values => {
    const updateToggleSwitch = values?.toggleSwitch === true ? 1 : 0;
    const array = [];
    this?.props?.route?.params?.selectedMember?.map(item => array.push(item?.user_id));
    try {
      let params = {
        url: API_DATA.SUBGROUPADD,
        data: {
          id: this?.state?.groupId,
          title: values?.title,
          is_private: updateToggleSwitch,
          user_ids: array.toString() || '',
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.SUBGROUPADD];
            if (resp.success) {
              this?.props?.saveSubGroupAdd(resp.data);
              this?.props?.saveGroupDetail({
                ...this?.props?.groupDetail,
                subgroups: [...this?.props?.groupDetail?.subgroups, resp?.data],
              });

              this?.state?.handelNewTab(resp?.data);
              this.props.showLoading(false);
              this?.handleGroupDetail();

              this.props.showToast(localize('SUCCESS'), resp.message);
              // this?.props?.navigation?.goBack();
              this?.props?.navigation?.replace('CONVERSATION', {
                groupId: resp?.data?.parent_id,
                tabGroupId: resp?.data?.id,
                groupTitle: this.state.groupName,
                tabName: resp?.data?.title,
                chat_id: resp?.data?.parent_chat_id,
                channel: resp?.data?.channel,
                tabChatId: resp?.data?.chat_id,
                isNewSubgroup: true,
              });
              this?.props?.CurrentTabName('chat');
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

  componentDidUpdate(prevState, prevProps) {
    if (prevProps.detail?.selectedMember !== this.props.route?.params?.selectedMember) {
      this.formikRef.current?.setFieldValue('user_ids', this?.props?.route?.params?.selectedMember?.map(item => item?.user_id) || []);
    }
  }

  handleGroupDetail = () => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: this.state.groupId,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              if (resp.success) {
                this?.props?.saveGroupDetail(resp.data);
                this?.props?.showLoading(false);
              } else {
                this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  // onSubmit = values => {
  //   console.log('valye....', values);
  //   const updateToggleSwitch = values?.toggleSwitch === true ? 1 : 0;
  //   const array = [];
  //   this?.props?.route?.params?.selectedMember?.map(item => array.push(item?.id));
  //   try {
  //     let item = {};

  //     item = {
  //       ...item,
  //       [`subgroups[${0}][title]`]: values?.title,
  //       [`subgroups[${0}][is_private]`]: updateToggleSwitch,
  //       [`subgroups[${0}][user_ids]`]: array.toString() || '',
  //     };

  //     let params = {
  //       url: API_DATA.GROUPADD,
  //       data: {
  //         title: this?.state.groupName,
  //         user_ids: this?.state?.selectUser.toString(),
  //         ...item,
  //       },
  //     };
  //     console.log('params.....', params);
  //     this.props.showLoading(true);
  //     callApi([params], this.props.userData.access_token)
  //       .then(response => {
  //         console.log('response.....', response);
  //         this.props.showLoading(false).then(() => {
  //           let resp = response[API_DATA.GROUPADD];
  //           if (resp.success) {
  //             console.log('resp.....', resp);
  //             this?.props?.saveGroupAdd(resp.data);
  //             this.props.showLoading(false);
  //             // this.getDashboardList();
  //             this.props.navigation.navigate('CONVERSATION', { groupId: resp?.data?.id });
  //           } else {
  //             this.props.showErrorAlert(localize('ERROR'), resp.message);
  //           }
  //         });
  //       })
  //       .catch(err => {
  //         this.props.showLoading(false);
  //       });
  //   } catch (e) {
  //     console.log('catch error >>>', e);
  //   }
  // };
  handlePrivate = (values, setFieldvalue) => {
    this.setState({ toggleSwitch: values });
    if (values === true) {
      this.setState({ openPrivate: true });
    } else {
      this.setState({ openPrivate: false });
    }
    setFieldvalue('toggleSwitch', values);
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const array = this?.props?.route?.params?.selectedMember?.map(item => item?.user_id);
    const initialValues = {
      title: '',
      toggleSwitch: this?.state?.toggleSwitch,
      user_ids: this?.props?.route?.params?.selectedMember?.map(item => item?.user_id) || [],
    };
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={{ flex: 1 }}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
          <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
              // keyboardDismissMode="none"
              keyboardShouldPersistTaps="handled"
              bounces={false}
              contentContainerStyle={{ flex: 1 }}
              extraScrollHeight={Responsive.getHeight(8)}
              enableAutomaticScroll={true}
              enableOnAndroid={false}
            >
              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                {/* <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0), }}> */}
                <View style={styles.header}>
                  <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
                    <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
                  </TouchableOpacity>
                  {/* <View style={styles.headerCenter}>
                  <TouchableOpacity style={styles.chatIconBtn}>
                    <Icon2 name="message-square" style={[styles.chatIcon, { color: theme?.colors?.RED_500 }]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatIconBtn}>
                    <Icon name="calendar-outline" style={styles.chatIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatIconBtn}>
                    <Icon2 name="graph-horizontal" style={styles.chatIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.chatIconBtn}>
                    <Icon name="checkbox-outline" style={styles.chatIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.headerRightImgWrap} onPress={() => this.props.navigation.navigate('CHAT_PROFILE')}>
                    <Image source={IMAGES.sortIcon} style={styles.headerRightImg} />
                  </TouchableOpacity>
                </View> */}
                </View>
                {/* Start No Msg Container */}
                <View style={{ flex: 1 }}>
                  <NoDataFound
                    // title="No Group yet"
                    text="No one has said anything yet. 
                    Send a message to start the conversation."
                    imageWidth={Responsive.getWidth(50)}
                    imageHeight={Responsive.getWidth(50)}
                    source={IMAGES.noChatImage}
                    titleColor={theme?.colors?.WHITE}
                  />
                </View>
                {/* <View style={[styles.noMsgContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.noMsgTxt}>{'No one has said anything yet. Send a message to start the conversation.'}</Text>
                </View> */}
                {/* End No Msg Container */}
                <Formik
                  innerRef={this.formikRef}
                  initialValues={initialValues}
                  onSubmit={this.onSubmit}
                  validationSchema={this.sidenoteSchema}
                >
                  {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                    return (
                      <>
                        <View style={styles.chatFooter}>
                          <View style={styles.inputContainer}>
                            <TextInput
                              value={values.title}
                              onChangeText={text => setFieldValue('title', text)}
                              placeholder="Name the category "
                              style={styles.msgInput}
                              placeholderTextColor={theme?.colors?.GRAY_100}
                              returnKeyType="done"
                            />
                            {values?.title && values?.toggleSwitch ? (
                              <TouchableOpacity style={[styles.inputBtn]} onPress={() => handleSubmit(values)}>
                                <Icon name="arrow-up-circle" style={[styles.inputBtnIcon, { color: theme?.colors?.PURPLE_500 }]} />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={[styles.inputBtn]} onPress={() => handleSubmit(values)}>
                                <Icon name="arrow-up-circle" style={[styles.inputBtnIcon, { color: theme?.colors?.PURPLE_500 }]} />
                              </TouchableOpacity>
                            )}
                          </View>
                          {errors.title && touched.title && <Text style={[styles.errorText]}>{errors.title}</Text>}
                          <View style={styles.privateRow}>
                            <View style={styles.privateColLeft}>
                              <Icon4 name="lock-outline" style={[styles.privateIcon]} />
                              <Text style={[styles.privateTxt]}>{'Private category'}</Text>
                            </View>
                            <View style={styles.privateColRight}>
                              <Switch
                                // trackColor={{ false: "#767577", true: "#81b0ff" }}
                                // thumbColor={toggleSwitch ? "#f5dd4b" : "#f4f3f4"}
                                trackColor={theme?.colors?.GRAY_800}
                                // thumbColor={theme?.colors?.RED_500}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={value => this.handlePrivate(value, setFieldValue)}
                                value={values.toggleSwitch}
                              />
                            </View>
                          </View>
                          {this.state.openPrivate === true ? (
                            <View style={styles.privateRow}>
                              <TouchableOpacity
                                style={{ flexDirection: 'row' }}
                                onPress={() =>
                                  this?.props?.navigation?.navigate('ADD_MEMBER', {
                                    memberTitle: this?.state?.memberTitle,
                                    selectedMember: this?.state?.selectedMember,
                                    detail: this?.state?.detail,
                                  })
                                }
                              >
                                <View style={styles.privateColLeft}>
                                  <Icon4 name="people" style={[styles.privateIcon]} />
                                  {this?.props?.route?.params?.selectedMember ? (
                                    this?.props?.route?.params?.selectedMember?.map((item, index) => (
                                      // <Text style={[styles.privateTxt]}>{`Member${index + 1}`}</Text>
                                      <Text style={[styles.privateTxt]}>{`${item?.user_name}`}</Text>
                                    ))
                                  ) : (
                                    <Text style={[styles.privateTxt]}>{'Add member'}</Text>
                                  )}
                                </View>
                                <View style={[styles.right, { justifyContent: 'flex-end' }]}>
                                  <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : null}
                          {errors.user_ids && touched.user_ids && (
                            <Text style={[styles.errorText, { paddingBottom: Responsive.getWidth(3) }]}>{errors.user_ids}</Text>
                          )}
                        </View>
                      </>
                    );
                  }}
                </Formik>
              </KeyboardAvoidingView>
            </KeyboardAwareScrollView>
            {/* </SafeAreaWrapper> */}
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupList: state?.groupState?.groupList,
    groupDetail: state?.groupState?.groupDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(NewCategoryScreen);
