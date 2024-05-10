import React from 'react';

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
  Alert,
  RefreshControl,
  BackHandler,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';
import { RowItems } from '../../components/rowItems';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

// import api functions
import { callApi } from '@apiCalls';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import { Button, Card } from 'react-native-elements';
import ActionButton from 'react-native-circular-action-menu';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/AntDesign';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Validation, convertTimeStamp } from '@utils';
import NoDataFound from '../../components/noDataFound';
import { set } from 'react-native-reanimated';
import { memberExpression } from '@babel/types';
import { AppContext } from '../../themes/AppContextProvider';

class AddSidenote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
      isRefreshing: false,
      isEnabled: false,
      userData: this?.props?.route?.params?.userData,
      isLoading: true,
      chatId: this?.props?.route?.params?.chatId,
      groupData: '',
    };
  }
  static contextType = AppContext;

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };
  componentDidMount() {
    this.getGroupList();
  }

  getGroupList() {
    try {
      const params = {
        url: API_DATA.GROUPLIST,
        data: {
          // page: this.state.currentPage,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPLIST];
              this.setState({ isLoading: false });
              const selectedGroup = resp?.data?.filter(item => item?.createdBy?.id === this?.props?.userData?.userInfo?.id);

              const selectedId = selectedGroup?.filter(
                item => !item.members?.some(member => member.user_id === this.state.userData.user_id),
              );
              // this.props.saveGroupList(selectedId);
              if (resp.success) {
                this.props.saveMembersGroupList(selectedId);
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

  handleAddGroupMembers = Id => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to add this person in conversation?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          // this.setState({
          //   isBlock: !this.state.isBlock,
          // });
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.GROUPMEMBERADD,
                data: {
                  id: Id,
                  user_ids: this?.state?.userData?.user_id ? this?.state?.userData?.user_id : this.state.userData?.id,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.GROUPMEMBERADD];

                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this?.props?.addGroupMember(this?.state?.userData, Id, 'sharedSideNote');
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
          }, 1000);
        },
      },
    ]);
  };

  _renderSwipeFrontItemGroup = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);
    const selectedUser = item?.members?.filter(val => val?.user_id !== this?.props?.userData?.userInfo?.id);
    return (
      <TouchableOpacity
        style={styles.sidenotRow}
        onPress={() => {
          this.handleAddGroupMembers(item?.id);
        }}
        activeOpacity={1}
      >
        <View style={styles.sidenotStatusCol}>
          {item?.is_mute === 1 ? (
            <Icon name="notifications-off-outline" style={styles.sidenotHiddenColIcon} />
          ) : (
            <View style={styles.tinyCircle} />
          )}
        </View>
        <View style={styles.sidenotContentCol}>
          <Text style={styles.sidenotName}>{item?.title}</Text>
          <View style={styles.sidenotTxtRow}>
            <Text style={styles.sidenotCateTxt3}>
              {item?.total_members}
              {' Members'}{' '}
            </Text>
          </View>
          <View style={styles.sidenotTxtRow}>
            <Text style={[styles.sidenotLastMsg, { flex: 1 }]} numberOfLines={1}>
              {item?.last_message}
            </Text>
          </View>
        </View>
        {item?.members?.length !== 0 ? (
          <View style={styles.sidenotImgCol}>
            <Image
              source={item?.members?.[0]?.user_image ? { uri: item?.members?.[0]?.user_image } : IMAGES.sortIcon}
              style={[styles.userImg1]}
            />
            <Image
              source={item?.members?.[1]?.user_image ? { uri: item?.members?.[1]?.user_image } : IMAGES.sortIcon}
              style={styles.userImg2}
            />
            {item?.member_count > 2 ? <Text style={styles.userImgCount}>{`+${item?.member_count - 2}`}</Text> : null}
            <Image source={IMAGES.CIRCLE_GROUP} style={styles.circleGroupImg} />
          </View>
        ) : (
          <View>
            <Image source={{ uri: item?.image }} style={{ height: 50, width: 50, borderRadius: 25 }} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
           <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0 }}></SafeAreaWrapper>
    </ImageBackground>
          );
    }

    return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}> 
      <SafeAreaWrapper backgroundColor={{}}  >
        <View style={[styles.content]}>
          {this?.props?.memberGroupList?.length ? (
            <SwipeListView
              data={this?.props?.memberGroupList || []}
              keyExtractor={(rowData, index) => index}
              renderItem={this._renderSwipeFrontItemGroup}
              closeOnRowPress={true}
              closeOnRowBeginSwipe={true}
              closeOnRowOpen={true}
              contentContainerStyle={styles.swipeListView}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <NoDataFound
              title="Nothing to see"
              text="You don’t have any sidenote yet"
              titleColor={'#C8BCBC'}
              textColor={'#847D7B'}
              titleFontSize={20}
              source={IMAGES.noChatImage}
              imageWidth={205}
              imageHeight={156}
            />
          )}
        </View>
      </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    memberGroupList: state?.groupState?.memberGroupList,
    chatList: state?.groupState?.chatList,
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AddSidenote);
