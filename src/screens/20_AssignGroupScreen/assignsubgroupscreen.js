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
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';
import NoDataFound from '../../components/noDataFound';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

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
import { Button, Input, Switch, Tab, TabView } from 'react-native-elements';
import { AppContext } from '../../themes/AppContextProvider';

// import LinearGradient from 'react-native-linear-gradient';

class AssignSubGroupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      time: new Date(),
      switchReminder: false,
      switchDay: false,
      index: 0,
      subSelected: this?.props?.route?.params?.subSelected,
      subTitle: this?.props?.route?.params?.subGroupTitle,
      subFrom: this?.props?.route?.params?.subFrom,
      select: false,
      setFieldValue: this?.props?.route?.params?.setFieldValue,
      tabName: 'Group',
      currentPage: 1,
      currentUserPage: 1,
      isMoreLoading: false,
      isUserMoreLoading: false,
      isRefreshing: false,
      isLoaderGroup: true,
      isLoaderEvent: true,
      groupId: this?.props?.route?.params?.groupId,
      groupDetail: '',
      selectedId: this?.props?.route?.params?.inputField?.assigned_user_id,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getMyConnectionsList();
    // this.getGroupList();/
    this.handleGroupDetail();
    this?.props?.navigation?.setParams({
      subSelected: this.state.subSelected,
      subTitle: this.state.subTitle,
      subIsCreate: this?.props?.route?.params?.subIsCreate,
      subFrom: this.state.subFrom,
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
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              if (resp.success) {
                this?.props?.saveGroupDetail(resp.data);
                this?.setState({
                  groupDetail: resp?.data,
                });
                this?.props?.showLoading(false);
              } else {
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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  _handleIndexChange = index => {
    this.setState({ index });
  };

  onChange(id, title, from) {
    if (id === this.state.selectedId || id === this.state.subSelected) {
      this.setState({
        subSelected: null,
        subTitle: '',
        selectedId: '',
        subFrom: null,
      });
      this?.props?.navigation?.setParams({
        subSelected: null,
        subTitle: '',
        subFrom: null,
      });
    } else {
      let key = 'assigned_group_title';
      if (from === 'user') {
        key = 'assigned_user_name';
      }

      this.state.setFieldValue(`assigned_user_id`, id);
      this.state.setFieldValue(key, title);

      this.setState({
        subSelected: id,
        subTitle: title,
        subFrom: from,
        selectedId: id,
      });
      this?.props?.navigation?.setParams({
        subSelected: id,
        subTitle: title,
        subFrom: from,
      });
    }
  }

  refreshControlGroup = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getGroupList();
    }, 500);
  };

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
      <>
        <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            {this?.state?.groupDetail?.members?.length === 0 ? (
              <NoDataFound
                title="No Group yet"
                imageWidth={205}
                imageHeight={156}
                source={IMAGES.noChatImage}
                text="No group appear here"
                titleColor={'white'}
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
                  data={this?.state?.groupDetail?.members || []}
                  keyExtractor={(item, index) => String(index)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() =>
                    this.state.isUserMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                  }
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        {this.props?.userData?.userInfo?.id !== item?.user_id ? (
                          <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.user_id, item?.user_name, 'user')}>
                            <Image
                              source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                              style={[{ borderRadius: 75, width: 50, height: 50, marginRight: 20 }]}
                            />
                            <View style={styles.body}>
                              <Text style={styles.h6}>{item?.user_name}</Text>
                            </View>
                            <View style={[styles.right, styles.listIcon]}>
                              {this.state.subSelected === item.user_id || this.state.selectedId === item.user_id ? (
                                <Image source={IMAGES.checkIcon2} style={styles.listIcon} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    );
                  }}
                />
              </>
            )}
          </KeyboardAvoidingView>
          {/* <View style={styles.tabContainerStyle}>
            <Tab value={this.state.index} onChange={this._handleIndexChange} indicatorStyle={styles.indicatorStyle}>
              <Tab.Item
                title="group"
                titleStyle={this.state.index == 0 ? styles.titleActiveStyle : styles.titleStyle}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
                variant={'default'}
              />
              <Tab.Item
                title="Contact"
                titleStyle={this.state.index == 1 ? styles.titleActiveStyle : styles.titleStyle}
                buttonStyle={styles.buttonStyle}
                containerStyle={styles.containerStyle}
                variant={'default'}
              />
            </Tab>
          </View> */}
          {/* <TabView value={this.state.index} onChange={this._handleIndexChange}>
            <TabView.Item style={{ width: '100%' }}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollView} nestedScrollEnabled={false}>
                <View style={{ flex: 1 }}>
                  {this?.props?.groupList?.length !== 0 ? (
                    <>
                      {this?.props?.groupList?.map(item => (
                        <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.id, item.title, 'group')}>
                          <View style={styles.body}>
                            <Text style={styles.h6}>{item.title}</Text>
                          </View>
                          <View style={[styles.right, styles.listIcon]}>
                            {this.state.subSelected === item.id ? <Image source={IMAGES.checkIcon2} style={styles.listIcon} /> : null}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <NoDataFound
                      title="No Group yet"
                      imageWidth={205}
                      imageHeight={156}
                      source={IMAGES.noChatImage}
                      text="No group appear here"
                      titleColor={'white'}
                    />
                  )}
                </View>
              </ScrollView>
            </TabView.Item>
            <TabView.Item style={{ width: '100%' }}>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={this?.props?.userList || []}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.id, item.name, 'user')}>
                      <Image
                        source={{ uri: item?.image ? item?.image : IMAGES.sortIcon }}
                        style={[
                          COMMON_STYLE.headerIcon,
                          { ...COMMON_STYLE.imageStyle(17), borderRadius: 50, width: 50, height: 50, marginRight: 20 },
                        ]}
                      />
                      <View style={styles.body}>
                        <Text style={styles.h6}>{item.name}</Text>
                      </View>
                      <View style={[styles.right, styles.listIcon]}>
                        {this.state.subSelected === item.id ? <Image source={IMAGES.checkIcon2} style={styles.listIcon} /> : null}
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.index}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={false}
                  // contentContainerStyle={{ flex: 1 }}
                  style={{ flex: 1 }}
                />
             
              </View>
            </TabView.Item>
          </TabView> */}
        </SafeAreaWrapper>
      </>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupList: state?.dashboardState?.groupList,
    myConnections: state?.dashboardState?.myConnections,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AssignSubGroupScreen);
