import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { COLORS } from '../../themes/colors';
import { color } from 'react-native-reanimated';
import { FONTS } from '../../themes/fonts';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    content: {
      flex: 1,
      ...STYLES.paddingStyle(0, 0, 2, 6),
    },
    topWidgetBoxContainer: {
      flexDirection: 'row',
    },
    widgetBox: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      minHeight: Responsive.getHeight(18),
      borderRadius: Responsive.getWidth(3),
      padding: 0,
      marginLeft: Responsive.getWidth(4),
      marginBottom: Responsive.getWidth(4),
      overflow: 'hidden',
    },
    chatListContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      // minHeight: Responsive.getHeight(18),
      borderRadius: Responsive.getWidth(3),
      padding: 0,
      overflow: 'hidden',
    },
    widgetTopBox: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
      padding: Responsive.getWidth(4),
      paddingBottom: Responsive.getWidth(2),
    },
    widgetHeaderBox: {
      padding: Responsive.getWidth(4),
      paddingBottom: 0,
    },
    widgetDate: {
      marginRight: Responsive.getWidth(2),
    },
    widgetDateText: {
      ...STYLES.textStyle(31, theme?.colors?.GRAY_100, 'BOLD', 'left'),
    },
    widgetDayText: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BOLD', 'left'),
      marginBottom: 2,
    },
    widgetYearText: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BOLD', 'left'),
    },
    notFoundText: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_200, 'BASE', 'left'),
    },
    ListEmptyComponent: {
      flex: 1,
      marginBottom: -Responsive.getWidth(4),
    },
    widgetNotfound: {
      flex: 1,
      paddingHorizontal: Responsive.getWidth(4),
    },
    noTaskfound: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
      height: Responsive.getWidth(24),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      marginBottom: Responsive.getWidth(4),
    },
    noTaskfoundImg: {
      width: Responsive.getHeight(14),
      height: '100%',
      resizeMode: 'contain',
    },
    noTaskfoundText: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BOLD', 'center'),
      marginLeft: Responsive.getWidth(6),
    },
    widgetNotfoundImg: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: Responsive.getHeight(8),
      resizeMode: 'contain',
    },
    topNotfoundImg: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: Responsive.getHeight(7.4),
      resizeMode: 'contain',
    },
    topNotfoundImgMain: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      height: Responsive.getHeight(12.4),
      resizeMode: 'contain',
    },
    taskBox: {
      position: 'relative',
      width: Responsive.getHeight(18),
      height: Responsive.getHeight(10),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: Responsive.getWidth(3),
      padding: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(4),
      overflow: 'hidden',
    },
    taskSepratorStyle: {
      width: Responsive.getHeight(1.5),
      height: '100%',
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(1.5),
    },
    userRowImg: {
      ...STYLES.imageStyle(4.5),
      borderRadius: 75,
      resizeMode: 'cover',
      backgroundColor: theme?.colors?.GRAY_800,
    },
    userRowTxt: {
      flex: 1,
      paddingLeft: Responsive.getWidth(1),
      ...STYLES.textStyle(8, theme?.colors?.GRAY_50, 'BASE'),
    },
    taskBoxTitle: {
      ...STYLES.textStyle(11.5, theme?.colors?.WHITE, 'BOLD'),
      marginBottom: Responsive.getWidth(1.5),
    },
    taskBoxTimeTxt: {
      position: 'absolute',
      top: Responsive.getWidth(1),
      right: Responsive.getWidth(1.5),
      ...STYLES.textStyle(7, theme?.colors?.GRAY_50, 'BASE'),
    },
    lastTaskBox: {
      position: 'relative',
      width: Responsive.getHeight(18),
      height: Responsive.getHeight(10),
      borderRadius: Responsive.getWidth(3),
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme?.colors?.GRAY_838383,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Responsive.getHeight(1.5),
    },
    not_Found: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    not_found_title: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      marginBottom: 4,
    },
    not_found_text: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'center'),
    },
    not_FoundImg: {
      ...STYLES.imageStyle(50),
    },

    addIconStyle: {
      position: 'absolute',
      right: 0,
      bottom: 30,
    },
    addIcon: {
      ...STYLES.imageStyle(25),
    },
    ActionButtonIcon: {
      ...STYLES.imageStyle(17),
    },

    carouselContainer: {
      overflow: 'hidden',
      paddingBottom: Responsive.getWidth(4),
    },
    eventItem: {
      backgroundColor: theme?.colors?.OPACITY_100,
      padding: Responsive.getWidth(2),
      marginHorizontal: Responsive.getWidth(3),
      borderRadius: Responsive.getWidth(2),
      flexDirection: 'row',
    },
    eventSmallImage: {
      height: 25,
      width: 25,
      backgroundColor: 'white',
      borderRadius: Responsive.getWidth(5),
    },
    chatIcon: {
      ...STYLES.imageStyle(3),
      // borderRadius: 5,
      // backgroundColor: 'white',
      marginRight: Responsive.getWidth(1),
    },
    eventImage: {
      height: Responsive.getHeight(11),
      width: Responsive.getWidth(25),
      backgroundColor: theme?.colors?.GRAY_1000,
      borderRadius: 6,
    },
    chatTitle: {
      ...STYLES.textStyle(7, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    eventTitle: {
      ...STYLES.textStyle(15, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginTop: 8,
    },
    eventTime: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_100, 'BASE', 'left'),
      marginTop: 3,
    },
    paginationStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      height: 'auto',
      paddingVertical: 0,
      paddingLeft: Responsive.getWidth(5),
      bottom: -Responsive.getWidth(3),
      // paddingRight: Responsive.getWidth(10),
      // bottom: 0,
    },
    taskContainer: {
      flex: 1,
      paddingHorizontal: Responsive.getWidth(4),
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(1.5),
    },
    tickCircleStyle: {
      width: Responsive.getWidth(4),
      height: Responsive.getWidth(4),
      borderRadius: Responsive.getWidth(2),
      borderWidth: 1,
      borderColor: '#635E5C',
      marginRight: Responsive.getWidth(3),
    },
    taskItemTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
    },
    vieworeBtn: {
      backgroundColor: theme?.colors?.OPACITY_100,
      paddingVertical: Responsive.getWidth(2),
      paddingHorizontal: Responsive.getWidth(4),
      height: Responsive.getWidth(10),
    },
    vieworeBtnTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
    },

    sidenoteContainer: {
      flex: 1,
    },

    sidenoteItem: {
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      padding: Responsive.getWidth(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaContent: {
      flexDirection: 'row',
    },
    listDotStyle: {
      width: Responsive.getWidth(3),
      height: Responsive.getWidth(3),
      borderRadius: Responsive.getWidth(2),
      backgroundColor: theme?.colors?.RED_500,
    },

    profileGroup: {
      justifyContent: 'flex-end',
      width: Responsive.getWidth(16),
      height: Responsive.getWidth(16),
      resizeMode: 'contain',
    },
    profileImage1: {
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
      borderRadius: Responsive.getWidth(5),
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_800,
      backgroundColor: theme?.colors?.GRAY_800,
      marginRight: Responsive.getWidth(2),
      position: 'absolute',
      left: Responsive.getWidth(0.5),
      top: Responsive.getWidth(0.5),
      zIndex: 1,
    },
    profileImage2: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      borderRadius: Responsive.getWidth(4),
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_800,
      backgroundColor: theme?.colors?.GRAY_800,
      position: 'absolute',
      right: Responsive.getWidth(1.5),
      bottom: Responsive.getWidth(0.5),
      zIndex: 1,
    },
    moreImg: {
      width: Responsive.getWidth(7.5),
      height: Responsive.getWidth(7.5),
      borderRadius: Responsive.getWidth(4),
      position: 'absolute',
      right: Responsive.getWidth(2),
      top: Responsive.getWidth(2),
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    moreImgText: {
      ...STYLES.textStyle(8, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    sidenotRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Responsive.getWidth(3),
      // borderRadius: 12,
      // backgroundColor: theme?.colors?.GRAY_800,
      // marginBottom: 20,
      borderBottomWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
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
      width: Responsive.getWidth(12.5),
      height: Responsive.getWidth(12.5),
      borderRadius: 75,
      position: 'absolute',
      top: Responsive.getWidth(0.7),
      left: Responsive.getWidth(0.7),
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_1000,
      backgroundColor: theme?.colors?.GRAY_1000,
      zIndex: 1,
    },
    userImg2: {
      width: Responsive.getWidth(9.5),
      height: Responsive.getWidth(9.5),
      borderRadius: 75,
      position: 'absolute',
      bottom: Responsive.getWidth(1.3),
      right: Responsive.getWidth(2.5),
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_1000,
      backgroundColor: theme?.colors?.GRAY_1000,
      zIndex: 1,
    },
    userImgCount: {
      ...STYLES.textStyle(10, theme?.colors?.WHITE, 'BASE'),
      position: 'absolute',
      top: Responsive.getWidth(5.3),
      right: Responsive.getWidth(2.5),
      zIndex: 1,
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
    moreChatBtn: {
      paddingVertical: Responsive.getWidth(3),
      paddingHorizontal: Responsive.getWidth(5),
      backgroundColor: theme?.colors?.OPACITY_100,
    },
    moreChatBtnText: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BASE'),
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
    chatCount: {
      height: 20,
      width: 20,
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: Responsive.getWidth(3),
      right: Responsive.getWidth(0),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    chatCountTxt: {
      ...STYLES.textStyle(11, 'BOLD'),
      color: theme?.colors?.WHITE,
    },
    homeNoDataContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(10),
    },
    homeNoDataImg: {
      width: Responsive.getWidth(50),
      height: Responsive.getWidth(40),
      resizeMode: 'contain',
    },
    homeNoDataTitle: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BASE'),
      marginTop: Responsive.getWidth(5),
      marginBottom: Responsive.getWidth(1),
    },
    homeNoDataPara: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BASE'),
    },
    widgetBoxCustom: {
      minHeight: Responsive.getHeight(8.42),
      // backgroundColor: theme?.colors?.GRAY_800,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingTop: 9,
      paddingRight: 5,
      paddingBottom: 6,
      paddingLeft: 10,
      position: 'relative',
    },
    widgetBoxCustomText: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_100, 'BOLD'),
    },
    profileImageCustom: {
      position: 'absolute',
      bottom: 6,
      right: 5,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 100,
    },
    widgetBoxAddCustom: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme?.colors?.GRAY_838383,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fab: {
      backgroundColor: '#FF4403',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Add shadow on Android
      position: 'absolute',
      right: 20,
      bottom: 20,
    },
    sidenoteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
    },
    sidenoteIcon: {
      ...COMMON_STYLE.imageStyle(2.8, theme?.colors?.RED_500),
      marginRight: Responsive.getWidth(1),
    },
    sidenoteTxt: {
      ...COMMON_STYLE.textStyle(8, theme?.colors?.WHITE, 'BASE', 'center'),
    },
  });
