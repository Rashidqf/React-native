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
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Responsive.getWidth(6),
    },
    modalView: {
      width: '100%',
      backgroundColor: 'rgba(24, 24, 24, 0.7)',
      padding: Responsive.getWidth(5),
      borderRadius: Responsive.getWidth(4),
    },
    modalImageView: {
      width: Responsive.getWidth(35),
      height: Responsive.getWidth(35),
      backgroundColor: '#ECECEC',
      alignSelf: 'center',
      marginBottom: 35,
    },
    modalTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.DARK_GRAY, 'BOLD', 'center'),
      marginBottom: 6,
    },
    modalText: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.WHITE, 'BASE', 'center'),
      marginBottom: 15,
      marginTop: 10,
    },
    modalButtonText: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.BLACK, 'BOLD', 'center'),
      marginTop: 20,
    },
    cellSeprator: {
      borderWidth: 0.3,
      borderColor: theme?.colors?.INPUT_GRAY_COLOR,
    },
    listModal: {
      flex: 1,
      backgroundColor: '#262530',
    },
    SafeAreaView: {
      flex: 1,
      // marginTop: Responsive.getWidth(15),
    },
    privateRow: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
    },
    privateColLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    privateColRight: {
      width: 100,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    privateIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_100),
    },
    privateTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_300, 'BASE'),
      paddingLeft: 10,
    },
    dfdfd: {},
  });
