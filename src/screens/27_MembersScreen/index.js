import React, { useState } from 'react';

import { Image, Text, View, TouchableOpacity, SafeAreaView, Alert, Modal, FlatList, Share } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import Icon2 from 'react-native-vector-icons/Feather';
import { UserModal } from '@components';
import onShare from '../../utils/deepLinking';
import { AppContext } from '../../themes/AppContextProvider';

class MembersScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: this?.props?.route?.params?.detail,
      subTabName: this?.props?.route?.params?.subTabName,
      subIndex: this?.props?.route?.params?.subIndex,
      removeMember: this?.props?.route?.params?.removeMember,
      groupId: this?.props?.route?.params?.groupId,
      modalVisible: false,
      profileDetails: '',
      profileModal: false,
      selectedMember: [],
      memberTitle: '',
      isLoader: true,
      isBlock: false,
editModerator:false 
      // members: this?.props?.route?.params?.detail?.members?.filter(item => item?.user_id !== this?.props?.userData?.userInfo?.id),
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.handleGroupDetail();
  }
  componentWillUnmount() {
    this.handleGroupDetail();
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
                this.setState({ isLoader: false, groupDetaildata: resp.data });
                this?.props?.saveGroupDetail(resp.data);
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

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  handleRemoveMember = item => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to remove this member?', [
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.GROUPMEMBERREMOVE,
              data: {
                id: this?.props?.groupDetail?.id,
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

                    this.props.groupMemberRemove(item?.member_id, item?.id, false);
                    this.setState({
                      detail: {
                        ...this?.props?.route?.params?.detail,
                        members: this?.props?.route?.params?.detail?.members?.filter(val => val?.member_id !== item?.member_id),
                      },
                    });
                    this.handleGroupDetail();
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
        },
      },
    ]);
  };
  handleRemoveMemberSub = item => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to remove this member?', [
      {
        text: 'No',
        onPress: () => {
          console.log('No Pressed');
        },
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.GROUPMEMBERREMOVE,
              data: {
                // id: this?.props?.groupDetail?.subgroups?.[this?.state?.subIndex]?.id,
                id: this?.props?.groupDetail?.id,
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
                    this.handleGroupDetail();

                    this.props.subGroupMemberRemove(item?.member_id, this?.props?.groupDetail?.subgroups?.[this?.state?.subIndex]?.id);
                    // this.setState({
                    //   detail: {
                    //     ...this?.props?.route?.params?.detail,
                    //     members: this?.props?.route?.params?.detail?.members?.filter(val => val?.member_id !== item?.member_id),
                    //   },
                    // });
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
        },
      },
    ]);
  };

  shareLink = async () => {
    const result = await Share.share({
      message: 'Please join me on Sidenote. \n \n' + this?.props?.userData?.userInfo?.invitation_url,
      url: this?.props?.userData?.userInfo?.invitation_url,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        this.setState({
          modalVisible: false,
        });
      } else {
        this.setState({
          modalVisible: false,
        });
      }
    } else if (result.action === Share.dismissedAction) {
      this.setState({
        modalVisible: false,
      });
    }
  };
  _renderMembersItem = ({ item, index }) => {
    const { theme } = this.context;
    const styles = style(theme);
    console.log("item ====>", item)
    return (
      <View style={styles.memberCol}>
        <TouchableOpacity
          style={styles.memberImgWrap}
          onPress={() =>
           { this.setState({
              modalVisible: this?.state?.editModerator ? false: true,
              profileDetails: {
                name: item?.user_name,
                phone: item?.user_phone,
                image:item?.user_image,
                channel: item?.channel,
                chat_id: item?.chat_id,
                connection_id: item?.connection_id,
                is_moderator: item?.is_moderator,
                user_id: item?.user_id,
                group_id: item?.group_id,
                member_id: item?.member_id,
            
              },
           }),
          this.state.editModerator && this.addModerator(item)
          }
            
          }
        >
          <Image
            source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
            style={[styles.memberImg, { borderRadius: 50 }]}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        <Text style={styles.memberName}>{item.user_name}</Text>
        <TouchableOpacity
          disabled={index === 0 || item?.user_id === this?.props?.userData?.userInfo?.id}
          onPress={() => this?.state?.editModerator ? this?.addModerator(item): this.handleRemoveMember(item)}
        >
          {index == 0 ? (
            <Text style={styles.linkTxt}>Admin</Text>
          ) : this?.state?.removeMember ? (
            <Text style={styles.linkTxt2}>Remove</Text>
          ) : item?.is_moderator === 1 ? (
            <Text style={styles.linkTxt2}>
            {this?.state?.editModerator ? "Remove" : "Moderator"}
              {item?.user_id === this?.props?.userData?.userInfo?.id ? ' (You)' : null}
            </Text>
          ) : item?.user_id === this?.props?.userData?.userInfo?.id ? (
            <Text style={styles.linkTxt2}>You</Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };
  _renderSubMembersItem = ({ item, index }) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <View style={styles.memberCol}>
        <TouchableOpacity
          style={styles.memberImgWrap}
          onPress={() =>
            this.setState({
              modalVisible: this?.state?.editModerator ? false : true,
              profileDetails: {
                 name: item?.user_name,
                phone: item?.user_phone,
                image:item?.user_image,
                channel: item?.channel,
                chat_id: item?.chat_id,
                connection_id: item?.connection_id,
                is_moderator: item?.is_moderator,
                user_id: item?.user_id,
                group_id: item?.group_id,
                member_id: item?.member_id,
              },
            })
          }
        >
          <Image
            source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
            style={[styles.memberImg, { borderRadius: 50 }]}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        <Text style={styles.memberName}>{item?.user_name}</Text>
        <TouchableOpacity
          disabled={index === 0 || item?.user_id === this?.props?.userData?.userInfo?.id}
          onPress={() => this?.state?.editModerator ? this?.addModerator(item) : this.handleRemoveMemberSub(item)}
        >
          {index == 0 ? (
            <Text style={styles.linkTxt}>Admin</Text>
          ) : this?.state?.removeMember ? (
            <Text style={styles.linkTxt2}>Remove</Text>
          ) : item?.is_moderator === 1 ? (
            <Text style={styles.linkTxt2}>
                 {this?.state?.editModerator ? "Remove" : "Moderator"}
              {item?.user_id === this?.props?.userData?.userInfo?.id ? ' (You)' : null}
            </Text>
          ) : item?.user_id === this?.props?.userData?.userInfo?.id ? (
            <Text style={styles.linkTxt2}>You</Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

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
                  is_block: this?.state?.profileDetail?.is_block === 1 ? 0 : 1,
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
                      this.props.showLoading(false);
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };
  addModerator = item => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to make or remove this person moderator?', [
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
                url: API_DATA.GROUPMODERATOR,
                data: {
                  group_id: this.state.groupId,
                  user_id: item?.user_id,
                  is_moderator: item?.is_moderator === 1 ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.GROUPMODERATOR];
                    if (resp.success) {
                      this.props.showToast(localize('SUCCESS'), resp.message);
                      this.props.addGroupModerator(item?.user_id);
                      this.props.showLoading(false);
                    } else {
                      // this.props.showErrorAlert(localize('ERROR'), resp.message);
                    }
                  });
                })
                .catch(err => {
                  this.props.showLoading(false);
                });
            } catch (e) {}
          }, 1000);
        },
      },
    ]);
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        {this?.state?.isLoader === false ? (
          <>
            {/* <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0), }}> */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
                <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{'Members'}</Text>
              </View>
              {this?.props?.groupDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ||
              this?.props?.groupDetail?.members?.length === 2 ? (
                <View>
                  {/* {this?.state?.subTabName === 'general' ? ( */}
                  <TouchableOpacity
                    style={styles.headerRight}
                    onPress={() => {
                      if (this?.state?.subTabName === 'general') {
                        this?.props?.navigation?.navigate('UPDATE_MEMBER', {
                          selectedMember: this?.state?.selectedMember,
                          memberTitle: this?.state?.memberTitle,
                          oldMember: this?.props?.groupDetail?.members,
                          subTabName: this?.state?.subTabName,
                          subIndex: this?.state?.subIndex,
                        });
                      } else {
                        this?.props?.navigation?.navigate('UPDATE_SUB_MEMBER', {
                          selectedMember: this?.state?.selectedMember,
                          memberTitle: this?.state?.memberTitle,
                          oldDetail: this?.props?.groupDetail,
                          subTabName: this?.state?.subTabName,
                          subIndex: this?.state?.subIndex,
                        });
                      }
                    }}
                  >
                    {this?.props?.route?.params?.removeMember === true ? null : <Text style={styles.headerAddBtnTxt}>{'Add'}</Text>}
                  </TouchableOpacity>
                  {/* ) : null} */}
                </View>
              ) : (
                this?.props?.groupDetail?.members?.map(val =>
                  val?.user_id === this?.props?.userData?.userInfo?.id && val?.is_moderator === 1 ? (
                    <TouchableOpacity
                      style={styles.headerRight}
                      onPress={() => {
                        if (this?.state?.subTabName === 'general') {
                          this?.props?.navigation?.navigate('UPDATE_MEMBER', {
                            selectedMember: this?.state?.selectedMember,
                            memberTitle: this?.state?.memberTitle,
                            oldMember: this?.props?.groupDetail?.members,
                            subTabName: this?.state?.subTabName,
                            subIndex: this?.state?.subIndex,
                          });
                        } else {
                          this?.props?.navigation?.navigate('UPDATE_SUB_MEMBER', {
                            selectedMember: this?.state?.selectedMember,
                            memberTitle: this?.state?.memberTitle,
                            oldDetail: this?.props?.groupDetail,
                            subTabName: this?.state?.subTabName,
                            subIndex: this?.state?.subIndex,
                          });
                        }
                      }}
                    >
                      {this?.props?.route?.params?.removeMember === true ? null : <Text style={styles.headerAddBtnTxt}>{'Add'}</Text>}
                    </TouchableOpacity>
                  ) : null,
                )
              )}
            </View>
            <View style={styles.container}>
              {this.state.subTabName === 'general' ? (
                <FlatList
                  data={this?.props?.groupDetail?.members}
                  renderItem={this._renderMembersItem}
                  //horizontal={true}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={this?.props?.groupDetail?.members || []}
                  // data={this?.props?.groupDetail?.subgroups?.[this?.state?.subIndex].members || []}
                  renderItem={this._renderSubMembersItem}
                  //horizontal={true}
                  keyExtractor={item => item.id}
                  contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
              {

              }
            </View>
            {/* </SafeAreaWrapper> */}
            
            {this.state.modalVisible && this.state.profileDetails ? (
              <UserModal
                visible={this.state.modalVisible}
                inVisible={() => this.setState({ modalVisible: false })}
                userDetails={this.state.profileDetails}
                chat_id={this.state.profileDetails.chat_id}
                isFromGroup={this?.props?.groupDetail?.createdBy?.id === this?.props?.userData?.userInfo?.id ? true : false}
                sendMessage={false}
                onPressSendMsg={() =>
                  this?.props?.navigation?.push('SINGAL_CHAT', {
                    profileDetail: this?.state?.profileDetails,
                    is_block: this?.state?.profileDetails?.is_block,
                  })
                }
                onPressModerator={() => this.addModerator(this?.state?.profileDetails)}
                onPressSharedSidenote={() =>
                  this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.profileDetails?.chat_id })
                }
                onPressBlock={() =>
                  this.state?.profileDetails?.chat_id
                    ? this.handleChatBlock(this.state?.profileDetails?.chat_id)
                    : this.handleUserBlock(this.state?.profileDetails?.connection_id)
                }
                onPressInvite={() => {
                  this.shareLink();
                }}
                onPressAddtoSidenote={() => this?.props?.navigation?.navigate('ADD_SIDENOTE', { userData: this?.state?.profileDetails })}
              />
            ) : null}

            {/* <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({
                  modalVisible: !this.state.modalVisible,
                });
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => this.setState({ profileModal: true, modalVisible: false })}>
                    <Text style={styles.modalText}>View Profile</Text>
                  </TouchableOpacity>
                  <View style={styles.cellSeprator} />

                  {this.state.profileDetails.user_id !== this?.props?.userData?.userInfo?.id ? (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('SINGAL_CHAT', {
                          profileDetail: this.state.profileDetails,
                          fromChatProfile: true,
                        }),
                          this.setState({
                            modalVisible: false,
                          });
                      }}
                    >
                      <Text style={styles.modalText}>Send Message</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={[styles.modalView, { marginTop: 15 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        modalVisible: false,
                      })
                    }
                  >
                    <Text style={[styles.modalButtonText, { marginTop: 0, color: theme?.colors?.ERROR }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal> */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.profileModal}
              onRequestClose={() => {
                this.setState({
                  profileModal: false,
                });
              }}
            >
              <View style={styles.listModal}>
                <SafeAreaView style={styles.SafeAreaView}>
                  <View>
                    <TouchableOpacity
                      style={{
                        tintColor: theme?.colors?.WHITE,
                        flexDirection: 'row',
                      }}
                      onPress={() => this.setState({ profileModal: !this.state.profileModal })}
                    >
                      <Image source={IMAGES.backArrow} style={[COMMON_STYLE.imageStyle(4), { marginTop: 24, marginLeft: 20 }]} />
                      <Text style={{ color: theme?.colors?.WHITE, fontWeight: '500', padding: 20, fontSize: 16 }}>
                        {this.state?.profileDetails.user_name}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: Responsive.getWidth(40),
                      }}
                    >
                      <Image
                        source={{ uri: this?.state?.profileDetails?.user_image }}
                        style={{
                          width: Responsive.getWidth(100),
                          height: Responsive.getHeight(50),
                          justifyContent: 'center',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </View>
                </SafeAreaView>
              </View>
            </Modal>
          </>
        ) : null}
        {
          this?.state?.removeMember ? 
            null :
            <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => {
                          this.setState({
                           editModerator:!this?.state?.editModerator
                         })
                        }}
                      >
                        <Text style={[styles.btnTitle, { marginTop: 10 }]}>{!this?.state?.editModerator ? "Edit Moderator" : "Done"}</Text>
                      </TouchableOpacity>
        }
          
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    groupDetail: state?.groupState?.groupDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(MembersScreen);
