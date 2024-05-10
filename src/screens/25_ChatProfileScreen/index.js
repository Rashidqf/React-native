import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import RowItems from '../../components/rowItems/rowItems';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { AppContext } from '../../themes/AppContextProvider';

class ChatProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
      subTabName: this?.props?.route?.params?.subTabName,
      isEnabled: false,
      isBlock: false,
      subIndex: this?.props?.route?.params?.subIndex,
      chatId: this?.props?.route?.params?.chatId,
      isShowPicker: false,
      profile: '',
      groupId: this?.props?.route?.params?.groupId,
      groupDetaildata: '',
      privateChat: this?.props?.route?.params?.privateChat,
      privateUserName: this?.props?.route?.params?.userName,
      userImage: this?.props?.route?.params?.userImage,
      groupTitle: this?.props?.route?.params?.groupTitle,
      groupName: '',
      isEdit: false,
      listState: this?.props?.route?.params?.state,
      chatDetail: '',
      isLoader: true,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getChatDetail();
    {
      this.state.privateChat !== true && this.handleGroupDetail();
    }
  }
  getChatList() {
    try {
      const params = {
        url: API_DATA.CHATLIST,
        data: {
          // page: this.state.currentPage,
        },
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.CHATLIST];
            if (resp.success) {
              this?.props?.newChatList({ ...resp?.data, archive_count: resp?.archive_count });
              this.setState({ isMoreLoading: false });
              this.setState({
                isRefreshing: false,
              });
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

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };
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
                this.setState({ groupDetaildata: resp.data });
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

  getChatDetail = () => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: this?.state?.chatId,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.CHATDETAIL];
            if (resp.success) {
              this?.setState({
                isLoader: false,
              });
              this.props.getChatDetail(resp?.data);
              this.setState({
                chatDetail: resp,
                isEnabled: this?.props?.chatDetail?.is_mute === 1 ? true : false,
                isBlock: this?.props?.chatDetail?.is_block === 1 ? true : false,
              });
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
  };

  getDashboardList() {
    try {
      const params = {
        url: API_DATA.DASHBOARD,
        data: {},
      };
      if (this?.state?.isRefreshing === false) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.DASHBOARD];
              if (resp.success) {
                this.props.saveDashboard(resp.data, resp.total_task_count, resp.total_chat_count);
                this.props.showLoading(false);
                this.setState({
                  isRefreshing: false,
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

  handleGroupLeave = () => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to leave this group?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.GROUPLEAVE,
              data: {
                id: this?.props?.groupDetail?.id,
                user_id: this?.props?.userData?.userInfo?.id,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.GROUPLEAVE];
                  if (resp.success) {
                    this.getDashboardList();
                    this.getChatList();
                    this.props.showToast(localize('SUCCESS'), resp.message);
                    if (this?.state?.subTabName === 'general') {
                      this?.props?.navigation?.pop(2);
                    } else {
                      this?.props?.navigation?.pop(2);
                    }
                    this.props.groupLeave(this?.props?.userData?.userInfo?.id, this?.state?.chatId);
                    this.props.showLoading(false);
                  } else {
                    this.props.showErrorAlert(localize('ERROR'), resp.message);
                  }
                });
              })
              .catch(err => {
                this.props.showLoading(false);
              });
          } catch (e) {}
        },
      },
    ]);
  };

  handleClearConversation = item => {
    Alert.alert(localize('APP_NAME'), 'Are you sure you want to clear this conversation?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.CHATCLEAR,
              data: {
                chat_id: this?.state?.chatId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.CHATCLEAR];
                  if (resp.success) {
                    this.getChatList();
                    this.getDashboardList();
                    this.props.getChatClear(this?.state?.chatId);
                    this.props.showLoading(false);
                    this.props.showToast(localize('SUCCESS'), resp.message);
                    this?.props?.navigation?.goBack();
                  } else {
                    this.props.showErrorAlert(localize('ERROR'), resp.message);
                  }
                });
              })
              .catch(err => {
                this.props.showLoading(false);
              });
          } catch (e) {}
        },
      },
    ]);
  };

  toggleSwitch = () => {
    this.setState({
      isEnabled: !this.state.isEnabled,
    });
    try {
      const params = {
        url: API_DATA.CHATMUTE,
        data: {
          chat_id: this?.state?.chatId,
          is_mute: this.state.isEnabled === true ? 0 : 1,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.CHATMUTE];
            if (resp.success) {
              this.props.getChatMute();
              this.props.showLoading(false);
              // this.setState({
              //   isEnabled: !this.state.isEnabled,
              // });
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
    } catch (e) {}
  };

  handleArchiveChat = () => {
    try {
      const params = {
        url: API_DATA.CHATARCHIVE,
        data: {
          chat_id: this?.state?.chatId,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.CHATARCHIVE];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.getChatList();
              this.props.getChatArchive(this?.state?.chatId, this.state.listState);

              this.props.showLoading(false);
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
    } catch (e) {}
  };

  handleChackBlock = () => {
    Alert.alert(localize('APP_NAME'), 'Are you sure want to block this conversation?', [
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
                url: API_DATA.CHATBLOCK,
                data: {
                  chat_id: this?.state?.chatId,
                  is_block: this.state.isBlock === true ? 0 : 1,
                },
              };
              this.props.showLoading(true);
              callApi([params], this.props.userData.access_token)
                .then(response => {
                  this.props.showLoading(false).then(() => {
                    let resp = response[API_DATA.CHATBLOCK];
                    if (resp.success) {
                      this.props.getChatBlock();
                      this.getChatDetail();
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

  updateGroupProfile = () => {
    // console.log('group id ====>', this.state.groupId);
    this.setState({ isEdit: false });
    try {
      const params = {
        url: API_DATA.GROUPPROFILEUPDATE,
        data: {
          id: this?.state?.groupId,
          image: this.state.profile !== '' && this.state.profile,
          title:
            this?.state.groupName === ''
              ? this?.state?.subTabName === 'general'
                ? this?.state?.groupTitle
                : this?.state?.subTabName
              : this.state.groupName,
        },
      };

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPPROFILEUPDATE];
            this.handleGroupDetail();
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);

              this.props.getGroupProfileUpdate(resp.data);
              // this.getChatList();
              this.props.showLoading(false);
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(err => {
          this.props.showLoading(false);
        });
    } catch (e) {}
  };

  _renderPickerPopup() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={this.state.isShowPicker}>
        <TouchableWithoutFeedback onPress={() => this.setState({ isShowPicker: false })}>
          <SafeAreaView style={styles.safeAreaStyle}>
            <View style={styles.alertBoxStyle}>
              <Button
                buttonStyle={styles.closeButtonStyle}
                icon={<Image style={styles.closeIconStyle} source={IMAGES.close} />}
                onPress={() => this.setState({ isShowPicker: false })}
              />
              <Text numberOfLines={2} style={styles.alertTitleStyle}>
                {'Change Group Picture'}
              </Text>
              <Text style={styles.descriptionStyle}>{'Select photo to upload group picture.'}</Text>
              <View style={styles.profileBtnViewStyle}>
                {this._renderBotton(localize('CAMERA'), () => this.openImagePicker('camera'))}
                {this._renderBotton(localize('GALLERY'), () => this.openImagePicker('gallery'))}
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
  _renderBotton(title, onPress, color) {
    const { theme } = this.context;
    const styles = style(theme);
    return <Button type="clear" title={title} buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={onPress} />;
  }
  openImagePicker(type) {
    this.setState({ isShowPicker: false }, () => {
      setTimeout(() => {
        const configOption = {
          width: 600,
          height: 600,
          compressImageMaxWidth: 600,
          compressImageMaxHeight: 600,
          //   cropping: Platform.OS === 'ios' ? true : true,
          compressImageQuality: 0.8,
        };
        if (type == 'camera') {
          ImagePicker.openCamera(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        } else {
          ImagePicker.openPicker(configOption)
            .then(image => this.handleImageResponce(image))
            .catch(error => this.handlePickerError(error));
        }
      }, 1000);
    });
  }
  handleImageResponce(image) {
    this.setState({
      profilePic: image.path,
      profile: {
        uri: image.path,
        type: image.mime,
        name: image.path.split('/').pop(),
      },
    });
    this.updateGroupProfile();
  }

  handlePickerError(error) {
    if (error.code === 'E_PICKER_NO_CAMERA_PERMISSION') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('CAMERA_PERMISSION'),
      });
    } else if (error.code === 'E_PERMISSION_MISSING') {
      this.setState({
        isShowAlert: true,
        alertMsg: Localize('GALLERY_PERMISSION'),
      });
    }
  }

  handleDeleteConversation = chatId => {
    // this.setState({ hide: false });

    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this conversation?', [
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          try {
            const params = {
              url: API_DATA.CHATDELETE,
              data: {
                chat_id: chatId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.CHATDELETE];
                  if (resp.success) {
                    // this.setState({ hide: true });
                    this.getDashboardList();
                    this.props.navigation.navigate('TAB_NAVIGATOR');

                    this.props.getChatDelete(chatId);
                    this.props.showLoading(false);
                    this.props.showToast(localize('SUCCESS'), resp.message);
                  } else {
                    this.props.showErrorAlert(localize('ERROR'), resp.message);
                  }
                });
              })
              .catch(err => {
                this.props.showLoading(false);
              });
          } catch (e) {}
        },
      },
    ]);
  };

  handleUnarchiveChat = () => {
    try {
      const params = {
        url: API_DATA.CHATUNARCHIVE,
        data: {
          chat_id: this?.state?.chatId,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.CHATUNARCHIVE];
            if (resp.success) {
              this.props.getChatUnarchive(this?.state?.chatId, this.state.listState);

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
    } catch (e) {}
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const chatDetail = this?.props?.chatDetail;
    const otherUserData =
      this?.props?.groupDetail?.total_members === 2 &&
      this?.props?.groupDetail?.members?.find(item => item?.user_id !== this?.props?.userData?.userInfo?.id);
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        {this?.state?.isLoader === false ? (
          <>
            {/* <SafeAreaWrapper backgroundColor={COLORS.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0), }}> */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
                <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
              </TouchableOpacity>
              <View style={styles.headerCenter}></View>
              {this.state.isEdit === true ? (
                <TouchableOpacity
                  style={styles.headerRight}
                  onPress={() => {
                    Keyboard.dismiss(), this.updateGroupProfile();
                  }}
                >
                  <Text style={styles.headerAddBtnTxt}>{'Done'}</Text>
                </TouchableOpacity>
              ) : this?.props?.userData?.userInfo?.id === chatDetail?.admin?.id || chatDetail?.member_count === 2 ? (
                <TouchableOpacity style={styles.headerRight} onPress={() => this.setState({ isEdit: true })}>
                  <Text style={styles.headerAddBtnTxt}>{'Edit'}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollView}>
              <View style={styles.container}>
                <View style={styles.profileView}>
                  {this.state.privateChat !== true ? (
                    <TouchableOpacity
                      style={styles.profileWrap}
                      onPress={() =>
                        this?.props?.userData?.userInfo?.id === this?.props?.groupDetail?.createdBy?.id ||
                        this?.props?.groupDetail?.total_members === 2
                          ? this.setState({ isShowPicker: true })
                          : null
                      }
                    >
                      {otherUserData ? (
                        <Image
                          source={otherUserData?.user_image ? { uri: otherUserData?.user_image } : IMAGES.sortIcon}
                          style={styles.profileImg}
                        />
                      ) : (
                        <Image
                          source={this.props?.groupDetail?.image ? { uri: this.props?.groupDetail?.image } : IMAGES.sortIcon}
                          style={styles.profileImg}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.profileWrap} onPress={() => {}}>
                      <Image source={this.state?.userImage ? { uri: this.state?.userImage } : IMAGES.sortIcon} style={styles.profileImg} />
                    </TouchableOpacity>
                  )}
                  {this.state.privateChat !== true ? (
                    <View style={{ flexDirection: 'row' }}>
                      {this.state.isEdit === true ? (
                        <TouchableOpacity style={styles.userName}>
                          <TextInput
                            placeholder={this?.state?.subTabName === 'general' ? this?.state?.groupTitle : this?.state?.subTabName}
                            value={this.state.groupName}
                            style={[styles.userName, { textAlign: 'right' }]}
                            placeholderTextColor={theme?.colors?.WHITE}
                            onChangeText={text => this.setState({ groupName: text })}
                            autoFocus
                            editable={this.state.isEdit === true ? true : false}
                          />
                        </TouchableOpacity>
                      ) : otherUserData ? (
                        <Text style={styles.userName}>{otherUserData?.user_name}</Text>
                      ) : (
                        <Text style={styles.userName}>
                          {this?.state.groupName === ''
                            ? this?.state?.subTabName === 'general'
                              ? this?.state?.groupTitle
                              : this?.state?.subTabName
                            : this.state.groupName}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.userName}>{this?.state?.privateUserName}</Text>
                  )}
                  {otherUserData ? <Text style={styles.groupName}>{`${chatDetail?.title}`}</Text> : null}
                  {this.state.privateChat === true ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        this.props?.navigation?.goBack();
                      }}
                    >
                      <Text style={styles.buttonText}>{'Send Messages'}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchTxt}>{'Mute Conversation'}</Text>
                  <Switch
                    // trackColor={{ false: '#767577', true: '#81b0ff' }}
                    // thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={this.toggleSwitch}
                    value={this?.state?.isEnabled}
                    // value={this.state.isEnabled}
                  />
                </View>
                {this.state.privateChat !== true ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'users'}
                    title={
                      this?.state?.subTabName === 'general'
                        ? `${this?.props?.groupDetail?.members?.length} Members`
                        : `${this?.props?.groupDetail?.members?.length} Members`
                      // : `${this?.props?.groupDetail?.subgroups?.[this?.state?.subIndex]?.members?.length} Members`
                    }
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() =>
                      this?.props?.navigation?.navigate('MEMBERS', {
                        subTabName: this?.state?.subTabName,
                        subIndex: this?.state?.subIndex,
                        removeMember: false,
                        groupId: this?.state?.groupId,
                      })
                    }
                  />
                ) : null}
                {this._renderPickerPopup()}
                {this.state.privateChat === true &&
                this.state.chatDetail?.common_groups_count !== 0 &&
                this.state.chatDetail?.common_groups_count !== undefined ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'users'}
                    title={`${
                      this.state.chatDetail?.common_groups_count !== undefined && this.state.chatDetail?.common_groups_count
                    } Shared Sidenotes`}
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                      this?.props?.navigation?.push('SHARED_SIDENOTE_LIST', { chatId: this.state.chatDetail?.data?.chat_id });
                    }}
                  />
                ) : null}

                <RowItems
                  theme={theme}
                  leftIcon={'image'}
                  title={'Image Gallery'}
                  containerStyle={[styles.RowItemsStyle]}
                  onPress={() => this.props.navigation.navigate('IMAGE_GALLERY', { chatId: this.state.chatId })}
                />
                {this?.props?.groupDetail?.subgroups?.length !== 0 && this.state.privateChat !== true ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'hash'}
                    title={`${this?.props?.groupDetail?.subgroups?.length} Categories`}
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() =>
                      this.props.navigation.navigate('CATEGORIES', {
                        groupId: this.state.groupId,
                      })
                    }
                  />
                ) : null}
                <RowItems
                  theme={theme}
                  leftIcon={'image'}
                  title={'Poll'}
                  containerStyle={[styles.RowItemsStyle, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    this.props.navigation.push('CONVERSATION', {
                      // tabTopName: 'polls',
                      groupId: this.state.groupId,
                      groupTitle: this.state.groupTitle,
                      channel: this.state.chatDetail.channel,
                      chat_id: this.state.chatId,
                    });
                    this?.props?.CurrentTabName('polls');
                  }}
                />

                <Text style={styles.rowItemsTitle}>{'Privacy and Support'}</Text>
                {this?.props?.groupDetail?.members[0].user_id === this?.props?.userData?.userInfo?.id ||
                this?.props?.groupDetail?.members?.length === 2 ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'minus-circle'}
                    title={'Remove a member'}
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() =>
                      this?.props?.navigation?.navigate('MEMBERS', {
                        subTabName: this?.state?.subTabName,
                        subIndex: this?.state?.subIndex,
                        removeMember: true,
                        groupId: this?.state?.groupId,
                      })
                    }
                  />
                ) : null}
                {this.state.privateChat !== true ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'minus-circle'}
                    title={'Leave Group'}
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() =>
                      chatDetail?.admin.id === this.props.userData.userInfo.id || chatDetail?.members?.length === 2
                        ? this.handleDeleteConversation(chatDetail?.chat_id)
                        : this.handleGroupLeave()
                    }
                  />
                ) : null}
                {this?.props?.groupDetail?.members[0].user_id === this?.props?.userData?.userInfo?.id ||
                this.state.privateChat === true ||
                this?.props?.groupDetail?.members?.length === 2 ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'slash'}
                    title={`${this?.state?.isBlock === true ? 'Unblock a Chat' : 'Block a Chat'}`}
                    containerStyle={[styles.RowItemsStyle]}
                    onPress={() => this.handleChackBlock()}
                  />
                ) : null}
                <RowItems
                  theme={theme}
                  leftIcon={'trash'}
                  title={'Clear Conversation'}
                  containerStyle={[styles.RowItemsStyle]}
                  onPress={() => this.handleClearConversation()}
                  rightIconStyle={{ opacity: 0 }}
                />
                {this?.state?.subTabName === 'general' || this?.state?.privateChat === true ? (
                  <RowItems
                    theme={theme}
                    leftIcon={'folder'}
                    title={chatDetail?.is_archive === 1 ? 'Unarchive Chat' : 'Archive Chat'}
                    containerStyle={[styles.RowItemsStyle, { borderBottomWidth: 0 }]}
                    onPress={() => (chatDetail?.is_archive === 1 ? this.handleUnarchiveChat() : this.handleArchiveChat())}
                    rightIconStyle={{ opacity: 0 }}
                  />
                ) : null}
              </View>
            </ScrollView>
          </>
        ) : null}
        {/* </SafeAreaWrapper> */}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state?.redState?.userData,
    groupDetail: state?.groupState?.groupDetail,
    chatList: state?.groupState?.chatList,
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatProfileScreen);
