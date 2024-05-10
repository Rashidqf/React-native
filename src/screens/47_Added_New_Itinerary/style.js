import { StyleSheet } from 'react-native';
import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    noBorderInputContainer: {
      borderBottomWidth: 0,
      // borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    datePickerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    noBorderInput: {
      paddingLeft: 0,
    },
    noBorderInputTxt: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    noBorderInputContainerRight: {
      borderBottomWidth: 0,
      marginRight: -Responsive.getWidth(1),
    },
    backgroundImage: {
      flex: 1,
    },
    searchControl: {
      borderBottomWidth: 0,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    tabContianer: {
      flexDirection: 'row',
      paddingLeft: Responsive.getWidth(6),
      marginBottom: Responsive.getWidth(4),
    },
    tabItem: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 50,
      marginRight: Responsive.getWidth(1),
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    tabItemActive: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 50,
      marginLeft: 10,
      backgroundColor: theme?.colors?.PURPLE,
    },
    tabItemText: {
      ...STYLES.textStyle(11, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    eventList: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(2),
      paddingHorizontal: Responsive.getWidth(6),
    },
    eventListText: {
      flex: 1,
      ...STYLES.textStyle(15, theme?.colors?.WHITE, 'BASE'),
    },
    eventListIcon: {
      ...STYLES.imageStyle(5, theme?.colors?.ORANGE_200, 'BASE'),
    },
    postBtnTxt: {
      ...STYLES.textStyle(14, theme?.colors?.PURPLE_500, 'BASE', 'center'),
    },
    draftButton: {
      height: 41,
      width: 120,
      borderWidth: 2,
      marginLeft: 20,
      borderColor: theme?.colors?.GRAY_BORDER,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stickyButton: {
      // position: 'absolute',
      // bottom: 80,
      flexDirection: 'row',
    },
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
    postButton: {
      height: 41,
      width: 120,
      backgroundColor: theme?.colors?.PURPLE,
      marginLeft: 45,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    calendarTextStyle: {
      fontFamily: FONTS.BOLD,
      color: theme?.colors?.WHITE,
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
    // Popup Style
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
      padding: Responsive.getWidth(6),
      paddingBottom: Responsive.getWidth(10),
    },
    btn: {
      height: 48,
      borderRadius: 12,
      borderWidth: 1,
    },
    btnTitleStyle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE'),
    },
    btnOrange: {
      borderColor: theme?.colors?.ORANGE_200,
      backgroundColor: theme?.colors?.ORANGE_200,
    },
    btnOutlineOrange: {
      marginTop: Responsive.getWidth(3),
      backgroundColor: theme?.colors?.TRANSPARENT,
      borderColor: theme?.colors?.ORANGE_200,
    },
  });
