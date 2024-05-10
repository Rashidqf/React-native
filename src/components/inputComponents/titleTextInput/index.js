import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

import { Tooltip } from 'react-native-elements';
import MaskInput from 'react-native-mask-input';

// import helpers
import { Responsive } from '@helpers';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';

//import themes
import { COMMON_STYLE, IMAGES } from '@themes';

// import Utils
import { Validation } from '@utils';
import { AppContext } from '../../../themes/AppContextProvider';

export default class TitleTextInput extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isShowPass: false,
      hasFocus: false,
    };
  }
  static contextType = AppContext;

  setFocus(hasFocus) {
    this.setState({ hasFocus });
  }
  setBlur(hasFocus) {
    this.setState({ hasFocus });
  }
  focus(hasFocus) {
    this.setState({ hasFocus });
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const {
      title,
      value,
      placeholder,
      inputStyle,
      inputContainerStyle,
      inputFocusStyle,
      isPassword,
      hasInfo,
      infoMsg,
      iconRight,
      onPressRight,
      onPressInput,
      onFocus,
      editable,
    } = this.props;
    return (
      <View style={[styles.inputContainerStyle, inputContainerStyle]}>
        {title && <Text style={[styles.titleStyle, { marginLeft: 6 }]}>{title}</Text>}
        <View
          style={
            this.state.hasFocus
              ? [styles.inputViewFocusStyle, { backgroundColor: theme?.colors?.MASK_INPUT }]
              : [styles.inputViewStyle, inputFocusStyle, { backgroundColor: theme?.colors?.MASK_INPUT }]
          }
        >
          {!onPressInput ? (
            <MaskInput
              style={[styles.inputStyle, inputStyle]}
              placeholderTextColor={theme?.colors?.PLACEHOLDER}
              onFocus={this.setFocus.bind(this, true)}
              onBlur={this.setBlur.bind(this, false)}
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
          {isPassword && (
            <TouchableOpacity
              style={styles.btnStyle}
              onPress={() =>
                this.setState(prevState => {
                  return {
                    isShowPass: !prevState.isShowPass,
                  };
                })
              }
            >
              <Image
                source={!this.state.isShowPass ? IMAGES.invisible : IMAGES.visible}
                style={[COMMON_STYLE.imageStyle(6), styles.isShowPassStyle]}
              />
            </TouchableOpacity>
          )}

          {hasInfo && (
            <Tooltip
              popover={<Text style={styles.infoTitleStyle}>{infoMsg}</Text>}
              height={150}
              width={300}
              backgroundColor={theme?.colors?.WHITE}
              overlayColor={theme?.colors?.DARK_OPACITY}
            >
              <Image source={IMAGES.info} style={COMMON_STYLE.imageStyle(6)} />
            </Tooltip>
          )}

          {iconRight && (
            <TouchableOpacity style={styles.btnStyle} onPress={onPressRight}>
              <Image source={iconRight} style={COMMON_STYLE.imageStyle(6)} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
