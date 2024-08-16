import {StyleSheet} from 'react-native';

import {COLORS, COMMON_STYLE, STYLES} from '../../theme';
import {Responsive} from '../../helper';

export const style = (theme: any) =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    circleIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.PRIMARY,
    },
    selectedContactsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      backgroundColor: theme.colors.BACKGROUND,
      alignItems: 'center',
    },
    selectedContactsText: {
      color: theme.colors.TEXT,
    },
    loginContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // topContent: {
    //   width: '100%',
    // },
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
    SearchInput: {
      fontSize: Responsive.getWidth(25),
      color: theme?.colors?.WHITE,
      height: '100%',
      borderWidth: 1,
      borderColor: theme?.colors?.WHITE,
      // flex: 1,
    },
    searchView: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme?.colors?.GRAY_300,
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 10,
    },
    searchBar: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE'),
    },
    sidenotHiddenColIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_300),
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
      // backgroundColor: theme?.colors?.GRAY_1000,
    },
    letterStyle: {
      ...COMMON_STYLE.textStyle(17, theme?.colors?.RED_500, 'BOLD', 'left'),
    },
    contentRow: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingHorizontal: Responsive.getWidth(6),
      // borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
      flexDirection: 'row',
      alignItems: 'center',
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
      ...COMMON_STYLE.textStyle(16, theme?.colors?.GRAY_50, 'BASE', 'left'),
    },
    contatText: {
      ...COMMON_STYLE.textStyle(14, COLORS?.GRAY_70, 'BASE', 'left'),
    },
    btnSmall: {
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      minWidth: Responsive.getWidth(18),
      paddingHorizontal: Responsive.getWidth(3),
      // paddingTop: 10,
      justifyContent: 'center',
    },
    btnAdded: {
      // backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      minWidth: Responsive.getWidth(18),
      paddingHorizontal: Responsive.getWidth(3),
      // paddingTop: 6,
      borderWidth: 1,
      justifyContent: 'center',
      borderColor: theme?.colors?.RED_500,
    },
    notBtn: {
      height: Responsive.getWidth(8),
      minWidth: Responsive.getWidth(18),
      paddingHorizontal: Responsive.getWidth(3),

      justifyContent: 'center',
    },
    btnText: {
      color: theme?.colors?.WHITE,
      fontSize: Responsive.getWidth(16),
      textAlign: 'center',
    },
    linkBtn: {
      minWidth: Responsive.getWidth(5),
      alignSelf: 'center',
      alignItems: 'flex-end',
    },
    linkBtnIcon: {
      ...COMMON_STYLE.imageStyle(6),
    },
    backgroundImage: {
      flex: 1,
    },
    titleText: {
      ...STYLES.textStyle(14, COLORS.WHITE, 'BOLD', 'left'),
      lineHeight: Responsive.getWidth(8),
      textAlign: 'center',
      color: theme?.colors?.WHITE,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(4),
      paddingHorizontal: Responsive.getWidth(6),
      borderColor: 'rgba(255, 255, 255, 0.08)',
      backgroundColor: 'transparent',
    },
  });
