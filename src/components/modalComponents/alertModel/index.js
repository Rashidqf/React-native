import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import helpers
import { Responsive } from '@helpers';

// import Languages
import { localize } from '@languages';

//import style
import { styles } from './style';

import { IMAGES } from '@themes';

// import constants
import { COLORS, COMMON_STYLE } from '@themes';

class AlertModel extends React.PureComponent<Props> {
  static defaultProps = {
    alertImage: IMAGES.app_logo,
    successBtnTitle: localize('OK'),
    cancelBtnTitle: localize('CANCEL'),
  };

  _renderBotton(obj = { color: COLORS.ALERT_BUTTON }) {
    return (
      <TouchableOpacity style={styles.btnStyle} onPress={obj.onPress}>
        <Text style={styles.btnTitleStyle(obj.color)}>{obj.btnTitle}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { alertImage, cancelBtnTitle, successBtnTitle } = this.props;

    return (
      <Modal animationType="fade" transparent={true} visible={this.props.alertData.isShowAlert}>
        <SafeAreaView style={styles.safeAreaStyle}>
          <View style={styles.alertBoxStyle}>
            {alertImage && <Image style={[styles.alertImageStyle]} source={alertImage} />}

            {this.props.alertData.alertTitle && (
              <Text numberOfLines={2} style={styles.titleStyle}>
                {this.props.alertData.alertTitle}
              </Text>
            )}
            <ScrollView bounces={false}>
              <Text style={styles.descriptionStyle}>{this.props.alertData.alertMsg}</Text>
            </ScrollView>
            <View style={styles.buttonViewStyle}>
              {this._renderBotton({
                btnTitle: successBtnTitle,
                color: COLORS.ALERT_BUTTON,
                onPress: () => {
                  try {
                    this.props.alertData.onPressOk();
                  } catch (e) {}
                  this.props.hideErrorAlert();
                },
              })}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AlertModel);
