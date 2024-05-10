import { StyleSheet, Platform } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    eventContainer: {
      flex: 1,
    },
    eventScroll: {
      // paddingHorizontal: Responsive.getWidth(6),
    },
    eventHeaderTitle: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BOLD'),
      paddingVertical: Platform.OS === 'ios' ? 10 : 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      paddingRight: 0,
      marginLeft: 0,
      marginBottom: Platform.OS === 'ios' ? 0 : 10,
      backgroundColor: "transparent",
    },
    rowBack: {
      alignItems: 'flex-end',
      // backgroundColor: '#DDD',
      // flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 100,
    },
    eventItem: {
      // borderRadius: Responsive.getWidth(6),
      // overflow: 'hidden',
      // backgroundColor: theme?.colors?.GRAY_900,
      // borderWidth: 1,
      // borderColor: 'rgba(207, 186, 163, 0.35)',
      // marginBottom: Responsive.getWidth(5),
      // minHeight: Responsive.getWidth(40),
      // marginBottom: Responsive.getWidth(5),
      position: 'relative',
      flexDirection: 'row',
      padding: Responsive.getWidth(2),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 16,
    },
    eventImageView: {
      position: 'relative',
      width: '100%',
      height: Responsive.getWidth(54),
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
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      opacity: 0.5,
    },
    eventContent: {
      position: 'absolute',
      bottom: 0,
      padding: Responsive.getWidth(6),
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      // backgroundColor: 'rgba(0,0,0,0.5)'
    },
    eventContentRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
    groupText: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_50, 'BASE', 'left'),
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
      ...COMMON_STYLE.textStyle(20, theme?.colors?.DARK_GRAY, 'BASE', 'center'),
      marginBottom: 6,
    },
    modalText: {
      ...COMMON_STYLE.textStyle(20, theme?.colors?.WHITE, 'BASE', 'center'),
      paddingVertical: Responsive.getWidth(4),
      // marginBottom: 15,
      // marginTop: 10,
    },
    modalButtonText: {
      ...COMMON_STYLE.textStyle(20, theme?.colors?.BLACK, 'BASE', 'center'),
      paddingVertical: Responsive.getWidth(4.5),
      // marginTop: 20,
    },
    cellSeprator: {
      borderWidth: 1,
      // borderColor: theme?.colors?.INPUT_GRAY_COLOR,
      borderColor: theme?.colors?.GRAY_200,
      opacity: 0.2,
    },
    countdownText: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_300, 'BASE', 'left'),
      marginLeft: '82%',
      marginTop: -18,
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      padding: Responsive.getWidth(2),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 16,
    },
    eventImgView: {
      position: 'relative',
      width: Responsive.getWidth(36),
      height: Responsive.getWidth(36),
      borderRadius: 12,
      overflow: 'hidden',
      zIndex: 2,
    },
    eventImg: {
      width: '100%',
      height: '100%',
    },
    listItemContent: {
      flex: 1,
      paddingLeft: Responsive.getWidth(3),
    },
    eventTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(1),
      marginBottom: Responsive.getWidth(1),
    },
    eventTitleIcon: {
      ...COMMON_STYLE.imageStyle(5),
      marginRight: Responsive.getWidth(2),
    },
    hoursTxt: {
      position: 'absolute',
      right: Responsive.getWidth(1),
      top: Responsive.getWidth(1),
      ...COMMON_STYLE.textStyle(9, theme?.colors?.GRAY_100, 'BASE'),
    },
    eventUsrRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
    },
    eventUsrImg: {
      ...COMMON_STYLE.imageStyle(8),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_200,
      resizeMode: 'cover'
    },
    eventUsrName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(2),
    },
    dayTxt: {
      ...COMMON_STYLE.textStyle(13, '#AAB2C8', 'BASE'),
      marginTop: Responsive.getWidth(2),
    },
    timeTxt: {
      ...COMMON_STYLE.textStyle(11, '#AAB2C8', 'BASE'),
    },
    globeIcon: {
      ...COMMON_STYLE.imageStyle(6),
      marginTop: Responsive.getWidth(2),
    },
    ddContainer: {
      padding: Responsive.getWidth(2),
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 16,
      margin: Responsive.getWidth(5),
    },
    ddItem: {
      position: 'relative',
      flexDirection: 'row',
      // padding: Responsive.getWidth(2),
      // backgroundColor: 'rgba(255,255,255,0.1)',
      // borderRadius: 16,
      // margin: Responsive.getWidth(5),
    },
    ddItemContent: {
      position: 'relative',
      flex: 1,
      paddingLeft: Responsive.getWidth(2),
    },
    ddItemTitle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(1.5),
      marginBottom: Responsive.getWidth(1),
    },
    sidenoteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(2),
    },
    sidenoteIcon: {
      ...COMMON_STYLE.imageStyle(4),
      marginRight: Responsive.getWidth(1),
    },
    sidenoteTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    arrowBtn: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 150,
    },
    arrowBtnIcon: {
      ...COMMON_STYLE.imageStyle(6, theme?.colors?.GRAY_200),
    },
    ddMenu: {
      position: 'relative',
      marginTop: Responsive.getWidth(2),
      borderTopWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      paddingTop: Responsive.getWidth(1),
    },
    imagesRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: Responsive.getWidth(2),
      paddingRight: Responsive.getWidth(1),
    },
    imagesRowImg: {
      ...COMMON_STYLE.imageStyle(5),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_200,
      resizeMode: 'cover',
      marginRight: -Responsive.getWidth(1)
    },
    checkBox: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      padding: Responsive.getWidth(3),
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 9,
      margin: Responsive.getWidth(5),
      marginBottom: 0,
    },
    checkBoxIcon: {
      ...COMMON_STYLE.imageStyle(6),
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_1000,
      borderRadius: 5,
    },
    checkBoxTxt: {
      flex: 1,
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      paddingLeft: Responsive.getWidth(3),
    },
    itemInfoRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
      marginBottom: Responsive.getWidth(1),
    },
    itemInfoRowIcon: {
      ...COMMON_STYLE.imageStyle(3.5, theme?.colors?.GRAY_200),
      marginRight: Responsive.getWidth(1),
    },
    itemInfoRowTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.GRAY_200, 'BOLD'),
    },
    checkListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(3),
    },
    checkListIcon: {
      ...COMMON_STYLE.imageStyle(6),
    },
    checkListItemTxt: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_100, 'BASE'),
      paddingLeft: Responsive.getWidth(2),
    },
    coloredBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: Responsive.getWidth(18),
      height: '110%',
      borderRadius: 16,
      backgroundColor: '#01C1FD',
      zIndex: 1,
    },
    bgPurple: {
      backgroundColor: '#BF5AF2',
    },
    bgSkyBlue: {
      backgroundColor: '#01C1FD',
    },
    taskView: {
      position: 'relative',
      // flexDirection: 'row',
      padding: Responsive.getWidth(2),
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      margin: Responsive.getWidth(5),
      borderLeftWidth: 5,
      borderColor: theme?.colors?.RED_500,
    },
    taskTitle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
    },
    taskDay: {
      position: 'absolute',
      top: Responsive.getWidth(2),
      right: Responsive.getWidth(2),
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BASE'),
    },
    taskRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: Responsive.getWidth(2),
    },
    taskInRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    taskInTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BASE'),
    },
    taskInImg: {
      ...COMMON_STYLE.imageStyle(5),
      borderRadius: 75,
      marginRight: Responsive.getWidth(1),
    },
    taskInIcon: {
      ...COMMON_STYLE.imageStyle(3, theme?.colors?.WHITE),
      marginRight: Responsive.getWidth(1),
    },
    taskInTxtSep: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BOLD'),
      marginHorizontal: Responsive.getWidth(1.5),
    },
    dfsfd: {

    },

  });
