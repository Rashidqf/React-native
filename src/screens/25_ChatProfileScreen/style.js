import { StyleSheet, StatusBar, Platform } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

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
      // marginLeft: Responsive.getWidth(60),
    },
    headerAddBtnTxt: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BOLD', 'right'),
    },
    headerLeftIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
      marginLeft: -5,
    },
    editButton: {
      marginTop: 10,
      marginLeft: 10,
    },
    container: {
      paddingVertical: 15,
      paddingBottom: 0,
    },
    profileView: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
    },
    profileWrap: {
      width: Responsive.getWidth(30),
      height: Responsive.getWidth(30),
      borderRadius: 75,
      marginBottom: 20,
      backgroundColor: theme?.colors?.GRAY_800,
    },
    profileImg: {
      width: '100%',
      height: '100%',
      borderRadius: Responsive.getWidth(20),
    },
    userName: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginBottom: 10,
    },
    groupName: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE', 'center'),
      marginBottom: 5,
    },
    userNicName: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BASE', 'center'),
      marginBottom: 30,
    },
    button: {
      height: 40,
      paddingHorizontal: 20,
      borderRadius: 30,
      backgroundColor: theme?.colors?.RED_500,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      ...STYLES.textStyle(15, theme?.colors?.GRAY_50, 'BOLD'),
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
      paddingHorizontal: 15,
    },
    switchTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
    },
    RowItemsStyle: {
      paddingHorizontal: 15,
    },
    rowItemsTitle: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BOLD', 'left'),
      marginTop: 30,
      paddingHorizontal: 15,
    },
    safeAreaStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme?.colors?.DARK_OPACITY,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    alertBoxStyle: {
      width: Responsive.getWidth(90),
      maxHeight: Responsive.getHeight(55),
      borderRadius: Responsive.getWidth(3),
      backgroundColor: theme?.colors?.WHITE,
    },
    closeButtonStyle: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      alignSelf: 'flex-end',
      margin: Responsive.getWidth(2),
      backgroundColor: theme?.colors?.TRANSPARENT,
    },
    closeIconStyle: {
      width: Responsive.getWidth(4),
      height: Responsive.getWidth(4),
    },
    alertTitleStyle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.BLACK, 'BOLD', 'center'),
    },
    descriptionStyle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.DARK_GRAY, undefined, 'center'),
      marginHorizontal: Responsive.getWidth(2),
      marginVertical: Responsive.getHeight(1),
    },
    profileBtnViewStyle: {
      marginVertical: Responsive.getHeight(2),
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: 150,
    },
    inputCodeStyle: {
      width: '70%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',

      overflow: 'hidden',
      marginLeft: 2,
      alignItems: 'center',
    },
    inputphoneStyle: {
      width: '100%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',

      overflow: 'hidden',
      borderColor: 'black',
      alignItems: 'center',
      borderRightWidth: 1,
    },
    titleStyle: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.INPUT_GRAY_COLOR, 'BOLD'),
      lineHeight: Responsive.getWidth(7),
      marginTop: Responsive.getHeight(2),
    },
  });
