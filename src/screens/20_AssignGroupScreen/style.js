import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    tabContainerStyle: {
      paddingHorizontal: Responsive.getWidth(12),
    },
    indicatorStyle: {
      backgroundColor: theme?.colors?.RED_500,
      height: 2,
      borderRadius: 2,
    },
    titleStyle: {
      textTransform: 'none',
      ...STYLES.textStyle(14, theme?.colors?.GRAY_300, 'BOLD', 'center'),
    },
    titleActiveStyle: {
      textTransform: 'none',
      ...STYLES.textStyle(14, theme?.colors?.RED_500, 'BOLD', 'center'),
    },
    containerStyle: {
      backgroundColor: theme?.colors?.TRANSPARENT,
    },
    buttonStyle: {
      backgroundColor: theme?.colors?.TRANSPARENT,
      paddingLeft: 0,
      paddingRight: 0,
      width: 'auto',
      flex: null,
    },
    tabHeader: {
      flexDirection: 'row',
      borderBottomWidth: 0,
      borderColor: 'rgba(0,0,0,0.08)',
      width: '100%',
    },
    tabStyle: {
      flex: 1,
      paddingHorizontal: Responsive.getWidth(10),
      paddingVertical: Responsive.getWidth(15),
    },
    selectTabStyle: {
      borderBottomWidth: 3,
      borderColor: theme?.colors?.RED_500,
    },
    tabTextStyle: {
      textAlign: 'center',
      color: '#020108',
      fontSize: Responsive.getWidth(18),
    },
    selectTabTextStyle: {
      color: '#222B45',
    },
    sidenoteItem: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: Responsive.getWidth(6),
      flexDirection: 'row',
      alignItems: 'center',
    },
    sidenoteItemText: {
      flex: 1,
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BOLD',),
    },
    sidenoteItemIcon: {
      ...COMMON_STYLE.imageStyle(6)
    },
  });
