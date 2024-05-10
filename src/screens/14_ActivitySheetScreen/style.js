import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { COLORS } from '../../themes/colors';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

    sectionHeader: {
      paddingHorizontal: Responsive.getWidth(6),
      paddingBottom: 8,
      paddingTop: Responsive.getWidth(6),
      backgroundColor: theme?.colors?.GRAY_1000,
    },
    letterStyle: {
      ...COMMON_STYLE.textStyle(17, theme?.colors?.RED_500, 'BOLD', 'left'),
    },
    contatLetter: {
      ...COMMON_STYLE.textStyle(17, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    addButton: {
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(7),
      marginLeft: Responsive.getWidth(6),
      marginRight: Responsive.getWidth(6),
    },
    backgroundImage: {
      flex: 1,
    },
    contentRow: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingHorizontal: Responsive.getWidth(6),
      borderColor: 'rgba(255, 255, 255, 0.08)',
      flexDirection: 'row',
      alignItems: 'center',
    },
    contatText: {
      ...STYLES.textStyle(12, COLORS.GRAY_70, 'BOLD', 'left'),
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(4),
      paddingHorizontal: Responsive.getWidth(6),
      borderColor: 'rgba(255, 255, 255, 0.08)',
      backgroundColor: 'transparent',
    },
  });
