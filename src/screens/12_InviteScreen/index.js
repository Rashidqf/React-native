import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES } from '@themes';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import { AppContext } from '../../themes/AppContextProvider';
import { COLORS } from '../../themes/colors';

class InviteScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      searchPlaceholder: 'Search',
      typeText: null,
      loading: true,
      permission: '',
    };
    Contacts.iosEnableNotesUsage(false);
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getContact();
  }

  getContact() {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission().then(permission => {
        if (permission === 'undefined') {
          Contacts.requestPermission().then(permission => {});
        }
        if (permission === 'authorized') {
          this.setState({ permission });
          this.loadContacts();
        }
        if (permission === 'denied') {
          this.setState({ permission });
        }
      });
    } else {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(errr => {
        if (errr === 'granted') {
          this.props.navigation.navigate('FIND_FRIENDS', { contact: this.state.contacts });
        }
        if (errr === 'denied') {
          this.props.navigation.goBack();
        }
      });
    }
  }

  loadContacts() {
    // console.log('object');
    Contacts.getAll()
      .then((err, contacts) => {
        // console.log('user errro ====>', err[0]);

        this.setState({ contacts, loading: false });
        this.props.navigation.navigate('FIND_FRIENDS', { contact: contacts });
      })
      .catch(e => {
        // console.log('ERR', e);
        this.setState({ loading: false });
      });

    Contacts.getCount().then(count => {
      this.setState({ searchPlaceholder: `Search ${count} contacts` });
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
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <View style={styles.loginContent}>
            <View style={styles.topContent}>
              <View style={styles.inviteImageView}>
                <View style={styles.inviteImageCircle} />
                <Image source={IMAGES.openDoodlesLoving} style={styles.inviteImage} />
              </View>
              <Text style={styles.inviteText}>Find & Invite Friends</Text>
              <Text style={styles.preStyle}>
                Find friends already on Sidenote and add them to your contacts. Invite others that haven’t join the conversation yet.
              </Text>
              <Button
                style={styles.buttonContainerStyle}
                buttonStyle={[styles.button, { backgroundColor: COLORS.ORANGE_200 }]}
                title={'Invite Friends'}
                titleStyle={styles.buttonText}
                onPress={() => this.getContact()}
              />
              <Button
                style={styles.marginTop}
                buttonStyle={[styles.buttonTrans, { marginTop: 20 }]}
                title={'Maybe Later'}
                titleStyle={styles.buttonTransText}
                onPress={() => this.props.navigation.navigate('TAB_NAVIGATOR')}
              />
            </View>
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(InviteScreen);
