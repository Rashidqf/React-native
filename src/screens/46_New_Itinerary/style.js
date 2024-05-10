import { StyleSheet } from 'react-native';
import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    calendarTextStyle: {
      fontFamily: FONTS.BOLD,
      color: theme?.colors?.WHITE,
    },
    todayTextStyle: {
      fontFamily: FONTS.BOLD,
      color: theme?.colors?.WHITE,
    },
    datePickerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchControl: {
      borderBottomWidth: 0,

      borderColor: 'rgba(255, 255, 255, 0.08)',
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
      justifyContent: 'center',
      marginTop: 30,
    },
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
    postButton: {
      height: 41,
      width: 120,
      backgroundColor: theme?.colors?.PURPLE,
      // marginLeft: 45,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
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
  });
