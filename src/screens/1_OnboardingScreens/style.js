import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    sliderImage: {
      width: 319.27,
      height: 231,
      resizeMode: 'contain',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#9A9A9A',
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: '#00B0FF',
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    mainView: {
      flex: 1,
      marginTop: 50,
    },
    textView: {
      ...STYLES.textStyle(14, '#FFF', 'BASE', 'center'),
    },
    headerAppIcon: {
      height: 35,
      width: 50,
      marginTop: 10,
      alignSelf: 'center',
    },
    listView: {
      marginTop: 75,
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      alignItems: 'center',
      height: 25,
    },
    skipView: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    backView: {
      alignItems: 'flex-start',
    },
    buttonContinue: {
      height: 50,
      backgroundColor: '#FF4403',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 46,
      marginLeft: 20,
      marginRight: 20,
    },
    buttonView: {
      flex: 1,
    },
    welcome: {
      ...STYLES.textStyle(24, '#FFF', 'BOLD', 'center'),
    },
    detailsText: {
      ...STYLES.textStyle(14, '#FFFFFF', 'BASE', 'center'),
    },
    listTitleText: {
      ...STYLES.textStyle(16, '#FFF', 'BASE', 'center'),
    },
    listTitleTextBlue: {
      ...STYLES.textStyle(15, '#FFFFFF', 'BASE', 'center'),
    },
    dotView: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 52,
    },
    nextButton: {
      height: 80,
      width: 88,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nextButtonView: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
  });
