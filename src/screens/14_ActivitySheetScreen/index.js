import React from 'react';

import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  SectionList,
  NativeModules,
  PermissionsAndroid,
  ImageBackground,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import Contacts from 'react-native-contacts';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { callApi } from '@apiCalls';
import onShare from '../../utils/deepLinking';

import { API_DATA } from '@constants';
import { AppContext } from '../../themes/AppContextProvider';
import { COLORS } from '../../themes/colors';
var DirectSms = NativeModules.DirectSms;
class ActivitySheetScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      selected: [],
      shareUrl: '',
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.loadContacts();
  }

  loadContacts() {
    Contacts.getAll()
      .then(contacts => {
        // console.log('user errro ====>', contacts);

        this.setState({ contacts, loading: false });
      })
      .catch(e => {
        this.setState({ loading: false });
      });

    Contacts.getCount().then(count => {
      this.setState({ searchPlaceholder: `Search ${count} contacts` });
    });

    Contacts.checkPermission();
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.left}>
              <Image source={IMAGES.shareIcon} style={styles.listIcon} />
            </View>
            <View style={styles.body}>
              <Text style={[styles.listTitle, { colors: theme?.colors?.WHITE }]}>Invite friends to Sidenote</Text>
            </View>
            <View style={styles.right}>
              <Image source={IMAGES.rightArrow} style={styles.listIcon} />
            </View>
          </TouchableOpacity>

          <FlatList
            data={this.state.contacts || []}
            // ListHeaderComponent={() => <Button title="Add Content" />}
            renderItem={({ item }) => (
              <View style={styles.contentRow}>
                <View style={styles.left}>
                  <View style={[styles.contactProfile, { backgroundColor: theme?.colors?.ORANGE_200 }]}>
                    <Text style={[styles.contatLetter, { letterSpacing: 1 }]}>
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
                <View style={styles.body}>
                  <Text style={styles.contatLabel}>{Platform.OS === 'android' ? item?.displayName : item?.givenName}</Text>
                  {item.phoneNumbers[0] !== 'undefined' ? (
                    <Text style={[styles.contatText, { marginTop: 5 }]}>{item?.phoneNumbers[0]?.number}</Text>
                  ) : // <MaskInput
                  //   value={item?.phoneNumbers[0]?.number}
                  //   editable={false}
                  //   style={styles.contatText}
                  //   mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                  // />
                  null}
                </View>
                <View style={styles.right}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!this.state.selected?.some(val => val?.displayName === item.displayName)) {
                        this.setState({
                          selected: [...this.state.selected, item],
                        });
                      } else {
                        this.setState({
                          selected: this.state.selected.filter(val => val.displayName !== item?.displayName),
                        });
                      }
                      this.inviteFriend(item?.phoneNumbers[0]?.number);
                    }}
                  >
                    <Image
                      source={
                        this.state.selected.some(val => val?.displayName === item?.displayName) ? IMAGES.checkIcon2 : IMAGES.uncheckIcon2
                      }
                      style={{ height: 22, width: 22 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.index}
          />
          {this.state.selected.length === 0 ? null : (
            <View
              style={{
                height: 80,
                // borderTopWidth: 2,
                // borderColor: 'rgba(255, 255, 255, 0.08)',
                backgroundColor: theme?.colors?.TRANSPARENT,
                justifyContent: 'center',
              }}
            >
              <Button
                buttonStyle={styles.addButton}
                title={`Invite ${this.state.selected.length} Contacts`}
                titleStyle={styles.addButtonText}
                onPress={() => onShare(this.state.shareUrl.url)}
              />
            </View>
          )}
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
export default connect(mapStateToProps, mapDispatchToProps)(ActivitySheetScreen);
