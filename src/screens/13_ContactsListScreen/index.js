import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  FlatList,
  SectionList,
  Platform,
  PermissionsAndroid,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { callApi } from '@apiCalls';
import onShare from '../../utils/deepLinking';
import { localize } from '@languages';

import { API_DATA } from '@constants';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';
const header = styles => {
  return (
    <TouchableOpacity style={COMMON_STYLE.headerBtnStyle} onPress={() => this.setState({ search: !this.state.search })}>
      <Icon name="search" style={styles.sidenotHiddenColIcon} />
    </TouchableOpacity>
  );
};
class ActivitySheetScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        header(style);
      },
    });
    this.sectionListRef = React.createRef();
    this.state = {
      selected: [],

      searchPlaceholder: 'Search',
      typeText: null,
      loading: true,
      shareUrl: [],
      search: false,
      newContact: [],
      isLoader: true,
      searchText: '',
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.loadContacts();
  }

  loadContacts() {
    this?.props?.showLoading(true);
    setTimeout(() => {
      Contacts.getAll()
        .then(contacts => {
          const array = [];
          contacts?.map(item => {
            if (item.phoneNumbers[0] != [] || item.phoneNumbers[0] !== undefined) {
              array.push({
                mobile_no: item?.phoneNumbers[0]?.number,
                displayName: Platform.OS === 'ios' ? item?.givenName : item?.displayName,
                thumbnailPath: item?.thumbnailPath,
              });
            }
          });
          const newArr = [];
          array.filter(item => {
            if (item.mobile_no != undefined) {
              newArr.push(item);
            }
          });
          array?.length && this.postContactNumber(newArr);
          this?.props?.showLoading(false);
        })
        .catch(e => {
          this.setState({ loading: false });
        });
    }, 1000);

    Contacts.getCount().then(count => {
      this.setState({ searchPlaceholder: `Search ${count} contacts` });
    });

    Contacts.checkPermission();
  }

  postContactNumber = contacts => {
    fetch(`${API_DATA.BASE_URL}/${API_DATA.SEND_CONTACT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.userData.access_token}`,
      },
      body: JSON.stringify(contacts),
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this?.props?.getContactNumber(res?.data);
        this.setState({ loading: false, newContact: res?.data, isLoader: false });
      })
      .catch(e => {
        console.log('catch error =>>>>', e);
      });
  };

  getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      // console.log('i charecter ===>', i);
      let currChar = String.fromCharCode(aCode + i);
      let obj = {
        title: currChar,
      };

      // console.log('this.state?.contacts', JSON.stringify(this.state?.contacts[0]));
      // if (Platform?.OS === 'android') {
      let currContacts = this?.props?.contactList?.filter(item => {
        return item?.displayName?.[0]?.toUpperCase() === currChar;
      });
      if (currContacts.length > 0) {
        currContacts.sort((a, b) => a?.displayName?.localeCompare(b.displayName));
        obj.data = currContacts;
        contactsArr.push(obj);
      }

      // let currContacts = [...this.state?.contacts];
    }
    return contactsArr;
  };

  inviteFriend = number => {
    if (number !== undefined) {
      var cleaned = ('' + number).replace(/\D/g, '').slice(-10);
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

      var newNumber = match[1] + '-' + match[2] + '-' + match[3];

      try {
        const params = {
          url: API_DATA.INVITEFRIEND,
          data: {
            phone: newNumber,
          },
        };
        this.props.showLoading(true);
        setTimeout(() => {
          callApi([params], this.props.userData.access_token)
            .then(response => {
              this.props.showLoading(false).then(() => {
                let resp = response[API_DATA.INVITEFRIEND];
                this.props.showLoading(false);

                console.log('send invitaion =====>', resp);
                if (resp.success) {
                  // this.props.showToast(localize('SUCCESS'), 'Invitation has been sent successfully!');
                  this?.props?.updateContactStatus({
                    mobile_no: number,
                  });
                  this.props.sendInvitation(resp.data);
                  // this.setState({ shareUrl: true });
                  setTimeout(() => {
                    onShare(this.props.userData.userInfo.invitation_url);
                  }, 1000);
                  // onShare(this.props.userData.userInfo.invitation_url);
                } else {
                  // this.setState({ shareUrl: true });
                  this.props.showErrorAlert(localize('ERROR'), resp.message);
                }
              });
            })
            .catch(err => {
              this.props.showLoading(false);
            });
        }, 1000);
      } catch (e) {
        console.log('catch error >>>', e);
      }
    } else {
      this.props.showToast('Message', 'Number Should Empty Srting, Please enter valid number ');
    }
  };

  removeContact = contactId => {
    this.setState({
      selected: this.state.selected.filter(val => val?.index !== contactId),
    });
  };

  searchItems = text => {
    this.setState({ searchText: text });
    this.sectionListRef?.current?.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
    });
    if (text === '') {
      this.loadContacts();
    } else {
      let newArray = this?.props?.contactList?.filter(item => {
        const itemData = `${item?.displayName?.toLowerCase()}`;
        const textData = text.toLowerCase();
        if (text.length > 0) {
          return itemData.indexOf(textData) > -1;
        }
      });

      this.setState({ newContact: newArray });
    }
  };
  sendInvitation = data => {
    try {
      const params = {
        url: API_DATA.SEND_REQUEST,
        data: {
          mobile_no: data,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.SEND_REQUEST];
              if (resp.success) {
                this?.props?.updateContactStatus(resp?.data);
                this.props.showLoading(false);
              } else {
                // this.setState({ shareUrl: true });
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 1000);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const Invitaion = this.props.userData.userInfo.invitation_url;
    const contactList = this.props.contactList;
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          {this?.state?.isLoader === false ? (
            <>
              {contactList ? (
                <>
                  {this.state.search === true && (
                    <View style={styles.searchView}>
                      <View style={{ padding: 15 }}>
                        <Icon name="search" style={styles.sidenotHiddenColIcon} />
                      </View>
                      <TextInput
                        value={this.state.searchText}
                        onChangeText={text => this.searchItems(text)}
                        placeholder="Search contacts"
                        placeholderTextColor={theme?.colors?.GRAY_300}
                        autoFocus={true}
                        style={[styles.searchBar]}
                      />
                    </View>
                  )}
                  <TouchableOpacity style={styles.listItem}>
                    <View style={styles.left}>
                      <Image source={IMAGES.InviteIcon} style={styles.listIcon} />
                    </View>
                    <TouchableOpacity style={styles.body} onPress={() => onShare(Invitaion)}>
                      <Text style={[styles.listTitle, { color: theme?.colors?.WHITE }]}>Invite friends to Sidenote</Text>
                    </TouchableOpacity>
                    <View style={styles.right}>
                      <Image source={IMAGES.rightArrow} style={styles.listIcon} />
                    </View>
                  </TouchableOpacity>
                  <View>
                    <FlatList
                      data={this?.state?.selected || []}
                      contentContainerStyle={styles.taglist}
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled
                      initialNumToRender={2}
                      horizontal
                      renderItem={({ item }) => {
                        const [fisrtName, lastName] = item?.name?.split(' ');
                        return (
                          <>
                            <View style={styles.tagStyle}>
                              <Text style={styles.tagTextStyle}>{fisrtName}</Text>
                              <TouchableOpacity style={styles.tagClose} onPress={() => this.removeContact(item?.index)}>
                                <Image source={IMAGES.closeIcon} style={COMMON_STYLE.imageStyle(6, theme?.colors?.WHITE)} />
                              </TouchableOpacity>
                            </View>
                          </>
                        );
                      }}
                      ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
                      keyExtractor={(id, index) => index.toString()}
                    />
                  </View>
                  <View style={styles.divide} />
                  {this.state?.searchText === '' ? (
                    <View style={{ padding: Responsive.getWidth(5) }}>
                      <Text style={[styles.titleText]}>{`Good news! We found some friends\n already using Sidenote`}</Text>
                    </View>
                  ) : null}

                  {this?.state?.newContact?.length !== 0 ? (
                    <>
                      {contactList?.length !== 0 ? (
                        <SectionList
                          ref={this.sectionListRef}
                          sections={this.getData()}
                          // ListHeaderComponent={() => <Button title="Add Content" />}
                          renderItem={({ item }) => (
                            <View style={[styles.contentRow, { alignItems: 'flex-start' }]}>
                              {/* <Text style={{color: "red"}} >{JSON.stringify(item)}</Text> */}
                              <View style={styles.left}>
                                <View style={[styles.contactProfile, { backgroundColor: theme?.colors?.GRAY_200 }]}>
                                  <Image
                                    source={item?.thumbnailPath ? { uri: item?.thumbnailPath } : IMAGES.sortIcon}
                                    style={styles.profileImage}
                                  />
                                </View>
                              </View>
                              <View style={styles.body}>
                                <Text style={styles.contatLabel}>{item?.displayName || item?.givenName}</Text>

                                <Text style={[styles.contatText, { marginTop: 5 }]}>{item?.mobile_no}</Text>
                              </View>
                              <View style={[styles.right, { alignSelf: 'center' }]}>
                                <TouchableOpacity
                                  style={
                                    item?.status === 'send' || item?.status === 'pending'
                                      ? styles.btnAdded
                                      : item?.status === 'connected'
                                      ? styles.notBtn
                                      : styles.btnSmall
                                  }
                                  onPress={() => {
                                    if (!this.state.shareUrl?.some(val => val?.displayName === item?.displayName)) {
                                      this.setState({
                                        shareUrl: [...this.state.shareUrl, item],
                                      });
                                    } else {
                                      this.setState({
                                        shareUrl: this.state.shareUrl.filter(val => val?.displayName !== item?.displayName),
                                      });
                                    }

                                    if (item?.status === 'invite') {
                                      this.sendInvitation(item?.mobile_no);
                                      onShare(Invitaion);
                                    }
                                    if (item?.status === 'add') {
                                      this.inviteFriend(item?.mobile_no);
                                      // onShare();
                                    }

                                    // this.inviteFriend(item?.phoneNumbers[0]?.number);
                                  }}
                                >
                                  {item?.status === 'invite' ? (
                                    <Text style={[styles.contatText, { color: theme?.colors?.WHITE, textAlign: 'center' }]}>Invite</Text>
                                  ) : item?.status === 'add' ? (
                                    <Text style={[styles.contatText, { color: theme?.colors?.WHITE, textAlign: 'center' }]}>Add</Text>
                                  ) : item?.status === 'pending' ? (
                                    <Text style={[styles.contatText, { color: theme?.colors?.WHITE, textAlign: 'center' }]}>Pending</Text>
                                  ) : item?.status === 'connected' ? (
                                    <View style={styles.linkBtn}>
                                      <Image source={IMAGES.link_icon} style={styles.linkBtnIcon} />
                                    </View>
                                  ) : item?.status === 'send' ? (
                                    <Text style={[styles.contatText, { color: theme?.colors?.RED_500, textAlign: 'center' }]}>Sent</Text>
                                  ) : null}
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                          renderSectionHeader={({ section }) => (
                            <View style={styles.sectionHeader}>
                              <Text style={styles.letterStyle}>{section.title}</Text>
                            </View>
                          )}
                        />
                      ) : (
                        <NoDataFound
                          title="Nothing to see"
                          text="You don’t have any Contact yet"
                          titleColor={theme?.colors?.GRAY_50}
                          textColor={theme?.colors?.GRAY_100}
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
                      text="You don’t have any Contact yet"
                      titleColor={theme?.colors?.GRAY_50}
                      textColor={theme?.colors?.GRAY_100}
                      titleFontSize={20}
                      source={IMAGES.noChatImage}
                      imageWidth={205}
                      imageHeight={156}
                    />
                  )}
                </>
              ) : null}
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
    contactList: state.dashboardState.contactList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ActivitySheetScreen);
