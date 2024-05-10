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
    privateIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_100),
    },
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
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
    noBorderInputTxtRight: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'right'),
    },
    noBorderInputContainerRight: {
      borderBottomWidth: 0,
      marginRight: -Responsive.getWidth(1),
    },
    noBorderInputRight: {
      paddingLeft: 0,
      paddingRight: 0,
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
    bottomBtnView: {
      paddingHorizontal: Responsive.getWidth(5),
      marginTop: Responsive.getWidth(5),
    },
    smallBtn: {
      paddingVertical: Responsive.getWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    smallBtnText: {
      ...STYLES.textStyle(16, theme?.colors?.WHITE, 'BASE', 'right'),
    },
  });
