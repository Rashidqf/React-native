import { StyleSheet, StatusBar, Platform } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

    header: {
      height: Platform.OS === 'ios' ? 50 : 60,
      paddingHorizontal: 15,
      // borderBottomWidth: 1,
      // borderColor: theme?.colors?.GRAY_800,
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
      ...STYLES.textStyle(20, theme?.colors?.RED_500),
      marginLeft: -5,
    },
    headerRightImgWrap: {
      width: Responsive.getWidth(9),
      height: Responsive.getWidth(9),
      borderRadius: 75,
    },
    headerRightImg: {
      width: '100%',
      height: '100%',
    },
    chatIconBtn: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chatIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_300),
    },
    chatFooter: {
      paddingHorizontal: 15,
      // borderTopWidth: 1,
      // borderColor: theme?.colors?.GRAY_800,
      // backgroundColor: theme?.colors?.GRAY_900,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    inputContainer: {
      flexDirection: 'row',
    },
    msgInput: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
      height: 50,
    },
    inputBtn: {
      width: 50,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    inputBtnIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_300),
    },
    inputBtnIcon2: {
      ...STYLES.textStyle(18, theme?.colors?.PURPLE_500),
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
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE'),
      paddingLeft: 10,
    },
    noMsgContainer: {
      padding: 15,
      marginTop: Responsive.getWidth(10),
    },
    noMsgTxt: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'center'),
      lineHeight: 24,
      width: Responsive.getWidth(80),
      alignSelf: 'center',
    },

    msgContainer: {
      paddingHorizontal: 15,
    },
    msgContainerLeft: {
      width: Responsive.getWidth(85),
      marginTop: Responsive.getWidth(8),
    },
    msgContainerRight: {
      width: Responsive.getWidth(70),
      marginTop: Responsive.getWidth(8),
      marginLeft: 'auto',
      marginRight: 0,
    },
    msgRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    senderImgWrap: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      borderRadius: 75,
      marginBottom: 23,
    },
    userImg: {
      width: '100%',
      height: '100%',
    },
    msgTxtBox: {
      flex: 1,
      width: Responsive.getWidth(60),
      marginHorizontal: Responsive.getWidth(3),
    },
    msgTimeTxt: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_200, 'BASE', 'left'),
      marginBottom: 5,
    },
    msgTimeTxtRight: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_200, 'BASE', 'right'),
      marginBottom: 5,
    },
    typeMsgTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
      fontSize: 14,
      lineHeight: 20,
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      borderRadius: 10,
      padding: 10,
    },
    shareImgView: {
      flex: 1,
      height: Responsive.getHeight(18),
      borderRadius: 10,
      overflow: 'hidden',
    },
    shareImg: {
      width: '100%',
      height: '100%',
    },
    replyBtnRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyBtnTxt: {
      ...STYLES.textStyle(10, theme?.colors?.PURPLE_500, 'BASE', 'left'),
      marginTop: 5,
      marginRight: 15,
    },
    msgLikeBtn1: {
      marginBottom: 20,
    },
    msgLikeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginBottom: 20,
    },
    likeIcon: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_300),
      // ...STYLES.textStyle(12, theme?.colors?.RED_500, "BASE"),
    },
    likeCountTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_300),
      // ...STYLES.textStyle(12, theme?.colors?.RED_500,),
      marginLeft: 2,
    },
    replyLeftView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      width: Responsive.getWidth(82),
      marginLeft: 'auto',
    },
    replyImgWrap: {
      width: Responsive.getWidth(7),
      height: Responsive.getWidth(7),
      borderRadius: 75,
    },
    replyViewContent: {
      paddingLeft: Responsive.getWidth(2),
    },
    replyNameTxt: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_300),
    },
    replyNameInnerTxt: {
      ...STYLES.textStyle(11, theme?.colors?.WHITE),
    },
    replyTxt2: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_100),
      marginTop: 3,
    },
    eventView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      borderRadius: 10,
      padding: 10,
    },
    eventDateView: {
      width: Responsive.getWidth(15),
      height: Responsive.getWidth(15),
      borderRadius: 10,
      backgroundColor: theme?.colors?.GRAY_800,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventDetail: {
      flex: 1,
      paddingLeft: 10,
    },
    eventDateTxt1: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE'),
      textTransform: 'uppercase',
    },
    eventDateTxt2: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_300, 'BOLD'),
      marginTop: 3,
    },
    eventTitle: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE'),
    },
    eventSubjectTxt: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_200, 'BASE'),
      marginTop: 3,
    },
    eventDate: {
      ...STYLES.textStyle(11, theme?.colors?.GRAY_200, 'BASE'),
      marginTop: 3,
    },
    optionView: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      borderRadius: 10,
      padding: 10,
    },
    optionQuestionTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE'),
    },
    optionRow: {
      position: 'relative',
      width: '100%',
      height: Responsive.getWidth(9),
      borderRadius: 8,
      backgroundColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      marginTop: 8,
      overflow: 'hidden',
    },
    optionRowTxt: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_50, 'BASE'),
      zIndex: 1,
    },
    optionRowTxtIcon: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_50),
    },
    optionProgress: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '0%',
      height: '100%',
      backgroundColor: theme?.colors?.RED_500,
    },
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
    dfdfd: {},
  });
