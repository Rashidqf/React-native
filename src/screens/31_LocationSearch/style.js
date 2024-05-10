import { StyleSheet, StatusBar } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    ScrollView: {
      flexGrow: 1,
    },
    KeyboardAvoidingView: {
      flex: 1,
      paddingHorizontal: 15,
      marginTop: 5,
    },
    searchRow: {
      position: 'relative',
      flexDirection: 'row',
      // alignItems: 'center',
      backgroundColor: theme?.colors?.INPUT_BG,
      borderRadius: 12,
    },
    searchIcon: {
      position: 'absolute',
      width: 50,
      top: 13,
      ...STYLES.textStyle(14, theme?.colors?.GRAY_300, 'BASE', 'center'),
    },
    header: {
      height: 80,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: StatusBar.currentHeight,
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
      backgroundColor: theme?.colors?.GRAY_1000,
    },
    memberCol: {
      width: Responsive.getWidth(100) / 3,
      // height: Responsive.getWidth(100) / 3,
      // backgroundColor: theme?.colors?.BLACK,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    memberImgWrap: {
      width: Responsive.getWidth(18),
      height: Responsive.getWidth(18),
      borderRadius: 75,
    },
    memberImg: {
      width: '100%',
      height: '100%',
    },
    memberName: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BOLD', 'center'),
      marginTop: 10,
    },
    linkTxt: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BASE', 'center'),
      marginTop: 5,
    },
    linkTxt2: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BASE', 'center'),
      marginTop: 5,
    },
    dfdfd: {},
  });
