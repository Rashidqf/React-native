import { StyleSheet, StatusBar } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

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
    headerRightIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
    },
    container: {
      padding: 15,
      paddingBottom: 0,
    },
    profileView: {
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
    },
    profileWrap: {
      position: 'relative',
      width: Responsive.getWidth(30),
      height: Responsive.getWidth(30),
      borderRadius: 75,
      marginBottom: 20,
    },
    profileImg1: {
      width: Responsive.getWidth(18),
      height: Responsive.getWidth(18),
      borderRadius: 75,
      position: 'absolute',
      top: Responsive.getWidth(0),
      left: Responsive.getWidth(0),
      borderWidth: 4,
      borderColor: theme?.colors?.GRAY_1000,
      zIndex: 1,
    },
    profileImg2: {
      width: Responsive.getWidth(14),
      height: Responsive.getWidth(14),
      borderRadius: 75,
      position: 'absolute',
      top: Responsive.getWidth(15),
      left: Responsive.getWidth(0),
      borderWidth: 4,
      borderColor: theme?.colors?.GRAY_1000,
    },
    profileImg3: {
      width: Responsive.getWidth(20),
      height: Responsive.getWidth(20),
      borderRadius: 75,
      position: 'absolute',
      bottom: Responsive.getWidth(0),
      right: Responsive.getWidth(0),
      borderWidth: 4,
      borderColor: theme?.colors?.GRAY_1000,
      zIndex: 2,
    },
    profileImgTxt: {
      width: Responsive.getWidth(14),
      height: Responsive.getWidth(14),
      borderRadius: 75,
      backgroundColor: theme?.colors?.RED_500,
      position: 'absolute',
      top: Responsive.getWidth(1),
      right: Responsive.getWidth(1),
      borderWidth: 4,
      borderColor: theme?.colors?.GRAY_1000,
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      lineHeight: Responsive.getWidth(12),
    },
    userName: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginBottom: 10,
    },
    userNicName: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BASE', 'center'),
      marginBottom: 30,
    },
    button: {
      paddingHorizontal: 20,
      borderRadius: 30,
      backgroundColor: theme?.colors?.RED_500,
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
    },
    switchTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
    },
    rowItemsTitle: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BOLD', 'left'),
      marginTop: 30,
    },
  });
