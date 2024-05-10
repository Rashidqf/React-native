import { StyleSheet, Platform, StatusBar } from 'react-native';

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
    flex1: {
      flex: 1,
    },
    pollContainer: {
      // minHeight: Responsive.getWidth(70),
      padding: 15,
    },
    voterContainer: {
      flex: 1,
      // padding: 15,
      // borderTopWidth: 1,
      // borderColor: 'rgba(99, 94, 92, 0.24)',
    },
    secTitle: {
      ...STYLES.textStyle(16, theme?.colors?.RED_500, 'BASE', 'left'),
      letterSpacing: Responsive.getWidth(0.2),
      // marginBottom: Responsive.getWidth(3),
      padding: 15,
    },
    pollCard: {
      position: 'relative',
      paddingHorizontal: Responsive.getWidth(3),
      paddingVertical: Responsive.getWidth(2),
      backgroundColor: theme?.colors?.GRAY_800,
      borderRadius: 10,
    },
    pollCardTitle: {
      ...STYLES.textStyle(16, theme?.colors?.WHITE, 'BOLD', 'left'),
      marginBottom: Responsive.getWidth(2),
    },
    pollCardSubTitle: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_200, 'BASE', 'left'),
      marginBottom: Responsive.getWidth(6),
    },
    chatPollCardTitle: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_100, 'BASE', 'left'),
      marginBottom: Responsive.getWidth(3),
    },
    pollProgress: {
      position: 'relative',
      width: '100%',
      height: Responsive.getWidth(10),
      borderRadius: 75,
      backgroundColor: 'rgba(207, 186, 163, 0.1)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 8,
      // paddingHorizontal: Responsive.getWidth(3),
      overflow: 'hidden',
      marginBottom: 10,
    },
    pollProgressTxt: {
      ...STYLES.textStyle(13, theme?.colors?.WHITE, 'BOLD', 'left'),
      paddingHorizontal: Responsive.getWidth(3),
      zIndex: 1204,
    },
    pollProgressView: {
      position: 'absolute',
      // width: '100%',
      height: '100%',
      borderRadius: 8,
      backgroundColor: theme?.colors?.RED_500,
    },
    pollVoteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Responsive.getWidth(2),
      marginBottom: Responsive.getWidth(3),
    },
    pollVoteTxt: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'BOLD', 'left'),
    },
    polluserRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // borderBottomWidth: 1,
      // borderColor: 'rgba(99, 94, 92, 0.24)',
      paddingVertical: Responsive.getWidth(3),
      paddingHorizontal: 15,
    },
    polluserImg: {
      width: Responsive.getWidth(12),
      height: Responsive.getWidth(12),
      borderRadius: 75,
      backgroundColor: theme?.colors?.GRAY_100,
    },
    polluserTxt: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100, 'BOLD', 'left'),
    },
    polluserTxt2: {
      ...STYLES.textStyle(12, theme?.colors?.GRAY_200, 'BOLD', 'left'),
      // color: 'rgba(58, 55, 54, 1)',
      marginTop: Responsive.getWidth(1),
    },

    header: {
      height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 60,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: theme?.colors?.GRAY_800,
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingBottom: Responsive.getWidth(3),
    },
    headerLeft: {
      width: 50,
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
      // marginLeft: Responsive.getWidth(60),
    },
    headerAddBtnTxt: {
      ...STYLES.textStyle(12, theme?.colors?.PURPLE_500, 'right'),
    },
    headerLeftIcon: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_100),
      marginLeft: -5,
    },
    editButton: {
      marginTop: 10,
      marginLeft: 10,
    },
    headerTitle: {
      ...STYLES.textStyle(14, theme?.colors?.GRAY_100),
    },
  });
