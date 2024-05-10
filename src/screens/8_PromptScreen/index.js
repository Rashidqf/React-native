import React from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import style
import { style } from './style';
import { Button } from 'react-native-elements';
import { AppContext } from '../../themes/AppContextProvider';

class PromptScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  static contextType = AppContext;

  componentDidMount() {}

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000}>
        <View style={styles.loginContent}>
          <View style={styles.topContent}>
            <Text style={styles.h5}>You’re ready to go</Text>
            <Button
              style={styles.marginTop}
              buttonStyle={styles.button}
              title={'Let’s get you in!'}
              titleStyle={styles.buttonText}
              onPress={() => this.props.navigation.replace('TAB_NAVIGATOR', { fromSignup: true })}
            />
          </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(PromptScreen);
