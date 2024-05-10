import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      paddingBottom: Responsive.getWidth(5),
    },
    buttonView: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 27,
    },
    buttonContinue: {
      height: 50,
      backgroundColor: '#FF4403',
      borderRadius: 59,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 28,
    },
    textView: {
      ...STYLES.textStyle(14, '#FFF', 'BASE', 'center'),
    },
    splashbackgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    signupstyle: {
      ...STYLES.textStyle(13, theme?.colors?.PURPLE_500, 'BASE', 'left'),
    },
  });
