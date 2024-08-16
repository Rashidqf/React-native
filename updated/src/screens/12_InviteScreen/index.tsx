import React, {useEffect, useState, useContext} from 'react';
import {
  Image,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  ImageBackground,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {Button} from 'react-native-elements';
import {SafeAreaWrapper} from '../../components/wrapper';
import {COLORS, COMMON_STYLE, IMAGES} from '../../theme';
import {AppContext} from '../../theme/AppContextProvider';
import {style} from './style';
import {useAppDispatch, useAppSelector} from '../../store/hooks';

const InviteScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search');
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<string>('');
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.dashboardState.contactList);
  const {theme} = context;
  const styles = style(theme);

  useEffect(() => {
    getContact();
  }, []);

  const getContact = async () => {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission().then(permission => {
        if (permission === 'undefined') {
          Contacts.requestPermission().then(permission => {});
        }
        if (permission === 'authorized') {
          setPermission(permission);
          loadContacts();
        }
        if (permission === 'denied') {
          setPermission(permission);
        }
      });
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      })
        .then(res => {
          if (res === PermissionsAndroid.RESULTS.GRANTED) {
            loadContacts();
          } else {
            console.log('Contacts permission denied');
          }
        })
        .catch(error => {
          console.error('Permission error: ', error);
        });
    }
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        setContacts(contacts);
        setLoading(false);
        navigation.navigate('FIND_FRIENDS', {contact: contacts});
      })
      .catch(e => {
        setLoading(false);
      });

    Contacts.getCount().then(count => {
      setSearchPlaceholder(`Search ${count} contacts`);
    });

    Contacts.checkPermission().then(permission => {
      if (permission === 'undefined') {
        Contacts.requestPermission().then(permission => {});
      }
      if (permission === 'authorized') {
      }
      if (permission === 'denied') {
      }
    });
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <SafeAreaWrapper>
        <View style={styles.loginContent}>
          <View style={styles.topContent}>
            <View style={styles.inviteImageView}>
              <View style={styles.inviteImageCircle} />
              <Image
                source={IMAGES.openDoodlesLoving}
                style={styles.inviteImage}
              />
            </View>
            <Text style={styles.inviteText}>Find & Invite Friends</Text>
            <Text style={styles.preStyle}>
              Find friends already on Sidenote and add them to your contacts.
              Invite others that haven’t joined the conversation yet.
            </Text>
            <Button
              style={COMMON_STYLE.buttonContainerStyle}
              buttonStyle={[
                COMMON_STYLE.button,
                {backgroundColor: COLORS.ORANGE_200},
              ]}
              title={'Invite Friends'}
              titleStyle={COMMON_STYLE.buttonText}
              onPress={getContact}
            />
            <Button
              style={COMMON_STYLE.marginTop}
              buttonStyle={[COMMON_STYLE.buttonTrans, {marginTop: 20}]}
              title={'Maybe Later'}
              titleStyle={COMMON_STYLE.buttonTransText}
              onPress={() => navigation.navigate('TAB_NAVIGATOR')}
            />
          </View>
        </View>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default InviteScreen;
