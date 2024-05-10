import { StyleSheet, StatusBar, Platform } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    rightIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      textAlign: 'right',
      // marginRight: -5,
    },
    sepratorStyle: {
      height: 0.8,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },

    header: {
      height: Platform.OS === 'ios' ? 90 : 80,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      alignItems: 'flex-end',
      // paddingTop: StatusBar.currentHeight,
      paddingBottom: Responsive.getWidth(3),
    },
    headerLeft: {
      width: 50,
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRight: {
      width: 50,
      alignItems: 'flex-end',
    },
    headerLeftIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
      marginLeft: -5,
    },
    headerTitle: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100),
    },
    headerRightIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
    },
    headerAddBtnTxt: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BOLD', 'right'),
    },
    container: {
      flex: 1,
      // padding: 15,
      // paddingBottom: 0,
      // backgroundColor: 'red'
    },
    rowItemsStyle: {
      paddingHorizontal: 15,
    },

    // Dropdown CSS
    dropdown: {
      position: 'relative',
    },
    dropdownBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      height: 50,
    },
    leftIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200, 'BOLD'),
    },
    dropdownBtnTxt: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
    },
    dropdownBtnIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      textAlign: 'right',
      marginRight: -5,
    },
    dropdownList: {
      position: 'absolute',
      top: 50,
      right: 15,
      width: 200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme?.colors?.GRAY_800,
      zIndex: 1024,
    },
    dropdownListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme?.colors?._RGBA_67,
    },
    dropdownListItemTxt: {
      flex: 1,
      ...STYLES.textStyle(11, theme?.colors?.GRAY_50, 'BOLD', 'left'),
    },
    dropdownListItemIcon: {
      width: 30,
      ...STYLES.textStyle(14, theme?.colors?.GRAY_200),
      textAlign: 'right',
    },
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
  });
