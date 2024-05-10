import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
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
import { SafeAreaWrapper, TitleTextInput } from '@components';
import NoDataFound from '../../components/noDataFound';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

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

class EventDetailsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedStartDate: null,
      time: new Date(),
      switchReminder: false,
      switchDay: false,
      index: 0,
      tabName: 'Group',
      currentPage: 1,
      currentUserPage: 1,
      isMoreLoading: false,
      isUserMoreLoading: false,
      selected: this?.props?.route?.params?.userId ? this?.props?.route?.params?.userId : this?.props?.route?.params?.selected,
      title: this?.props?.route?.params?.groupTitle,
      from: this?.props?.route?.params?.from,
      select: false,
      isRefreshing: false,
      isLoaderGroup: true,
      isLoaderEvent: true,
      groupId: this?.props?.route?.params?.groupId,
      groupDetail: '',
      // myConnections: this?.props?.myConnections,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getGroupList();
    this.handleGroupDetail();
    // this.getMyConnectionsList();
    this?.props?.navigation?.setParams({
      selected: this.state.selected,
      title: this.state.title,
      isCreate: this?.props?.route?.params?.isCreate,
      from: this.state.from,
      tabName: this?.state?.tabName,
      isFrom: this?.props?.route?.params?.isFrom,
      tasks:this?.props?.route?.params?.tasks
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
    } catch (e) { }
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
                this?.setState({
                  isLoaderEvent: false,
                });
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

  getGroupList() {
    try {
      const params = {
        url: API_DATA.GROUPLIST,
        data: {
          limit: 20,
          page: this.state.currentPage,
        },
      };
      if (this?.state?.currentPage === 1) {
        this.props.showLoading(true);
      }
      if (this.state.isMoreLoading === true) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPLIST];
              if (resp.success) {
                this?.setState({
                  isLoaderGroup: false,
                });
                if (this?.state?.currentPage === 1) {
                  this?.props?.saveGroupList(resp);
                } else {
                  this?.props?.saveGroupListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  currentPage: this.state.currentPage + 1,
                });
                this.props.showLoading(false);
                this?.setState({
                  isRefreshing: false,
                });
                // this.setState({
                //   currentPage: this.state.currentPage + 1,
                // });
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

  onChange(id, title, from) {
    if (id === this.state.selected) {
      this.setState({
        selected: null,
        title: '',
      });
      this?.props?.navigation?.setParams({
        selected: null,
        title: '',
      });
    } else {
      this.setState({
        selected: id,
        title: title,
        from,
      });
      this?.props?.navigation?.setParams({
        selected: id,
        title: title,
        from: from,
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
      <ImageBackground source={IMAGES.onboardingScreen} style={{ flex: 1 }}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            {this?.state?.groupId ? (
              <>
                {this?.props?.myConnections?.data?.length === 0 ? (
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
                      data={this?.state?.groupDetail?.members || []}
                      keyExtractor={(item, index) => String(index)}
                      ListFooterComponent={() =>
                        this.state.isUserMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                      }
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, index }) => {
                        return (
                          item?.user_id !== this?.props?.userData?.userInfo?.id && (
                            <TouchableOpacity style={[styles.listItem]} onPress={() => this.onChange(item?.user_id, item?.user_name, 'user')}>
                              <Image
                                source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                                style={[{ borderRadius: 75, width: 50, height: 50, marginRight: 20 }]}
                              />
                              <View style={styles.body}>
                                <Text style={styles.h6}>{item?.user_name}</Text>
                              </View>
                              <View style={[styles.right, styles.listIcon]}>
                                {this.state.selected === item?.user_id ? <Image source={IMAGES.checkIcon2} style={styles.listIcon} /> : null}
                              </View>
                            </TouchableOpacity>
                          )
                        );
                      }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <View style={styles.tabNav}>
                  <TouchableOpacity
                    style={[styles.buttonStyle, this.state.tabName == 'Group' ? styles.tabNavBtnActive : styles.tabNavBtn]}
                    onPress={() => {
                      this.setState({
                        tabName: 'Group',
                      });
                      this?.props?.navigation?.setParams({
                        tabName: 'Group',
                      });
                    }}
                  >
                    <Text style={[styles.titleStyle, this.state.tabName == 'Group' ? styles.tabTitleActive : styles.tabTitle]}>Sidenotes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonStyle, this.state.tabName == 'Contact' ? styles.selectTabStyle : styles.tabNavBtn]}
                    onPress={() => {
                      this.setState({
                        tabName: 'Contact',
                      });
                      this?.getMyConnectionsList();
                      this?.props?.navigation?.setParams({
                        tabName: 'Contact',
                      });
                    }}
                  >
                    <Text style={[styles.titleStyle, this.state.tabName == 'Contact' ? styles.tabTitleActive : styles.tabTitle]}>Contacts</Text>
                  </TouchableOpacity>
                </View>
                {this.state.tabName == 'Group' ? (
                  <>
                    {this?.state?.isLoaderGroup === false && this?.props?.groupList ? (
                      <>
                        {this?.props?.groupList?.data?.length === 0 ? (
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
                                  onRefresh={() => this.refreshControlGroup()}
                                />
                              }
                              showsHorizontalScrollIndicator={false}
                              data={this?.props?.groupList?.data || []}
                              keyExtractor={(item, index) => String(index)}
                              onEndReachedThreshold={0.5}
                              onEndReached={() => {
                                if (
                                  this?.props?.groupList?.total_pages !== 1 &&
                                  !this.state.isMoreLoading &&
                                  this?.props?.groupList?.total_count !== this.props?.groupList?.data.length
                                ) {
                                  this.setState({ isMoreLoading: true });
                                  this.getGroupList();
                                }
                              }}
                              ListFooterComponent={() =>
                                this.state.isMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                              }
                              renderItem={({ item, index }) => {
                                return (
                                  <View>
                                    {this.state.tabName === 'Group' ? (
                                      <TouchableOpacity style={[styles.sidenoteItem]} onPress={() => this.onChange(item.id, item.title, 'group')}>
                                        <Text style={styles.sidenoteItemText}>{item.title}</Text>
                                        {this.state.selected === item.id ? (
                                          <Image source={IMAGES.check2} style={styles.sidenoteItemIcon} />
                                        ) : null}
                                      </TouchableOpacity>
                                    ) : null}
                                  </View>
                                );
                              }}
                            />
                          </>
                        )}
                      </>
                    ) : null}
                  </>
                ) : null}
                {this.state.tabName == 'Contact' ? (
                  <>
                    {this?.state?.isLoaderEvent === false && this?.props?.myConnections ? (
                      <>
                        {this?.props?.myConnections?.data?.length === 0 ? (
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
                              data={this?.props?.myConnections?.data || []}
                              keyExtractor={(item, index) => String(index)}
                              ListFooterComponent={() =>
                                this.state.isUserMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                              }
                              onEndReachedThreshold={0.5}
                              onEndReached={() => {
                                if (
                                  this?.props?.myConnections?.total_pages !== 1 &&
                                  !this.state.isUserMoreLoading &&
                                  this?.props?.myConnections?.total_count !== this.props?.myConnections?.data.length
                                ) {
                                  this.setState({ isUserMoreLoading: true });
                                  this.getMyConnectionsList();
                                }
                              }}
                              renderItem={({ item, index }) => {
                                return (
                                  <View>
                                    {this.state.tabName === 'Contact' ? (
                                      <TouchableOpacity
                                        style={[styles.listItem]}
                                        onPress={() => this.onChange(item?.user_id, item?.user_name, 'user')}
                                      >
                                        <Image
                                          source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                                          style={[{ borderRadius: 75, width: 50, height: 50, marginRight: 20 }]}
                                        />
                                        <View style={styles.body}>
                                          <Text style={styles.contatLabel}>{item?.user_name}</Text>
                                        </View>
                                        <View style={[styles.right, styles.listIcon]}>
                                          {this.state.selected === item?.user_id ? (
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
                      </>
                    ) : null}
                  </>
                ) : null}
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
        </View>
        <TabView value={this.state.index} onChange={this._handleIndexChange}>
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
                          {this.state.selected === item.id ? <Image source={IMAGES.checkMark} style={styles.listIcon} /> : null}
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
                      {this.state.selected === item.id ? <Image source={IMAGES.checkMark} style={styles.listIcon} /> : null}
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
      </ImageBackground>
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
export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsScreen);
