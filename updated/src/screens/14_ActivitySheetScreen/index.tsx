import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Platform,
  NativeModules,
} from 'react-native';
import {Button} from 'react-native-elements';
import Contacts from 'react-native-contacts';
import {AppContext} from '../../theme/AppContextProvider';
import {COMMON_STYLE, IMAGES} from '../../theme';
import onShare from '../../utils/deepLinking';
import {style} from './style';
import {SafeAreaWrapper} from '../../components/wrapper';
import {useAppSelector} from '../../store/hooks';
interface Contact {
  displayName?: string;
  givenName?: string;
  phoneNumbers: {number: string}[];
}
var DirectSms = NativeModules.DirectSms;
const ActivitySheetScreen: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact[]>([]);
  const context = useContext(AppContext);
  const userData = useAppSelector(state => state.redState.userData);

  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;
  const styles = style(theme);

  useEffect(() => {
    loadContacts();
  }, []);

  const Invitaion = userData.userInfo.invitation_url;

  const loadContacts = async () => {
    try {
      const allContacts = await Contacts.getAll();
      setContacts(allContacts);
      const count = await Contacts.getCount();
      // Assuming you want to set some state with the count for searchPlaceholder
      // setSearchPlaceholder(`Search ${count} contacts`);
    } catch (e) {
      // Handle errors here
    }
    Contacts.checkPermission();
  };

  const handleSelectContact = (contact: Contact) => {
    if (!selected.some(val => val.displayName === contact.displayName)) {
      setSelected([...selected, contact]);
    } else {
      setSelected(
        selected.filter(val => val.displayName !== contact.displayName),
      );
    }
    inviteFriend(contact.phoneNumbers[0]?.number);
  };

  const inviteFriend = (phoneNumber?: string) => {
    // Handle invitation logic here
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <SafeAreaWrapper
        containerStyle={{marginLeft: 0, marginRight: 0, marginTop: 100}}>
        <View style={COMMON_STYLE.safeAreaWrapper}>
          <TouchableOpacity style={styles.listItem}>
            <View style={COMMON_STYLE.left}>
              <Image source={IMAGES.shareIcon} style={COMMON_STYLE.listIcon} />
            </View>
            <View style={COMMON_STYLE.body}>
              <Text
                style={[COMMON_STYLE.listTitle, {color: theme?.colors?.WHITE}]}>
                Invite friends to Sidenote
              </Text>
            </View>
            <View style={COMMON_STYLE.right}>
              <Image source={IMAGES.rightArrow} style={COMMON_STYLE.listIcon} />
            </View>
          </TouchableOpacity>

          <FlatList
            data={contacts}
            renderItem={({item}) => (
              <View style={styles.contentRow}>
                <View style={COMMON_STYLE.left}>
                  <View
                    style={[
                      COMMON_STYLE.contactProfile,
                      {backgroundColor: theme?.colors?.ORANGE_200},
                    ]}>
                    {/* Uncomment and use the following if needed */}
                    <Text style={[styles.contatLetter, {letterSpacing: 1}]}>
                      {Platform.OS === 'android'
                        ? item?.displayName
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                        : item?.givenName
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')}
                    </Text>
                  </View>
                </View>
                <View style={COMMON_STYLE.body}>
                  {/* Uncomment and use the following if needed */}
                  <Text style={COMMON_STYLE.contatLabel}>
                    {Platform.OS === 'android'
                      ? item?.displayName
                      : item?.givenName}
                  </Text>
                  {item.phoneNumbers[0]?.number ? (
                    <Text style={[styles.contatText, {marginTop: 5}]}>
                      {item.phoneNumbers[0].number}
                    </Text>
                  ) : null}
                </View>
                <View style={COMMON_STYLE.right}>
                  <TouchableOpacity onPress={() => handleSelectContact(item)}>
                    <Image
                      source={
                        selected.some(
                          val => val.displayName === item.displayName,
                        )
                          ? IMAGES.checkIcon2
                          : IMAGES.uncheckIcon2
                      }
                      style={{height: 22, width: 22}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {selected.length > 0 && (
            <View
              style={{
                height: 80,
                backgroundColor: theme?.colors?.TRANSPARENT,
                justifyContent: 'center',
              }}>
              <Button
                buttonStyle={styles.addButton}
                title={`Invite ${selected.length} Contacts`}
                titleStyle={COMMON_STYLE.addButtonText}
                onPress={() => onShare(Invitaion)}
              />
            </View>
          )}
        </View>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default ActivitySheetScreen;
