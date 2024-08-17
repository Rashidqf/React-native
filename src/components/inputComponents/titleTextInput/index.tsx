import React, {useContext} from 'react';
import {Text, View, TouchableOpacity, Image, TextInput} from 'react-native';

import {Tooltip} from 'react-native-elements';
import MaskInput from 'react-native-mask-input';

import {style} from './style';
import {COMMON_STYLE, IMAGES} from '../../../theme';
import {Validation} from '../../../utils';
import {AppContext} from '../../../theme/AppContextProvider';

interface Props {
  title: string;
  value: string;
  onChangeText: (newValue: string) => void;
  placeholder?: string;
  inputStyle?: any;
  inputContainerStyle?: any;
  inputFocusStyle?: any;
  isPassword?: boolean;
  hasInfo?: boolean;
  infoMsg?: string;
  iconRight?: any;
  onPressRight?: () => void;
  onPressInput?: () => void;
  onFocus?: () => void;
  editable?: boolean;
}

const TitleTextInput: React.FC<Props> = ({
  title,
  value,
  onChangeText,
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
}) => {
  const context = useContext(AppContext);
  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;
  const styles = style(theme);
  const [isShowPass, setIsShowPass] = React.useState(false);
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleFocus = () => {
    setHasFocus(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const togglePasswordVisibility = () => {
    setIsShowPass(prevState => !prevState);
  };

  return (
    <View style={[styles.inputContainerStyle, inputContainerStyle]}>
      {title && (
        <Text style={[styles.titleStyle, {marginLeft: 6}]}>{title}</Text>
      )}
      <View
        style={
          hasFocus
            ? [
                styles.inputViewFocusStyle,
                {backgroundColor: theme?.colors?.MASK_INPUT},
              ]
            : [
                styles.inputViewStyle,
                inputFocusStyle,
                {backgroundColor: theme?.colors?.MASK_INPUT},
              ]
        }>
        {!onPressInput ? (
          <MaskInput
            style={[styles.inputStyle, inputStyle]}
            placeholderTextColor={theme?.colors?.PLACEHOLDER}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPassword && !isShowPass}
            value={value}
            onChangeText={onChangeText}
            {...(placeholder ? {placeholder} : {})}
          />
        ) : (
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={1}
            onPress={onPressInput}>
            <Text
              style={COMMON_STYLE.textStyle(
                15,
                Validation.isEmpty(value)
                  ? theme?.colors?.PLACEHOLDER
                  : theme?.colors?.INPUT_GRAY_COLOR,
              )}>
              {Validation.isEmpty(value) ? placeholder : value}
            </Text>
          </TouchableOpacity>
        )}
        {isPassword && (
          <TouchableOpacity
            style={styles.btnStyle}
            onPress={togglePasswordVisibility}>
            <Image
              source={!isShowPass ? IMAGES.invisible : IMAGES.visible}
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
            overlayColor={theme?.colors?.DARK_OPACITY}>
            <Image
              source={require('../../../assets/images/background/Group1.png')}
              style={COMMON_STYLE.imageStyle(6)}
            />
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
};

export default TitleTextInput;
