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
    flatlistContentContainerStyle: {
      paddingTop: Responsive.getWidth(6),
      paddingHorizontal: Responsive.getWidth(6),
    },
    itemSepratorStyle: {
      width: '100%',
      height: Responsive.getWidth(3),
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      paddingVertical: Responsive.getWidth(2),
      paddingHorizontal: Responsive.getWidth(2.5),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 15,
    },
    listItemUimg: {
      ...COMMON_STYLE.imageStyle(12),
    },
    listItemContent: {
      flex: 1,
      paddingLeft: Responsive.getWidth(3),
    },
    listItemTitle: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD'),
      marginBottom: Responsive.getWidth(1),
    },
    sidenoteCountTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.GRAY_200, 'BOLD'),
    },
    listBtnRow: {
      flexDirection: 'row',
      marginTop: Responsive.getWidth(2),
    },
    btnOrange: {
      borderWidth: 2,
      borderColor: theme?.colors?.RED_500,
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnOutlineGray: {
      borderWidth: 2,
      borderColor: theme?.colors?.GRAY_200,
      // backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: Responsive.getWidth(3),
    },
    btnOrangeTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BOLD'),
    },
    btnOutlineGrayTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BOLD'),
    },
    multipleImgsView: {
      position: 'relative',
      width: Responsive.getWidth(22),
      height: Responsive.getWidth(20),
      // backgroundColor: 'red'
    },
    multipleImgs1: {
      position: 'absolute',
      left: Responsive.getWidth(6),
      ...COMMON_STYLE.imageStyle(11),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      zIndex: 2
    },
    multipleImgs2: {
      position: 'absolute',
      top: Responsive.getWidth(5),
      ...COMMON_STYLE.imageStyle(8),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      zIndex: 1
    },
    multipleImgs3: {
      position: 'absolute',
      right: Responsive.getWidth(2),
      bottom: 0,
      ...COMMON_STYLE.imageStyle(14),
      borderRadius: 75,
      resizeMode: 'cover',
      borderWidth: 3,
      borderColor: theme?.colors?.GRAY_800,
      zIndex: 4
    },
    multipleImgsCount: {
      position: 'absolute',
      right: -Responsive.getWidth(1),
      top: Responsive.getWidth(2),
      width: Responsive.getWidth(8),
      height: Responsive.getWidth(8),
      lineHeight: Responsive.getWidth(8),
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: 75,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: Responsive.getWidth(1.5),
      paddingRight: Responsive.getWidth(1.5),
    },
    multipleImgsCountTxt: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BOLD',),
    },
    userImg: {
      ...COMMON_STYLE.imageStyle(7),
      borderRadius: 75,
      resizeMode: 'cover',
    },
    userImgName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(1.5),
    },

    // MODAL STYLE
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
      overflow: 'hidden'
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

