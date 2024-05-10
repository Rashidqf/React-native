import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import { Button, Input, Switch } from 'react-native-elements';
import Contacts from 'react-native-contacts';
import MaskInput, { Masks, createNumberMask } from 'react-native-mask-input';
import { callApi } from '@apiCalls';
import onShare from '../../utils/deepLinking';
import { API_DATA } from '@constants';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      switchNotify: this?.props?.userData?.userInfo?.is_notify_content ? true : false,
      switchSound: this?.props?.userData?.userInfo?.is_play_sound ? true : false,
      reminderColor: false,
      isSelectedNotify: this?.props?.userData?.userInfo?.notify_content_type,
      selectedSound: this?.props?.userData?.userInfo?.message_sound,
      selectedSidenoteSound: this?.props?.userData?.userInfo?.sidenote_sound,
      swithIndicators: this?.props?.userData?.userInfo?.typing_indicators ? true : false,
      soundTitle: '',
      soundSidenoteTitle: '',
    };
    this.onSelect = this.onSelect.bind(this);
  }
  static contextType = AppContext;

  onSelect(value) {
    if (this?.state?.isSelectedNotify !== value) {
      this.setState({ isSelectedNotify: value });
      // } else {
      //   this.setState({ isSelectedNotify: '' });
    }
  }

  componentDidMount() {
    StorageOperation.getData([ASYNC_KEYS.MESSAGE_SOUND]).then(response => {
      this?.setState({
        soundTitle: response[0][1],
      });
    });

    this?.props?.navigation?.setParams({
      handleSubmit: this?.handleSubmit,
    });
  }

  handleSubmit = () => {
    try {
      const params = {
        url: API_DATA.UPDATE_SETTINGS,
        data: {
          notify_content_type: this?.state?.isSelectedNotify ? this?.state?.isSelectedNotify : '',
          message_sound: this?.props?.sound?.name ? this?.props?.sound?.name : this?.state?.selectedSound || '',
          typing_indicators: this?.state?.swithIndicators ? 1 : 0,
          is_notify_content: this?.state?.switchNotify ? 1 : 0,
          is_play_sound: this?.state?.switchSound ? 1 : 0,
          sidenote_sound: this?.props?.sidenoteSound?.name ? this?.props?.sidenoteSound?.name : this?.state?.selectedSidenoteSound || '',
        },
      };

      this.props.showLoading(true);
      callApi([params], this.props.userData.access_token)
        .then(response => {
          this.props.showLoading(false).then(() => {
            let resp = response[API_DATA.UPDATE_SETTINGS];
            if (resp.success) {
              this.props.updateSettings(resp.data);
              StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)]]).then(() => {
                this.saveUserData(resp);
                this.props.showToast(localize('SUCCESS'), resp.message);
              });
              (async () => {
                // if (!this?.state?.firstTimeValue) {
                StorageOperation.setData([[ASYNC_KEYS.MESSAGE_SOUND, this?.props?.sound?.title]]).then(response => {
                  // this?.setState({
                  //   soundTitle : response
                  // })
                });
                // }
              })();
              //  StorageOperation.setData([
              //    [ASYNC_KEYS.FIRST_TIME_LOGIN + this.props?.userData?.userInfo?.id, 'true'],
              //    [ASYNC_KEYS.FIRST_TIME_FEED + this.props?.userData?.userInfo?.id, 'true'],
              //  ]).then(() =>
              //    this.props.navigation.reset({
              //      index: 0,
              //      routes: [
              //        {
              //          name: 'TAB_NAVIGATOR',
              //        },
              //      ],
              //    }),
              //  );
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message, () => {
                this.props.navigation.goBack();
              });
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

  saveUserData(resp) {
    this.props.saveUserData({
      userInfo: resp.data,
    });
  }

  handleNotify = values => {
    this.setState({ switchNotify: values });
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const [newSoundName] = this?.state?.selectedSound?.split('.');
    const [newSoundSidenoteName] = this?.state?.selectedSidenoteSound?.split('.');
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginTop: 100 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.secTitle}>{'Notifications'}</Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionRowTitle}>{'Notify content'}</Text>
              <Switch
                trackColor={{ false: theme?.colors?.GRAY_800, true: theme?.colors?.RED_500 }}
                thumbColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                ios_backgroundColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.GRAY_1000}
                onValueChange={value => this?.handleNotify(value)}
                value={this.state.switchNotify}
              />
            </View>
            {/* <TouchableOpacity style={styles.actionRow}> */}
            <TouchableOpacity style={styles.actionRow} onPress={() => this.onSelect('Name and Content')}>
              <Text style={styles.actionRowTitle}>{'Name and Content'}</Text>
              <View>
                {this.state.isSelectedNotify === 'Name and Content' ? <Image source={IMAGES.check2} style={styles.checkIcon} /> : null}
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionRow}> */}
            <TouchableOpacity style={styles.actionRow} onPress={() => this.onSelect('Name')}>
              <Text style={styles.actionRowTitle}>{'Name Only'}</Text>
              <View>{this.state.isSelectedNotify === 'Name' ? <Image source={IMAGES.check2} style={styles.checkIcon} /> : null}</View>
            </TouchableOpacity>
            <Text style={styles.secTitle}>{'Sounds'}</Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionRowTitle}>{'Play sounds'}</Text>
              <Switch
                trackColor={{ false: theme?.colors?.GRAY_800, true: theme?.colors?.RED_500 }}
                thumbColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                ios_backgroundColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.GRAY_1000}
                onValueChange={value => this.setState({ switchSound: value })}
                value={this.state.switchSound}
              />
            </View>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                this?.props?.navigation?.navigate('SoundsScreen', {
                  selectedSound: this?.props?.sound?.name
                    ? this?.props?.sound?.title
                    : this?.state?.selectedSound
                      ? newSoundName
                      : this?.state?.soundTitle,
                })
              }
            >
              {this?.props?.sound?.name || this?.state?.soundTitle || this?.state?.selectedSound ? (
                <Text style={styles.actionRowTitle}>{this?.props?.sound?.title || this?.state?.soundTitle || newSoundName}</Text>
              ) : (
                <Text style={styles.actionRowTitle}>{'Message Sound'}</Text>
              )}
              <View>
                <Image source={IMAGES.downArrow} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
            <Text style={styles.secTitle}>{'Messaging'}</Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionRowTitle}>{'Typing Indicators'}</Text>
              <Switch
                trackColor={{ false: theme?.colors?.GRAY_800, true: theme?.colors?.RED_500 }}
                thumbColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.WHITE}
                ios_backgroundColor={this.state.reminderColor === true ? theme?.colors?.RED_500 : theme?.colors?.GRAY_1000}
                onValueChange={value => this.setState({ swithIndicators: value })}
                value={this.state.swithIndicators}
              />
            </View>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() =>
                this?.props?.navigation?.navigate('SidenoteSoundsScreen', {
                  selectedSidenoteSound: this?.props?.sidenoteSound?.name
                    ? this?.props?.sidenoteSound?.title
                    : this?.state?.selectedSidenoteSound
                      ? newSoundSidenoteName
                      : this?.state?.soundSidenoteTitle,
                })
              }
            >
              {this?.props?.sidenoteSound?.name || this?.state?.sidenotetitle || this?.state?.selectedSidenoteSound ? (
                <Text style={styles.actionRowTitle}>
                  {this?.props?.sidenoteSound?.title || this?.state?.soundSidenoteTitle || newSoundSidenoteName}
                </Text>
              ) : (
                <Text style={styles.actionRowTitle}>{'Message Sound'}</Text>
              )}
              <View>
                <Image source={IMAGES.downArrow} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
            <Text style={styles.secTitle}>{'Privacy'}</Text>
            <TouchableOpacity style={styles.actionRow} onPress={() => this?.props.navigation.navigate('BLOCKED_USER')}>
              <Text style={styles.actionRowTitle}>{'Blocked Users'}</Text>
              <View>
                <Image source={IMAGES.downArrow} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    settings: state.redState.settings,
    sound: state.redState.sound,
    sidenoteSound: state.redState.sidenoteSound,
    blockUserList: state?.groupState.blockUserList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
