import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      flex: 1,
      paddingBottom: Responsive.getHeight(2),
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },

    topContent: {
      paddingTop: Responsive.getHeight(5),
      paddingBottom: Responsive.getHeight(2),
      width: '100%',
    },
    profilePhoto: {
      width: Responsive.getWidth(44),
      height: Responsive.getWidth(44),
      borderRadius: Responsive.getWidth(88),
      backgroundColor: theme?.colors?.GRAY_300,
      alignSelf: 'center',
    },
    profileImg: {
      width: Responsive.getWidth(44),
      height: Responsive.getWidth(44),
      borderRadius: Responsive.getWidth(88),
      resizeMode: 'cover',
    },
    addIconStyle: {
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    addIcon: {
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
    },
    safeAreaStyle: {
      width: '100%',
      height: '100%',
      backgroundColor: theme?.colors?.DARK_OPACITY,
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
    },
    alertBoxStyle: {
      // width: Responsive.getWidth(90),
      width: '100%',
      maxHeight: Responsive.getHeight(55),
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      backgroundColor: 'white',
    },
    closeButtonStyle: {
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      alignSelf: 'flex-end',
      margin: Responsive.getWidth(2),
      backgroundColor: theme?.colors?.TRANSPARENT,
    },
    closeIconStyle: {
      width: Responsive.getWidth(4),
      height: Responsive.getWidth(4),
    },
    alertTitleStyle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.BLACK, 'BOLD', 'center'),
    },
    descriptionStyle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.DARK_GRAY, undefined, 'center'),
      marginHorizontal: Responsive.getWidth(2),
      marginVertical: Responsive.getHeight(1),
    },
    profileBtnViewStyle: {
      // width: '80%',
      // alignSelf: 'center',
      // marginVertical: Responsive.getHeight(2),
      // // alignItems: 'center',
      // justifyContent: 'space-evenly',
      // height: 150,
      marginVertical: Responsive.getHeight(2),
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: 150,
    },
    inputCodeStyle: {
      width: '70%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',

      overflow: 'hidden',
      marginLeft: 2,
      alignItems: 'center',
    },
    inputphoneStyle: {
      width: '100%',
      height: Responsive.getWidth(13),
      flexDirection: 'row',

      overflow: 'hidden',
      borderColor: 'black',
      alignItems: 'center',
      borderRightWidth: 1,
    },
    titleStyle: {
      ...COMMON_STYLE.textStyle(13, theme?.colors?.INPUT_GRAY_COLOR, 'BOLD'),
      lineHeight: Responsive.getWidth(7),
      marginTop: Responsive.getHeight(2),
    },
    inputClearIconBtn: {
      width: Responsive.getWidth(5),
      height: Responsive.getWidth(5),
      position: 'absolute',
      top: Responsive.getWidth(17),
      right: Responsive.getWidth(3),
    },
    inputClearIcon: {
      width: '100%',
      height: '100%',
    },
    modalButton: {
      minWidth: '60%',
      height: 50,
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: 10,
    },
    modalButtonText: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.WHITE, 'BOLD', 'center'),
    },
  });
