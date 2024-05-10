import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
  FlatList,
  SectionList,
  TextInput,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, FONTS } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

//import style
import { style } from './style';
import NoDataFound from '../../components/noDataFound';
import { Button, Input, Switch } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import onShare from '../../utils/deepLinking';
import Contacts from 'react-native-contacts';
import { AppContext } from '../../themes/AppContextProvider';

class SidenoteScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      myConnections: this?.props?.myConnections,
      newConnectionList: this?.props?.myConnections?.data || [],
      isLoader: true,
      isUserMoreLoading: false,
      isRefreshing: false,
      currentUserPage: 1,
    };
  }
  static contextType = AppContext;

  formRef = React.createRef();

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
        }
      });
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {}).then(permission => {
        if (permission === 'granted') {
          this.setState(permission);
        }
        if (permission === 'denied') {
          this.setState(permission);
        }
        if (permission === 'never_ask_again') {
          this.setState(permission);
        }
      });
    }
  };
  componentDidMount() {
    this?.checkPermission();
    this.getMyConnectionsList();
    // this.getUserAllList();
    this?.props?.navigation?.setParams({
      // handleOpenChat: this.handleOpenChat,
      selected: this?.state?.selected,
    });
  }

  initialValues = {
    title: '',
    user_ids: [],
  };

  sidenoteSchema = Yup.object().shape({
    title: Yup.string().required('Please enter name of the sidenote '),
    // user_ids: Yup.array().min(2, 'Please Select More Then 1 Users For Create Group'),
  });

  handleOpenChat = () => {
    this?.props?.navigation?.navigate('CONVERSATION', { selectedUser: this?.state?.selected });
    this?.props?.CurrentTabName('chat');
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState?.selected.length !== this?.state?.selected.length) {
      this?.props?.navigation?.setParams({
        selected: this?.state?.selected,
      });
    }
  }

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
  onSubmit = values => {
    const userId = this?.state?.selected?.map(item => item?.user_id);
    // this.props?.navigation?.navigate('CONVERSATION');
    try {
      let params = {
        url: API_DATA.GROUPADD,
        data: {
          title: values.title,
          user_ids: userId.join(','),
        },
      };

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPADD];
            if (resp.success) {
              this.props?.navigation?.navigate('CONVERSATION', {
                selectUser: userId,
                groupTitle: values?.title,
                detail: this.state.selected,
                groupId: resp?.data?.id,
                channel: resp?.data?.channel,
                chat_id: resp?.data?.chat_id,
                // channel: resp?.data?.channel,
                groupCreated: true,
              });
              this?.props?.CurrentTabName('chat');
              // this?.props?.saveGroupAdd(resp);
              // this.getGroupList();
              this.getChatList();
              this.getDashboardList();

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
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };

  getGroupList() {
    try {
      const params = {
        url: API_DATA.GROUPLIST,
        data: {
          // page: this.state.currentPage,
        },
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.GROUPLIST];
            if (resp.success) {
              this?.props?.saveGroupList(resp?.data);
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

  getUserAllList() {
    try {
      const params = {
        url: API_DATA.USERALL,
        data: {},
      };
      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.USERALL];
            if (resp.success) {
              this?.props?.saveUserAll(resp.data);
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

  getMyConnectionsListFromSearch(text) {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { kwd: text || '' },
      };
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.MYCONNECTIONS];
            if (resp.success) {
              console.log('SearchResponse:', JSON.stringify(resp));
              this.setState({
                newConnectionList: [...resp.data],
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

  getMyConnectionsList(page) {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { limit: 10, page: page ? page : this.state.currentUserPage },
      };
      if (this?.state?.isUserMoreLoading === true) {
        this.props.showLoading(true);
      }
      if (this?.state?.currentUserPage === 1) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.MYCONNECTIONS];
              if (resp.success) {
                this.setState({ isLoader: false });
                if (this?.state?.currentUserPage === 1) {
                  this.setState({ myConnections: resp.data, newConnectionList: resp.data });
                  this?.props?.saveMyConnections(resp);
                } else {
                  this.setState({
                    myConnections: [...this?.state?.myConnections, ...resp?.data],
                    newConnectionList: [...this?.state?.newConnectionList, ...resp.data],
                  });
                  this?.props?.saveMyConnectionsLoadMore(resp);

                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  currentUserPage: this.state.currentUserPage + 1,
                });
                this.setState({ isRefreshing: false });
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
  getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      // console.log("i ===>", i)
      let currChar = String?.fromCharCode(aCode + i);
      let obj = {
        title: currChar,
      };
      // console.log("newconnection ====>", this?.state?.newConnectionList)
      let currContacts =
        this?.state &&
        this?.state?.newConnectionList &&
        this?.state?.newConnectionList?.filter(item => {
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

  removeContact = contactId => {
    this.setState({
      selected: this.state.selected.filter(val => val?.user_id !== contactId),
    });
  };

  searchItems = text => {
    if (text.length === 0) {
      this.getMyConnectionsList(1);
    } else {
      // let newArray = this?.state?.myConnections.filter(item => {
      //   const itemData = `${item?.user_name?.toLowerCase()}`;
      //   const textData = text.toLowerCase();
      //   if (text.length > 0) {
      //     return itemData.indexOf(textData) > -1;
      //   }
      // });
      // this.setState({ newConnectionList: newArray });
      this.getMyConnectionsListFromSearch(text);
    }
  };

  refreshControlUser = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getMyConnectionsList();
    }, 500);
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0 }}>
          {this?.state?.isLoader === false ? (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
              <View style={styles.searchView}>
                <View style={{ marginRight: 10 }}>
                  <FlatList
                    data={this?.state?.selected || []}
                    // contentContainerStyle={styles.taglist}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    initialNumToRender={2}
                    horizontal
                    renderItem={({ item }) => {
                      const [fisrtName, lastName] = item?.user_name?.split(' ');
                      return (
                        <View style={styles.tagStyle}>
                          <Text style={styles.tagTextStyle}>{fisrtName}</Text>
                          <TouchableOpacity style={styles.tagClose} onPress={() => this.removeContact(item?.user_id)}>
                            <Image source={IMAGES.x_icon} style={{ ...COMMON_STYLE.imageStyle(2.5), marginLeft: 2 }} />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    ItemSeparatorComponent={() => <View style={styles.tagSepratorStyle} />}
                    keyExtractor={(id, index) => index.toString()}
                    // contentContainerStyle={{ paddingLeft: Responsive.getWidth(5) }}
                  />
                </View>
                <Icon name="search" style={styles.sidenotHiddenColIcon} />
                <TextInput
                  onChangeText={text => this.searchItems(text)}
                  placeholder="Search for people"
                  placeholderTextColor={theme?.colors?.GRAY_200}
                  style={[styles.searchBar]}
                />
              </View>
              {this?.state?.selected?.length === 1 ? (
                <TouchableOpacity style={[styles.listItem, { borderTopWidth: 1, borderBottomWidth: 0 }]}>
                  <View style={styles.left}>
                    <Image source={IMAGES.direct_msg_icon} style={styles.listIcon} />
                  </View>
                  <View style={styles.body}>
                    <Text style={[styles.listTitle, { color: theme?.colors?.GRAY_50, fontFamily: FONTS.BOLD }]}>
                      Start a direct message
                    </Text>
                  </View>
                  <View style={styles.right}>
                    <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                  </View>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity style={[styles.listItem, { borderTopWidth: 1, borderBottomWidth: 0 }]}>
                    <View style={styles.left}>
                      <Image source={IMAGES.PVT_CHAT} style={styles.listIcon} />
                    </View>
                    <TouchableOpacity style={styles.body} onPress={() => this.props.navigation.navigate('MY_CONNECTION')}>
                      <Text style={[styles.listTitle, { color: theme?.colors?.GRAY_50, fontFamily: FONTS.BOLD }]}>
                        Start a private chat
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.right}>
                      <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => this?.handleFindFriend()}>
                    <View style={styles.left}>
                      <Image source={IMAGES.InviteIcon} style={styles.listIcon} />
                    </View>
                    <View style={styles.body}>
                      <Text style={[styles.listTitle, { color: theme?.colors?.GRAY_50, fontFamily: FONTS.BOLD }]}>
                        Invite friends to Sidenote
                      </Text>
                    </View>
                    <View style={styles.right}>
                      <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                    </View>
                  </TouchableOpacity>
                </>
              )}

              {/* <View style={styles.divide} /> */}
              <Formik
                innerRef={this.formRef}
                initialValues={this.initialValues}
                onSubmit={this.onSubmit}
                validationSchema={this.sidenoteSchema}
              >
                {({ values, isValid, touched, errors, handleSubmit, setFieldTouched, setFieldValue, handleChange }) => {
                  if (!this?.props?.route?.params?.handleSubmit) {
                    this.props.navigation.setParams({ handleSubmit });
                  }
                  return (
                    <View style={styles.searchControl}>
                      {/* {errors.user_ids && touched.user_ids && (
                    <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(6), paddingBottom: Responsive.getWidth(3) }]}>
                      {errors.user_ids}
                    </Text>
                  )} */}
                      <TextInput
                        placeholder="SideNote Name?"
                        placeholderTextColor={theme?.colors?.WHITE}
                        value={values.title}
                        onChangeText={handleChange('title')}
                        style={styles.sideNoteInput}
                      />
                      {errors.title && touched.title && (
                        <Text style={[styles.errorText, { paddingLeft: Responsive.getWidth(6), paddingBottom: Responsive.getWidth(3) }]}>
                          {errors.title}
                        </Text>
                      )}
                    </View>
                  );
                }}
              </Formik>
              {this?.state?.newConnectionList?.length !== 0 ? (
                <>
                  {this?.state?.myConnections?.length !== 0 ? (
                    <SectionList
                      sections={this.getData()}
                      keyboardShouldPersistTaps="handled"
                      stickySectionHeadersEnabled={false}
                      refreshControl={
                        <RefreshControl
                          tintColor={theme?.colors?.WHITE}
                          refreshing={this.state.isRefreshing}
                          onRefresh={() => this.refreshControlUser()}
                        />
                      }
                      // ListHeaderComponent={() => <Button title="Add Content" />}
                      renderItem={({ item }) => (
                        <View style={styles.contentRow}>
                          <View style={styles.left}>
                            <View style={styles.contactProfile}>
                              <Image source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }} style={styles.profileImage} />
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.body, { justifyContent: 'center' }]}
                            onPress={() => {
                              if (!this.state.selected?.some(val => val?.user_id === item?.user_id)) {
                                this.setState({
                                  selected: [...this.state.selected, item],
                                });
                              } else {
                                this.setState({
                                  selected: this.state.selected.filter(val => val.user_id !== item?.user_id),
                                });
                              }
                            }}
                          >
                            <Text style={styles.contatLabel}>{item?.user_name}</Text>
                            {/* <Text style={styles.contatText}>{item?.user_phone}</Text> */}
                          </TouchableOpacity>
                          <View style={[styles.right, { justifyContent: 'center' }]}>
                            <TouchableOpacity
                              onPress={() => {
                                if (!this.state.selected?.some(val => val?.user_id === item?.user_id)) {
                                  this.formRef?.current?.setFieldValue('user_ids', [
                                    ...this.formRef?.current.values?.user_ids,
                                    item?.user_id,
                                  ]);
                                  this.setState({
                                    selected: [...this.state.selected, item],
                                  });
                                } else {
                                  this.formRef?.current?.setFieldValue(
                                    'user_ids',
                                    this.formRef?.current.values?.user_ids?.filter(val => val !== item?.user_id),
                                  );
                                  this.setState({
                                    selected: this.state.selected.filter(val => val.user_id !== item?.user_id),
                                  });
                                }
                              }}
                            >
                              <Image
                                source={
                                  this.state.selected.some(val => val?.user_id === item?.user_id) ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2
                                }
                                style={[styles.checkboxStyle]}
                              />
                            </TouchableOpacity>
                            {/* <Button buttonStyle={styles.addButton} title={localize('ADDED')} titleStyle={styles.addButtonText} /> */}
                          </View>
                        </View>
                      )}
                      onEndReachedThreshold={0.5}
                      onEndReached={() => {
                        if (
                          this?.props?.myConnections?.total_pages !== 1 &&
                          !this.state.isUserMoreLoading &&
                          this?.props?.myConnections?.total_count !== this.props?.myConnections?.data.length
                        ) {
                          this.setState({ isMoreLoading: true });
                          this.getMyConnectionsList();
                        }
                      }}
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
            </KeyboardAvoidingView>
          ) : null}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    userList: state?.dashboardState?.userList,
    myConnections: state?.dashboardState?.myConnections,
    groupList: state?.dashboardState?.groupList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(SidenoteScreen);
