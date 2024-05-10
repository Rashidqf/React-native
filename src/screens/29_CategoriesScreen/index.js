import React, { useState } from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  SafeAreaView,
  Animated,
  ImageBackground,
  Switch,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, RowItems, CategoriesDropdown } from '@components';

//import languages
import { localize } from '@languages';

import { ASYNC_KEYS, API_DATA } from '@constants';
import { callApi } from '@apiCalls';
//import style
import { style } from './style';
import Icon2 from 'react-native-vector-icons/Feather';
import { AppContext } from '../../themes/AppContextProvider';

class CategoriesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      dropdownListData: this.dropdownListData,
      dropdownListData1: this.dropdownListData1,
      groupId: this?.props?.route?.params?.groupId,
      isShowPicker: false,
      subGroupId: '',
      isLoading: true,
      memberTitle: '',
      subIndex: null,
      groupName: '',
    };
    this.onPress = this.onPress.bind(this);
  }
  static contextType = AppContext;

  dropdownListData = [
    {
      index: 0,
      listTitle: 'Rename Category',
      onPress: id => {
        this?.props?.subGroupIDData(id);
      },
    },
    { index: 1, listTitle: 'Archive Category', onPress: id => this.handleArchiveGroup(id) },
    { index: 2, listTitle: 'Make Private', onPress: id => this.handleGroupDetail(id) },
  ];
  dropdownListData1 = [
    {
      index: 0,
      listTitle: 'Rename Category',
      onPress: id => {
        this?.props?.subGroupIDData(id);
      },
    },
    { index: 1, listTitle: 'Archive Category', onPress: id => this.handleArchiveGroup(id) },
  ];
  componentDidMount() {
    this.handleGroupDetail();
  }

  onPress() {
    this.setState({ isHidden: !this.state.isHidden });
  }

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  handleArchiveGroup = id => {
    try {
      const params = {
        url: API_DATA.GROUPARCHIVE,
        data: {
          id: id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPARCHIVE];
              if (resp.success) {
                this.props.getGroupArchive(id);
                // this.getDashboardList();

                this.props.showLoading(false);

                this.props.showToast(localize('SUCCESS'), resp.message);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
                this.setState({
                  isEnabled: !this.state.isEnabled,
                });
              }
            });
          })
          .catch(err => {
            this.setState({
              isEnabled: !this.state.isEnabled,
            });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  handleGroupDetail = groupId => {
    const group_id = groupId ? groupId : this.state.groupId;
    try {
      const params = {
        url: API_DATA.GROUPDETAIL,
        data: {
          id: group_id,
        },
      };
      setTimeout(() => {
        callApi([params], this?.props?.userData?.access_token)
          .then(response => {
            this?.props?.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPDETAIL];
              this.setState({ isLoading: false });

              if (resp.success) {
                groupId
                  ? this?.props?.navigation?.navigate('PRIVATE_GROUP', {
                      selectedMember: resp.data.members,
                      memberTitle: this?.state?.memberTitle,
                      oldDetail: resp?.data,
                      subTabName: resp?.data?.title,
                      subIndex: this?.state?.subIndex,
                    })
                  : this?.props?.saveGroupDetail(resp.data);

                this?.props?.showLoading(false);
              } else {
              }
            });
          })
          .catch(err => {
            this.setState({ isLoading: false });

            this?.props?.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
        <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}></SafeAreaWrapper>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        {/* <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0) }}> */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{'Categories'}</Text>
          </View>
          <View style={styles.headerRight}></View>
        </View>

        <View style={[styles.container]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.ScrollView]} nestedScrollEnabled={false}>
            {this?.props?.groupDetail?.total_archive_subgroups !== 0 ? (
              <RowItems
                // leftIcon={'minus-circle'}
                theme={theme}
                title={'View archived'}
                titleStyle={{ color: theme?.colors?.PURPLE_500 }}
                containerStyle={[styles.rowItemsStyle]}
                onPress={() => this.props.navigation.navigate('ARCHIVED', { groupId: this?.props?.groupDetail?.id })}
              />
            ) : null}

            <FlatList
              data={this?.props?.groupDetailA?.subgroups || []}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ height: '100%' }}
              renderItem={({ item, index }) => (
                <>
                  {item.isArchive === 0 && (
                    <CategoriesDropdown
                      theme={theme}
                      title={item.title}
                      id={item.id}
                      selectedId={this?.props?.subGroupIdC}
                      onPressLabel={() => {}}
                      dropdownListData={item.is_private === 1 ? this.state.dropdownListData1 : this.state.dropdownListData}
                      onListPress={() => console.log('item?.id', item?.id)}
                      containerStyle={{ zIndex: 1 }}
                    />
                  )}
                </>
              )}
              keyExtractor={(id, index) => index.toString()}
            />
          </ScrollView>
        </View>
        {/* </SafeAreaWrapper> */}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupDetail: state?.groupState?.groupDetail,
    groupDetailA: state?.groupState?.groupDetailA,
    gpArchiveList: state.groupState.gpArchiveList,
    subGroupIdC: state.groupState.subGroupIdC,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen);
