import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableWithoutFeedback,
  TextInput,
  Modal
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

//import components
import { SafeAreaWrapper, ItinerariesCard, EventCard } from '@components';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import _ from 'lodash';
import { AppContext } from '../../themes/AppContextProvider';

class ItineraryDescriptionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      // headerRight: () => {
      //   const { theme } = this.context;
      //   return (
      //     <TouchableOpacity style={COMMON_STYLE.headerBtnStyle}>
      //       {/* <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text> */}
      //       <Image source={IMAGES.more} style={COMMON_STYLE.imageStyle(6)} />
      //     </TouchableOpacity>
      //   );
      // },
    });

    this.state = {
      isVisible: true,
      modalVisible: false,
    };
  }
  static contextType = AppContext;


  componentDidMount() {
    // this.props.showLoading(true);
  }


  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            enabled
            keyboardVerticalOffset={120}
          >
            <View style={styles.container}>
              <TextInput
                placeholder={'Message goes here...'}
                placeholderTextColor={theme?.colors?.GRAY_100}
                style={styles.inputStyle}
                multiline
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                <Image source={IMAGES.insert_link_icon} style={styles.linkIcon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.saveBtnTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaWrapper>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: !this.state.modalVisible,
            });
          }}
        >
          <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Insert link</Text>
                <View style={styles.modalInputView}>
                  <TextInput
                    placeholder={'Text'}
                    placeholderTextColor={'#888583'}
                    style={styles.modalInput}
                  />
                  <View style={styles.modalInputSep} />
                  <TextInput
                    placeholder={'URL'}
                    placeholderTextColor={'#888583'}
                    style={styles.modalInput}
                  />
                </View>
                <View style={styles.modalBtnsView}>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => this.setState({ modalVisible: false })}
                  >
                    <Text style={styles.modalBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtn}>
                    <Text style={styles.modalBtnText}>Insert</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    itineraryDraftList: state?.dashboardState?.itineraryDraftList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ItineraryDescriptionScreen);
