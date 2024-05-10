import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
  backgroundImage: {
      flex: 1,
    },
    content: {
      flex: 1,
      // ...STYLES.paddingStyle(6, 6, 2, 6),
    },
    swipeListView: {
      ...STYLES.paddingStyle(0, 0, 7, 0),
    },
    secTitle: {
      ...STYLES.textStyle(15, theme?.colors?.RED_500, 'BOLD'),
      marginBottom: 10,
    },
    // Group Sidenot Row
    sidenotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Responsive.getWidth(3),
      borderRadius: 12,
      backgroundColor: theme?.colors?.GRAY_800,
      marginBottom: 20,
    },
    sidenotStatusCol: {
      width: Responsive.getWidth(5),
    },
    tinyCircle: {
      width: Responsive.getWidth(2.5),
      height: Responsive.getWidth(2.5),
      borderRadius: 75,
      backgroundColor: theme?.colors?.RED_500,
    },
    sidenotContentCol: {
      flex: 1,
      paddingHorizontal: 8,
    },
    sidenotName: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginBottom: 10,
    },
    sidenotTxtRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    sidenotCateTxt1: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE'),
    },
    sidenotCateTxt2: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BASE'),
      paddingLeft: 5,
      paddingRight: 8,
    },
    sidenotCateTxt3: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_200, 'BASE'),
    },
    sidenotLastMsg: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_200, 'BASE'),
      marginTop: 5,
    },
    sidenotImgCol: {
      width: Responsive.getWidth(20),
      height: Responsive.getWidth(20),
      position: 'relative',
    },
    circleGroupImg: {
      // ...STYLES.imageStyle(20),
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    userImg1: {
      width: Responsive.getWidth(11),
      height: Responsive.getWidth(11),
      borderRadius: 75,
      position: 'absolute',
      top: Responsive.getWidth(1.3),
      left: Responsive.getWidth(1.3),
      zIndex: 1,
    },
    userImg2: {
      width: Responsive.getWidth(9),
      height: Responsive.getWidth(9),
      borderRadius: 75,
      position: 'absolute',
      bottom: Responsive.getWidth(1.3),
      right: Responsive.getWidth(2.5),
      zIndex: 1,
    },
    userImgCount: {
      ...STYLES.textStyle(10, theme?.colors?.WHITE, 'BASE'),
      position: 'absolute',
      top: Responsive.getWidth(5.3),
      right: Responsive.getWidth(2.5),
      zIndex: 1,
    },
    chatCount: {
      height: 20,
      width: 20,
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -Responsive.getWidth(1),
      right: Responsive.getWidth(1),
    },
    chatCountTxt: {
      ...STYLES.textStyle(11, 'BOLD'),
      color: theme?.colors?.WHITE,
    },
    sidenotHiddenRow: {
      height: '84%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: theme?.colors?.BLACK_100,
      borderRadius: 12,
      overflow: 'hidden',
      paddingRight: 20,
    },
    sidenotHiddenCol: {
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sidenotHiddenColIcon: {
      ...STYLES.textStyle(18, theme?.colors?.WHITE),
    },
    sidenotHiddenColImg: {
      width: Responsive.getWidth(6),
      height: Responsive.getWidth(6),
      resizeMode: 'contain',
    },

    // Single Sidenot Row
    singleSidenotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Responsive.getWidth(3),
      backgroundColor: theme?.colors?.GRAY_800,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      marginBottom: 20,
    },
    singleSidenotContentCol: {
      flex: 1,
    },
    singleSidenotImgCol: {
      width: Responsive.getWidth(15),
      alignItems: 'flex-end',
    },
    singleUserImg: {
      width: Responsive.getWidth(11),
      height: Responsive.getWidth(11),
      borderRadius: 75,
    },
    not_Found: {
      flex: 1,
      // justifyContent:'center',
      alignItems: 'center',
      paddingTop: Responsive.getWidth(20),
    },
    not_found_title: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_200, 'BOLD', 'center'),
      marginBottom: 10,
    },
    not_found_text: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_200, 'BASE', 'center'),
    },
    not_FoundImg: {
      ...STYLES.imageStyle(50),
      backgroundColor: theme?.colors?.GRAY_1000,
    },
    ActionButtonIcon: {
      ...STYLES.imageStyle(17),
    },
  });
