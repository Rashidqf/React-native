import {StyleSheet} from 'react-native';

import {Responsive} from '../../../helper';
import {COLORS, COMMON_STYLE, IMAGES} from '../../../theme';

export const styles = StyleSheet.create({
  safeAreaStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  },

  alertBoxStyle: {
    width: Responsive.getWidth(90),
    height: Responsive.getHeight(9),
    borderRadius: Responsive.getWidth(2),
    backgroundColor: COLORS.WHITE,
    ...COMMON_STYLE.paddingStyle(4, 4, 1.2, 1.2),
    marginTop: Responsive.getHeight(3),
    shadowColor: COLORS.DARK_GRAY,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    elevation: 3,
    justifyContent: 'center',
  },

  titleStyle: {
    ...COMMON_STYLE.textStyle(12, COLORS.DARK_GRAY, 'BOLD'),
  },

  descriptionStyle: {
    ...COMMON_STYLE.textStyle(10, COLORS.GRAY, undefined),
  },

  btnTitleStyle: color => {
    return {...COMMON_STYLE.textStyle(12, color, 'BOLD')};
  },
});
