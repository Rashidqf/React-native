import {StyleSheet} from 'react-native';
import {Responsive} from '../../helper';
import {COMMON_STYLE, STYLES} from '../../theme';

// import { COMMON_STYLE, STYLES } from '@themes';
// import { Responsive } from '@helpers';

export const style = (theme: any) =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topContent: {
      paddingTop: Responsive.getHeight(5),
      paddingBottom: Responsive.getHeight(5),
      width: '100%',
    },
    mainHeading: {
      color: '#00B0FF',
    },
    fontBold: {
      fontWeight: '800',
      paddingBottom: Responsive.getHeight(4),
    },
    paddingBottomP: {
      paddingBottom: Responsive.getHeight(4),
    },
  });
