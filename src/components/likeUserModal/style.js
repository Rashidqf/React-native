import { StyleSheet } from 'react-native';

import { STYLES, IMAGES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...STYLES,
    safeAreaStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      alignItems: 'center',
    },
    modalView: {
      width: '100%',
      alignItems: 'center',
      padding: Responsive.getWidth(8),
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
    },
    modalImageView: {
      width: Responsive.getWidth(40),
      height: Responsive.getWidth(40),
      backgroundColor: theme?.colors?.LIGHT_BLUE_SKY,
      alignSelf: 'center',
      marginBottom: 35,
    },

    modalBodyclose: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    SafeAreaView: {
      flex: 1,
      // marginTop: Responsive.getWidth(15),
    },
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });
