import {StyleSheet} from 'react-native';

import {Responsive} from '../../helper';
import {COMMON_STYLE, STYLES} from '../../theme';

export const style = (theme: any) =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      paddingBottom: Responsive.getWidth(5),
    },
    inputCodeStyle: {
      width: '70%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',
      overflow: 'hidden',
      marginLeft: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,
    },
    inputphoneStyle: {
      width: '100%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',

      overflow: 'hidden',
      borderColor: 'black',
      alignItems: 'center',
      borderRightWidth: 1,
    },
    // inputCodeStyle:{
    //   width: "80%",
    //   height: Responsive.getWidth(13),
    //   flexDirection: "row",
    //   overflow: "hidden",
    //   marginLeft:1,
    //   alignItems: "center",
    // },
    titleStyle: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.WHITE, 'BOLD'),
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    buttonPhone: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 32,
    },

    continueButton: {
      height: 50,
      backgroundColor: '#FF4403',
      borderRadius: 59,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    },
    continueTxt: {
      ...STYLES.textStyle(14, '#FFF', 'BASE', 'center'),
    },
    inputContainerStyle: {
      flex: 1,
      marginBottom: 1,
      marginTop: 32,
      marginLeft: 6,
    },
    inputMaskStyle: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE'),
      ...STYLES.paddingStyle(4, 4),
    },
    countyCodeView: {
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',
    },

    mobileView: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      left: 5,
    },
  });
