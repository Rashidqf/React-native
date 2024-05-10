import React from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';
import onShare from '../../utils/deepLinking';

import { API_DATA } from '@constants';
import NoDataFound from '../../components/noDataFound';

import { UserModal } from '@components';
import { AppContext } from '../../themes/AppContextProvider';

class BlockUserScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notiList: this?.props?.notiList,
      currentPage: 1,
      isMoreLoading: false,
      isRefreshing: false,
      isBlock: false,
      isLoading: true,
      isModalVisible: false,
      userDetails: '',
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getBlockList();
  }

  getBlockList() {
    try {
      const params = {
        url: API_DATA.BLOCKLIST,
        data: {},
      };
      if (this.state.isRefreshing === true) {
        this.props.showLoading(false);
      } else {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.BLOCKLIST];
              this.setState({ isLoading: false });

              if (resp.success) {
                this?.props?.getBlockUserList(resp?.data);
                this.setState({ isMoreLoading: false, chatResp: resp });
                this.setState({
                  isRefreshing: false,
                });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }
  handleUserBlock = connectionId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this user?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.BLOCKUSER,
                data: {
                  connection_id: connectionId,
                  is_block: this?.state?.userDetails?.is_block === 1 ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.BLOCKUSER];

                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);

                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };
  handleChatBlock = chatId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this person?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          setTimeout(() => {
            try {
              const params = {
                url: API_DATA.CHATBLOCK,
                data: {
                  chat_id: chatId,
                  is_block: this.state.isBlock === true ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.CHATBLOCK];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this.props.getChatBlock();
                      // this.getChatDetail();
                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };

  handleUserUnblock = connectionId => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to unblock this person?', [
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
                url: API_DATA.BLOCKUSER,
                data: {
                  connection_id: connectionId,
                  is_block: 0,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.BLOCKUSER];
                    if (resp.success) {
                      this.props.getUserBlock(connectionId);
                      // this.getChatDetail();
                      this.props.showLoading(false);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                      this.props.showToast(localize('SUCCESS'), resp.message);
                    } else {
                      this.props.showErrorAlert(localize('ERROR'), resp.message);
                      this.setState({
                        isBlock: !this.state.isBlock,
                      });
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                  this.setState({
                    isBlock: !this.state.isBlock,
                  });
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };

  refreshBlockUser = () => {
    this?.setState({ isRefreshing: true });
    setTimeout(() => {
      this?.getBlockList();
    }, 500);
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
      <ImageBackground source={IMAGES?.onboardingScreen} style={styles.background}>
        <SafeAreaWrapper backgroundColor={{}}>
          {this?.props?.blockUserList?.length ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  tintColor={theme?.colors?.WHITE}
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.refreshBlockUser()}
                />
              }
              data={this?.props?.blockUserList}
              keyboardShouldPersistTaps="handled"
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.contentRow, { alignItems: 'center' }]}
                  onPress={() => {
                    this.setState({ userDetails: item, isModalVisible: true });
                  }}
                >
                  <View style={styles.contactProfile}>
                    <Image source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }} style={styles.profileImage} />
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center' }}>
                    <Text style={styles.contatLabel}>{item?.user_name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.outlineRedBtn}
                    onPress={() => {
                      this.handleUserUnblock(item?.connection_id);
                    }}
                  >
                    <Text style={[styles.outlineRedBtnTxt]}>Unblock</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              // keyExtractor={item => item?.user_id
            />
          ) : (
            <NoDataFound
              title="Nothing to see"
              text="You don’t have any blocked user yet"
              titleColor={'#C8BCBC'}
              textColor={'#847D7B'}
              titleFontSize={20}
              source={IMAGES.noChatImage}
              imageWidth={205}
              imageHeight={156}
            />
          )}
          {this.state.isModalVisible && this.state.userDetails ? (
            <UserModal
              visible={this.state.isModalVisible}
              inVisible={() => this.setState({ isModalVisible: false })}
              userDetails={this.state.userDetails}
              chat_id={this.state.userDetails.chat_id}
              sendMessage={false}
              onPressSendMsg={() =>
                this?.props?.navigation?.push('SINGAL_CHAT', {
                  profileDetail: this?.state?.userDetails,
                  is_block: this?.state?.userDetails?.is_block,
                })
              }
              onPressSharedSidenote={() =>
                this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.userDetails?.chat_id })
              }
              onPressBlock={() =>
                this.state?.profileDetail?.chat_id
                  ? this.handleChatBlock(this.state?.userDetails?.chat_id)
                  : this.handleUserBlock(this.state?.userDetails?.connection_id)
              }
              onPressInvite={() => onShare(this?.props?.userData?.userInfo?.invitation_url)}
              onPressAddtoSidenote={() => this?.props?.navigation?.push('ADD_SIDENOTE', { userData: this?.state?.userDetails })}
            />
          ) : null}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    blockUserList: state?.groupState.blockUserList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(BlockUserScreen);
