import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, IMAGES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...STYLES,
    safeAreaStyle: {
      flex: 1,
      backgroundColor: theme?.colors?.DARK_OPACITY,
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
      alignItems: 'center',
      // padding: Responsive.getWidth(6),
    },
      userName: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginBottom: 10,
    },
    modalView: {
     width: '100%',
      backgroundColor: theme?.colors?.GRAY_900,
      padding: Responsive.getWidth(8),
      paddingHorizontal: Responsive.getWidth(6),
      // borderRadius: Responsive.getWidth(4),
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
    },
    modalImageView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 35,
    },
     modalImageViewBody: {
      flex: 1,
      paddingRight: Responsive.getWidth(5)
    },
    modalTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.WHITE, 'BOLD', 'center'),
      marginBottom: Responsive.getWidth(3),
      lineHeight: Responsive.getWidth(7),
    },
    modalText: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.GRAY_COLOR, 'BASE', 'center'),
      marginBottom: Responsive.getWidth(10),
      lineHeight: Responsive.getWidth(6),
    },
    modalBodyclose: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    titleText: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.BLACK_414, 'BOLD'),
      marginBottom: Responsive.getWidth(2),
      textAlign: 'center',
    },
    detailText: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.SUBLABEL_GREY),
      ...COMMON_STYLE.marginStyle(0, 0, 2, 1),
      textAlign: 'center',
    },
    SafeAreaView: {
      flex: 1,
      // marginTop: Responsive.getWidth(15),
    },
    userName: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      // marginBottom: 10,
    },
    sendButton: {
      backgroundColor: theme?.colors?.RED_500,
      width: '60%',
      borderRadius: 20,
      // marginLeft: Responsive.getWidth(18),
      marginTop: Responsive.getHeight(2),
      alignSelf: 'center',
    },
     contatText: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_200, 'BASE', 'left'),
    },
     userProfileImage: {
      width: Responsive.getWidth(30),
      height: Responsive.getWidth(30),
      borderRadius: 75,
      resizeMode: 'cover'
    },
     sendButtonTxt: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_50, 'BASE', 'center'),
    },
    connectionTxt1: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      marginBottom: Responsive.getHeight(0.5)
    },
    connectionTxt2: {
      ...STYLES.textStyle(9, theme?.colors?.GRAY_50, 'BASE', 'center'),
      opacity: 0.7
    },
  });
