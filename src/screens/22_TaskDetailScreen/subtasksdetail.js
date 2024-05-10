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
import { style } from './style';
import { Button, ListItem, Icon } from 'react-native-elements';
// import { FlatList } from 'react-native-gesture-handler';

// import Utils
import { MethodUtils } from '@utils';
import { STRING_UNARY_OPERATORS } from '@babel/types';
import { AppContext } from '../../themes/AppContextProvider';
class SubTaskDetailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subTaskDetais: this?.props?.route?.params?.subTaskDetais,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.props?.navigation?.setParams({
      handleSubmit: this.handleSubmit,
    });
  }

  handleSubmit = () => {
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
          try {
            const params = {
              url: API_DATA.TASKDELETE,
              data: {
                id: this?.state?.subTaskDetais?.id,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.TASKDELETE];
                  if (resp.success) {
                    this.props.saveTaskDelete(this?.state?.subTaskDetais?.id);
                    this.getDashboardList();
                    this.getTaskList();
                    this.props.showLoading(false);
                    this.props.navigation.pop(2);
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

  getTaskList = () => {
    try {
      const params = {
        url: API_DATA.TASKLIST,
        data: {},
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.TASKLIST];
            const { theme } = this.context;
            const styles = style(theme);
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

  handleTasks = taskID => {
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
                this.props.saveTaskComplete(resp.data, taskID);
                this.setState({ subTaskDetais: resp.data });
                this.props.showToast(localize('SUCCESS'), resp.message);

                // if (this.props.taskList) {
                this.props.showToast(localize('SUCCESS'), resp.message);
                this.props.saveTaskListComplete(resp.data, taskID);
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
    const subTaskDetais = this?.state?.subTaskDetais;
    const dateFormat = new Date();

    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.ScrollView}>
            <View style={styles.detailContent}>
              <Text style={styles.secTitleOne}>
                Due{' '}
                {subTaskDetais?.date === ''
                  ? ''
                  : moment().format('MM/DD/yyyy') === moment(subTaskDetais?.date).format('MM/DD/yyyy')
                  ? 'Today'
                  : moment(dateFormat).add(1, 'days').format('MM/DD/yyyy') === moment(subTaskDetais?.date).format('MM/DD/yyyy')
                  ? 'Tommorow'
                  : `on ${moment(subTaskDetais?.date).format('MM/DD/yyyy')}`}
                {subTaskDetais?.time === '' ? '' : ` at ${subTaskDetais?.time}`}
              </Text>
              <View style={styles.taskRow}>
                {/* <Text style={styles.textTitle}>Title: </Text> */}
                <TouchableOpacity
                  style={[styles.checkbox]}
                  onPress={() => {
                    this.handleTasks(subTaskDetais?.id);
                  }}
                >
                  <Image
                    source={subTaskDetais?.is_complete !== 1 ? IMAGES.uncheckIcon2 : IMAGES.checkIcon2}
                    style={[styles.checkboxStyle]}
                  />
                </TouchableOpacity>
                <Text style={styles.taskTitle}>{subTaskDetais?.title}</Text>
              </View>
              {subTaskDetais?.description !== 'undefined' ? (
                <View style={styles.descRow}>
                  <Text style={styles.descTitle}>Note</Text>
                  <Text style={styles.descPara}>{subTaskDetais?.description}</Text>
                </View>
              ) : null}

              {/* <View style={styles.userRow}>
                <View style={styles.imgRow}>
                  <TouchableOpacity style={styles.imgBtn}>
                    <Image source={IMAGES.sortIcon} style={[styles.imgBtnimg]} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imgBtn}>
                    <Image source={IMAGES.sortIcon} style={[styles.imgBtnimg]} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.userTxt, { color:  theme?.colors?.WHITE }]}>You and Kim on this task</Text>
              </View> */}
            </View>
          </ScrollView>
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(SubTaskDetailScreen);
