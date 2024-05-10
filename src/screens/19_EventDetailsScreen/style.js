import { StyleSheet, Platform, StatusBar } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    detailsImageView: {
      position: 'relative',
    },
    headerBtnStyle: {
      ...STYLES.paddingStyle(5, 5),
      height: 20,
      width: 20,
    },
    eventImageView: {
      position: 'relative',
      width: '100%',
      height: Responsive.getWidth(74),
    },
    eventImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
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
      ...STYLES.textStyle(20, theme?.colors?.WHITE, 'BASE', 'left'),
      marginBottom: 2,
      textShadowColor: 'rgba(0, 0, 0, 0.50)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },
    eventText: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE', 'left'),
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
      height: Responsive.getWidth(9),
      width: Responsive.getWidth(9),
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
    listItemIcon: {
      width: Responsive.getWidth(6),
      height: Responsive.getWidth(6),
      tintColor: theme?.colors?.GRAY_100,
    },
    listItemTitle: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
      // paddingLeft: Responsive.getWidth(4),
    },
    listItemTxt: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      paddingLeft: Responsive.getWidth(4),
    },
    listItemTxt2: {
      flex: 1,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_50, 'BASE', 'left'),
      paddingLeft: Responsive.getWidth(4),
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
    eventModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    eventModalbody: {
      position: 'relative',
      // height: Responsive.getHeight(15),
      paddingTop: Responsive.getWidth(4),
      paddingHorizontal: Responsive.getWidth(3),
      backgroundColor: '#393939',
      // borderTopLeftRadius: Responsive.getWidth(5),
      // borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    modalBtn: {
      borderRadius: 13,
      height: Responsive.getWidth(14),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
      backgroundColor: '#434343',
    },
    bgBlue: {
      backgroundColor: '#1684FC',
    },

  });
