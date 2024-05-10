import { StyleSheet } from 'react-native';
import { COMMON_STYLE, COLORS, IMAGES } from '@themes';

export const style = theme =>
  StyleSheet.create({
    headerTitleStyle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_100, 'BOLD', 'center'),
    },
  });
