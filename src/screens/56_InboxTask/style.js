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
      paddingHorizontal: Responsive.getWidth(4),
    },
    itemSepratorStyle: {
      width: '100%',
      height: Responsive.getWidth(3),
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      padding: Responsive.getWidth(3),
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 16,
    },
    calendarBtn: {
      position: 'absolute',
      top: -Responsive.getWidth(2),
      right: -Responsive.getWidth(2),
      width: Responsive.getWidth(10),
      height: Responsive.getWidth(10),
      backgroundColor: theme?.colors?.RED_500,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 75,
      zIndex: 1024,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    calendarBtnIcon: {
      ...COMMON_STYLE.imageStyle(7)
    },
    listItemContent: {
      flex: 1,
      // paddingLeft: Responsive.getWidth(3),
    },
    taskTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.WHITE, 'BOLD'),
      marginTop: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(1),
    },
    eventUsrRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventUsrImg: {
      ...COMMON_STYLE.imageStyle(5.5),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_200,
      resizeMode: 'cover'
    },
    eventUsrName: {
      flex: 1,
      ...COMMON_STYLE.textStyle(10, theme?.colors?.WHITE, 'BASE'),
      paddingLeft: Responsive.getWidth(2),
    },
    monthItem: {
      paddingHorizontal: Responsive.getWidth(4),
      borderBottomWidth: 2,
      borderColor: theme?.colors?.TRANSPARENT,
      paddingBottom: Responsive.getWidth(2),
    },
    monthItemActive: {
      paddingHorizontal: Responsive.getWidth(4),
      borderBottomWidth: 2,
      borderColor: theme?.colors?.RED_500,
      paddingBottom: Responsive.getWidth(2),
    },
    monthItemTxt: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.WHITE, 'BASE'),
    },
    monthItemTxtActive: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.RED_500, 'BASE'),
    },
    hItemSepratorStyle: {
      width: Responsive.getWidth(2),
    },
    pinnedItem: {
      width: Responsive.getWidth(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    pinnedItemImg: {
      ...COMMON_STYLE.imageStyle(14),
      borderRadius: 75,
      backgroundColor: theme?.colors?.RED_500,
    },
    pinnedItemName: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BASE', 'center'),
      marginTop: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(2),
    },
    pinnedDotsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    blueDote: {
      height: Responsive.getWidth(2),
      width: Responsive.getWidth(2),
      borderRadius: 75,
      backgroundColor: '#1684FC',
      marginHorizontal: Responsive.getWidth(0.5),
    },
    redDote: {
      height: Responsive.getWidth(2),
      width: Responsive.getWidth(2),
      borderRadius: 75,
      backgroundColor: '#FF4403',
      marginHorizontal: Responsive.getWidth(0.5),
    },
    pinnedItemSeprator: {
      width: Responsive.getWidth(3),
    },
    sidenoteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Responsive.getWidth(1),
    },
    sidenoteIcon: {
      ...COMMON_STYLE.imageStyle(5),
      marginRight: Responsive.getWidth(1),
    },
    sidenoteTxt: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BASE', 'center'),
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
      height: 250,
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

