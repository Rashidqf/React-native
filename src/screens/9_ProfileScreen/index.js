import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import api functions
import { callApi } from '@apiCalls';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

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
import { AppContext } from '../../themes/AppContextProvider';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: {
        value: this.props.userData.userInfo.name,
        isError: false,
        title: 'Full Name',
      },
      email: {
        value: this.props.userData.userInfo.email,
        isError: false,
        title: 'Email Address',
        extraProps: { keyboardType: 'email-address' },
      },
      phone: {
        value: this.props.userData.userInfo.phone,
        isError: false,
        title: 'Enter your phone number',
        extraProps: {
          maxLength: 15,
          keyboardType: 'number-pad',
          mask: text => {
            return [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
          },
        },
      },
    };
  }
  static contextType = AppContext;
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getProfileDetail();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  //get profile detail
  getProfileDetail() {
    try {
      const params = {
        url: API_DATA.PROFILE,
      };
      var accessToken = this.props.userData.access_token;
      this.props.showLoading(true);
      callApi([params], accessToken)
        .then(response => {
          let resp = response[API_DATA.PROFILE];
          this.props.showLoading(false).then(() => {
            if (resp.success) {
              StorageOperation.setData([[ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)]]).then(() => {
                this.saveUserData(resp);
              });
            } else {
              this.props.showErrorAlert(localize('ERROR'), resp.message);
            }
          });
        })
        .catch(error => {
          this.props.showLoading(false);
        });
    } catch (e) {
      console.log('catch error >>> ', e);
      this.setState({ isStartApiCalling: false });
    }
  }

  saveUserData(resp) {
    this.props.saveUserData({
      userInfo: resp.data,
    });
  }

  // render custom component
  renderInputComponent(key) {
    const temp = this.state[key];

    return (
      <TitleTextInput
        title={temp.title}
        value={temp.value}
        onChangeText={masked => {
          this.changeData(key, {
            value: masked,
          });
        }}
        {...temp.extraProps}
      />
    );
  }

  changeData(key, object) {
    var tmpObj = {};
    tmpObj[key] = { ...this.state[key], ...object };
    this.setState(tmpObj);
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={100}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.loginContent}>
                <View style={styles.topContent}>
                  <View style={styles.profilePhoto}>
                    <Image source={IMAGES.avtar} style={styles.profileImg} />
                    <TouchableOpacity style={styles.addIconStyle}>
                      <Image source={IMAGES.addIcon} style={styles.addIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
                {this.renderInputComponent('fullname')}
                {this.renderInputComponent('email')}
                {this.renderInputComponent('phone')}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaWrapper>
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
