import { StyleSheet } from 'react-native';
import { COMMON_STYLE, COLORS, IMAGES } from '@themes';
import { Responsive } from '@helpers';

export const styling = theme =>
  StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      shadowOffset: { height: 0 },
      elevation: 0,
      height: 100,
      backgroundColor: theme?.colors?.GRAY_100,
    },

    sectionHeaderTitle: {
      ...COMMON_STYLE.textStyle(15, COLORS.RED_500, 'BOLD', 'left'),
      marginTop: Responsive.getWidth(2),
    },

    headerTitleStyle: {
      ...COMMON_STYLE.textStyle(14, COLORS.GRAY_100, 'BOLD', 'center'),
    },
    headerProfile: {
      width: Responsive.getWidth(12),
      height: Responsive.getWidth(12),
      borderRadius: 75,
      // overflow: 'hidden',
      backgroundColor: COLORS.RED_500,
      marginLeft: Responsive.getWidth(6),
      padding: 0,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 75,
      resizeMode: 'cover',
    },
    headerIcon: {
      ...COMMON_STYLE.imageStyle(6),
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Responsive.getWidth(6),
      paddingVertical: Responsive.getWidth(5),
    },
    navIcon: {
      ...COMMON_STYLE.imageStyle(6),
      marginRight: Responsive.getWidth(5),
    },
    navTitle: {
      ...COMMON_STYLE.textStyle(14, COLORS.GRAY_50, 'BASE', 'left'),
    },
    drawerTopContent: {
      paddingVertical: Responsive.getWidth(5),
      paddingHorizontal: Responsive.getWidth(6),
    },
    profileImageView: {
      position: 'relative',
      width: Responsive.getWidth(17),
      height: Responsive.getWidth(17),
      borderRadius: 75,
      backgroundColor: COLORS.GRAY_200,
      marginBottom: Responsive.getWidth(5),
      borderWidth: 2,
      borderColor: COLORS.RED_500,
    },
    drawerProfile: {
      // ...COMMON_STYLE.imageStyle(17),
      width: '100%',
      height: '100%',
    },
    chatCount: {
      height: 20,
      width: 20,
      backgroundColor: COLORS.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: -Responsive.getWidth(1),
      right: -Responsive.getWidth(1),
    },
    chatCountTxt: {
      ...COMMON_STYLE.textStyle(11, 'BOLD'),
      color: COLORS.WHITE,
    },
    navCount: {
      minHeight: 20,
      minWidth: 20,
      backgroundColor: COLORS.RED_500,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 5,
    },
    h5: {
      ...COMMON_STYLE.textStyle(16, COLORS.WHITE, 'BASE', 'left'),
      marginBottom: 4,
    },
    linkText: {
      ...COMMON_STYLE.textStyle(14, COLORS.PURPLE_500, 'BASE', 'left'),
    },
    drawerBottomContent: {
      flex: 1,
      height: Responsive.getHeight(30),
      backgroundColor: COLORS.GRAY_800,
      ...COMMON_STYLE.marginStyle(6, 6, 2, 6),
    },
    buttonText: {
      ...COMMON_STYLE.textStyle(14, COLORS.WHITE, 'BASE'),
    },
  });
