// COMOPONENT OR LIBRARY IMPORT
import React, { Fragment } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import themes
import { COLORS, IMAGES, COMMON_STYLE } from '@themes';

// import helpers
import { Responsive } from '@helpers';

//import languages
import { localize } from '@languages';

class Wrapper extends React.PureComponent {
  static defaultProps = {
    backgroundColor: COLORS.WHITE,
    statusBarColor: COLORS.TRANSPARENT,
    bgImage: '',
    isTranslucent: true,
  };

  render() {
    const {
      isTranslucent,
      backgroundColor,
      statusBarColor,
      containerStyle,
      children,
      bgImage,
    } = this.props;
    return (
      <Fragment>
        <StatusBar
          backgroundColor={statusBarColor}
          translucent={isTranslucent}
          barStyle="light-content"
        />

        <View style={styles.safeAreaViewStyle(backgroundColor)}>
          <Image style={styles.backgroundStyle} source={bgImage} />
          <View style={[styles.containerViewStyle]}>
            <SafeAreaView style={[styles.containerStyle, containerStyle]}>
              {children}
            </SafeAreaView>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaViewStyle: color => {
    return {
      flex: 1,
      backgroundColor: color,
    };
  },
  backgroundStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  containerViewStyle: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  containerStyle: {
    flex: 1,
    ...COMMON_STYLE.marginStyle(6, 6),
  },
});

function mapStateToProps(state, props) {
  return {
    isOnline: state.redState.isOnline,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export const SafeAreaWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wrapper);
