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
      paddingHorizontal: Responsive.getWidth(6),
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
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
    },
    contatText: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_200, 'BASE', 'left'),
    },
    searchView: {
      flexDirection: 'row',
      alignItems: 'center',
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

    right: {
      marginLeft: Responsive.getWidth(4),
    },

    notificationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(3),
      paddingHorizontal: Responsive.getWidth(4),
      // backgroundColor: theme?.colors?.RED_500,
      marginVertical: Responsive.getWidth(2),
      borderRadius: 10,
    },
    notificationRow2: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Responsive.getWidth(3),
      paddingHorizontal: Responsive.getWidth(4),
      // backgroundColor: theme?.colors?.GRAY_800,
      borderRadius: 10,
      marginVertical: Responsive.getWidth(2),
    },
    notificationTxt: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
      marginBottom: 5,
    },
    notificationTxtur: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
      marginBottom: 5,
    },
    notificationLabelText: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BOLD', 'left'),

    },
    notificationTxt2: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.GRAY_70, 'BASE', 'left'),
    },
    notificationTxt2ur: {
      ...COMMON_STYLE.textStyle(10, theme?.colors?.GRAY_70, 'BASE', 'left'),
    },
    notificationArrowCol: {
      width: Responsive.getWidth(10),
      alignItems: 'flex-end',
    },
    listArrowIcon: {
      width: Responsive.getWidth(6),
      height: Responsive.getWidth(6),
      tintColor: theme?.colors?.GRAY_50,
    },
    listArrowIcon2: {
      width: Responsive.getWidth(6),
      height: Responsive.getWidth(6),
      tintColor: theme?.colors?.GRAY_300,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
    },
    notification_profile_dp_style: {
      width: 40,
      height: 40,
      marginRight: 15,
      borderRadius: 20,
    },
    notification_list_img_style: {
      width: 42,
      height: 42,
      marginLeft: 15,
      borderRadius: 6,
    },
    notification_list: {
      position: 'relative',
    },
    icon_circle_check_style: {
      width: 13,
      height: 13,
      position: 'absolute',
      bottom: 0,
    },
    icon_calendar_add_style: {
      width: 11,
      height: 11,
      marginRight: 5,
    },
    createdEvent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
