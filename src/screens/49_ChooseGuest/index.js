import React from 'react';

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
  ActivityIndicator,
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
// const header = styles => {
//   return (
//     <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.setState({ search: !this.state.search })}>
//       <Icon name="search" style={styles.sidenotHiddenColIcon} />
//     </TouchableOpacity>
//   );
// };
class ChooseGuest extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity
            style={COMMON_STYLE.headerBtnStyle}
            onPress={() =>
              this?.props?.route?.params?.isEvent
                ? this?.props?.navigation?.navigate('CREATE_TASK', {
                    selected: this?.props?.route?.params?.selected,
                    groupTitle: this?.props?.route?.params?.title,
                    moderatorId: this?.props?.route?.params?.moderatorId,
                    moderatorName: this?.props?.route?.params?.moderatorName,
                    from: this?.props?.route?.params?.from,
                  })
                : this?.props?.navigation?.navigate('New_Itinerary', {
                    selected: this?.props?.route?.params?.selected,
                    groupTitle: this?.props?.route?.params?.title,
                    moderatorId: this?.props?.route?.params?.moderatorId,
                    moderatorName: this?.props?.route?.params?.moderatorName,
                    from: this?.props?.route?.params?.from,
                  })
            }
          >
            <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text>
          </TouchableOpacity>
        );
      },
    });

    this.state = {
      isVisible: true,
      checked: true,
      selected: this?.props?.route?.params?.userId ? this?.props?.route?.params?.userId : this?.props?.route?.params?.selected,
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
      isMoreLoading: false,
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
    this.getGroupList();
    this.getMyConnectionsList();
    this?.props?.navigation?.setParams({
      selected: this.state.selected,
      title: this.state.title,
      tabName: this?.state?.tabName,
    });
  }
  refreshControlGroup = () => {
    this?.setState({
      isRefreshing: true,
    });
    setTimeout(() => {
      this.getGroupList();
    }, 500);
  };
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

  getGroupList() {
    try {
      const params = {
        url: API_DATA.GROUPLIST,
        data: {
          limit: 20,
          page: this.state.currentPage,
        },
      };
      if (this?.state?.currentPage === 1) {
        this.props.showLoading(true);
      }
      if (this.state.isMoreLoading === true) {
        this.props.showLoading(true);
      }
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPLIST];
              if (resp.success) {
                this?.setState({
                  isLoaderGroup: false,
                });
                if (this?.state?.currentPage === 1) {
                  this?.props?.saveGroupList(resp);
                } else {
                  this?.props?.saveGroupListLoadMore(resp);
                  this.setState({ isMoreLoading: false });
                }
                this.setState({
                  currentPage: this.state.currentPage + 1,
                });
                this.props.showLoading(false);
                this?.setState({
                  isRefreshing: false,
                });
                // this.setState({
                //   currentPage: this.state.currentPage + 1,
                // });
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
  onChange(id, title, from) {
    if (id === this.state.selected) {
      this.setState({
        selected: null,
        title: '',
      });
      this?.props?.navigation?.setParams({
        selected: null,
        title: '',
      });
    } else {
      this.setState({
        selected: id,
        title: title,
        from,
      });
      this?.props?.navigation?.setParams({
        selected: id,
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
          <View style={styles.tabNav}>
            <TouchableOpacity
              onPress={() => this.ToggleFunction()}
              style={this.state.isVisible ? styles.tabNavBtnActive : styles.tabNavBtn}
            >
              <Text style={this.state.isVisible ? styles.tabTitleActive : styles.tabTitle}>Sidenotes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.ToggleFunction()}
              style={this.state.isVisible ? styles.tabNavBtn : styles.tabNavBtnActive}
            >
              <Text style={this.state.isVisible ? styles.tabTitle : styles.tabTitleActive}>Connections</Text>
            </TouchableOpacity>
          </View>

          {this.state.isVisible ? (
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
                    value={this.state.title}
                  />
                </View>
              </View>
              <FlatList
                refreshControl={
                  <RefreshControl
                    tintColor={theme?.colors?.WHITE}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.refreshControlGroup()}
                  />
                }
                showsHorizontalScrollIndicator={false}
                data={this?.props?.groupList?.data || []}
                keyExtractor={(item, index) => String(index)}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (
                    this?.props?.groupList?.total_pages !== 1 &&
                    !this.state.isMoreLoading &&
                    this?.props?.groupList?.total_count !== this.props?.groupList?.data.length
                  ) {
                    this.setState({ isMoreLoading: true });
                    this.getGroupList();
                  }
                }}
                ListFooterComponent={() =>
                  this.state.isMoreLoading ? <ActivityIndicator size="small" color={theme?.colors?.WHITE} /> : null
                }
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity style={styles.sidenoteItem} onPress={() => this.onChange(item.id, item.title, 'group')}>
                      <Text style={styles.sidenoteItemText}>{item.title}</Text>
                      {this.state.selected === item.id ? <Image source={IMAGES.check2} style={styles.sidenoteItemIcon} /> : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          ) : (
            <>
              <View style={styles.searchContainer}>
                {/*  */}

                <View style={{ marginRight: 10 }}>
                  <FlatList
                    // data={this?.state?.selected || []}
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
                          <TouchableOpacity
                            style={styles.tagClose}
                            onPress={() => {
                              const newArray = this.state.selected.filter(val => val?.user_id !== item?.user_id);
                              this.setState({
                                selected: newArray,
                              });
                              this?.props?.navigation?.setParams({
                                selected: newArray,
                              });
                            }}
                          >
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

                {/*  */}
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
                    value={this.state.title}
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
                      // onPress={() => {
                      //   this.onChange(item?.user_id, item?.user_name, 'user');
                      // }}
                      onPress={() => {
                        console.log('Item Data', JSON.stringify(item));
                        try {
                          const currentSelected = Array.isArray(this.state.selected) ? this.state.selected : [];
                          const existingSelectedItem = currentSelected.find(val => val?.user_id === item?.user_id);

                          if (!existingSelectedItem) {
                            this.setState({
                              selected: [...currentSelected, item],
                            });
                            this?.props?.navigation?.setParams({
                              selected: [...currentSelected, item],
                            });
                          } else {
                            this.setState({
                              selected: currentSelected.filter(val => val?.user_id !== item?.user_id),
                            });
                            this?.props?.navigation?.setParams({
                              selected: currentSelected.filter(val => val?.user_id !== item?.user_id),
                            });
                          }
                        } catch (e) {
                          console.log(e);
                        }
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
                          source={
                            Array.isArray(this?.state?.selected) && this?.state?.selected?.find(val => val?.user_id === item?.user_id)
                              ? IMAGES.checkIcon2
                              : IMAGES.uncheckIcon2
                          }
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
export default connect(mapStateToProps, mapDispatchToProps)(ChooseGuest);
