import { StyleSheet } from 'react-native';

import { COMMON_STYLE, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    logoImageStyle: {
      width: Responsive.getWidth(50),
      height: Responsive.getWidth(50),
      // marginTop: '80%',
      alignSelf: 'center',
    },

    titleStyle: {
      fontSize: 12,
      fontFamily: FONTS['BASE'],
      color: theme?.colors?.GRAY_100,
      textAlign: 'center',
    },
    splashbackgroundImage: {
      flex: 1,
      // justifyContent: 'center',
    },
    subtitleStyle: {
      fontSize: 14,
      fontFamily: FONTS['BOLD'],
      color: theme?.colors?.GRAY_100,
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 8,
    },
  });
