import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, IMAGES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    rowItemsTitle: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BOLD', 'left'),
      marginTop: 30,
    },
    rowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
    },
    leftIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200, 'BOLD'),
    },
    rowItemTxt: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
    },
    rightIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      textAlign: 'right',
      marginRight: -5,
    },
  });
