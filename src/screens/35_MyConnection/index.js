import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Platform,
  PermissionsAndroid,
  Modal,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import Contacts from 'react-native-contacts';
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import { FlingGestureHandler, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import RowItems from '../../components/rowItems/rowItems';
import _ from 'lodash';
import { AppContext } from '../../themes/AppContextProvider';
const header = styles => {
  return (
    <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.setState({ search: !this.state.search })}>
      <Icon name="search" style={styles.sidenotHiddenColIcon} />
    </TouchableOpacity>
  );
};
class MyConnection extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.setState({ search: !this.state.search })}>
            <Icon name="search" size={18} color={theme?.colors?.GRAY_100} />
          </TouchableOpacity>
        );
      },
    });

    this.state = {
      selected: [],
      contacts: [],
      searchPlaceholder: 'Search',
      typeText: null,
      loading: true,
      shareUrl: [],
      search: false,
      myConnections: this.props?.myConnections?.data,
      newConnections: this.props?.myConnections?.data,
      modalVisible: false,
      userDetails: '',
      chatDetail: '',
      isBlock: false,
      isPin: false,
      isRefreshing: false,
      isLoader: true,
      currentUserPage: 1,
      isUserMoreLoading: false,
      permission: '',
    };
  }
  static contextType = AppContext;

  checkPermission = () => {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission().then(permission => {
        if (permission === 'undefined') {
          Contacts.requestPermission().then(permission => {});
        }
        if (permission === 'authorized') {
          this.setState(permission);
        }
        if (permission === 'denied') {
          this.setState(permission);
        }
        if (permission === 'undefined') {
          this.setState(permission);

          // Alert.alert('Sort App', 'You have to give permission to get contacts ', [
          //   {
          //     text: 'Cancel',
          //     onPress: () => console.log('Cancel Pressed'),
          //     style: 'cancel',
          //   },
          //   { text: 'Allow', onPress: () => Linking.openSettings() },
          // ]);
        }
      });
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        // title: 'Contacts',
        // message: 'This app would like to view your contacts.',
      }).then(permission => {
        if (permission === 'granted') {
          this.setState(permission);

          // props.navigation.navigate('FIND_FRIENDS');
        }
        if (permission === 'denied') {
          this.setState(permission);

          // props.navigation.goBack();
        }
        if (permission === 'never_ask_again') {
          this.setState(permission);

          // Alert.alert('Sort App', 'You have to give permission to get contacts ', [
          //   {
          //     text: 'Cancel',
          //     onPress: () => console.log('Cancel Pressed'),
          //     style: 'cancel',
          //   },
          //   { text: 'Allow', onPress: () => Linking.openSettings() },
          // ]);
        }
      });
    }
  };
  componentDidMount() {
    this.getMyConnectionsList();
  }

  componentDidUpdate() {
    if (!_.isEqual(this.props?.myConnections?.data, this.state.myConnections))
      this.setState({
        myConnections: this.props?.myConnections?.data,
        newConnections: this.props?.myConnections?.data,
      });
  }

  getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      let currChar = String?.fromCharCode(aCode + i);
      let obj = {
        title: currChar,
      };

      let currContacts = this.state?.newConnections?.filter(item => {
        return item?.user_name?.[0]?.toUpperCase() === currChar;
      });

      if (currContacts?.length > 0) {
        currContacts.sort((a, b) => a.user_name.localeCompare(b.user_name));
        obj.data = currContacts;
        contactsArr.push(obj);
      }
    }
    return contactsArr;
  };

  getMyConnectionsList(page) {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { limit: 20, page: page ? page : this.state.currentUserPage },
      };
      if (this?.state?.isUserMoreLoading === true) {
        this.props.showLoading(true);
      }
      if (this?.state?.currentUserPage === 1) {
        this.props.showLoading(true);
      }
      console.log('params', params);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MYCONNECTIONS];
              if (resp.success) {
                // console.log('connection list', resp.data);
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
  handleChackBlock = chatId => {
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

  pinUser = data => {
    try {
      const params = {
        url: API_DATA.PIN_USER,
        data: {
          to_user_id: data,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.PIN_USER];
            if (resp.success) {
              this.props.showToast(localize('SUCCESS'), resp.message);
              this.props.getUserPin(data);
              // this.getChatDetail();
              this.props.showLoading(false);
              this.setState({
                isPin: !this.state.isPin,
              });
            } else {
              this.props.getUserPin(data);

              // this.props.showErrorAlert(localize('ERROR'), resp.message);
              this.setState({
                isPin: !this.state.isPin,
              });
            }
          });
        })
        .catch(err => {
          this.props.showLoading(false);
          this.setState({
            isPin: !this.state.isPin,
          });
        });
    } catch (e) {}
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
                  is_block: this.state.isBlock === true ? 0 : 1,
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

  getChatDetail = chat_Id => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: chat_Id,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              if (resp.success) {
                this.setState({
                  chatDetail: resp,
                  isBlock: this?.props?.chatDetail?.is_block === 1 ? true : false,
                });
                this.props.getChatDetail(resp?.data);
              } else {
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {}
  };
  removeContact = contactId => {
    this.setState({
      selected: this.state.selected.filter(val => val?.index !== contactId),
    });
  };

  searchItems = text => {
    if (text === '') {
      this.getMyConnectionsList();
    }
    let newArray = this?.state?.myConnections.filter(item => {
      const itemData = `${item?.user_name?.toLowerCase()}`;
      const textData = text.toLowerCase();
      if (text.length > 0) {
        return itemData.indexOf(textData) > -1;
      }
    });
    this.setState({ newConnections: newArray });
  };

  refreshConnectionList = () => {
    this?.setState({ isRefreshing: true });
    setTimeout(() => {
      this?.getMyConnectionsList();
    }, 500);
  };
  handleFindFriend = () => {
    // props.navigation.navigate('INVITE');
    if (Platform.OS === 'ios' && this?.state?.permission === 'authorized') {
      this?.props.navigation.navigate('FIND_FRIENDS');
    }
    if (Platform.OS === 'ios' && this?.state?.permission !== 'authorized') {
      // props.navigation.navigate('INVITE');
      this?.props.navigation.navigate('FIND_FRIENDS');
    }
    if (Platform.OS === 'android' && this?.state?.permission === 'granted') {
      this?.props.navigation.navigate('FIND_FRIENDS');
    }
    if (Platform.OS === 'android' && this?.state?.permission !== 'granted') {
      // props.navigation.navigate('INVITE');
      this?.props.navigation.navigate('FIND_FRIENDS');
    }
  };
  handleDisconnect = friend_id => {
    console.log('friend id', friend_id);
    try {
      const params = {
        url: API_DATA.DISCONNECT,
        data: {
          connection_id: friend_id,
        },
      };
      this.props.showLoading(true);
      console.log('params', params);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.DISCONNECT];
              console.log('dis res', resp);
              if (resp.success) {
                this?.getMyConnectionsList(this?.state?.currentUserPage);
                this.getData();
                this.props.showToast(localize('SUCCESS'), resp.message);
                // this.props.getChatDetail(resp?.data);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            console.log('catch in disconnect', err);
          });
      }, 500);
    } catch (e) {
      console.log('disconnect catch', e);
    }
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <TouchableOpacity style={styles.listItem} onPress={() => this?.handleFindFriend()}>
            <View style={styles.left}>
              <Image source={IMAGES.InviteIcon} style={styles.listIcon} />
            </View>
            <View style={styles.body}>
              {/* <Text style={[styles.listTitle, { color: theme?.colors?.WHITE }]}>Add new connections</Text> */}
              <Text style={[styles.listTitle, { color: theme?.colors?.WHITE }]}>Find Friends</Text>
            </View>
            <View style={styles.right}>
              <Image source={IMAGES.rightArrow} style={styles.listIcon} />
            </View>
          </TouchableOpacity>
          {this?.state?.isLoader === false ? (
            <>
              {this.state.search === true && (
                <View style={styles.searchView}>
                  <View style={{ padding: 15 }}>
                    <Icon name="search" style={styles.sidenotHiddenColIcon} />
                  </View>
                  <TextInput
                    onChangeText={text => this.searchItems(text)}
                    placeholder="Search for people"
                    placeholderTextColor={theme?.colors?.GRAY_300}
                    autoFocus={true}
                    style={[styles.searchBar]}
                  />
                </View>
              )}

              {this?.state?.newConnections?.length !== 0 ? (
                <>
                  {this?.state?.myConnections?.length !== 0 ? (
                    <SectionList
                      sections={this.getData()}
                      // ListHeaderComponent={() => <Button title="Add Content" />}
                      refreshControl={
                        <RefreshControl
                          tintColor={theme?.colors?.WHITE}
                          refreshing={this.state.isRefreshing}
                          onRefresh={() => this.refreshConnectionList()}
                        />
                      }
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
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <View>
                          <TouchableOpacity
                            style={styles.contentRow}
                            onPress={() => {
                              this.getChatDetail(item?.chat_id), this.setState({ modalVisible: true, userDetails: item });
                            }}
                          >
                            <View style={styles.left}>
                              <View style={styles.contactProfile}>
                                <Image
                                  source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                                  style={styles.profileImage}
                                />
                              </View>
                            </View>

                            <View style={[styles.body, { justifyContent: 'center' }]}>
                              <Text style={styles.contatLabel}>{item?.user_name}</Text>
                              <Text style={styles.contatText}>
                                {item?.user_phone_code} {item?.user_phone}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={item => item?.user_id}
                      renderSectionHeader={({ section }) => (
                        <View style={styles.sectionHeader}>
                          <Text style={styles.letterStyle}>{section.title}</Text>
                        </View>
                      )}
                    />
                  ) : (
                    <NoDataFound
                      title="Nothing to see"
                      text="You don’t have any connection yet"
                      titleColor={'#C8BCBC'}
                      textColor={'#847D7B'}
                      titleFontSize={20}
                      source={IMAGES.noChatImage}
                      imageWidth={205}
                      imageHeight={156}
                    />
                  )}
                </>
              ) : (
                <NoDataFound
                  title="Nothing to see"
                  text="You don’t have any connection yet"
                  titleColor={'#C8BCBC'}
                  textColor={'#847D7B'}
                  titleFontSize={20}
                  source={IMAGES.noChatImage}
                  imageWidth={205}
                  imageHeight={156}
                />
              )}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                // visible={true}
                onRequestClose={() => {
                  this.setState({
                    modalVisible: false,
                  });
                }}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={[styles.modalBodyclose]}
                    onPress={() => {
                      this.setState({
                        modalVisible: !this.state.modalVisible,
                      });
                    }}
                  ></TouchableOpacity>
                  <View style={[styles.modalView]}>
                    <View style={styles.modalImageView}>
                      <View style={styles.modalImageViewBody}>
                        <Text style={styles.userName}>{this?.state?.userDetails?.user_name}</Text>
                        <Text style={[styles.contatText]}>
                          {this?.state?.userDetails?.user_phone_code} {this?.state?.userDetails?.user_phone}
                        </Text>
                        <View style={{ flexDirection: 'row', marginTop: Responsive.getWidth(3) }}>
                          {this?.state?.userDetails?.chat_id !== '' &&
                          this?.state?.chatDetail?.common_groups_count &&
                          this?.state?.chatDetail?.common_groups_count !== 0 ? (
                            <TouchableOpacity
                              style={{ flex: 1, justifyContent: 'center' }}
                              onPress={() => {
                                this.setState({ modalVisible: false });
                                this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.userDetails?.chat_id });
                              }}
                            >
                              <Text style={styles.connectionTxt1}>{this?.state?.chatDetail?.common_groups_count}</Text>
                              <Text style={styles.connectionTxt2}>Shared{'\n'}Sidenotes</Text>
                            </TouchableOpacity>
                          ) : null}

                          {this?.state?.userDetails?.mutual_friends ? (
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                              <Text style={styles.connectionTxt1}>{this?.state?.userDetails?.mutual_friends}</Text>
                              <Text style={styles.connectionTxt2}>Mutual{'\n'}Connections</Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                      <Image source={{ uri: this?.state?.userDetails?.user_image }} style={styles.userProfileImage} />
                    </View>
                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={() => {
                        this.setState({ modalVisible: false });
                        this?.props?.navigation?.navigate('SINGAL_CHAT', {
                          profileDetail: this?.state?.userDetails,
                        });
                      }}
                    >
                      <Text style={[styles.sendButtonTxt]}>Send Message</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: Responsive.getWidth(10) }}>
                      <RowItems
                        theme={theme}
                        leftIcon={'message-square'}
                        title={`Add to Sidenote`}
                        leftIconStyle={[styles.RowItemsLeftIcon]}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          this.setState({ modalVisible: false });
                          this?.props?.navigation?.navigate('ADD_SIDENOTE', { userData: this.state.userDetails });
                        }}
                      />
                      {/* <RowItems
                        theme={theme}
                        leftIcon={'plus'}
                        title={'Add to System Contacts'}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => this.setState({ modalVisible: false })}
                      /> */}
                      <RowItems
                        theme={theme}
                        leftIcon={'slash'}
                        leftIconStyle={[styles.RowItemsLeftIcon]}
                        title={`${this.state.userDetails?.is_block === 1 ? 'Unblock' : 'Block'}`}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          this?.state?.chatDetail?.data?.chat_id && this.state?.chatDetail?.data?.chat_id !== ''
                            ? this.handleChackBlock(this?.state?.chatDetail?.data?.chat_id)
                            : this.handleUserBlock(this?.state?.userDetails?.connection_id);
                        }}
                      />
                      {/* {console.log('user details ====>', this.state.userDetails)} */}
                      <RowItems
                        theme={theme}
                        leftIcon2={'pin-outline'}
                        leftIconStyle={[styles.RowItemsLeftIcon]}
                        title={`${this.state.userDetails?.is_pin === 0 ? 'Pin' : 'Unpin'}`}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          this.pinUser(this?.state?.userDetails?.user_id);
                        }}
                      />
                      <RowItems
                        theme={theme}
                        leftIcon4={'unlink'}
                        leftIconStyle={[styles.RowItemsLeftIcon]}
                        title={'Disconnect'}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          this.handleDisconnect(this.state.userDetails.connection_id);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          ) : null}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    myConnections: state?.dashboardState?.myConnections,
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(MyConnection);
