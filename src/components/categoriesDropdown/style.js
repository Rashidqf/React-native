import { StyleSheet } from 'react-native';

import { STYLES, IMAGES } from '@themes';

export const style = theme =>
  StyleSheet.create({
    // Dropdown CSS
    dropdown: {
      position: 'relative',
    },
    dropdownBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      height: 50,
      zIndex: -1024,
    },
    leftIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200, 'BOLD'),
    },
    dropdownBtnTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      paddingRight: 10,
    },
    dropdownBtnIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      textAlign: 'right',
      // marginRight: -5,
    },
    dropdownList: {
      // position: 'absolute',
      // top: 0,
      right: 15,
      marginLeft: 'auto',
      width: 200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme?.colors?.GRAY_800,
      zIndex: 1024,
      elevation: 5,
      marginBottom: 5,
    },
    dropdownListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_1000,
    },
    dropdownListItemTxt: {
      flex: 1,
      ...STYLES.textStyle(11, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    dropdownListItemIcon: {
      width: 30,
      ...STYLES.textStyle(14, theme?.colors?.WHITE),
      textAlign: 'right',
    },
  });
