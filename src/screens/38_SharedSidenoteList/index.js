import React from 'react';

import { Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES } from '@themes';

// import api functions
import { callApi } from '@apiCalls';

//import constants
import { API_DATA } from '@constants';

//import style
import { style } from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import NoDataFound from '../../components/noDataFound';
import { AppContext } from '../../themes/AppContextProvider';

class SharedSideNoteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
      isRefreshing: false,
      isEnabled: false,
      chatResp: [],
      isLoading: true,
      chatId: this?.props?.route?.params?.chatId,
    };
  }
  static contextType = AppContext;

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };
  componentDidMount() {
    this.getChatDetail();
  }

  getChatDetail = () => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: this.state.chatId,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              this.setState({ isLoading: false });

              if (resp.success) {
                this.setState({
                  chatResp: resp?.common_groups,
                });
                this.props.getChatDetail(resp?.data);
              } else {
              }
            });
          })
          .catch(err => { });
      }, 500);
    } catch (e) { }
  };

  _renderSwipeFrontItemGroup = ({ item }) => {
    const { theme } = this.context;
    const styles = style(theme);
    const selectedUser = item?.members?.filter(val => val?.user_id !== this?.props?.userData?.userInfo?.id);
    // const selectedId = selectedUser?.map(item => item?.member_id);
    return (
      <TouchableOpacity
        style={styles.sidenotRow}
        onPress={() => {
          this.props.navigation.push('CONVERSATION', {
            groupTitle: item?.title,
            groupId: item?.group_id,
            detail: item,
            // selectUser: selectedId,
            channel: item?.channel,
            chat_id: item?.chat_id,
            groupCreated: false,
            state: 'other',
          });
          this?.props?.CurrentTabName('chat');
          // item?.unread_count !== 0 ? this.getReadChat(item?.chat_id) : null;
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
          {item?.last_message ? (
            <View style={[styles.sidenotTxtRow]}>
              <Text style={[styles.sidenotLastMsg, { flex: 1 }]} numberOfLines={1}>
                {item?.last_message}
              </Text>
            </View>) : null}
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

  onRowDidOpen = (rowKey, index) => { };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
        <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
          <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{}}></SafeAreaWrapper>
        </ImageBackground>
      );
    }
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginTop: 100 }}>
          <View style={[styles.content]}>
            {this?.state?.chatResp?.length ? (
              <SwipeListView
                showsVerticalScrollIndicator={false}
                data={this?.state?.chatResp || []}
                keyExtractor={(rowData, index) => index}
                renderItem={this._renderSwipeFrontItemGroup}
                closeOnRowPress={true}
                closeOnRowBeginSwipe={true}
                closeOnRowOpen={true}
              />
            ) : (
              <NoDataFound
                title="Nothing to see"
                text="You don’t have any shared sidenote yet"
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
    groupList: state?.dashboardState?.groupList,
    chatList: state?.groupState?.chatList,
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(SharedSideNoteList);
