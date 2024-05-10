import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, ScrollView, Animated } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Toast from 'react-native-toast-message';

import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

// import helpers
import { Responsive } from '@helpers';

// import Languages
import { localize } from '@languages';

//import style
import { styles } from './style';

import { IMAGES } from '@themes';

// import constants
import { COLORS, COMMON_STYLE } from '@themes';

const toastHeight = Responsive.getHeight(12) + initialWindowSafeAreaInsets.top;

class ToastAlert extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    this.state = {
      animation: new Animated.Value(-toastHeight),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("update >>>> toast");
    // if (prevProps.toastData != this.props.toastData) {
    Toast.show({
      type: this.props.toastData.toastTitle.toLowerCase() === 'error' ? 'error' : 'success',
      text1: this.props.toastData.toastTitle,
      text2: this.props.toastData.toastMsg,
      visibilityTime: 5000,
      autoHide: true,
    });
    //   if (this.props.toastData.isShowToast) {
    //     console.log("will show toast ");
    //     if (this.toastTimeout) {
    //       console.log("time out call ");
    //       this.toastTimeout = undefined;
    //
    //       const toastTitle = this.props.toastData.toastTitle;
    //       const toastMsg = this.props.toastData.toastMsg;
    //       this.hideToast(300).then(() => {
    //         console.log("complete hide");
    //         this.props.showToast(toastTitle, toastMsg);
    //       });
    //     } else {
    //       this.showToast();
    //     }
    //   }
    // }
  }

  showToast = () => {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      this.state.animation.setValue(0);
      this.toastTimeout = setTimeout(() => {
        this.hideToast();
      }, 5000);
    });
  };

  hideToast = (duration = 800) => {
    return new Promise((resolve, reject) => {
      Animated.timing(this.state.animation, {
        toValue: -toastHeight,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        this.toastTimeout = undefined;
        this.state.animation.setValue(-toastHeight);
        this.props.hideToast();
        resolve(true);
      });
    });
  };

  render() {
    const transformStyle = {
      transform: [
        {
          translateY: this.state.animation,
        },
      ],
    };

    return <Toast ref={ref => Toast.setRef(ref)} />;
  }
}

// <Animated.View
//   style={[{ width: "100%", position: "absolute" }, transformStyle]}
// >
//   <SafeAreaView style={styles.safeAreaStyle}>
//     <View style={styles.alertBoxStyle}>
//       <Text numberOfLines={1} style={styles.titleStyle}>
//         {this.props.toastData.toastTitle}
//       </Text>
//       <Text numberOfLines={2} style={styles.descriptionStyle}>
//         {this.props.toastData.toastMsg}
//       </Text>
//     </View>
//   </SafeAreaView>
// </Animated.View>

function mapStateToProps(state, props) {
  return {
    toastData: state.redState.toastData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ToastAlert);
