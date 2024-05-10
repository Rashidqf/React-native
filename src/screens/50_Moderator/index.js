import React, { Component } from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SectionList,
  FileListList,
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

export class ChooseModerator extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity
            style={COMMON_STYLE.headerBtnStyle}
            // onPress={() =>
            //   this?.props?.route?.params?.isEvent ?
            //   this?.props?.navigation?.navigate('CREATE_TASK', {
            //     moderatorName: this?.state?.title,
            //     moderatorId: this?.props?.route?.params?.moderatorId,
            //     selected: this?.props?.route?.params?.selected,
            //     groupTitle: this?.props?.route?.params?.groupTitle,
            //   })
            //   :
            //   this?.props?.navigation?.navigate('New_Itinerary', {
            //     moderatorName: this?.state?.title,
            //     moderatorId: this?.props?.route?.params?.moderatorId,
            //     selected: this?.props?.route?.params?.selected,
            //     groupTitle: this?.props?.route?.params?.groupTitle,
            //   })
            // }
            onPress={() => {
              if (this?.props?.route?.params?.isSubgroup) {
                // Call API for subgroup moderator
                this?.chooseModeratorForSubGroups();
              } else if (this?.props?.route?.params?.isEvent) {
                this?.props?.navigation?.navigate('CREATE_TASK', {
                  moderatorName: this?.state?.title,
                  moderatorId: this?.props?.route?.params?.moderatorId,
                  selected: this?.props?.route?.params?.selected,
                  groupTitle: this?.props?.route?.params?.groupTitle,
                });
              } else {
                this?.props?.navigation?.navigate('New_Itinerary', {
                  moderatorName: this?.state?.title,
                  moderatorId: this?.props?.route?.params?.moderatorId,
                  selected: this?.props?.route?.params?.selected,
                  groupTitle: this?.props?.route?.params?.groupTitle,
                });
              }
              // this?.props?.route?.params?.isEvent
              //   ? this?.props?.navigation?.navigate('CREATE_TASK', {
              //       moderatorName: this?.state?.title,
              //       moderatorId: this?.props?.route?.params?.moderatorId,
              //       selected: this?.props?.route?.params?.selected,
              //       groupTitle: this?.props?.route?.params?.groupTitle,
              //     })
              //   : this?.props?.navigation?.navigate('New_Itinerary', {
              //       moderatorName: this?.state?.title,
              //       moderatorId: this?.props?.route?.params?.moderatorId,
              //       selected: this?.props?.route?.params?.selected,
              //       groupTitle: this?.props?.route?.params?.groupTitle,
              //     });
            }}
          >
            <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text>
          </TouchableOpacity>
        );
      },
    });

    this.state = {
      isVisible: true,
      checked: true,
      moderatorId: this?.props?.route?.params?.userId ? this?.props?.route?.params?.userId : this?.props?.route?.params?.moderatorId,

      contacts: [],
      searchPlaceholder: 'Search',
      typeText: null,
      loading: true,
      shareUrl: [],
      search: false,
      modalVisible: false,
      userDetails: '',
      chatDetail: '',
      isBlock: false,
      isRefreshing: false,
      isLoader: true,
      currentPage: 1,
      currentUserPage: 1,
      isUserMoreLoading: false,
      permission: '',
      // myConnections: this.props?.myConnections?.data,
      // newConnections: this.props?.myConnections?.data,
      searchText: '',
    };
  }
  static contextType = AppContext;

  ToggleFunction = () => {
    this.setState(state => ({
      isVisible: !state.isVisible,
    }));
  };

  chooseModeratorForSubGroups() {
    // const data = {
    //   moderatorName: this?.state?.title,
    //   moderatorId: this?.props?.route?.params?.moderatorId,
    //   selected: this?.props?.route?.params?.selected,
    //   groupTitle: this?.props?.route?.params?.groupTitle,
    // };
    try {
      const params = {
        url: API_DATA.GROUPMODERATOR,
        data: {
          id: this?.state?.groupId,
          is_moderator: 1,
          group_id: this?.props?.route?.params?.groupId,
          user_id: this?.props?.route?.params?.moderatorId,
        },
      };
      if (this?.props?.route?.params?.moderatorId) {
        this?.props?.showLoading(true);
        setTimeout(() => {
          callApi([params], this?.props?.userData?.access_token)
            .then(response => {
              this?.props?.showLoading(false).then(() => {
                let resp = response[API_DATA.GROUPMODERATOR];
                if (resp.success) {
                  this?.props?.showLoading(false);
                  this?.props?.navigation.goBack();
                } else {
                  this.props.showErrorAlert(localize('ERROR'), resp.message);
                }
              });
            })
            .catch(err => {
              this?.props?.showLoading(false);
            });
        }, 500);
      }
    } catch (e) {}
  }

  getMyConnectionsList() {
    try {
      const params = {
        url: API_DATA.MYCONNECTIONS,
        data: { limit: 20, page: this.state.currentUserPage },
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

  componentDidMount() {
    this.getMyConnectionsList();
    this?.props?.navigation?.setParams({
      moderatorId: this.state.moderatorId,
      moderatorName: this?.state?.title,
      tabName: this?.state?.tabName,
    });
  }

  searchItems = text => {
    this.setState({
      searchText: text,
    });

    // if (text === '') {
    //   this.getMyConnectionsList();
    // }
    // let newArray = this?.state?.myConnections.filter(item => {
    //   const itemData = `${item?.user_name?.toLowerCase()}`;
    //   const textData = text.toLowerCase();
    //   if (text.length > 0) {
    //     return itemData.indexOf(textData) > -1;
    //   }
    // });
    // this.setState({ newConnections: newArray });
  };

  getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);

    const filteredBySearchText = this.state.searchText
      ? this.props?.myConnections?.data?.filter(item => {
          const itemData = `${item?.user_name?.toLowerCase()}`;
          const textData = this.state.searchText.toLowerCase();
          if (this.state.searchText.length > 0) {
            return itemData.indexOf(textData) > -1;
          }
        })
      : this.props?.myConnections?.data;

    for (let i = 0; i < 26; i++) {
      let currChar = String?.fromCharCode(aCode + i);
      let obj = {
        title: currChar,
      };

      let currContacts = filteredBySearchText?.filter(item => {
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

  clearText = () => {
    this.setState({
      title: '',
      selectedName: '',
      moderatorId: null,
    });
  };

  onChange(id, title, from) {
    if (id === this.state.moderatorId) {
      this.setState({
        moderatorId: null,
        title: '',
      });
      this?.props?.navigation?.setParams({
        moderatorId: null,
        title: '',
      });
    } else {
      this.setState({
        moderatorId: id,
        title: title,
        from,
      });
      this?.props?.navigation?.setParams({
        moderatorId: id,
        title: title,
        from: from,
      });
    }
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          {this.state.isVisible ? (
            <>
              <View style={styles.searchContainer}>
                <View style={styles.searchView}>
                  {this.state.title ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#FF4403',
                        width: 'auto',
                        borderRadius: 12,
                        flexDirection: 'row',
                      }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center', marginLeft: 10 }}>{this.state.title}</Text>
                      <TouchableOpacity onPress={this.clearText}>
                        <Icon name="close" style={{ color: 'white', marginLeft: 5 }} />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={{ padding: 10 }}>
                    <Icon name="search" style={styles.sidenotHiddenColIcon} />
                  </View>
                  <TextInput
                    onChangeText={text => this.searchItems(text)}
                    placeholder="Search"
                    placeholderTextColor={theme?.colors?.GRAY_200}
                    autoFocus={true}
                    style={[styles.searchBar]}
                  />
                </View>
              </View>
              <SectionList
                sections={this.getData()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.contentRow}
                      onPress={() => {
                        this.onChange(item?.user_id, item?.user_name, 'user');
                      }}
                    >
                      <View style={styles.left}>
                        <View style={styles.contactProfile}>
                          <Image source={{ uri: item.user_image }} style={styles.profileImage} />
                        </View>
                      </View>
                      <View style={[styles.body, { justifyContent: 'center' }]}>
                        <Text style={styles.contatLabel}>{item.user_name}</Text>
                      </View>
                      <View style={[styles.checkbox]}>
                        <Image
                          source={this.state.moderatorId === item.user_id ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2}
                          style={[styles.checkboxStyle]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.SectionListTitle}>{title}</Text>
                  </View>
                )}
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
              />
            </>
          ) : (
            <>
              <View style={styles.searchContainer}>
                <View style={styles.searchView}>
                  <View style={{ padding: 10 }}>
                    <Icon name="search" style={styles.sidenotHiddenColIcon} />
                  </View>
                  <TextInput
                    onChangeText={text => this.searchItems(text)}
                    placeholder="Search"
                    placeholderTextColor={theme?.colors?.GRAY_200}
                    autoFocus={true}
                    style={[styles.searchBar]}
                  />
                </View>
              </View>
              <SectionList
                sections={this.getData()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.contentRow}
                      onPress={() => {
                        this.onChange(item?.user_id, item?.user_name, 'user');
                      }}
                    >
                      <View style={styles.left}>
                        <View style={styles.contactProfile}>
                          <Image source={{ uri: item.user_image }} style={styles.profileImage} />
                        </View>
                      </View>
                      <View style={[styles.body, { justifyContent: 'center' }]}>
                        <Text style={styles.contatLabel}>{item.user_name}</Text>
                      </View>
                      <View style={[styles.checkbox]}>
                        <Image
                          source={this.state.moderatorId === item.user_id ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2}
                          style={[styles.checkboxStyle]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.SectionListTitle}>{title}</Text>
                  </View>
                )}
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
              />
            </>
          )}
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
    groupList: state?.dashboardState?.groupList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ChooseModerator);
