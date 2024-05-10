import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { COLORS } from '../../themes/colors';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      paddingBottom: Responsive.getWidth(5),
    },
    topContent: {
      paddingTop: Responsive.getWidth(5),
      paddingBottom: Responsive.getWidth(5),
    },
    signupStyle: {
      color: theme?.colors?.PURPLE_500,
    },
    backgroundImage: {
      flex: 1,
    },
    createAccountText: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(0, 0, 2, 0),
    },
    alreadyText: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BASE', 'center'),
      ...COMMON_STYLE.marginStyle(0, 0, 2, 1),
    },
    signInText: {
      ...STYLES.textStyle(14, COLORS.BLUE_100, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(1.5, 0, 2, 1),
    },
    tncView: {    
      flexDirection: 'row',
      ...COMMON_STYLE.marginStyle(0, 0, 0, 2),
    },
    iAccText: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BASE', 'center'),
      ...COMMON_STYLE.marginStyle(3, 0, 0.3, 0),
    },
    tncText: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_100, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(0.5, 0, 0.4, 0),
    },
  });
