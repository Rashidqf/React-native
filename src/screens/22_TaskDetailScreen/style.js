import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    screenBG: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    detailContent: {
      padding: 20,
      paddingHorizontal: 0,
    },
    textTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme?.colors?.WHITE,
    },
    titleStyle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme?.colors?.RED_500,
      paddingLeft: 5,
      paddingTop: 10,
    },
    secTitleOne: {
      ...STYLES.textStyle(13, theme?.colors?.RED_500, 'BASE', 'left'),
      marginBottom: 15,
    },
    taskRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    checkboxStyle: {
      width: 25,
      height: 25,
    },
    taskTitle: {
      flex: 1,
      ...STYLES.textStyle(18, theme?.colors?.WHITE, 'BOLD', 'left'),
      paddingLeft: 15,
    },
    descRow: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 20,
    },
    descTitle: {
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'left'),
      marginBottom: 10,
    },
    descPara: {
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    subtaskRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 15,
    },
    secTitleTwo: {
      ...STYLES.textStyle(12, theme?.colors?.RED_500, 'BASE', 'left'),
    },
    subTaskTitle: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BOLD', 'left'),
      paddingLeft: 15,
    },
    checkboxStyle2: {
      width: 20,
      height: 20,
    },
    userRow: {
      // flexDirection: 'row',
      // alignItems: 'center',
      borderTopWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 20,
    },
    imgRow: {
      flex: 1,
      flexDirection: 'row',
    },
    imgBtn: {
      width: 30,
      height: 30,
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_800,
      marginRight: -10,
      overflow: 'hidden',
    },
    imgBtnimg: {
      width: '100%',
      height: '100%',
    },
    userTxt: {
      flex: 1,
      ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'left'),
      paddingLeft: 20,
      paddingTop: 5,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
    },
    modalbodyBg: {
      width: '100%',
      height: '100%',
    },
    modalView: {
      height: 200,
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
      overflow: 'hidden',
    },
    modalSafeAreaView: {
      padding: Responsive.getWidth(8),
    },
    modalBtn: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      height: Responsive.getWidth(12),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getWidth(4),
    },
  });
