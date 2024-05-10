import React, { Component } from "react";
import { StyleSheet, Image, Modal, SafeAreaView, Platform } from "react-native";

//import third-party packages
import { ActionCreators } from "@actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import constants
import { COLORS, IMAGES } from "@themes";

// import helpers
import { Responsive } from "@helpers";
import AnimatedLottieView from "lottie-react-native";

class LoadingIndicator extends React.PureComponent<Props> {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.isLoading}
      >
        <SafeAreaView style={[styles.safeAreaStyle]}>
           {/* <Image style={styles.loadingStyle} source={IMAGES.loading} /> */}
           <AnimatedLottieView
            autoPlay
            source={require('./loading.json')}
            loop={true}
            speed={1}
            style={{ justifyContent: 'center', alignContent: 'center', width: 160, height: 160 }}
            autoSize={false}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    isLoading: state.redState.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(LoadingIndicator);

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.DARK_OPACITY,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingStyle: {
    width: Responsive.getWidth(15),
    height: Responsive.getWidth(15),
    resizeMode: "contain",
    padding: Responsive.getWidth(3),
  },
});
