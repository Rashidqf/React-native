import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Platform,
  PermissionsAndroid,
  Alert,
  RefreshControl,
  ImageBackground,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import {useDispatch, useSelector} from 'react-redux';

import {IMAGES, COMMON_STYLE} from '../../theme';
import {localize} from '../../languages';
import {API_DATA} from '../../constants';
import NoDataFound from '../../components/noDataFound';
import RowItems from '../../components/rowItems/rowItems';
import {style} from './style';
import _ from 'lodash';
import {SafeAreaWrapper} from '../../components/wrapper';
import {callApi} from '../../apiCalls';
import {AppContext} from '../../theme/AppContextProvider';
import {useAppSelector} from '../../store/hooks';

const MyConnection: React.FC<any> = ({navigation}) => {
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);
  const dispatch = useDispatch();

  const myConnections = useSelector((state: any) => state.myConnections?.data);
  const userData = useAppSelector(state => state.redState.userData);

  const [contacts, setContacts] = useState([]);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search');
  const [typeText, setTypeText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(false);
  const [newConnections, setNewConnections] = useState(myConnections);
  const [modalVisible, setModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const [chatDetail, setChatDetail] = useState('');
  const [isBlock, setIsBlock] = useState(false);
  const [isPin, setIsPin] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoader, setIsLoader] = useState(true);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [isUserMoreLoading, setIsUserMoreLoading] = useState(false);
  const [permission, setPermission] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={COMMON_STYLE.headerBtnStyle}
          onPress={() => setSearch(!search)}>
          <Icon name="search" size={18} color={theme?.colors?.GRAY_100} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, search]);

  useEffect(() => {
    checkPermission();
    getMyConnectionsList();
  }, []);

  useEffect(() => {
    if (!_.isEqual(myConnections, newConnections)) {
      setNewConnections(myConnections);
    }
  }, [myConnections]);

  const checkPermission = useCallback(() => {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission().then(permission => {
        if (permission === 'undefined') {
          Contacts.requestPermission().then(newPermission =>
            setPermission(newPermission),
          );
        } else {
          setPermission(permission);
        }
      });
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ).then(permission => {
        setPermission(permission);
      });
    }
  }, []);

  const getMyConnectionsList = useCallback(
    async (page = currentUserPage) => {
      try {
        const params = {
          url: API_DATA.BASE_URL + API_DATA.MYCONNECTIONS,
          data: {limit: 20, page},
        };

        if (isUserMoreLoading || currentUserPage === 1) {
          // dispatch(showLoading(true));
        }

        setTimeout(async () => {
          try {
            const response = await fetch(
              'https://api.prod.doyousidenote.com/api/v1/myconnections',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userData.access_token}`,
                },
                body: JSON.stringify(params.data),
              },
            );

            const resp = await response.json();

            if (response.ok && resp.success) {
              console.log('resp', resp);
              setIsRefreshing(false);
              setIsLoader(false);
              if (currentUserPage === 1) {
                // dispatch(saveMyConnections(resp));
              } else {
                // dispatch(saveMyConnectionsLoadMore(resp));
              }
              setCurrentUserPage(prevPage => prevPage + 1);
            } else {
              // dispatch(showErrorAlert(localize('ERROR'), resp.message));
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            // dispatch(showLoading(false));
          }
        }, 500);
      } catch (e) {
        console.error('Error in getMyConnectionsList:', e);
      }
    },
    [dispatch, userData, isUserMoreLoading, currentUserPage],
  );

  const getData = () => {
    let contactsArr = [];
    let aCode = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      let currChar = String.fromCharCode(aCode + i);
      let obj = {title: currChar};
      let currContacts = newConnections?.filter(
        (item: any) => item.user_name?.[0]?.toUpperCase() === currChar,
      );

      if (currContacts?.length > 0) {
        currContacts.sort((a: any, b: any) =>
          a.user_name.localeCompare(b.user_name),
        );
        obj.data = currContacts;
        contactsArr.push(obj);
      }
    }
    return contactsArr;
  };

  const handleFindFriend = useCallback(() => {
    if (Platform.OS === 'ios' && permission === 'authorized') {
      navigation.navigate('FIND_FRIENDS');
    } else if (Platform.OS === 'android' && permission === 'granted') {
      navigation.navigate('FIND_FRIENDS');
    } else {
      navigation.navigate('FIND_FRIENDS');
    }
  }, [navigation, permission]);

  const searchItems = (text: string) => {
    if (text === '') {
      getMyConnectionsList();
    }
    let newArray = myConnections.filter((item: any) =>
      item?.user_name?.toLowerCase().includes(text.toLowerCase()),
    );
    setNewConnections(newArray);
  };

  const refreshConnectionList = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      getMyConnectionsList();
    }, 500);
  };

  const handleBlockUser = useCallback(() => {
    Alert.alert(
      localize('ARE_YOU_SURE'),
      localize('DO_YOU_REALLY_WANT_TO_BLOCK'),
      [
        {
          text: localize('CANCEL'),
          onPress: () => setIsBlock(false),
          style: 'cancel',
        },
        {
          text: localize('OK'),
          onPress: () => {
            // Handle blocking logic here
            setIsBlock(false);
          },
        },
      ],
      {cancelable: false},
    );
  }, []);

  const handlePinUser = useCallback(() => {
    // Implement pin user logic here
    setIsPin(!isPin);
  }, [isPin]);

  const handleUserDetails = useCallback(
    (userId: string) => {
      // Fetch user details here
      setUserDetails(userId);
    },
    [setUserDetails],
  );

  const handleChatDetail = useCallback(
    (chatId: string) => {
      // Fetch chat details here
      setChatDetail(chatId);
    },
    [setChatDetail],
  );

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <SafeAreaWrapper
        containerStyle={{marginLeft: 0, marginRight: 0, marginTop: 100}}>
        <TouchableOpacity
          style={COMMON_STYLE.listItem}
          onPress={handleFindFriend}>
          <View style={COMMON_STYLE.left}>
            <Image source={IMAGES.InviteIcon} style={COMMON_STYLE.listIcon} />
          </View>
          <View style={COMMON_STYLE.body}>
            <Text
              style={[COMMON_STYLE.listTitle, {color: theme?.colors?.WHITE}]}>
              Find Friends
            </Text>
          </View>
          <View style={COMMON_STYLE.right}>
            <Image source={IMAGES.rightArrow} style={COMMON_STYLE.listIcon} />
          </View>
        </TouchableOpacity>
        {!isLoader ? (
          <>
            {search && (
              <View style={styles.searchView}>
                <View style={{padding: 15}}>
                  <Icon name="search" style={styles.sidenotHiddenColIcon} />
                </View>
                <TextInput
                  onChangeText={text => searchItems(text)}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={theme?.colors?.GRAY_200}
                  style={COMMON_STYLE.input}
                  value={typeText}
                />
              </View>
            )}
            <SectionList
              sections={getData()}
              keyExtractor={(item, index) => item + index}
              renderItem={({item}) => <RowItems item={item} />}
              renderSectionHeader={({section: {title}}) => (
                <Text
                  style={[
                    styles.sectionHeader,
                    {color: theme?.colors?.GRAY_300},
                  ]}>
                  {title}
                </Text>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refreshConnectionList}
                />
              }
            />
          </>
        ) : (
          <NoDataFound message="No data Found" />
        )}
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default MyConnection;
