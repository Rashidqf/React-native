import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      flex: 1,
      paddingBottom: Responsive.getHeight(2),
    },
    topContent: {
      paddingTop: Responsive.getHeight(5),
      paddingBottom: Responsive.getHeight(2),
      width: '100%',
    },
    profilePhoto: {
      width: Responsive.getWidth(44),
      height: Responsive.getWidth(44),
      borderRadius: Responsive.getWidth(88),
      backgroundColor: theme?.colors?.GRAY_300,
      alignSelf: 'center',
    },
    profileImg: {
      width: Responsive.getWidth(44),
      height: Responsive.getWidth(44),
      borderRadius: Responsive.getWidth(88),
      resizeMode: 'cover',
    },
    addIconStyle: {
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    addIcon: {
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
    },
  });
