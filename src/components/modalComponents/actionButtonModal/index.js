import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, Animated } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import helpers
import { Responsive } from '@helpers';

// import Languages
import { localize } from '@languages';

//import style
import { style } from './style';

import { IMAGES } from '@themes';
import Icon from 'react-native-vector-icons/MaterialIcons';

// import constants
import { COLORS, COMMON_STYLE } from '@themes';
// import { Modal } from 'react-native-paper';
import { AppContext } from '../../../themes/AppContextProvider';
import CustomFab from '../../floating/CustomFab';
import { useNavigation } from '@react-navigation/native';

class ActionButtonModal extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.rotationValue = new Animated.Value(0);
  }

  static contextType = AppContext;
  toggleFAB = () => {
    this?.props?.showModalAction(false);

    const toValue = this?.props?.showModal ? 0 : 1;
    Animated.spring(this.rotationValue, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const rotation = this.rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });

    return (
      <Modal animationType="fade" transparent={true} visible={this?.props?.showModal} onDismiss={() => this?.props?.showModalAction(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', paddingTop: '95%' }}>
          <TouchableOpacity style={[styles.modalBodyclose]} onPress={() => this?.props?.showModalAction(false)}></TouchableOpacity>

          <View style={styles.modalView}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    this?.props?.navigation.navigate('SIDENOTE_FRIENDS');
                    this?.props?.showModalAction(false);
                  }}
                >
                  <Image source={IMAGES.new_sidenote} style={{ height: 32, width: 32 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Sidenote</Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    this?.props?.navigation.navigate('CREATE_TASK');
                    this?.props?.showModalAction(false);
                  }}
                >
                  <Image source={IMAGES.calAddIcon} style={{ height: 27, width: 27 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Event</Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    this?.props?.navigation.navigate('NEW_TASK');
                    this?.props?.showModalAction(false);
                  }}
                >
                  <Image source={IMAGES.new_task} style={{ height: 27, width: 27 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Task </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.actionItem}>
                <TouchableOpacity style={styles.actionButton} onPress={() => {
                    this?.props?.navigation.navigate('MY_CONNECTION');
                    this?.props?.showModalAction(false);
                  }}>
                  <Image source={IMAGES.direct_message} style={{ height: 27, width: 27 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Direct Message </Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    this?.props?.navigation.navigate('New_Itinerary');
                    this?.props?.showModalAction(false);
                  }}
                >
                  <Image source={IMAGES.calAddIcon} style={{ height: 27, width: 27 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Itinerary</Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity style={styles.actionButton}  onPress={() => {
                    this?.props?.navigation.navigate('FIND_FRIENDS');
                    this?.props?.showModalAction(false);
                  }}>
                  <Image source={IMAGES.connection} style={{ height: 27, width: 27 }} />
                </TouchableOpacity>
                <Text style={styles.actionText}>New{'\n'}Connection</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.fab, { backgroundColor: '#403C3C' }]} onPress={this.toggleFAB}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Icon name={'clear'} size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
    showModal: state.dashboardState.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ActionButtonModal);
