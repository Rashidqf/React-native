import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, IMAGES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...STYLES,
    safeAreaStyle: {
      flex: 1,
      backgroundColor: theme?.colors?.DARK_OPACITY,
      justifyContent: 'center',
      alignItems: 'center',
    },
    atUserImg: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      borderRadius: 75,
      backgroundColor: theme?.colors?.RED_500,
    },
    atUserName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_50, 'BASE', 'left'),
      paddingLeft: Responsive.getWidth(3),
    },
    atItemRow: {
      width: '100%',
      height: 50,
      paddingHorizontal: Responsive.getWidth(3),
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: theme?.colors?.GRAY_400,
    },
    msgInput: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE'),
      height: 50,
      paddingTop: 10,
    },
  });
