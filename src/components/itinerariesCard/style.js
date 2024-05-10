import { StyleSheet } from 'react-native';
import { Responsive } from '@helpers';
import { COMMON_STYLE, STYLES } from '@themes';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    card: {
      position: 'relative',
      backgroundColor: theme?.colors.OPACITY_100,
      padding: Responsive.getWidth(2),
      marginHorizontal: Responsive.getWidth(3),
      borderRadius: 16,
      flexDirection: 'row',
      overflow: 'hidden',
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
    cardBody: {
      flex: 1,
      paddingLeft: 15,
    },
    dayTxt: {
      ...STYLES.textStyle(10, theme?.colors?.WHITE, 'BASE', 'left'),
      position: 'absolute',
      top: 0,
      right: 0,
    },
    userImgCircle: {
      height: Responsive.getWidth(7),
      width: Responsive.getWidth(7),
      backgroundColor: theme?.colors?.WHITE,
      borderRadius: 75,
      resizeMode: 'cover',
      marginRight: Responsive.getWidth(2),
    },
    userName: {
      ...STYLES.textStyle(11, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    chatIcon: {
      ...STYLES.imageStyle(3),
      marginRight: Responsive.getWidth(1),
    },
    eventImgView: {
      position: 'relative',
      width: Responsive.getWidth(35),
      height: Responsive.getWidth(35),
      borderRadius: 12,
      overflow: 'hidden',
      zIndex: 2,
    },
    eventImage: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
    },
    imgBadge: {
      position: 'absolute',
      top: Responsive.getWidth(3),
      left: -Responsive.getWidth(8),
      width: '100%',
      padding: Responsive.getWidth(1),
      transform: [{ rotate: '-30deg' }],
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    imgBadgeTxt: {
      ...STYLES.textStyle(10, theme?.colors?.WHITE, 'BOLD', 'center'),
    },
    chatTitle: {
      ...STYLES.textStyle(7, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    eventTitle: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginTop: Responsive.getWidth(2),
    },
    eventTime: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
      marginTop: Responsive.getWidth(1),
    },
    eventTime1: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
      marginTop: Responsive.getWidth(3),
    },
    eventTime2: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
      marginTop: Responsive.getWidth(1.5),
    },
    purpleBtn: {
      backgroundColor: theme?.colors?.PURPLE,
      paddingVertical: Responsive.getWidth(1),
      paddingHorizontal: Responsive.getWidth(3),
      borderRadius: 30,
      marginTop: Responsive.getWidth(1.5),
      alignSelf: 'flex-start',
    },
    purpleBtnTxt: {
      ...STYLES.textStyle(10, theme?.colors?.GRAY_100, 'BOLD', 'center'),
    },
  });
