import {StyleSheet} from 'react-native';

import {COMMON_STYLE, COLORS, IMAGES} from '@themes';
import {Responsive} from '@helpers';

export const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.DARK_OPACITY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertBoxStyle: {
    width: Responsive.getWidth(90),
    borderRadius: Responsive.getWidth(3),
    backgroundColor: COLORS.WHITE,
    padding: Responsive.getWidth(2),
  },

  titleStyle: {
    ...COMMON_STYLE.textStyle(18, COLORS.DARK_GRAY, 'BOLD', 'center'),
    marginVertical: Responsive.getHeight(2),
  },

  descriptionStyle: {
    ...COMMON_STYLE.textStyle(12, COLORS.LIGHT_GRAY, undefined, 'center'),
    marginBottom: Responsive.getHeight(1),
  },

  closeButtonStyle: {
    width: Responsive.getWidth(8),
    height: Responsive.getWidth(8),
    alignSelf: 'flex-end',
    backgroundColor: COLORS.TRANSPARENT,
  },

  btnStyle: (color = COLORS.RED) => {
    return {
      ...COMMON_STYLE.fillBtnStyle(40, color),
    };
  },

  buttonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: Responsive.getHeight(2),
  },
});
