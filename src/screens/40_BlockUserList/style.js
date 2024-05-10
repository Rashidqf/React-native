import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';
import { Clock } from 'react-native-reanimated';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    loginContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topContent: {
      width: '100%',
    },
    inviteImageView: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Responsive.getHeight(10),
    },
    inviteImage: {
      width: Responsive.getWidth(56),
      height: Responsive.getWidth(43),
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    h6: {
      ...COMMON_STYLE.textStyle(18, theme?.colors?.GRAY_100, 'BASE', 'center'),
      marginBottom: Responsive.getWidth(4),
    },
    inviteImageCircle: {
      width: Responsive.getWidth(42),
      height: Responsive.getWidth(42),
      borderRadius: Responsive.getWidth(21),
      backgroundColor: 'rgba(242, 170, 125, 0.5)',
      position: 'absolute',
    },
    topContent: {
      paddingVertical: Responsive.getWidth(4),
      paddingHorizontal: Responsive.getWidth(12),
    },
    topContentText: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE', 'center'),
      lineHeight: Responsive.getWidth(6),
    },
    sectionHeader: {
      paddingHorizontal: Responsive.getWidth(6),
      paddingBottom: 8,
      paddingTop: Responsive.getWidth(6),
      backgroundColor: theme?.colors?.GRAY_1000,
    },
    letterStyle: {
      ...COMMON_STYLE.textStyle(17, theme?.colors?.RED_500, 'BOLD', 'left'),
    },
    contentRow: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: Responsive.getWidth(6),
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      flexDirection: 'row',
    },
    tagStyle: {
      ...COMMON_STYLE.paddingStyle(3, 3, 1, 1),
      ...COMMON_STYLE.marginStyle(0, 1, 1, 0),
      backgroundColor: '#FC5401',
      borderRadius: Responsive.getWidth(5),
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagTextStyle: {
      ...COMMON_STYLE.textStyle(11, theme?.colors?.WHITE, 'BOLD'),
    },
    tagClose: {
      ...COMMON_STYLE.marginStyle(1, 0, 0, 0),
    },
    sepratorStyle: {
      height: 1,
      backgroundColor: theme?.colors?.BUTTON_GRAY,
    },
    taglist: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    contatLabel: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.WHITE, 'BOLD', 'left'),
    },
    contatText: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_200, 'BASE', 'left'),
    },
    searchView: {
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth: 1,
      // borderColor: theme?.colors?.GRAY_300,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: theme?.colors?.INPUT_BG,
      paddingVertical: Platform.OS === 'ios' ? 12 : 0,
      paddingHorizontal: 10,
    },
    sidenotHiddenColIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_200),
      width: 40,
    },
    searchBar: {
      flex: 1,
      ...COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE', 'left'),
    },
    listArrowIcon: {
      ...STYLES.imageStyle(6),
    },
    outlineRedBtn: {
      borderWidth: 1,
      height: 30,
      width: 80,
      borderRadius: 20,
      borderColor: theme?.colors?.RED_500,
      justifyContent: 'center',
      alignItems: 'center',
    },
    outlineRedBtnTxt: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.RED_500, 'BASE'),
    },
    background: {
      flex: 1,
    },
  });
