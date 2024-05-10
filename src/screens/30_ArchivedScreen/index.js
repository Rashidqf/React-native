import React, { useState } from 'react';

import { Text, View, Alert, TouchableOpacity, FlatList } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, CategoriesDropdown } from '@components';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';
import { ASYNC_KEYS, API_DATA } from '@constants';
import { callApi } from '@apiCalls';
//import style
import { style } from './style';
import Icon2 from 'react-native-vector-icons/Feather';
import NoDataFound from '../../components/noDataFound';
import { AppContext } from '../../themes/AppContextProvider';

class ArchivedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      dropdownListData: this.dropdownListData,
      isLoading: true,
    };
    this.onPress = this.onPress.bind(this);
  }
  static contextType = AppContext;

  dropdownListData = [
    {
      index: 0,
      listTitle: 'Unarchived',
      onPress: id => (this?.props?.route?.params?.isChat === true ? this.handleUnarchiveChat(id) : this.handleUnarchiveGroup(id)),
    },
    {
      index: 1,
      listTitle: 'Delete permanently',
      onPress: id => (this?.props?.route?.params?.isChat === true ? this.handleDeleteConversation(id) : this.handleDeleteGroup(id)),
    },
  ];

  handleDeleteConversation = chatId => {
    // this.setState({ hide: false });

    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this chat?', [
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
                    this.getChatArchiveList();
                    this.props.getChatDelete(chatId, 'archive');
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

  handleDeleteGroup = groupId => {
    // this.setState({ hide: false });

    Alert.alert(localize('APP_NAME'), 'Are you sure you want to delete this group?', [
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
              url: API_DATA.GROUPDELETE,
              data: {
                id: groupId,
              },
            };
            this.props.showLoading(true);
            callApi([params], this.props.userData.access_token)
              .then(response => {
                this.props.showLoading(false).then(() => {
                  let resp = response[API_DATA.GROUPDELETE];
                  if (resp.success) {
                    // this.setState({ hide: true });

                    this.props.getGroupDelete(groupId);
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

  handleUnarchiveGroup = id => {
    try {
      const params = {
        url: API_DATA.GROUPUNARCHIVE,
        data: {
          id: id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPUNARCHIVE];
              if (resp.success) {
                this.props.getGroupUnarchive(id);

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
  componentDidMount() {
    {
      this?.props?.route?.params?.isChat === true ? this.getChatArchiveList() : this.getGroupArchiveList();
    }
  }

  onPress() {
    this.setState({ isHidden: !this.state.isHidden });
  }

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  getGroupArchiveList() {
    try {
      const params = {
        url: API_DATA.GROUPARCHIVELIST,
        data: {
          parent_id: this?.props?.route?.params?.groupId,
        },
      };
      // if (this?.state?.isRefreshing === false) {
      this.props.showLoading(true);
      // }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPARCHIVELIST];
              this.setState({ isLoading: false });

              if (resp.success) {
                this?.props?.groupArchiveList(resp.data);
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
            this.setState({ isLoading: false });

            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  getChatArchiveList() {
    try {
      const params = {
        url: API_DATA.CHATARCHIVELIST,
        data: {},
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATARCHIVELIST];
              this.setState({ isLoading: false });

              if (resp.success) {
                this?.props?.getChatArchiveList(resp.data);
                this.props.showLoading(false);
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

  handleUnarchiveChat = id => {
    try {
      const params = {
        url: API_DATA.CHATUNARCHIVE,
        data: {
          chat_id: id,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATUNARCHIVE];
              if (resp.success) {
                this.props.getChatUnarchive(id);

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

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    if (this.state.isLoading) {
      return (
        <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ marginLeft: 0, marginRight: 0 }}></SafeAreaWrapper>
      );
    }
    const archivedList = this?.props?.route?.params?.isChat === true ? this?.props?.chatArchiveList : this?.props?.gpArchiveList;
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{'Archived'}</Text>
          </View>
          <TouchableOpacity style={styles.headerRight} onPress={() => {}}>
            {/* <Text style={styles.headerAddBtnTxt}>{'Add'}</Text> */}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {archivedList?.length ? (
            <FlatList
              data={archivedList || []}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <>
                  <CategoriesDropdown
                    title={item.title}
                    id={this?.props?.route?.params?.isChat === true ? item?.chat_id : item.id}
                    dropdownListData={this.state.dropdownListData}
                    onPressLabel={() => {
                      this?.props?.route?.params?.isChat === true
                        ? item?.type === 'Group'
                          ? this.props.navigation.navigate('CONVERSATION', {
                              groupTitle: item?.title,
                              groupId: item?.group_id,
                              detail: item,
                              // selectUser: selectedId,
                              channel: item?.channel,
                              chat_id: item?.chat_id,
                              tabName: 'general',
                              tabChatId: item?.chat_id,
                              tabGroupId: item?.group_id,
                              groupCreated: false,
                              state: 'other',
                            })
                          : this.props.navigation.navigate('SINGAL_CHAT', {
                              channel: item?.channel,
                              chat_id: item?.chat_id,
                              profileDetail: item,
                              state: 'other',
                            })
                        : this.props.navigation.navigate('CONVERSATION', {
                            groupTitle: item?.title,
                            groupId: item?.group_id,
                            detail: item,
                            // selectUser: selectedId,
                            channel: item?.channel,
                            chat_id: item?.chat_id,
                            groupCreated: false,
                            state: 'other',
                            isArchived: true,
                          });
                      this?.props?.CurrentTabName('chat');
                    }}
                    onListPress={() => console.log('item?.id', item?.id)}
                    containerStyle={{ zIndex: 1 }}
                    theme={theme}
                  />
                </>
              )}
              ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
              keyExtractor={(id, index) => index.toString()}
            />
          ) : (
            <NoDataFound
              title="No archive chats or groups  yet"
              imageWidth={Responsive.getWidth(50)}
              imageHeight={Responsive.getWidth(40)}
              source={IMAGES.noChatImage}
              text="Start your first sidenote below"
              titleColor={theme?.colors?.GRAY_50}
              textColor={theme?.colors?.GRAY_100}
            />
          )}
        </View>
        {/* </SafeAreaWrapper> */}
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    gpArchiveList: state.groupState.gpArchiveList,
    chatArchiveList: state.groupState.chatArchiveList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ArchivedScreen);
