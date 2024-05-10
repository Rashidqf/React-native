import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { COLORS } from '../../themes/colors';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topContent: {
      paddingTop: Responsive.getHeight(5),
      paddingBottom: Responsive.getHeight(5),
    },
    bottomContent: {
      paddingTop: Responsive.getHeight(5),
    },
    middelContent: {
      paddingTop: Responsive.getHeight(4),
      paddingBottom: Responsive.getHeight(4),
    },
    profilePhoto: {
      width: Responsive.getWidth(42),
      height: Responsive.getWidth(42),
      borderRadius: Responsive.getWidth(75),
      backgroundColor: COLORS.ORANGE_10,
      borderColor: COLORS.ORANGE_200,
      borderWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImg: {
      width: Responsive.getWidth(40),
      height: Responsive.getWidth(40),
      borderRadius: Responsive.getWidth(75),
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
      backgroundColor: theme?.colors?.WHITE,
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
      alignSelf: 'center',
      marginVertical: Responsive.getHeight(2),
      justifyContent: 'space-evenly',
      height: 150,
    },
    BtnViewStyle: {
      // alignSelf: 'center',
      // marginVertical: Responsive.getHeight(2),
      justifyContent: 'space-evenly',
      height: 150,
      width: '100%',
    },
    RemoveBtnViewStyle: {
      // alignSelf: 'cenbuttonTextter',
      // marginVertical: Responsive.getHeight(2),
      justifyContent: 'space-evenly',
      marginHorizontal: 10,
      height: 30,
    },
    backgroundImage: {
      flex: 1,
    },
    pictureText: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.GRAY_50, 'BOLD', 'center'),
    },
    favoriteText: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.GRAY_50, 'BASE', 'center'),
      ...COMMON_STYLE.marginStyle(0, 0, 1, 0),
    },
  });
