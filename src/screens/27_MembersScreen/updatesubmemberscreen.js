import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView, StatusBar, FlatList, SectionList } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon2 from 'react-native-vector-icons/Feather';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

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

class UpdateSubMemberScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMember: this?.props?.route?.params?.selectedMember,
      memberTitle: this?.props?.route?.params?.memberTitle,
      // detail: this?.props?.route?.params?.detail,
      oldDetail: this?.props?.route?.params?.oldDetail,
      subTabName: this?.props?.route?.params?.subTabName,
      subIndex: this?.props?.route?.params?.subIndex,
      groupDetail: [],
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.handleGroupDetail();
    // this?.props?.navigation?.setParams({
    //   // handleOpenChat: this.handleOpenChat,
    //   selectedMember: this.state.selectedMember,
    //   memberTitle: this.state.memberTitle,
    // });
    // this?.props?.navigation.setParams({
    //   handleUpdateGroup: this?.handleUpdateGroup,
    // });
  }

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

  handleGroupDetail = () => {
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          // id: this.state.groupId,
          id: this?.state?.oldDetail?.parent_id,
        },
      };
      this?.props?.showLoading(true);
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              if (resp.success) {
                // this?.props?.saveGroupDetail(resp.data);
                this?.setState({
                  groupDetail: resp?.data,
                });
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

  handleAddGroupMembers() {
    const userId = this?.state?.selectedMember?.map(item => item.user_id);
    try {
      const params = {
        url: API_DATA.GROUPMEMBERADD,
        data: {
          id: this?.state?.oldDetail?.id,
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

  handleUpdateGroup() {
    const userId = this?.state?.selectedMember?.map(item => item.user_id);
    try {
      const params = {
        url: API_DATA.GROUPSUBUPDATE,
        data: {
          id: this?.state?.oldDetail?.parent_id,
          subgroup_id: this?.state?.oldDetail?.id,
          title: this?.state?.oldDetail?.title,
          is_private: this?.state?.oldDetail?.is_private,
          user_ids: userId?.join(','),
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPSUBUPDATE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);

              this?.props?.saveGroupSubUpdate(this?.state?.selectedMember);
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
    const newArray = this?.state?.groupDetail?.members?.filter(
      item => !this?.state?.oldDetail?.members?.some(val => val?.user_id === item?.user_id),
    );

    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{'Member'}</Text>
          </View>
          <TouchableOpacity style={styles.headerRight} onPress={() => this?.handleAddGroupMembers()}>
            {newArray?.length !== 0 ? <Text style={styles.headerAddBtnTxt}>{'Add'}</Text> : null}
          </TouchableOpacity>
        </View>
        <View style={{ paddingVertical: 10, flex: 1 }}>
          <View style={{ flex: 1 }}>
            {newArray ? (
              <View style={{ flex: 1 }}>
                {newArray?.length === 0 ? (
                  <View style={{ flex: 1 }}>
                    <NoDataFound
                      title="No Members yet"
                      text="No Members appear here"
                      imageWidth={Responsive.getWidth(50)}
                      imageHeight={Responsive.getWidth(50)}
                      source={IMAGES.noChatImage}
                      titleColor={theme?.colors?.WHITE}
                    />
                  </View>
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={newArray || []}
                    keyExtractor={(item, index) => String(index)}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <TouchableOpacity style={styles.listItem} onPress={() => this.onChange(item.user_id, item.user_name, item)}>
                            <Image
                              source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                              style={[
                                COMMON_STYLE.headerIcon,
                                { ...COMMON_STYLE.imageStyle(17), borderRadius: 50, width: 50, height: 50, marginRight: 20 },
                              ]}
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
                        </View>
                      );
                    }}
                  />
                )}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    // groupDetail: state?.groupState?.groupDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(UpdateSubMemberScreen);
