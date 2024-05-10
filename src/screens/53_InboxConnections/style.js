import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { Clock } from 'react-native-reanimated';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    flatlistContentContainerStyle: {
      paddingTop: Responsive.getWidth(6),
      paddingHorizontal: Responsive.getWidth(6),
    },
    itemSepratorStyle: {
      width: '100%',
      height: Responsive.getWidth(3),
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      paddingVertical: Responsive.getWidth(2),
      paddingHorizontal: Responsive.getWidth(2.5),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
    },
    listItemUimg: {
      ...COMMON_STYLE.imageStyle(12),
      borderRadius: 75,
      resizeMode: 'cover',
    },
    listItemContent: {
      flex: 1,
      paddingLeft: Responsive.getWidth(3),
    },
    listItemTitle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginBottom: Responsive.getWidth(1),
    },
    globeIcon: {
      ...COMMON_STYLE.imageStyle(6),
      marginTop: Responsive.getWidth(2),
    },
    sidenoteCountTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.GRAY_200, 'BOLD'),
    },
    listBtnRow: {
      flexDirection: 'row',
      marginTop: Responsive.getWidth(5),
    },
    btnOrange: {
      borderWidth: 2,
      borderColor: theme?.colors?.RED_500,
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnOutlineGray: {
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_200,
      // backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Responsive.getWidth(3),
    },
    btnOrangeTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BOLD'),
    },

    userImg: {
      ...COMMON_STYLE.imageStyle(7),
      borderRadius: 75,
      resizeMode: 'cover',
    },
    userImgName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(1.5),
    },
    // MODAL STYLE
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    modalbodyBg: {
      width: '100%',
      height: '100%',
    },
    modalView: {
      height: 200,
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    modalSafeAreaView: {
      padding: Responsive.getWidth(8),
    },
    modalBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      height: Responsive.getWidth(12),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
    },
    flatlistContentContainerStyle: {
      paddingTop: Responsive.getWidth(6),
      paddingHorizontal: Responsive.getWidth(4),
    },
    itemSepratorStyle: {
      width: '100%',
      height: Responsive.getWidth(3),
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      padding: Responsive.getWidth(3),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 16,
    },
    calendarBtn: {
      position: 'absolute',
      top: -Responsive.getWidth(2),
      right: -Responsive.getWidth(2),
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
      backgroundColor: theme?.colors?.RED_500,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 75,
      zIndex: 1024,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    calendarBtnIcon: {
      ...COMMON_STYLE.imageStyle(7),
    },
    taskDayTxt: {
      position: 'absolute',
      top: -Responsive.getWidth(1),
      right: -Responsive.getWidth(1),
      ...COMMON_STYLE.textStyle(10, theme?.colors?.GRAY_100, 'BASE'),
    },
    listItemContent: {
      flex: 1,
      // paddingLeft: Responsive.getWidth(3),
    },
    taskTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.GRAY_100, 'BOLD'),
      marginTop: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(1),
    },
    eventUsrRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventUsrImg: {
      ...COMMON_STYLE.imageStyle(5.5),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_200,
      resizeMode: 'cover',
    },
    eventUsrName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(2),
    },
    monthItem: {
      paddingHorizontal: Responsive.getWidth(4),
      borderBottomWidth: 2,
      borderColor: theme?.colors?.TRANSPARENT,
      paddingBottom: Responsive.getWidth(2),
    },
    monthItemActive: {
      paddingHorizontal: Responsive.getWidth(4),
      borderBottomWidth: 2,
      borderColor: theme?.colors?.RED_500,
      paddingBottom: Responsive.getWidth(2),
    },
    monthItemTxt: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
    },
    monthItemTxtActive: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.RED_500, 'BASE'),
    },
    hItemSepratorStyle: {
      width: Responsive.getWidth(2),
    },
    pinnedItem: {
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    pinnedItemImg: {
      ...COMMON_STYLE.imageStyle(14),
      borderRadius: 75,
      backgroundColor: theme?.colors?.RED_500,
    },
    pinnedItemName: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BASE', 'center'),
      marginTop: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(2),
    },
    pinnedDotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    blueDote: {
      height: Responsive.getWidth(2),
      width: Responsive.getWidth(2),
      borderRadius: 75,
      backgroundColor: '#1684FC',
      marginHorizontal: Responsive.getWidth(0.5),
    },
    redDote: {
      height: Responsive.getWidth(2),
      width: Responsive.getWidth(2),
      borderRadius: 75,
      backgroundColor: '#FF4403',
      marginHorizontal: Responsive.getWidth(0.5),
    },
    pinnedItemSeprator: {
      width: Responsive.getWidth(3),
    },
    sidenoteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
    },
    sidenoteIcon: {
      ...COMMON_STYLE.imageStyle(5),
      marginRight: Responsive.getWidth(1),
    },
    sidenoteIcon2: {
      ...COMMON_STYLE.imageStyle(3.5, theme?.colors?.RED_500),
      marginRight: Responsive.getWidth(1),
    },
    sidenoteTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    itemSepratorStyle: {
      width: '100%',
      height: Responsive.getWidth(3),
    },
    eventListItem: {
      position: 'relative',
      flexDirection: 'row',
      padding: Responsive.getWidth(2),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 16,
    },
    eventImgView2: {
      position: 'relative',
      width: Responsive.getWidth(36),
      height: Responsive.getWidth(36),
      borderRadius: 12,
      overflow: 'hidden',
    },
    eventImg2: {
      width: '100%',
      height: '100%',
    },
    eventCalendarBtn: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: Responsive.getWidth(9),
      backgroundColor: theme?.colors?.BLUE_100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      zIndex: 1024,
    },
    eventItineraryBtn: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: Responsive.getWidth(9),
      backgroundColor: '#7B61FF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      zIndex: 1024,
    },
    eventCalendarBtnIcon: {
      ...COMMON_STYLE.imageStyle(4),
    },
    eventListItemContent: {
      flex: 1,
      paddingLeft: Responsive.getWidth(3),
    },
    eventUsrRow2: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
    },
    eventUsrImg2: {
      ...COMMON_STYLE.imageStyle(8),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_200,
      resizeMode: 'cover',
    },
    eventUsrName2: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(2),
    },
    hoursTxt: {
      position: 'absolute',
      right: Responsive.getWidth(1),
      top: Responsive.getWidth(1),
      ...COMMON_STYLE.textStyle(9, theme?.colors?.GRAY_100, 'BASE'),
    },
    dayTxt: {
      ...COMMON_STYLE.textStyle(13, '#AAB2C8', 'BASE'),
      marginTop: Responsive.getWidth(2),
    },
    timeTxt: {
      ...COMMON_STYLE.textStyle(11, '#AAB2C8', 'BASE'),
    },
    eventTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(1),
      marginBottom: Responsive.getWidth(1),
    },
    multipleImgsCount: {
      position: 'absolute',
      right: -Responsive.getWidth(1),
      top: Responsive.getWidth(2),
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      lineHeight: Responsive.getWidth(8),
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: 75,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: Responsive.getWidth(1.5),
      paddingRight: Responsive.getWidth(1.5),
    },
    multipleImgsCountTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BOLD'),
    },

    btnOutlineGrayTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BOLD'),
    },
    multipleImgsView: {
      position: 'relative',
      width: Responsive.getWidth(22),
      height: Responsive.getWidth(20),
      // backgroundColor: 'red'
    },
    multipleImgs1: {
      position: 'absolute',
      left: Responsive.getWidth(6),
      ...COMMON_STYLE.imageStyle(11),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      backgroundColor: theme?.colors?.GRAY_800,
      zIndex: 2,
    },
    multipleImgs2: {
      position: 'absolute',
      top: Responsive.getWidth(5),
      ...COMMON_STYLE.imageStyle(8),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      backgroundColor: theme?.colors?.GRAY_800,
      zIndex: 1,
    },
    multipleImgs3: {
      position: 'absolute',
      right: Responsive.getWidth(2),
      bottom: 0,
      ...COMMON_STYLE.imageStyle(14),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      backgroundColor: theme?.colors?.GRAY_800,
      zIndex: 4,
    },

    //Sidenote MODAL STYLE
    sidenoteModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    sidenoteModalbodyBg: {
      width: '100%',
      height: '100%',
    },
    sidenoteModalView: {
      height: 200,
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    sidenoteModalSafeAreaView: {
      padding: Responsive.getWidth(8),
    },
    sidenoteModalBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      height: Responsive.getWidth(12),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
    },
    //EVENT MODAL STYLE
    eventModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    eventModalbodyBg: {
      width: '100%',
      height: '100%',
    },
    eventModalView: {
      height: 250,
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    eventModalSafeAreaView: {
      padding: Responsive.getWidth(8),
    },
    eventModalBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      height: Responsive.getWidth(12),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
    },
    //TASK MODAL STYLE
    taskModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    taskModalbodyBg: {
      width: '100%',
      height: '100%',
    },
    taskModalView: {
      height: 250,
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    taskModalSafeAreaView: {
      padding: Responsive.getWidth(8),
    },
    taskModalBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      height: Responsive.getWidth(12),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
    },
  });
