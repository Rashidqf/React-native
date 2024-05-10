import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { Clock } from 'react-native-reanimated';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    KeyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingTop: Responsive.getWidth(3),
      paddingHorizontal: Responsive.getWidth(5),
    },
    inputStyle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE'),
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: Responsive.getWidth(5),
      paddingVertical: Responsive.getWidth(3),
    },
    linkIcon: {
      ...STYLES.imageStyle(6, theme?.colors?.GRAY_200)
    },
    saveBtnTxt: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_300, 'BOLD'),
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Responsive.getWidth(5),
    },
    modalView: {
      width: '100%',
      backgroundColor: '#707070',
      borderRadius: Responsive.getWidth(4),
    },
    modalBtnsView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalTitle: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD', 'center'),
      marginVertical: Responsive.getWidth(4),
    },
    modalBtn: {
      flex: 1,
      paddingVertical: Responsive.getWidth(4),
    },
    modalBtnText: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD', 'center'),
    },
    modalInputView: {
      backgroundColor: '#434343',
      borderRadius: Responsive.getWidth(4),
      marginHorizontal: Responsive.getWidth(2),
    },
    modalInput: {
      height: 50,
      ...STYLES.textStyle(14, '#C8BCBC', 'BOLD'),
      paddingHorizontal: Responsive.getWidth(4),
      textAlignVertical: 'center'
    },
    modalInputSep: {
      width: '100%',
      height: 1,
      backgroundColor: '#707070',
    },
    dfdsfds: {

    },
    dfdsfds: {

    },
    dfdsfds: {

    },
    dfdsfds: {

    },
  });
