import { StyleSheet } from 'react-native';

import { STYLES, COLORS, FONTS } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...STYLES,

    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      //   alignItems: 'center',
    },
    modalView: {
      width: '100%',
      alignItems: 'center',
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
    actions: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      justifyContent: 'space-around',
    },
    actionButton: {
      backgroundColor: '#FF4403',
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionItem: {
      margin: 20,
      alignItems: 'center',
    },
    actionText: {
      color: COLORS.WHITE,
      fontFamily: FONTS.BOLD,
      fontSize: 12,
      textAlign: 'center',
      flexShrink: 1,
      //   flex: 0.8,
      maxWidth: 80,
    },
    ActionButtonIcon: {
      ...STYLES.imageStyle(17),
    },
    fab: {
      backgroundColor: '#FF4403',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Add shadow on Android
      position: 'absolute',
      right: 20,
      bottom: 125,
    },
  });
