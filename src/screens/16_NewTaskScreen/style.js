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
    listIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_100),
    },
    listArrowIcon: {
      ...STYLES.imageStyle(6),
    },
    subtasksView: {
      // marginLeft: Responsive.getWidth(8),
      // paddingVertical: 15,
      // borderBottomWidth: 1,
      // borderColor: theme?.colors?.GRAY_800,
    },
    // addedTaskView: {
    //   paddingVertical: 15,
    //   borderBottomWidth: 1,
    //   borderColor: theme?.colors?.GRAY_800,
    // },
    selectedText: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BASE', 'left'),
      marginTop: Responsive.getWidth(0.5),
    },
    subtaskInput: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    searchControl: {
      borderBottomWidth: 0,
      borderColor: 'rgba(255, 255, 255, 0.08)',
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
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
  });
