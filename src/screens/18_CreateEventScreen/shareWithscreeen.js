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
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { AppContext } from '../../themes/AppContextProvider';

// import LinearGradient from 'react-native-linear-gradient';

class shareWithUserScreen extends React.Component {
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
      selectedUser: this?.props?.route?.params?.selectedUser,
      title: this?.props?.route?.params?.groupTitle,
      from: this?.props?.route?.params?.from,
      select: false,
      isRefreshing: false,
      isLoaderGroup: true,
      isLoaderEvent: true,
      isUpdate: this?.props?.route?.params?.isUpdate,
      eventID: this?.props?.route?.params?.eventID,
      // myConnections: this?.props?.myConnections,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    // this.getGroupList();
    this.getMyConnectionsList();
    this?.props?.navigation?.setParams({
      selectedUser: this.state.selectedUser,
      title: this.state.title,
      isUpdate: this.state.isUpdate,
      eventID: this.state.eventID,
    });
  }

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

  _handleIndexChange = index => {
    this.setState({ index });
  };

  onChange(id, memberTitle, item) {
    if (!this?.state?.selectedUser?.some(val => val?.user_id === id)) {
      this.setState({
        selectedUser: [...this?.state?.selectedUser, item],
        title: '',
      });
      this?.props?.navigation?.setParams({
        selectedUser: [...this?.state?.selectedUser, item],
        title: '',
        isUpdate: this.state.isUpdate,
      });
    } else {
      this.setState({
        selectedUser: this?.state?.selectedUser?.filter(val => val.user_id !== id),
        title: memberTitle,
      });
      this?.props?.navigation?.setParams({
        selectedUser: this?.state?.selectedUser?.filter(val => val.user_id !== id),
        title: memberTitle,
        isUpdate: this.state.isUpdate,
      });
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
          {this?.props?.myConnections?.data?.length === 0 ? (
            <NoDataFound
              title="No contacts yet"
              imageWidth={205}
              imageHeight={156}
              source={IMAGES.noChatImage}
              text="No contact appear here"
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
                    <View style={{}}>
                      <TouchableOpacity style={[styles.listItem]} onPress={() => this.onChange(item?.user_id, item?.user_name, item)}>
                        <Image
                          source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                          style={[{ borderRadius: 75, width: 50, height: 50, marginRight: 20 }]}
                        />
                        <View style={styles.body}>
                          <Text style={styles.h6}>{item?.user_name}</Text>
                        </View>
                        <View style={[styles.right, styles.listIcon]}>
                          {this?.state?.selectedUser?.some(val => val?.user_id === item?.user_id) ? (
                            <Image source={IMAGES.checkIcon2} style={[styles.listIcon]} />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
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
export default connect(mapStateToProps, mapDispatchToProps)(shareWithUserScreen);
