import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, RefreshControl, StatusBar, FlatList, SectionList } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon2 from 'react-native-vector-icons/Feather';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import NoDataFound from '../../components/noDataFound';
import { Button, Input, Switch } from 'react-native-elements';
import { AppContext } from '../../themes/AppContextProvider';

class UpdateMemberScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMember: this?.props?.route?.params?.selectedMember,
      memberTitle: this?.props?.route?.params?.memberTitle,
      // detail: this?.props?.route?.params?.detail,
      oldMember: this?.props?.route?.params?.oldMember,
      subTabName: this?.props?.route?.params?.subTabName,
      subIndex: this?.props?.route?.params?.subIndex,
        isLoader: true,
      currentUserPage: 1,
      isUserMoreLoading: false,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getMyConnectionsList();
    // this?.props?.navigation?.setParams({
    //   // handleOpenChat: this.handleOpenChat,
    //   selectedMember: this.state.selectedMember,
    //   memberTitle: this.state.memberTitle,
    // });
    // this?.props?.navigation.setParams({
    //   handleUpdateGroup: this?.handleUpdateGroup,
    // });
  }
 refreshConnectionList = () => {
    this?.setState({ isRefreshing: true });
    setTimeout(() => {
      this?.getMyConnectionsList();
    }, 500);
  };
  initialValues = {
    title: '',
  };

  onChange(id, memberTitle, item) {
    if (!this?.state?.selectedMember?.some(val => val?.user_id === id)) {
      this.setState({
        selectedMember: [...this?.state?.selectedMember, item],
        memberTitle: '',
      });
      this?.props?.navigation?.setParams({
        selectedMember: [...this?.state?.selectedMember, item],
        memberTitle: '',
      });
    } else {
      this.setState({
        selectedMember: this?.state?.selectedMember?.filter(val => val.user_id !== id),
        memberTitle: memberTitle,
      });
      this?.props?.navigation?.setParams({
        selectedMember: this?.state?.selectedMember?.filter(val => val.user_id !== id),
        memberTitle: memberTitle,
      });
    }
  }

   getMyConnectionsList() {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { limit: 10, page: this.state.currentUserPage },
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
                this.setState({
                  isRefreshing: false,
                  isLoader: false,
                });
                if (this?.state?.currentUserPage === 1) {
                  this?.props?.saveMyConnections(resp);
                  //   this.setState({ myConnections: resp.data, newConnections: resp.data });
                  this.setState({ isMoreLoading: false });
                } else {
                  this?.props?.saveMyConnectionsLoadMore(resp);
                  this.setState({ isUserMoreLoading: false });
                  //   this.setState({ myConnections: resp.data, newConnections: resp.data });
                  this.setState({ isMoreLoading: false });
                }

                this.setState({
                  currentUserPage: this.state.currentUserPage + 1,
                });
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

  handleAddGroupMembers() {
    const userId = this?.state?.selectedMember?.map(item => item.user_id);
    try {
      const params = {
        url: API_DATA.GROUPMEMBERADD,
        data: {
          id: this?.props?.groupDetail?.id,
          user_ids: userId?.join(','),
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPMEMBERADD];

            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this?.props?.addGroupMember(this?.state?.selectedMember);
              this?.props?.navigation?.goBack();
              this.setState({ isMoreLoading: false });
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

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const newArray = this?.props && this?.props?.myConnections && this?.props?.myConnections?.data.filter(item => !this?.state?.oldMember?.some(val => val?.user_id === item?.user_id));
    const newSubArray = this?.props?.groupDetail?.members?.filter(
      item => !this?.state?.oldMember?.some(val => val?.user_id === item?.user_id),
    );
   
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{'Add Member'}</Text>
          </View>
          <TouchableOpacity
            disabled={newArray?.length === 0 || this?.state?.selectedMember?.length === 0}
            style={styles.headerRight}
            onPress={() => this?.handleAddGroupMembers()}
          >
            <Text style={styles.headerAddBtnTxt}>{'Add'}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <>
            {newArray ? (
              <>
                {newArray?.length === 0 ? (
                  <NoDataFound
                    title="No Members yet"
                    text="No Members appear here"
                    imageWidth={Responsive.getWidth(50)}
                    imageHeight={Responsive.getWidth(50)}
                    source={IMAGES.noChatImage}
                    titleColor={theme?.colors?.WHITE}
                  />
                ) : (
                  <>
                    <View>
                        <FlatList
                          refreshControl={
                        <RefreshControl
                          tintColor={theme?.colors?.WHITE}
                          refreshing={this.state.isRefreshing}
                          onRefresh={() => this.refreshConnectionList()}
                        />
                      }
                        showsHorizontalScrollIndicator={false}
                        data={newArray || []}
                        keyExtractor={(item, index) => String(index)}
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
                            <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.user_id, item.user_name, item)}>
                              <Image
                                source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                                style={[{ borderRadius: 75, width: 50, height: 50, marginRight: 20 }]}
                                resizeMode={'cover'}
                              />
                              <View style={styles.body}>
                                <Text style={styles.h6}>{item?.user_name}</Text>
                              </View>
                              <View style={[styles.right, styles.listIcon]}>
                                {this?.state?.selectedMember?.some(val => val?.user_id === item?.user_id) ? (
                                  <Image source={IMAGES.checkIcon2} style={styles.listIcon} />
                                ) : null}
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  </>
                )}
              </>
            ) : null}
          </>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupDetail: state?.groupState?.groupDetail,
    myConnections: state?.dashboardState?.myConnections,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(UpdateMemberScreen);
