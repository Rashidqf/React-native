import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SectionList,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContextProvider';
import {SafeAreaWrapper} from '../../components/wrapper';
import LoadingIndicator from '../../components/modalComponents/loadingModel';
import {style} from './style';
import {IMAGES, COMMON_STYLE} from '../../theme';
import onShare from '../../utils/deepLinking';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  getContactNumberAction,
  updateContactStatusAction,
} from '../../store/action/dashboardAction';
interface Contact {
  mobile_no: string | null;
  displayName: string | null;
  thumbnailPath?: string | null;
  status?: string | null;
  givenName?: string | null;
}

const header = (
  styles: any,
  setSearch: (value: boolean) => void,
  search: boolean,
) => {
  return (
    <TouchableOpacity
      style={COMMON_STYLE.headerBtnStyle}
      onPress={() => setSearch(!search)}>
      <Ionicons name="search" style={styles.sidenotHiddenColIcon} />
    </TouchableOpacity>
  );
};

const ActivitySheetScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.redState.userData);
  const NewContactList = useAppSelector(
    state => state.dashboardState.contactList,
  );

  console.log('userData', userData);

  const sectionListRef = useRef<SectionList<any>>(null);
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isLoader, setIsLoader] = useState(true);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => header(styles, setSearch, search),
    });
    fetchContacts();
  }, []);

  const postContactNumber = (contacts: any) => {
    fetch(`https://api.prod.doyousidenote.com/api/v1/contact-invitation-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData?.access_token}`,
      },
      body: JSON.stringify(contacts),
    })
      .then(res => res.json())
      .then(res => {
        console.log('res', res);
        dispatch(getContactNumberAction(res.data));
        // setisLoading(false);
        // setNewContact(res?.data);
        setIsLoader(false);
      })
      .catch(e => {
        setIsLoader(false);
        console.log('catch error', e);
      });
  };

  const fetchContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        const array: Contact[] = contacts.map(item => ({
          mobile_no: item?.phoneNumbers[0]?.number,
          displayName:
            Platform.OS === 'ios' ? item?.givenName : item?.displayName,
          thumbnailPath: item?.thumbnailPath,
        }));
        const newArr = array.filter(item => item.mobile_no);
        newArr.length && postContactNumber(newArr);
        setContactList(newArr);
        setIsLoader(false);
      })
      .catch(e => {
        setIsLoader(false);
        console.log('Error fetching contacts', e);
      });
  };

  const getData = () => {
    const contactList = NewContactList || [];

    const contactsArr: {title: string; data: Contact[]}[] = [];
    const aCode = 'A'.charCodeAt(0);

    for (let i = 0; i < 26; i++) {
      const currChar = String.fromCharCode(aCode + i);
      const currContacts = contactList.filter(
        (item: any) => item.displayName[0]?.toUpperCase() === currChar,
      );

      if (currContacts.length > 0) {
        currContacts.sort((a: any, b: any) =>
          a.displayName.localeCompare(b.displayName),
        );
        contactsArr.push({title: currChar, data: currContacts});
      }
    }

    return contactsArr;
  };

  const sendInvitation = async (data: string) => {
    // setisLoading(true);
    try {
      const params = {
        // url: API_DATA.SEND_REQUEST,
        data: {
          mobile_no: data,
        },
      };

      // setTimeout(() => {
      fetch(`https://api.prod.doyousidenote.com/api/v1/invitation-for-app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.access_token}`,
        },
        body: JSON.stringify(params.data),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          dispatch(
            updateContactStatusAction({
              mobile_no: data,
            }),
          );
          // setisLoading(false);
          // setNewContact(res?.data);
          setIsLoader(false);
        })
        .catch(e => {
          console.log('catch error', e);
        });
      // }, 1000);
    } catch (e) {
      setIsLoader(false);
      console.log('Catch error >>>', e);
    }
  };

  const inviteFriend = (number: string | undefined) => {
    if (number !== undefined) {
      var cleaned = ('' + number).replace(/\D/g, '').slice(-10);
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      var newNumber = match ? `${match[1]}-${match[2]}-${match[3]}` : '';
      console.log(newNumber);
      try {
        const params = {
          // url: API_DATA.INVITEFRIEND,
          data: {
            phone: newNumber,
          },
        };
        setIsLoader(true);
        // setTimeout(() => {
        fetch(`https://api.prod.doyousidenote.com/api/v1/invitation/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.access_token}`,
          },
          body: JSON.stringify(params.data),
        })
          .then(res => res.json())
          .then(res => {
            dispatch(getContactNumberAction(res.data));
            // setisLoading(false);
            // setNewContact(res?.data);
            setIsLoader(false);
          })
          .catch(e => {
            console.log('catch error', e);
          });
        // }, 1000);
      } catch (e) {
        setIsLoader(false);
        console.log('catch error >>>', e);
      }
    } else {
      console.log('Number Should not be empty, Please enter a valid number');
    }
  };

  const searchItems = (text: string) => {
    setSearchText(text);
    sectionListRef.current?.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 0,
      viewPosition: 0,
    });

    if (text === '') {
      setSearchResults([]);
    } else {
      const filteredContacts = NewContactList.filter((item: Contact) => {
        const itemData = item.displayName?.toLowerCase() || '';
        const textData = text.toLowerCase();
        return itemData.includes(textData);
      });
      setSearchResults(filteredContacts);
    }
  };
  const Invitaion = 'userData.userInfo.invitation_url';
  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <LoadingIndicator isLoading={isLoader} />
      <SafeAreaWrapper
        containerStyle={{marginLeft: 0, marginRight: 0, marginTop: 100}}>
        {isLoader === false ? (
          <>
            {search && (
              <View style={styles.searchView}>
                <View style={{padding: 15}}>
                  <Icon name="search" style={styles.sidenotHiddenColIcon} />
                </View>
                <TextInput
                  value={searchText}
                  onChangeText={text => searchItems(text)}
                  placeholder="Search contacts"
                  placeholderTextColor={theme?.colors?.GRAY_300}
                  autoFocus={true}
                  style={[styles.searchBar]}
                />
              </View>
            )}
            <View style={{padding: 5}}>
              <Text style={[styles.titleText]}>
                Good news! We found some friends\n already using Sidenote
              </Text>
            </View>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                keyExtractor={item =>
                  item.mobile_no || Math.random().toString()
                }
                renderItem={({item}) => (
                  <View style={[styles.contentRow, {alignItems: 'flex-start'}]}>
                    <View style={COMMON_STYLE.left}>
                      <View
                        style={[
                          COMMON_STYLE.contactProfile,
                          {backgroundColor: theme.colors.GRAY_200},
                        ]}>
                        <Image
                          source={
                            item?.thumbnailPath
                              ? {uri: item?.thumbnailPath}
                              : IMAGES.contacts
                          }
                          style={COMMON_STYLE.profileImage}
                        />
                      </View>
                    </View>
                    <View style={COMMON_STYLE.body}>
                      <Text style={styles.contatLabel}>
                        {item?.displayName || item?.givenName}
                      </Text>
                      <Text style={[styles.contatText, {marginTop: 5}]}>
                        {item?.mobile_no}
                      </Text>
                    </View>
                    <View style={[COMMON_STYLE.right, {alignSelf: 'center'}]}>
                      <TouchableOpacity
                        style={
                          item?.status === 'send'
                            ? styles.btnAdded
                            : item?.status === 'pending'
                            ? styles.notBtn
                            : styles.btnSmall
                        }
                        onPress={() => {
                          if (item?.status === 'invite') {
                            sendInvitation(item?.mobile_no);
                            onShare(Invitaion);
                          } else if (item?.status === 'add') {
                            inviteFriend(item?.mobile_no);
                          }
                        }}>
                        {item?.status === 'invite' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Invite
                          </Text>
                        ) : item?.status === 'add' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Add
                          </Text>
                        ) : item?.status === 'pending' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Pending
                          </Text>
                        ) : item?.status === 'connected' ? (
                          <View style={styles.linkBtn}>
                            <Image
                              source={IMAGES.link_icon}
                              style={styles.linkBtnIcon}
                            />
                          </View>
                        ) : item?.status === 'send' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.RED_500,
                                textAlign: 'center',
                              },
                            ]}>
                            Sent
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            ) : (
              <SectionList
                ref={sectionListRef}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                sections={getData()}
                keyExtractor={item =>
                  item.recordID ? item.recordID : Math.random().toString()
                }
                renderItem={({item}) => (
                  <View style={[styles.contentRow, {alignItems: 'flex-start'}]}>
                    <View style={COMMON_STYLE.left}>
                      <View
                        style={[
                          COMMON_STYLE.contactProfile,
                          {backgroundColor: theme.colors.GRAY_200},
                        ]}>
                        <Image
                          source={
                            item?.thumbnailPath
                              ? {uri: item?.thumbnailPath}
                              : IMAGES.contacts
                          }
                          style={COMMON_STYLE.profileImage}
                        />
                      </View>
                    </View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('ACTIVITY_SHEET');
                      }}
                      style={COMMON_STYLE.body}>
                      <Text style={styles.contatLabel}>
                        {item?.displayName || item?.givenName}
                      </Text>
                      <Text style={[styles.contatText, {marginTop: 5}]}>
                        {item?.mobile_no}
                      </Text>
                    </Pressable>
                    <View style={[COMMON_STYLE.right, {alignSelf: 'center'}]}>
                      <TouchableOpacity
                        style={
                          item?.status === 'send'
                            ? styles.btnAdded
                            : item?.status === 'pending'
                            ? styles.notBtn
                            : styles.btnSmall
                        }
                        onPress={() => {
                          if (item?.status === 'invite') {
                            sendInvitation(item?.mobile_no);
                            onShare(Invitaion);
                          } else if (item?.status === 'add') {
                            inviteFriend(item?.mobile_no);
                          }
                        }}>
                        {item?.status === 'invite' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Invite
                          </Text>
                        ) : item?.status === 'add' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Add
                          </Text>
                        ) : item?.status === 'pending' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.WHITE,
                                textAlign: 'center',
                              },
                            ]}>
                            Pending
                          </Text>
                        ) : item?.status === 'connected' ? (
                          <View style={styles.linkBtn}>
                            <Image
                              source={IMAGES.link_icon}
                              style={styles.linkBtnIcon}
                            />
                          </View>
                        ) : item?.status === 'send' ? (
                          <Text
                            style={[
                              styles.contatText,
                              {
                                color: theme?.colors?.RED_500,
                                textAlign: 'center',
                              },
                            ]}>
                            Sent
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                renderSectionHeader={({section}) => (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.letterStyle}>{section.title}</Text>
                  </View>
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
              />
            )}
          </>
        ) : (
          <View>
            <Text>Loading...</Text>
          </View>
        )}
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default ActivitySheetScreen;
