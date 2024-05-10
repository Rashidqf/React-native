import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// ThirdParty Components
import {Button} from 'react-native-elements';

// import helpers
import {Responsive} from '@helpers';

// import Languages
import {localize} from '@languages';

//import style
import {styles} from './style';

// import constants
import {COLORS, IMAGES, COMMON_STYLE} from '@themes';

export default class AlertActionModel extends React.PureComponent<Props> {
  static defaultProps = {
    alertTitle: '',
    alertMsg: '',
    alertImage: '',
    successBtnTitle: localize('OK'),
    cancelBtnTitle: localize('CANCEL'),
  };

  _renderBotton(obj = {color: COLORS.RED}) {
    return (
      <Button
        title={obj.btnTitle}
        buttonStyle={styles.btnStyle(obj.color)}
        titleStyle={COMMON_STYLE.textStyle(13, COLORS.WHITE, 'BOLD')}
        onPress={obj.onPress}
      />
    );
  }

  render() {
    const {
      isShowModel,
      alertTitle,
      alertMsg,
      alertImage,
      cancelBtnTitle,
      successBtnTitle,
      onPressCancel,
      onPressSuccess,
      onPressClose,
    } = this.props;

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.isShowModel}>
        <SafeAreaView style={styles.safeAreaStyle}>
          <View style={styles.alertBoxStyle}>
            {onPressClose && (
              <Button
                buttonStyle={styles.closeButtonStyle}
                icon={
                  <Image
                    style={COMMON_STYLE.imageStyle(4)}
                    source={IMAGES.cross}
                  />
                }
                onPress={onPressClose}
              />
            )}

            {alertImage ? (
              <Image
                style={[COMMON_STYLE.imageStyle(10), {alignSelf: 'center'}]}
                source={alertImage}
              />
            ) : null}
            <Text numberOfLines={2} style={styles.titleStyle}>
              {alertTitle}
            </Text>

            <ScrollView bounces={false}>
              <Text style={styles.descriptionStyle}>{alertMsg}</Text>
            </ScrollView>

            <View style={styles.buttonViewStyle}>
              {onPressCancel
                ? this._renderBotton({
                    btnTitle: cancelBtnTitle,
                    onPress: onPressCancel,
                    color: COLORS.RED,
                  })
                : undefined}
              {this._renderBotton({
                btnTitle: successBtnTitle,
                onPress: onPressSuccess,
                color: COLORS.RED,
              })}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
