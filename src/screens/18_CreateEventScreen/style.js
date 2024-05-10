import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    privateIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_100),
    },
    listIcon: {
      ...STYLES.imageStyle(6),
    },
    listArrowIcon: {
      ...STYLES.imageStyle(6),
    },
    subtasksView: {
      marginLeft: Responsive.getWidth(8),
    },
    subtaskInput: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    subtaskContainerStyle: {
      borderBottomWidth: 0,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    subtaskInputStyle: {
      height: Responsive.getWidth(15),
      paddingHorizontal: Responsive.getWidth(4),
    },
    datePickerView: {
      justifyContent: 'center',
      alignItems: 'center',
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    noBorderInputContainer: {
      borderBottomWidth: 0,
      // borderColor: 'rgba(255, 255, 255, 0.08)',
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
    noBorderInputRight: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    noBorderInputTxtRight: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'right'),
    },
    postBtnTxt: {
      ...STYLES.textStyle(14, theme?.colors?.PURPLE_500, 'BASE', 'center'),
    },
    listIcon: {
      ...STYLES.imageStyle(6),
    },
    listArrowIcon: {
      ...STYLES.imageStyle(6),
    },
    subtasksView: {
      marginLeft: Responsive.getWidth(8),
    },
    subtaskInput: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    subtaskContainerStyle: {
      borderBottomWidth: 0,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    subtaskInputStyle: {
      height: Responsive.getWidth(15),
      paddingHorizontal: Responsive.getWidth(4),
    },
    datePickerView: {
      justifyContent: 'center',
      alignItems: 'center',
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    smallBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      height: Responsive.getWidth(9),
      paddingHorizontal: Responsive.getWidth(3),
      borderRadius: Responsive.getWidth(9),
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallBtnText: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'center'),
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    stickyButton: {
      // position: 'absolute',
      // bottom: 0,
      flexDirection: 'row',
      marginTop: 30
    },
    postButton: {
      height: 41,
      width: 120,
      backgroundColor: theme?.colors?.PURPLE,
      marginLeft: 65,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
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
  });
