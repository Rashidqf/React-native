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
  Modal,
  TouchableWithoutFeedback,
  ImageBackground,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
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
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button, ListItem, Icon } from 'react-native-elements';
import { UserModal } from '@components';
import onShare from '../../utils/deepLinking';

import { AppContext } from '../../themes/AppContextProvider';
import { Formik } from 'formik';
class TaskDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () =>
        this?.props?.taskDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? (
          <TouchableOpacity
            style={COMMON_STYLE.headerBtnStyle}
            disabled={this?.props?.taskDetail?.createdBy?.id !== this?.props?.userData?.userInfo?.id}
            onPress={() => this.handleDelete()}
          >
            <Text
              style={
                (COMMON_STYLE.headerBtnTextStyle,
                  this?.props?.taskDetail?.createdBy?.id !== this?.props?.userData?.userInfo?.id ? { color: '#8779DD' } : { color: '#8779DD' })
              }
            >
              Delete
            </Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        ),
    });

    this.state = {
      taskDetails: null,
      groupDetails: '',
      isLoader: true,
      isShowModal: false,
      profileDetail: '',
      isBlock: false,
      showEditModal: false,
    };
  }
  static contextType = AppContext;

  componentDidMount = async () => {
    this.handleTaskDetail();
    this.props?.navigation?.setParams({
      handleDelete: this.handleDelete,
    });
  };

  getTaskList = filters => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKLIST];
            const { theme } = this.context;

            const styles = style(theme);
            if (resp.success) {
              const keysValues = {
                pastTasks: '',

                todayTasks: 'Today',
                tomorrowTasks: 'Tomorrow',
                futureTasks: 'Upcoming',
              };
              let data = [];
              Object.keys(resp?.data)?.forEach(item => {
                if (filters && item === 'pastTasks') {
                  data.push({ title: keysValues[item], data: resp?.data[item] });
                  // this?.setState({
                  //   oldTaskEnable: true,
                  // });
                } else if (!filters && item !== 'pastTasks') {
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
              this.props.saveTaskDetail(resp.data);
              this?.setState({
                isLoader: false,
              });
              this.props?.navigation?.setParams({
                createdBy: resp?.data?.createdBy?.id,
                userId: this?.props?.userData?.userInfo?.id,
              });
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

  handleDelete = () => {
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
          console.log('task id ====>', this?.props?.taskDetail?.id, this?.props?.monthlyEventList?.id);
          try {
            const params = {
              url: API_DATA.TASKDELETE,
              data: {
                id: this?.props?.taskDetail?.id,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.TASKDELETE];
                  if (resp.success) {
                    this.props.navigation.goBack();
                    // this.props.saveTaskDelete(this?.props?.taskDetail?.id);
                    this.props.deleteMonthlyTaskList(this?.props?.taskDetail?.id);
                    this.getCalendarDataDay();
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

  handleTasks = (taskID, parentId) => {
    try {
      const params = {
        url: API_DATA.TASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.TASKCOMPLETE];
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                this.props.saveTaskListComplete(resp.data, taskID, parentId);
                // this.handleTaskDetail();
                this.getDashboardList();
                this.getTaskList();
                // this.props.saveTaskComplete(resp.data, taskID, state);
                // if (this.props.taskList) {
                // this.props.showToast(localize('SUCCESS'), resp.message);
                // this.props.saveTaskListComplete(resp.data, taskID, parentId, status);
                // }
                this.props.saveTaskCompleteInChat(resp.data, taskID);

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

  handleGroupDetail = groupId => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: groupId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              if (resp.success) {
                this.props.navigation.push('CONVERSATION', {
                  groupTitle: resp?.data?.title,
                  groupId: resp?.data?.id,
                  detail: resp?.data,
                  // selectUser: selectedId,
                  channel: resp?.data?.channel,
                  chat_id: resp?.data?.chat_id,
                  groupCreated: false,
                  state: 'other',
                });
                this?.props?.CurrentTabName('chat');
                this.setState({ groupDetails: resp?.data });
                this?.props?.saveGroupDetail(resp.data);
                this?.props?.showLoading(false);
              } else {
                // this?.props?.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) { }
  };

  getConnectionDetails = friendId => {
    try {
      const params = {
        url: API_DATA.CONNECTIONDETAILS,
        data: {
          friend_id: friendId,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.CONNECTIONDETAILS];

              if (resp.success) {
                this?.setState({
                  profileDetail: resp.data[0],
                });
              } else {
              }
            });
          })
          .catch(err => {
            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) { }
    this.setState({ message: '' });
  };

  handleUserBlock = connectionId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this user?', [
      {
        text: 'No',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.BLOCKUSER,
                data: {
                  connection_id: connectionId,
                  is_block: this?.state?.profileDetail?.is_block === 1 ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.BLOCKUSER];

                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);

                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) { }
          }, 1000);
        },
      },
    ]);
  };
  handleChatBlock = chatId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this person?', [
      {
        text: 'No',
        onPress: () => { },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.CHATBLOCK,
                data: {
                  chat_id: chatId,
                  is_block: this.state.isBlock === true ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.CHATBLOCK];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this.props.getChatBlock();
                      // this.getChatDetail();
                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) { }
          }, 1000);
        },
      },
    ]);
  };

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
      });
      let params = {
        url: API_DATA.TASKUPDATE,
        data: {
          id: this?.props?.route?.params?.taskId,
          title: values.title,
          description: values.description,
          date: dateDate,
          // time: values.time ? moment(values.time, ['h:mm A']).format('HH:mm:ss') : '' || '',
          // ...item,
        },
      };

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKUPDATE];
            if (resp?.success) {
              this?.props?.saveTaskUpdate(resp.data, this?.props?.route?.params?.taskId);
              this.props.showLoading(false);
              this.getTaskList();
              this.props.showToast(localize('SUCCESS'), resp.message);
              if (this?.state?.groupTask) {
                this.getTaskListId();
              }
              this.getDashboardList();
              this.getCalendarDataDay();
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

  getCalendarDataDay = () => {
    try {
      const params = {
        url: API_DATA.USER_CALENDAR_DAY,
        data: { date: this.props.route.params.currentDate.dateString },
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

  taskSchema = Yup.object().shape({
    title: Yup.string().required('must enter title'),
    description: Yup.string().required('must enter description'),
    // date: Yup.string().required(),
  });
  render() {
    const { img, width, height } = this.props;
    const { theme } = this.context;
    const styles = style(theme);
    const taskDetail = this?.props?.taskDetail;
    const dateFormat = new Date();
    const completed = taskDetail?.subtasks?.filter(item => item.is_complete === 1);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.screenBG}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginTop: 100 }}>
          {this?.state?.isLoader === false ? (
            <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.ScrollView}>
                <Formik
                  initialValues={{
                    title: this?.props?.taskDetail?.title,
                    description: this?.props?.taskDetail?.description,
                    // date: this?.props?.taskDetail?.date,
                    // date: '',
                    // time: this?.props?.taskDetail?.time,
                    // time: moment(this?.props?.taskDetail?.time, ['h:mm A']).format('H:i:s'),
                    // subtasks: this?.props?.taskDetail?.subtasks,
                    // assigned_group_id: this?.props?.taskDetails?.assigned_group_id,
                    // assigned_group_title: this?.props?.taskDetail?.assigned_group_title,
                    // assigned_user_id: this?.props.taskDetails.assigned_user_id,
                    // assigned_user_name: this.state.taskDetails.assigned_user_name,
                  }}
                  onSubmit={this.onUpdateSubmit}
                  validationSchema={this.taskSchema}
                >
                  {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                    return (
                      <>
                        {taskDetail ? (
                          <View style={styles.detailContent}>
                            <Text style={styles.secTitleOne}>
                              Due{' '}
                              {taskDetail?.date === ''
                                ? ''
                                : moment().format('MM/DD/yyyy') === moment(taskDetail?.date).format('MM/DD/yyyy')
                                  ? 'Today'
                                  : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(taskDetail?.date).format('MM/DD/yyyy')
                                    ? 'Tommorow'
                                    : `on ${moment(taskDetail?.date).format('MM/DD/yyyy')}`}
                              {taskDetail?.time === '' ? '' : ` at ${taskDetail?.time}`}
                            </Text>
                            <View style={styles.taskRow}>
                              {/* <Text style={styles.textTitle}>Title: </Text> */}
                              <TouchableOpacity style={[styles.checkbox]} onPress={() => this.handleTasks(taskDetail?.id)}>
                                <Image
                                  source={taskDetail?.is_complete !== 1 ? IMAGES.uncheckIcon2 : IMAGES.checkIcon2}
                                  style={[styles.checkboxStyle]}
                                />
                              </TouchableOpacity>
                              {this?.props?.taskDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? (
                                <>
                                  <TextInput value={values?.title} style={styles.taskTitle} onChangeText={handleChange('title')} />
                                  {errors?.title && <Text>{errors?.title}</Text>}
                                </>
                              ) : (
                                <Text style={styles.taskTitle}>{taskDetail?.title}</Text>
                              )}
                            </View>
                            {taskDetail?.description !== '' ? (
                              <View style={styles.descRow}>
                                <Text style={styles.descTitle}>Note</Text>
                                {this?.props?.taskDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? (
                                  <>
                                    <TextInput
                                      value={values?.description}
                                      style={styles.descPara}
                                      onChangeText={handleChange('description')}
                                    />
                                    {errors?.description && <Text>{errors?.description}</Text>}
                                  </>
                                ) : (
                                  <Text style={styles.descPara}>{taskDetail?.description}</Text>
                                )}
                              </View>
                            ) : null}

                            {taskDetail?.subtasks.length !== 0 ? (
                              <View style={[styles.taskRow, { flexDirection: 'column' }]}>
                                <View style={styles.subtaskRow}>
                                  <Text style={styles.secTitleTwo}>Subtasks</Text>
                                  <Text style={[styles.secTitleTwo, { color: theme?.colors?.WHITE }]}>
                                    {completed?.length}/{taskDetail?.subtasks?.length} completed
                                  </Text>
                                </View>
                                {taskDetail?.subtasks?.map(item => (
                                  <View style={styles.taskRow}>
                                    <TouchableOpacity
                                      style={[styles.checkbox]}
                                      onPress={() => {
                                        this.handleTasks(item?.id, taskDetail?.id);
                                      }}
                                    >
                                      <Image
                                        source={item?.is_complete === 1 ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2}
                                        style={[styles.checkboxStyle2]}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => this?.props?.navigation?.navigate('SUB_TASK_DETAIL_SCREEN', { subTaskDetais: item })}
                                    >
                                      <Text style={styles.subTaskTitle}>{item?.title}</Text>
                                    </TouchableOpacity>
                                  </View>
                                ))}
                                {/* <Text style={styles.taskTitle}>{taskDetail?.title}</Text> */}
                              </View>
                            ) : null}

                            <View style={styles.userRow}>
                              {this.props?.userData?.userInfo?.id === taskDetail?.createdBy?.id ? (
                                <View>
                                  {taskDetail?.assigned_group_title !== '' ? (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      {taskDetail?.assigned_group_image !== '' ? (
                                        <TouchableOpacity style={styles.imgBtn}>
                                          <Image source={{ uri: taskDetail?.assigned_group_image }} style={[styles.imgBtnimg]} />
                                        </TouchableOpacity>
                                      ) : null}
                                      <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>
                                        {`You have created this task and assigned to `}
                                        <Text
                                          style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                                          onPress={() => this.handleGroupDetail(taskDetail?.assigned_group_id)}
                                        >{`${taskDetail?.assigned_group_title}`}</Text>
                                      </Text>
                                      {/* <TouchableOpacity onPress={() => this.handleGroupDetail(taskDetail?.assigned_group_id)}>
                            <Text style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}> {`${taskDetail?.assigned_group_title}`}</Text>
                          </TouchableOpacity> */}
                                    </View>
                                  ) : taskDetail?.assigned_user_name === '' ? (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>{'You have created this task'}</Text>
                                    </View>
                                  ) : (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: this?.props?.userData?.userInfo?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: taskDetail?.assigned_user_image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>
                                        {`You have created this task and assigned to `}
                                        <Text
                                          style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                                          onPress={() => {
                                            this.getConnectionDetails(taskDetail?.assigned_user_id), this.setState({ isShowModal: true });
                                          }}
                                        >
                                          {`${taskDetail?.assigned_user_name}`}
                                        </Text>
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              ) : (
                                <View>
                                  {taskDetail?.assigned_group_title !== '' ? (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: taskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: taskDetail?.assigned_group_image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>
                                        <Text
                                          style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                                          onPress={() => {
                                            this.getConnectionDetails(taskDetail?.createdBy?.id), this.setState({ isShowModal: true });
                                          }}
                                        >
                                          {`${taskDetail?.createdBy?.name}`}
                                        </Text>
                                        {` has created this task and assigned to `}
                                        <Text
                                          style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                                          onPress={() => this.handleGroupDetail(taskDetail?.assigned_group_id)}
                                        >
                                          {`${taskDetail?.assigned_group_title}`}
                                        </Text>
                                      </Text>
                                    </View>
                                  ) : taskDetail?.assigned_user_name === '' ? (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: taskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <Text
                                        style={[styles.userTxt, { color: theme?.colors?.WHITE }]}
                                      >{`${taskDetail?.createdBy?.name} has created this task`}</Text>
                                    </View>
                                  ) : (
                                    <View style={styles.imgRow}>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image source={{ uri: taskDetail?.createdBy?.image }} style={[styles.imgBtnimg]} />
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.imgBtn}>
                                        <Image
                                          source={
                                            taskDetail?.assigned_user_id === this?.props?.userData?.userInfo?.id
                                              ? { uri: this?.props?.userData?.userInfo?.image }
                                              : { uri: taskDetail?.assigned_user_image }
                                          }
                                          style={[styles.imgBtnimg]}
                                        />
                                      </TouchableOpacity>
                                      {/* <TouchableOpacity onPress={() => this.getConnectionDetails(taskDetail?.createdBy?.id)}>
                            <Text style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}>{`${taskDetail?.createdBy?.name}`}</Text>
                          </TouchableOpacity> */}
                                      <Text style={[styles.userTxt, { color: theme?.colors?.WHITE }]}>
                                        <Text
                                          style={[styles.userTxt, { color: theme?.colors?.RED_500 }]}
                                          onPress={() => {
                                            this.getConnectionDetails(taskDetail?.createdBy?.id), this.setState({ isShowModal: true });
                                          }}
                                        >
                                          {`${taskDetail?.createdBy?.name}`}
                                        </Text>
                                        {` has created this task and assigned to ${taskDetail?.assigned_user_id === this?.props?.userData?.userInfo?.id
                                          ? 'You'
                                          : taskDetail?.assigned_user_name
                                          }`}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          </View>
                        ) : null}
                        <View>
                          <TouchableOpacity style={styles.modalBtn} onPress={() => handleSubmit()}>
                            <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}>Save Details</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    );
                  }}
                </Formik>
              </ScrollView>
            </View>
          ) : null}

          {this.state.isShowModal && this.state.profileDetail ? (
            <UserModal
              visible={this.state.isShowModal}
              inVisible={() => this.setState({ isShowModal: false })}
              userDetails={this.state.profileDetail}
              sendMessage={false}
              chat_id={this.state.profileDetail.chat_id}
              onPressSendMsg={() =>
                this?.props?.navigation?.push('SINGAL_CHAT', {
                  profileDetail: this?.state?.profileDetail,
                  is_block: this?.state?.profileDetail?.is_block,
                })
              }
              onPressSharedSidenote={() =>
                this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.profileDetail?.chat_id })
              }
              onPressBlock={() =>
                this.state?.profileDetail?.chat_id
                  ? this.handleChatBlock(this.state?.profileDetail?.chat_id)
                  : this.handleUserBlock(this.state?.profileDetail?.connection_id)
              }
              onPressInvite={() => onShare(this?.props?.userData?.userInfo?.invitation_url)}
              onPressAddtoSidenote={() => this?.props?.navigation?.navigate('ADD_SIDENOTE', { userData: this?.state?.profileDetail })}
            />
          ) : null}
          {/* <Modal visible={this.state.showEditModal} transparent={true}>
          <TouchableWithoutFeedback onPress={() => this.setState({ showEditModal: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.modalContainer}>
              <View style={styles.modalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.modalbodyBg}>
                  <View style={styles.modalSafeAreaView}>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}>Confirm connection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    taskDetail: state?.dashboardState?.taskDetail,
    eventState: state?.eventState?.eventState,
    myConnections: state?.dashboardState?.myConnections,
    chatDetail: state?.groupState?.chatDetail,
    groupList: state?.dashboardState?.groupList,
    monthlyEventList: state?.eventState?.monthlyEventList,
    sidenoteList: state?.eventState?.sidenoteList,
    monthlyTaskList: state?.eventState?.monthlyTaskList,
    connectionList: state?.eventState?.connectionList,
    pinnedUser: state?.eventState?.pinnedUser,
    // total_count: state?.dashboardState?.total_count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailScreen);
