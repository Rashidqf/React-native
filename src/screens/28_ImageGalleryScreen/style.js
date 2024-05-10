import { StyleSheet, StatusBar, Platform } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,

    header: {
      height: Platform.OS === 'ios' ? 90 : 80,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      alignItems: 'flex-end',
      // paddingTop: StatusBar.currentHeight,
      paddingBottom: Responsive.getWidth(3),
    },
    headerLeft: {
      // width: 50,
    },
    headerCenter: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRight: {
      width: 50,
      alignItems: 'flex-end',
    },
    headerLeftIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
      marginLeft: -5,
    },
    headerTitle: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100),
    },
    headerRightIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
    },
    container: {
      flex: 1,
      // padding: 15,
      // paddingBottom: 0,
      // backgroundColor: 'red'
    },
    imgCol: {
      width: Responsive.getWidth(100) / 3,
      height: Responsive.getWidth(100) / 3,
      backgroundColor: theme?.colors?.BLACK,
      padding: 1,
      overflow: 'hidden',
    },
    listModal: {
      flex: 1,
      backgroundColor: '#262530',
    },
    SafeAreaView: {
      flex: 1,
      // marginTop: Responsive.getWidth(15),
    },
    horizontalSlider: {
      // paddingLeft: Responsive.getWidth(4),
      // paddingRight: Responsive.getWidth(5),
      marginTop: Responsive.getWidth(40),

      paddingBottom: Responsive.getWidth(20),
    },
    categoryItem: {
      width: Responsive.getWidth(100),
      height: Responsive.getWidth(96),
      // borderRadius: Responsive.getWidth(12),
      overflow: 'hidden',
      // marginLeft: Responsive.getWidth(16),
      // backgroundColor: '#FF6672',
    },
    galleryImg: {
      width: '100%',
      height: '100%',
    },
    userName: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginBottom: 10,
    },
  });
