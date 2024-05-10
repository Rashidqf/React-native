import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

import { Tooltip } from 'react-native-elements';
import MaskInput from 'react-native-mask-input';

//import style
import { style } from './style';

//import themes
import { COMMON_STYLE, IMAGES } from '@themes';

// import Utils
import { Validation } from '@utils';
import { AppContext } from '../../../themes/AppContextProvider';

export default class PhoneTextInput extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = { isShowPass: false };
  }
  static contextType = AppContext;

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const {
      title,
      value,
      placeholder,
      inputContainerStyle,
      inputFocusStyle,
      isPassword,
      hasInfo,
      infoMsg,
      iconRight,
      onPressRight,
      onPressInput,
    } = this.props;
    return (
      <View style={[styles.inputContainerStyle, inputContainerStyle]}>
        {title && <Text style={styles.titleStyle}>{title}</Text>}
        <View style={[styles.inputViewStyle, inputFocusStyle]}>
          {!onPressInput ? (
            <MaskInput
              style={styles.inputStyle}
              placeholderTextColor={theme?.colors?.PLACEHOLDER}
              secureTextEntry={isPassword && !this.state.isShowPass}
              {...this.props}
            />
          ) : (
            <TouchableOpacity style={styles.buttonStyle} activeOpacity={1} onPress={onPressInput}>
              <Text
                style={COMMON_STYLE.textStyle(15, Validation.isEmpty(value) ? theme?.colors?.PLACEHOLDER : theme?.colors?.INPUT_GRAY_COLOR)}
              >
                {Validation.isEmpty(value) ? placeholder : value}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
