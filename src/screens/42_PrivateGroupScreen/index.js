import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView, StatusBar, FlatList, SectionList } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon2 from 'react-native-vector-icons/Feather';
import { Formik } from 'formik';
import * as Yup from 'yup';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import NoDataFound from '../../components/noDataFound';
import { Button, Input, Switch } from 'react-native-elements';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../../themes/AppContextProvider';

class PrivateGroupScreen extends React.Component {
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
      privateValue: this?.props?.route?.params?.oldDetail?.is_private,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.handleGroupDetail();
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
      this.handleRemoveMemberSub(item);

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
                this?.props?.subGroupDetails(resp.data);
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

  handleUpdateGroup() {
    const userId = this?.state?.selectedMember?.map(item => item.user_id);
    const privateGroup = this.state.privateValue ? 1 : 0;
    console.log('userId,,,', userId);
    try {
      const params = {
        url: API_DATA.GROUPSUBUPDATE,
        data: {
          id: this?.state?.oldDetail?.parent_id,
          subgroup_id: this?.state?.oldDetail?.id,
          title: this?.state?.oldDetail?.title,
          is_private: privateGroup,
          user_ids: userId?.join(','),
        },
      };
      this.props.showLoading(true);
      console.log('');
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPSUBUPDATE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.props.subGroupPrivate(this?.state?.oldDetail?.id);
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

  handleRemoveMemberSub = item => {
    try {
      const params = {
        url: API_DATA.GROUPMEMBERREMOVE,
        data: {
          // id: this?.props?.groupDetail?.subgroups?.[this?.state?.subIndex]?.id,
          id: this?.state?.oldDetail?.id,
          user_id: item?.user_id,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPMEMBERREMOVE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);

              this.props.subGroupMemberRemove(item?.member_id, this?.state?.oldDetail?.id);

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
  };

  handleToggle = value => {
    if (value !== true) {
      this.setState({ privateValue: false });
    } else {
      this.setState({ privateValue: true });
    }
    // value ? this.setState({ privateValue: false }) :
  };

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
            <Text style={styles.headerTitle}>{this.state.oldDetail.title}</Text>
          </View>
          <TouchableOpacity style={styles.headerRight} onPress={() => this?.handleUpdateGroup()}>
            <Text style={styles.headerAddBtnTxt}>{'Update'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.privateRow}>
          <View style={styles.privateColLeft}>
            <Icon4 name="lock-outline" style={[styles.privateIcon]} />
            <Text style={[styles.privateTxt]}>{'Private category'}</Text>
          </View>
          <View style={styles.privateColRight}>
            <Switch
              // trackColor={{ false: "#767577", true: "#81b0ff" }}
              // thumbColor={toggleSwitch ? "#f5dd4b" : "#f4f3f4"}
              trackColor={theme?.colors?.GRAY_800}
              // thumbColor={theme?.colors?.RED_500}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => this.handleToggle(value)}
              value={this.state.privateValue}
            />
          </View>
        </View>
        <View style={{ paddingVertical: 10 }}>
          <>
            {/* {this?.state?.groupDetail?.members.length ? ( */}
            <>
              {this?.props?.groupDetailA?.members?.length === 0 ? (
                <NoDataFound
                  title="No Members yet"
                  imageWidth={205}
                  imageHeight={156}
                  source={IMAGES.noChatImage}
                  text="No Members appear here"
                  titleColor={theme?.colors?.WHITE}
                />
              ) : (
                <>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={this.props?.groupDetailA?.members || []}
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
                            <TouchableOpacity style={[styles.right, styles.listIcon]}>
                              {this?.state?.selectedMember?.some(val => val?.user_id === item?.user_id) ? (
                                <Image source={IMAGES.checkMark} style={styles.listIcon} />
                              ) : null}
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </>
              )}
            </>
            {/* ) : null} */}
          </>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    subGroupDetails: state?.groupState?.subGroupDetails,
    groupDetailA: state?.groupState?.groupDetailA,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(PrivateGroupScreen);
