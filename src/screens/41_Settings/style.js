import { StyleSheet } from 'react-native';
import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { Clock } from 'react-native-reanimated';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    secTitle: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.RED_500, 'BASE', 'left'),
      marginTop: 20,
      // marginBottom: 8,
    },
    soundTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginTop: 24,
      // marginBottom: 8,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 58,
      marginTop: 8,
    },
    actionRowTitle: {
      flex: 1,
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD', 'left'),
    },
    checkIcon: {
      width: 24,
      height: 24,
    },
    arrowIcon: {
      width: 25,
      height: 25,
      transform: [{ rotate: '-90deg' }],
      tintColor: theme?.colors?.GRAY_200,
    },
    dropdownBtnIcon: {
      width: 40,
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      textAlign: 'right',
      // marginRight: -5,
    },
    backgroundImage: {
      flex: 1,
      // justifyContent: 'center',
    },
  });
