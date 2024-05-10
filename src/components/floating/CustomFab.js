import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Animated, Modal, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CustomFAB extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rotationValue = new Animated.Value(0);
  }
  toggleFAB = () => {
    this?.props?.showModalAction(!this?.props?.showModal);

    const toValue = this?.props?.showModal ? 0 : 1;
    Animated.spring(this.rotationValue, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };
  render() {
    const fabBackgroundColor = this?.props?.showModal ? '#000000' : '#FF4403';
    const rotation = this.rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    }
    );
    return (
      <TouchableOpacity style={[styles().fab, { backgroundColor: fabBackgroundColor }]} onPress={this.toggleFAB}>
        <Animated.View>
          <Icon name={'add'} size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = theme =>
  StyleSheet.create({
    fab: {
      backgroundColor: '#FF4403',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Add shadow on Android
      position: 'absolute',
      right: 20,
      bottom: 20,
    },
  });

function mapStateToProps(state, props) {
  return {
    showModal: state?.dashboardState?.showModal,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(CustomFAB);
