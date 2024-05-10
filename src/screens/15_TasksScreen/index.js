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
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import ActionButton from 'react-native-circular-action-menu';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { API_DATA } from '@constants';

//import themes
import { IMAGES, FONTS, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button, ListItem, Icon } from 'react-native-elements';
// import { FlatList } from 'react-native-gesture-handler';

// import Utils
import { MethodUtils } from '@utils';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';

class MyCustomText extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMoreVisible: false,
      showMore: false,
    };
  }
  static contextType = AppContext;
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <>
        <Text
          style={styles.h6}
          numberOfLines={this?.state?.showMore ? null : 3}
          onTextLayout={e => {
            if (e.nativeEvent.lines.length >= 3) {
              this?.setState({
                showMoreVisible: true,
              });
            }
          }}
        >
          {this?.props?.item?.title}
        </Text>
        {this?.state?.showMoreVisible ? (
          <TouchableOpacity onPress={() => this.props.handleTaskDetail(this?.props?.item?.id)}>
            <Text style={[styles.fourteenGrayStyle, { fontWeight: 'bold' }]}>{this?.state?.showMore ? 'See less' : 'See more'}</Text>
          </TouchableOpacity>
        ) : null}
      </>
    );
  }
}

class TasksScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      oldTaskEnable: false,

      tasksList: [
        {
          id: 1,
          name: 'List item 1',
        },
        {
          id: 2,
          name: 'List item 2',
        },
        {
          id: 3,
          name: 'List item 3',
        },
      ],
      selected: [],
      form: null,
      isMoreLoading: false,
      openExpand: [],
      isRefreshing: false,
      showMoreButtonVisible: false,
      showMore: false,
      isLoader: true,
      taskType: '',
      rowIndex: null,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getTaskList(this?.state?.oldTaskEnable);
    this?.props?.navigation?.setParams({
      getTaskList: this.getTaskList,
    });
  }

  refreshControl = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getTaskList(this?.state?.oldTaskEnable);
    }, 500);
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
  handleTasks = (taskID, parentId) => {
    try {
      const params = {
        url: API_DATA.TASKCOMPLETE,
        data: {
          id: taskID,
        },
      };
      // this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKCOMPLETE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.props.saveTaskListComplete(resp.data, taskID, parentId);
              // this.getTaskList(this?.state?.oldTaskEnable);
              // this.getDashboardList();
              if (this.props.dashboardList) {
                this.props.saveTaskComplete(resp.data, taskID);
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

  handleTaskDetail = taskId => {
    console.log('task id find', taskId);
    this?.props?.navigation?.navigate('TASK_DETAIL', { taskId });
  };

  handleEditTask = taskId => {
    this.props.navigation.navigate('UPDATE_TASK', {
      taskId,
      getTaskList: this?.getTaskList,
      groupTask: false,
      oldTaskEnable: this?.state?.oldTaskEnable,
    });
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
  handleDeleteTask = taskId => {
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

  handleReportTask = eventId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to report this?', [
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
          this.props.showToast(localize('SUCCESS'), 'Task reported successfully');
        },
      },
    ]);
  };

  onChangeExpand = id => {
    if (id === this.state.openExpand) {
      this.setState({
        openExpand: null,
      });
    } else {
      this.setState({
        openExpand: id,
        expanded: true,
      });
    }
  };

  onSwipeOpen = rowIndex => {
    this.setState({
      rowIndex: rowIndex,
    });
  };
  onSwipeClose = rowIndex => {
    if (rowIndex === this.state.rowIndex) {
      this.setState({ rowIndex: null });
    }
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const taskList = this?.props?.taskList?.data;

    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
        {this?.state?.isLoader === false ? (
          <View style={{ flex: 1 }}>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>{localize('TASKS_TAB')}</Text>
              <View style={styles.filterTab}>
                <TouchableOpacity
                  style={this.state.taskType === '' ? styles.activeTab : styles.inActiveTab}
                  onPress={() => {
                    this.setState({
                      taskType: '',
                      oldTaskEnable: false,
                    });
                    this?.getTaskList(false);
                  }}
                >
                  <Text style={this.state.taskType === '' ? styles.activeIcon : styles.inActiveIcon}>Current Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={this.state.taskType === 'OldTask' ? styles.activeTab : styles.inActiveTab}
                  onPress={() => {
                    this.setState({
                      taskType: 'OldTask',
                      oldTaskEnable: true,
                    });
                    this?.getTaskList(true);
                  }}
                >
                  <Text style={this.state.taskType === 'OldTask' ? styles.activeIcon : styles.inActiveIcon}>Past Tasks</Text>
                  {/* <Image
                    source={IMAGES.TASKS_TAB}
                    style={this.state.taskType === 'OldTask' ? styles.activeIcon : [styles.inActiveIcon, { tintColor: 'white' }]}
                  /> */}
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              refreshControl={
                <RefreshControl
                  tintColor={theme?.colors?.WHITE}
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.refreshControl()}
                />
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ScrollView}
              nestedScrollEnabled={false}
            >
              {taskList ? (
                <View style={{ flex: 1 }}>
                  {/* {taskList?.length != 0 ? ( */}
                  {taskList?.length != 0 && (taskList?.[0]?.data?.length || taskList?.[1]?.data?.length || taskList?.[2]?.data?.length) ? (
                    <SectionList
                      sections={taskList || []}
                      keyExtractor={item => item.id}
                      // refreshing={this?.state?.isRefreshing}
                      onEndReachedThreshold={0.5}
                      // refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={() => this.refreshControl()} />}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ flex: 1 }}>
                            <Swipeout
                              right={
                                item?.createdBy?.id === this?.props?.userData?.userInfo?.id && [
                                  {
                                    text: (
                                      <Image
                                        style={
                                          item?.createdBy?.id !== this?.props?.userData?.userInfo?.id
                                            ? [COMMON_STYLE.imageStyle(6), { tintColor: 'gray' }]
                                            : COMMON_STYLE.imageStyle(6)
                                        }
                                        source={IMAGES.deleteNewIcon}
                                      />
                                    ),
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleDeleteTask(item?.id),
                                    disabled: item?.createdBy?.id !== this?.props?.userData?.userInfo?.id,
                                  },
                                  {
                                    text: <Image style={COMMON_STYLE.imageStyle(6)} source={IMAGES.edit} />,
                                    backgroundColor: theme?.colors?.GRAY_1000,
                                    onPress: () => this.handleEditTask(item?.id),
                                  },
                                ]
                              }
                              onOpen={() => this.onSwipeOpen(index)}
                              close={this.state.rowIndex !== index}
                              onClose={() => this.onSwipeClose(index)}
                              autoClose={true}
                              // rowIndex ={index}
                              sectionId={0}
                              backgroundColor={theme?.colors?.GRAY_1000}
                              style={{ borderBottomWidth: 1, borderColor: theme?.colors?.GRAY_800 }}
                            >
                              <View style={[styles.listItem, styles.borderBottomNull]}>
                                <View style={styles.ListItemAccordion}>
                                  <TouchableOpacity
                                    style={[styles.left, { marginRight: 0, width: Responsive.getWidth(10) }]}
                                    onPress={() => this.handleTasks(item.id)}
                                  >
                                    <Image
                                      source={item?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                      style={[styles.listIcon]}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[styles.body]} onPress={() => this.handleTaskDetail(item?.id)}>
                                    <MyCustomText item={item} handleTaskDetail={this.handleTaskDetail} />
                                    <View style={styles.meta}>
                                      {item?.assigned_group_title ? (
                                        <>
                                          <View style={styles.metaItem}>
                                            <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                            <Text style={styles.thirteenGrayStyle}>{item?.assigned_group_title}</Text>
                                          </View>
                                        </>
                                      ) : null}
                                      {item?.assigned_user_name ? (
                                        <>
                                          <View style={styles.metaItem}>
                                            <Image source={IMAGES.dashIcon} style={styles.metaIcon} />
                                            <Text style={styles.thirteenGrayStyle}>{item?.assigned_user_name}</Text>
                                          </View>
                                        </>
                                      ) : null}
                                      <View style={styles.metaItem}>
                                        <Image source={IMAGES.calendarIcon} style={styles.metaIcon} />
                                        <Text style={styles.thirteenGrayStyle}>
                                          {moment(item.date).format('MMMM DD')} {item.time === '' ? '' : 'at ' + item.time}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>

                                  {item?.subtasks?.length !== 0 ? (
                                    <TouchableOpacity
                                      style={[styles.right, { marginRight: 10 }]}
                                      onPress={() => this.onChangeExpand(item?.id)}
                                    >
                                      <Image
                                        source={this.state.openExpand === item?.id ? IMAGES.upArrow : IMAGES.downArrow}
                                        style={styles.listIcon}
                                      />
                                    </TouchableOpacity>
                                  ) : null}
                                  {item?.createdBy?.id === this?.props?.userData?.userInfo?.id ? null : (
                                    <TouchableOpacity onPress={() => this.handleReportTask(item?.id)}>
                                      <Image source={IMAGES.report} style={{ height: 20, width: 20, tintColor: theme?.colors?.WHITE }} />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                              {this.state.openExpand === item?.id ? (
                                <View>
                                  {item?.subtasks?.map(val => {
                                    return (
                                      <>
                                        <View
                                          style={[
                                            styles.listItem,
                                            styles.listItemBg,
                                            styles.subListItem,
                                            { marginTop: 0, backgroundColor: theme?.colors?.GRAY_1000 },
                                          ]}
                                        >
                                          <TouchableOpacity
                                            style={[styles.left, { marginRight: 0 }]}
                                            onPress={() => this.handleTasks(val.id, item?.id)}
                                          >
                                            <Image
                                              source={val?.is_complete === 1 ? IMAGES.checkIcon : IMAGES.uncheckIcon}
                                              style={styles.subListIcon}
                                            />
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            style={[styles.body, { paddingLeft: 10 }]}
                                            onPress={() =>
                                              this?.props?.navigation?.navigate('SUB_TASK_DETAIL_SCREEN', { subTaskDetais: val })
                                            }
                                          >
                                            <View style={styles.body}>
                                              <Text style={styles.h6}>{val?.title}</Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      </>
                                    );
                                  })}
                                </View>
                              ) : null}
                            </Swipeout>
                          </View>
                        );
                      }}
                      renderSectionHeader={({ section: { title } }) => (
                        <View style={[styles.sectionHeader]}>
                          <Text style={styles.sectionHeaderTitle}>
                            <Text style={styles.header}>{title}</Text>
                          </Text>
                        </View>
                      )}
                    />
                  ) : (
                    <NoDataFound
                      title="Nothing to see"
                      text="You don’t have any tasks created yet"
                      titleColor={theme?.colors?.GRAY_50}
                      textColor={theme?.colors?.GRAY_100}
                      titleFontSize={20}
                      source={IMAGES.noChatImage}
                      imageWidth={205}
                      imageHeight={156}
                    />
                  )}
                </View>
              ) : null}
            </ScrollView>
            {!this?.state?.oldTaskEnable ? (
              <TouchableOpacity
                style={styles.fabButton}
                onPress={() => this.props.navigation.navigate('NEW_TASK', { oldTaskEnable: this?.state?.oldTaskEnable })}
              >
                <Image source={IMAGES.addTask} style={styles.fabButtonIcon} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </SafeAreaWrapper>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    taskList: state?.dashboardState?.taskList,
    dashboardList: state?.dashboardState?.dashboardList,
    // total_count: state?.dashboardState?.total_count,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(TasksScreen);
