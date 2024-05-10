import { StyleSheet, Platform, StatusBar } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    detailsImageView: {
      position: 'relative',
    },
    smallBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      
      borderRadius: Responsive.getWidth(9),
      justifyContent: 'center',
      alignItems: 'center',
     
      alignSelf: 'flex-end',
     
    },
     smallBtnText: {
      ...STYLES.textStyle(8, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    headerBtnStyle: {
      ...STYLES.paddingStyle(5, 5),
      height: 20,
      width: 20,
    },
    // eventImage: {
    //   width: '100%',
    //   height: Responsive.getWidth(74),
    //   borderRadius: 0,
    // },
    eventImageView: {
      position: 'relative',
      width: '100%',
      height: Responsive.getWidth(74),
    },
    eventImage: {
      width: '100%',
      height: '100%',
    },
    gradientLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '105%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      opacity: 0.5,
    },
    eventItem: {
      // borderRadius: Responsive.getWidth(6),
      overflow: 'hidden',
      backgroundColor: theme?.colors?.GRAY_900,
      // borderWidth: 1,
      // borderColor: 'rgba(207, 186, 163, 0.24)',
      // marginTop: 8,
      minHeight: Responsive.getWidth(40),
    },
    eventContent: {
      position: 'absolute',
      bottom: 0,
      padding: Responsive.getWidth(6),
      paddingTop: Platform.OS === 'ios' ? Responsive.getWidth(15) : Responsive.getWidth(9),
      // paddingBottom: Platform.OS === 'ios' ? 0 : Responsive.getWidth(6),
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 1024,
    },
    eventContentRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    smallBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      height: Responsive.getWidth(9),
      paddingHorizontal: Responsive.getWidth(3),
      borderRadius: Responsive.getWidth(9),
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      alignSelf: 'flex-end',
    },
    smallBtnText: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    eventTitle: {
      ...STYLES.textStyle(20, theme?.colors?.WHITE, 'BOLD', 'left'),
      marginBottom: 2,
      textShadowColor: 'rgba(0, 0, 0, 0.50)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },
    eventText: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      opacity: 0.8,
      textShadowColor: 'rgba(0, 0, 0, 0.50)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },
    textTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme?.colors?.WHITE,
    },
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
    listArrowIcon: {
      ...STYLES.imageStyle(6),
    },
    eventContentTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerBtnStyle: {
      width: Responsive.getWidth(10),
      // backgroundColor: 'red',
    },
    closeIcon: {
      height: Responsive.getWidth(7.5),
      width: Responsive.getWidth(7.5),
      // tintColor: theme?.colors?.BLACK,
    },
    todayTextStyle: {
      fontFamily: FONTS.BOLD,
      color: theme?.colors?.WHITE,
    },
    monthTitleStyle: {
      fontSize: 20,
      fontFamily: FONTS.BOLD,
    },
    arrowStyle: {
      tintColor: theme?.colors?.RED_500,
      ...STYLES.imageStyle(4),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      // justifyContent: 'center',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: Responsive.getWidth(5),
      paddingBottom: Responsive.getWidth(10),
    },
    modalView: {
      width: '100%',
      backgroundColor: 'rgba(24, 24, 24, 0.7)',
      // padding: Responsive.getWidth(5),
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
      ...COMMON_STYLE.textStyle(18, theme?.colors?.DARK_GRAY, 'BASE', 'center'),
      marginBottom: 6,
    },
    modalText: {
      ...COMMON_STYLE.textStyle(18, theme?.colors?.WHITE, 'BASE', 'center'),
      paddingVertical: Responsive.getWidth(4),
      // marginBottom: 15,
      // marginTop: 10,
    },
    modalButtonText: {
      ...COMMON_STYLE.textStyle(18, theme?.colors?.BLACK, 'BASE', 'center'),
      paddingVertical: Responsive.getWidth(4.5),
      // marginTop: 20,
    },
    cellSeprator: {
      borderWidth: 1,
      // borderColor: theme?.colors?.INPUT_GRAY_COLOR,
      borderColor: theme?.colors?.GRAY_200,
      opacity: 0.2,
    },
    contentContainer: {
      flex: 1,
      paddingTop: Responsive.getWidth(5),
      paddingHorizontal: Responsive.getWidth(4),
    },
    listItem: {
      flexDirection: 'row',
      // alignItems: 'center',
      marginBottom: Responsive.getWidth(5),
    },
    listUserImg: {
      width: Responsive.getWidth(7),
      height: Responsive.getWidth(7),
      borderRadius: 75,
    },
    listItemIcon: {
      width: Responsive.getWidth(7),
      height: Responsive.getWidth(7),
      tintColor: theme?.colors?.GRAY_100,
    },
    listItemTitle: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
      // paddingLeft: Responsive.getWidth(4),
    },
    listItemTxt: {
      flex: 1,
      ...STYLES.textStyle(13, theme?.colors?.WHITE, 'BOLD', 'left'),
      paddingLeft: Responsive.getWidth(4),
    },
    listItemTxt2: {
      flex: 1,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_50, 'BASE', 'left'),
      paddingLeft: Responsive.getWidth(4),
    },
    listItemTxtIn: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(5),
      paddingLeft: Responsive.getWidth(10),
    },
    userImg: {
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
      borderRadius: 75,
      resizeMode: 'cover',
    },
    userName: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE', 'left'),
      paddingLeft: Responsive.getWidth(4),
    },
    eventScroll: {
      paddingHorizontal: Responsive.getWidth(6),
    },
    invitees: {
      flex: 1,
      ...STYLES.textStyle(10, theme?.colors?.GRAY_50, 'BASE', 'left'),
      paddingLeft: Responsive.getWidth(4),
    },
    sectionHeaderTitle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
    },
    imgBtnimg: {
      width: '100%',
      height: '100%',
    },
    userRowNew: {
      // flexDirection: 'row',
      // alignItems: 'center',
      borderTopWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 20,
    },
    imgRow: {
      flex: 1,
      flexDirection: 'row',
    },
    imgBtn: {
      width: 30,
      height: 30,
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_800,
      marginRight: -10,
      overflow: 'hidden',
    },
    userTxt: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'left'),
      paddingLeft: 20,
      paddingTop: 5,
    },
    SectionListTitle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(5),
      marginBottom: Responsive.getWidth(4),
    },
    eventItem2: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: Responsive.getWidth(6),
      overflow: 'hidden',
      backgroundColor: theme?.colors?.GRAY_900,
      // borderWidth: 1,
      // borderColor: 'rgba(207, 186, 163, 0.24)',
      minHeight: Responsive.getWidth(40),
      padding: Responsive.getWidth(3),
      marginBottom: Responsive.getWidth(3),
    },
    eventItemImg: {
      width: Responsive.getWidth(40),
      height: Responsive.getWidth(40),
      borderRadius: 20
    },
    eventContent2: {
      flex: 1,
      paddingLeft: Responsive.getWidth(3),
    },
    eventUserImg: {
      ...STYLES.imageStyle(8),
      resizeMode: 'cover',
      borderRadius: 75,
    },
    eventItemDate: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      marginTop: Responsive.getWidth(3),
    },
    eventItemTitle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(2),
    },
    eventItemTime: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      marginTop: Responsive.getWidth(2),
    },
    eventItemName: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      marginTop: Responsive.getWidth(2),
    },
    stickyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Responsive.getWidth(8),
      marginBottom: Responsive.getWidth(12),
    },
    postButton: {
      height: 41,
      width: 130,
      backgroundColor: theme?.colors?.PURPLE,
      marginRight: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    btnIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
    draftButton: {
      height: 41,
      width: 130,
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_BORDER,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
