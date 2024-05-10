import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    ListItemAccordion: {
      flexDirection: 'row',
      // alignItems: 'center',
    },

    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(5),
    },
    checkboxBody: {
      flex: 1,
      paddingHorizontal: Responsive.getWidth(8),
    },
    checkboxTextStyle: {
      color: theme?.colors?.WHITE,
      fontSize: Responsive.getWidth(16),
    },
    sectionHeaderTitle: {
      ...STYLES.textStyle(15, theme?.colors?.RED_500, 'BOLD', 'left'),
      paddingTop: Responsive.getWidth(3),
      backgroundColor: theme?.colors?.GRAY_1000,
      // backgroundColor: 'yellow',
      marginBottom: Responsive.getWidth(3),
    },
    header: {
      marginTop: Responsive.getWidth(5),
      paddingTop: 0,
    },
    filterTab: {
      justifyContent: 'space-around',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      borderRadius: 30,
      overflow: 'hidden',
    },
    activeTab: {
      flex: 1,
      backgroundColor: theme?.colors?.RED_500,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inActiveTab: {
      flex: 1,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: theme?.colors?.GRAY_1000,
    },
    activeIcon: {
      ...STYLES.textStyle(15, theme?.colors?.WHITE, 'BOLD'),
      // ...STYLES.textStyle(24, theme?.colors?.GRAY_100, 'BOLD', 'left'),
    },
    inActiveIcon: {
      // ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      ...STYLES.textStyle(15, theme?.colors?.WHITE, 'BOLD'),
    },
  });
