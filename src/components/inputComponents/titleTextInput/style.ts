import {Responsive} from './../../../helper/responsive';
import {StyleSheet} from 'react-native';

//import themes
import {COMMON_STYLE, IMAGES} from '../../../theme';

export const style = (theme: any) =>
  StyleSheet.create({
    inputContainerStyle: {
      flex: 1,
      marginBottom: 4,
      marginTop: Responsive.getWidth(4),
    },
    titleStyle: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.WHITE, 'BOLD'),
      lineHeight: Responsive.getWidth(9),
    },
    inputViewStyle: {
      width: '100%',
      height: Responsive.getWidth(14),
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: 'transparent',
      borderRadius: Responsive.getWidth(3),
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      ...COMMON_STYLE.paddingStyle(3, 3),
      alignItems: 'center',
    },
    inputViewFocusStyle: {
      width: '100%',
      height: Responsive.getWidth(14),
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_100,
      borderRadius: Responsive.getWidth(3),
      backgroundColor: theme?.colors?.GRAY_1000,
      overflow: 'hidden',
      ...COMMON_STYLE.paddingStyle(3, 3),
      alignItems: 'center',
    },
    inputFocusStyle: {
      backgroundColor: 'transparent',
      borderColor: '#C8BCBC',
    },
    inputStyle: {
      height: '100%',
      flex: 1,
      ...COMMON_STYLE.textStyle(13, theme?.colors?.GRAY_50, 'BOLD'),
    },
    buttonStyle: {height: '100%', flex: 1, justifyContent: 'center'},
    infoTitleStyle: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.INPUT_GRAY_COLOR),
      width: '100%',
    },
    btnStyle: {
      ...COMMON_STYLE.marginStyle(3),
      height: '100%',
      justifyContent: 'center',
    },
    isShowPassStyle: {
      tintColor: theme?.colors?.GRAY_100,
    },
  });
