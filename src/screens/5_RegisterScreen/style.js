import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { FONTS } from '../../themes/fonts';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

    subContent: {
      ...COMMON_STYLE.paddingStyle(12.5, 12.5, 3, 3),
    },
    inputCodeStyle: {
      width: '70%',
      height: Responsive.getWidth(16),
      flexDirection: 'row',
      overflow: 'hidden',
      marginLeft: 2,
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
    inputStle: {
      paddingLeft: 16,
    },
    signinStyle: {
      ...STYLES.textStyle(13, theme?.colors?.PURPLE_500, 'BASE', 'center'),
    },
    backgroundImage: {
      flex: 1,
    },
    logoView: { alignItems: 'center', marginTop: 60 },
    countyCodeView: { flexDirection: 'row', alignItems: 'center', height: '100%' },
    mobileInputView: {
      paddingLeft: 20,
      width: '100%',
      textAlignVertical: 'center',
      fontFamily: FONTS.BOLD,
      fontSize: Responsive.getFontSize(14),
    },
    mobileView: { height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' },
  });
