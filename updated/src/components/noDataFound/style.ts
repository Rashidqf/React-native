import {StyleSheet} from 'react-native';
import {COLORS, COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {Responsive} from '../../helper';

export const styles = StyleSheet.create({
  ...COMMON_STYLE,
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  h4: {
    color: '#000000',
    // fontFamily: Theme.POPPINSBOLD,
    fontSize: Responsive.getWidth(5),
    lineHeight: Responsive.getWidth(5),
    marginBottom: Responsive.getWidth(2),
  },
  text: {
    // color: 'white',
    // fontFamily: FO,
    fontSize: Responsive.getWidth(4),
    lineHeight: Responsive.getWidth(6),
  },
});
