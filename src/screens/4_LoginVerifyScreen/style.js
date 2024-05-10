import { StyleSheet, Platform } from 'react-native';

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
    verifyContent: {
      ...COMMON_STYLE.paddingStyle(12.5, 12.5, 5, 0),
    },
    codeField: {
      ...COMMON_STYLE.paddingStyle(0, 0, 5, 0),
      alignItems: 'center',
    },
    cell: {
      width: Responsive.getWidth(12),
      height: Responsive.getWidth(14),
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: 'rgba(207, 186, 163, 0.1)',
      borderRadius: 12,
      color: theme?.colors?.GRAY_50,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      textAlignVertical: 'center',
      ...COMMON_STYLE.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      lineHeight: Responsive.getFontSize(16) + 3,
      overflow: 'hidden',
      ...COMMON_STYLE.marginStyle(0.5, 0.5, 0, 0),
      paddingTop: 13,
    },
    focusCell: {
      borderRadius: 12,
      borderColor: '#C8BCBC',
      backgroundColor: theme?.colors?.TRANSPARENT,
      ...COMMON_STYLE.textStyle(16, theme?.colors?.RED_500, 'BASE', 'center'),
      lineHeight: Responsive.getFontSize(16) + 3,
      overflow: 'hidden',
      textAlign: 'center',
      paddingTop: 12,
    },

    backgroundImage: {
      flex: 1,
    },
    verifyText: {
      ...COMMON_STYLE.marginStyle(0, 0, 5, 0),
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      lineHeight: Responsive.getFontSize(16) + 5,
    },
    activateText: {
      ...STYLES.textStyle(16, COLORS.ORANGE_200, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(0, 0, 5, 0),
    },
    receiveText: {
      ...STYLES.textStyle(16, COLORS.GRAY_100, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(0, 0, 3, 1),
    },
    resendText: {
      ...STYLES.textStyle(15, COLORS.BLUE_100, 'BOLD', 'center'),
      ...COMMON_STYLE.marginStyle(1.5, 0, 3, 1),
    },
  });
