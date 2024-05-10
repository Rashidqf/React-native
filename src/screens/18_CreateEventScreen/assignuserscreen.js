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
  FlatList,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';
import NoDataFound from '../../components/noDataFound';

//import constants
import { API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';
import { style } from './style';

import { AppContext } from '../../themes/AppContextProvider';

class AssignUserScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      currentUserPage: 1,
      isUserMoreLoading: false,
      selectedTask: this?.props?.route?.params?.selectedTask,
      userNameTask: this?.props?.route?.params?.userNameTask,
      from: this?.props?.route?.params?.from,
      isRefreshing: false,
      groupId: this?.props?.route?.params?.groupId,
      // myConnections: this?.props?.myConnections,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    // this.getMyConnectionsList();
    this.handleGroupDetail();
    this?.props?.navigation?.setParams({
      selectedTask: this.state.selectedTask,
      userNameTask: this.state.userNameTask,
      isCreateTask: this?.props?.route?.params?.isCreateTask,
      // setFieldValue: this.props.route?.params?.setFieldValue,
    });
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
    } catch (e) {}
  };

  getMyConnectionsList() {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { limit: 20, page: this.state.currentUserPage },
      };
      if (this?.state?.isUserMoreLoading === true) {
        this.props.showLoading(true);
      }
      if (this?.state?.currentUserPage === 1) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MYCONNECTIONS];
              if (resp.success) {
                if (this?.state?.currentUserPage === 1) {
                  this?.props?.saveMyConnections(resp);
                } else {
                  this?.props?.saveMyConnectionsLoadMore(resp);
                  this.setState({ isUserMoreLoading: false });
                }
                // this.setState({ myConnections: resp.data });
                this.setState({
                  currentUserPage: this.state.currentUserPage + 1,
                });
                this.props.showLoading(false);
                this.setState({ isRefreshing: false });
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

  _handleIndexChange = index => {
    this.setState({ index });
  };

  onChange(id, userNameTask, from) {
    if (id === this.state.selectedTask) {
      this.setState({
        selectedTask: null,
        userNameTask: '',
      });
      this?.props?.navigation?.setParams({
        selectedTask: null,
        userNameTask: '',
        // setFieldValue: this.props.route?.params?.setFieldValue,
      });
      this.props.route?.params?.setFieldValue('assigned_user_id', '');
      if (this?.props?.route?.params?.isCreateTask === false) {
        this.props.route?.params?.setFieldValue('assigned_user_name', '');
      }
    } else {
      this.setState({
        selectedTask: id,
        userNameTask: userNameTask,
        from,
      });
      this?.props?.navigation?.setParams({
        selectedTask: id,
        userNameTask: userNameTask,
        from: from,
        // setFieldValue: this.props.route?.params?.setFieldValue,
      });

      this.props.route?.params?.setFieldValue('assigned_user_id', id);
      if (this?.props?.route?.params?.isCreateTask === false) {
        this.props.route?.params?.setFieldValue('assigned_user_name', userNameTask);
      }
    }
  }

  refreshControlUser = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getMyConnectionsList();
    }, 500);
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
        <KeyboardAvoidingView
          style={styles.KeyboardAvoidingView}
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <>
            {this?.props?.groupDetail ? (
              <>
                {this?.props?.groupDetail?.data?.length === 0 ? (
                  <NoDataFound
                    title="No Group yet"
                    imageWidth={205}
                    imageHeight={156}
                    source={IMAGES.noChatImage}
                    text="No group appear here"
                    titleColor={theme?.colors?.WHITE}
                  />
                ) : (
                  <>
                    <FlatList
                      refreshControl={
                        <RefreshControl
                          tintColor={theme?.colors?.WHITE}
                          refreshing={this.state.isRefreshing}
                          onRefresh={() => this.refreshControlUser()}
                        />
                      }
                      showsHorizontalScrollIndicator={false}
                      data={this?.props?.groupDetail?.members || []}
                      keyExtractor={(item, index) => String(index)}
                      ListFooterComponent={() =>
                        this.state.isUserMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                      }
                      onEndReachedThreshold={0.5}
                      // onEndReached={() => {
                      //   if (
                      //     this?.props?.groupDetail?.total_pages !== 1 &&
                      //     !this.state.isUserMoreLoading &&
                      //     this?.props?.groupDetail?.total_count !== this.props?.groupDetail?.data.length
                      //   ) {
                      //     this.setState({ isUserMoreLoading: true });
                      //     this.getMyConnectionsList();
                      //   }
                      // }}
                      renderItem={({ item, index }) => {
                        // if (item?.user_id !== this.props?.userData?.userInfo?.id) {
                        return (
                          <View>
                            {/* {this.props?.userData?.userInfo?.id === this?.props?.groupDetail?.members?.id ? ( */}
                            <TouchableOpacity
                              style={[styles.listItem]}
                              onPress={() => this.onChange(item?.user_id, item?.user_name, 'user')}
                            >
                              <Image
                                source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                                style={[{ borderRadius: 50, width: 50, height: 50, marginRight: 20 }]}
                                resizeMode={'cover'}
                              />
                              <View style={styles.body}>
                                <Text style={styles.h6}>{item?.user_name}</Text>
                              </View>
                              <View style={[styles.right, styles.listIcon]}>
                                {this.state.selectedTask === item?.user_id ? (
                                  <Image source={IMAGES.checkIcon2} style={styles.listIcon} />
                                ) : null}
                              </View>
                            </TouchableOpacity>
                            {/* ) : null} */}
                          </View>
                        );
                        // }
                      }}
                    />
                  </>
                )}
              </>
            ) : null}
          </>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    myConnections: state?.dashboardState?.myConnections,
    groupDetail: state?.groupState?.groupDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AssignUserScreen);
