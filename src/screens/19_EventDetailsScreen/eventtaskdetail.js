import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  StatusBar,
  SectionList,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from '../22_TaskDetailScreen/style';
import { Button, ListItem, Icon } from 'react-native-elements';
// import { FlatList } from 'react-native-gesture-handler';

// import Utils
import { MethodUtils } from '@utils';
import { AppContext } from '../../themes/AppContextProvider';
class EventTaskDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskDetails: null,
      groupDetails: '',
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.handleTaskDetail();

    // this.props?.navigation?.setParams({
    //   handleSubmit: this.handleSubmit,
    // });
  }

  handleTaskDetail = () => {
    try {
      const params = {
        url: API_DATA.EVENTTASKDETAIL,
        data: {
          id: this.props.route.params.taskId,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.EVENTTASKDETAIL];
            if (resp.success) {
              this.props.saveeventTaskDetail(resp.data);
              this.props.showLoading(false);
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
                this.props.navigation.goBack();
              });
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

  // handleSubmit = () => {
  //   Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this task?', [
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
  //         try {
  //           const params = {
  //             url: API_DATA.EVENTTASKDELETE,
  //             data: {
  //               id: this?.props?.eventTaskDetail?.id,
  //             },
  //           };
  //           this.props.showLoading(true);
  //           callApi([params], this.props.userData.access_token)
  //             .then(response => {
  //               this.props.showLoading(false).then(() => {
  //                 let resp = response[API_DATA.EVENTTASKDELETE];
  //                 if (resp.success) {
  //                   this.props.eventTaskDelete(this?.props?.eventTaskDetail?.id, resp?.data);
  //                   this.props.navigation.goBack();
  //                   // this.getDashboardList();
  //                   this.props.showLoading(false);
  //                 } else {
  //                   this.props.showErrorAlert(localize('ERROR'), resp.message);
  //                 }
  //               });
  //             })
  //             .catch(err => {
  //               this.props.showLoading(false);
  //             });
  //         } catch (e) {
  //           console.log('catch error >>>', e);
  //         }
  //       },
  //     },
  //   ]);
  // };

  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      setTimeout(() => {
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
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  handleTasks = taskID => {
    try {
      const params = {
        url: API_DATA.EVENTTASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.EVENTTASKCOMPLETE];
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);

                this.props.saveEventTaskComplete(resp.data, taskID);
                // if (this.props.taskList) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                // }
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

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const eventTaskDetail = this?.props?.eventTaskDetail;
    const dateFormat = new Date();
    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.ScrollView}>
            {eventTaskDetail ? (
              <View style={styles.detailContent}>
                <Text style={styles.secTitleOne}>
                  Due{' '}
                  {eventTaskDetail?.date === ''
                    ? ''
                    : moment().format('MM/DD/yyyy') === moment(eventTaskDetail?.date).format('MM/DD/yyyy')
                    ? 'Today'
                    : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(eventTaskDetail?.date).format('MM/DD/yyyy')
                    ? 'Tommorow'
                    : `on ${moment(eventTaskDetail?.date).format('MM/DD/yyyy')}`}
                  {eventTaskDetail?.time === '' ? '' : ` at ${eventTaskDetail?.time}`}
                </Text>
                <View style={styles.taskRow}>
                  {/* <Text style={styles.textTitle}>Title: </Text> */}
                  <TouchableOpacity style={[styles.checkbox]} onPress={() => this.handleTasks(eventTaskDetail?.id)}>
                    <Image
                      source={eventTaskDetail?.is_complete !== 1 ? IMAGES.uncheckIcon2 : IMAGES.checkIcon2}
                      style={[styles.checkboxStyle]}
                    />
                  </TouchableOpacity>
                  <Text style={styles.taskTitle}>{eventTaskDetail?.title}</Text>
                </View>
                {eventTaskDetail?.description !== '' ? (
                  <View style={styles.descRow}>
                    <Text style={styles.descTitle}>Note</Text>
                    <Text style={styles.descPara}>{eventTaskDetail?.description}</Text>
                  </View>
                ) : null}
                <View style={styles.userRow}>
                  {this.props?.userData?.userInfo?.id === eventTaskDetail?.createdBy?.id ? (
                    <View>
                      {eventTaskDetail?.assigned_user_name !== '' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                            {eventTaskDetail?.assigned_user_image !== '' ? (
                              <TouchableOpacity style={styles.imgBtn}>
                                <Image source={{ uri: eventTaskDetail?.assigned_user_image }} style={[styles.imgBtnimg]} />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          <View>
                            <Text
                              style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                            >{`You have created this task and assigned to `}</Text>
                            <TouchableOpacity>
                              <Text style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}>
                                {' '}
                                {`${eventTaskDetail?.assigned_user_name}`}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : eventTaskDetail?.assigned_user_name === '' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                          </View>
                          <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>{'You have created this task'}</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: eventTaskDetail?.assigned_user_image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <Text
                              style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                            >{`You have created this task and assigned to `}</Text>
                            <TouchableOpacity>
                              <Text
                                style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                              >{`${eventTaskDetail?.assigned_user_name}`}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      {eventTaskDetail?.assigned_user_name !== '' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: eventTaskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: eventTaskDetail?.assigned_group_image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <TouchableOpacity>
                              <Text
                                style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                              >{`${eventTaskDetail?.createdBy?.name}`}</Text>
                            </TouchableOpacity>
                            <Text
                              style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                            >{` has created this task and assigned to `}</Text>
                            <TouchableOpacity>
                              <Text
                                style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                              >{`${eventTaskDetail?.assigned_user_name}`}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : eventTaskDetail?.assigned_user_name === '' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: eventTaskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                          </View>
                          <Text
                            style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                          >{`${eventTaskDetail?.createdBy?.name} has created this task`}</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.imgRow}>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image source={{ uri: eventTaskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imgBtn}>
                              <Image
                                source={
                                  eventTaskDetail?.assigned_user_id === this?.props?.userData?.userInfo?.id
                                    ? { uri: this?.props?.userData?.userInfo?.image }
                                    : { uri: eventTaskDetail?.assigned_user_image }
                                }
                                style={[styles.imgBtnimg]}
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <TouchableOpacity>
                              <Text
                                style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                              >{`${eventTaskDetail?.createdBy?.name}`}</Text>
                            </TouchableOpacity>
                            <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>{` has created this task and assigned to ${
                              eventTaskDetail?.assigned_user_id === this?.props?.userData?.userInfo?.id
                                ? 'You'
                                : eventTaskDetail?.assigned_user_name
                            }`}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaWrapper>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    eventTaskDetail: state?.eventState?.eventTaskDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(EventTaskDetail);
