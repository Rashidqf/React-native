import {StyleSheet} from 'react-native';
import {Responsive} from '../../helper';
import {COMMON_STYLE, STYLES} from '../../theme';

export const style = (theme: any) =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
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
      borderBottomWidth: 1,
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
      ...COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_50, 'BASE', 'left'),
    },
    contatText: {
      ...COMMON_STYLE.textStyle(12, theme?.colors?.GRAY_200, 'BASE', 'left'),
    },
    btnSmall: {
      backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(18),
      // paddingHorizontal: Responsive.getWidth(6),
      // paddingTop: 10,
      justifyContent: 'center',
    },
    btnAdded: {
      // backgroundColor: theme?.colors?.RED_500,
      borderRadius: Responsive.getWidth(40),
      height: Responsive.getWidth(8),
      width: Responsive.getWidth(18),
      // paddingHorizontal: Responsive.getWidth(8),
      // paddingTop: 6,
      borderWidth: 1,
      justifyContent: 'center',
      borderColor: theme?.colors?.RED_500,
    },
    btnText: {
      color: theme?.colors?.WHITE,
      fontSize: Responsive.getWidth(16),
      textAlign: 'center',
    },

    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'flex-end',
      alignItems: 'center',
      // padding: Responsive.getWidth(6),
    },
    modalView: {
      width: '100%',
      backgroundColor: theme?.colors?.GRAY_900,
      padding: Responsive.getWidth(8),
      paddingHorizontal: Responsive.getWidth(6),
      // borderRadius: Responsive.getWidth(4),
      borderTopLeftRadius: Responsive.getWidth(5),
      borderTopRightRadius: Responsive.getWidth(5),
    },
    modalImageView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 35,
    },
    modalImageViewBody: {
      flex: 1,
      paddingRight: Responsive.getWidth(5),
    },
    userProfileImage: {
      width: Responsive.getWidth(30),
      height: Responsive.getWidth(30),
      borderRadius: 75,
      resizeMode: 'cover',
    },
    modalTitle: {
      ...COMMON_STYLE.textStyle(16, theme?.colors?.WHITE, 'BOLD', 'center'),
      marginBottom: Responsive.getWidth(3),
      lineHeight: Responsive.getWidth(7),
    },
    modalText: {
      ...COMMON_STYLE.textStyle(
        13,
        theme?.colors?.GRAY_COLOR,
        'BASE',
        'center',
      ),
      marginBottom: Responsive.getWidth(10),
      lineHeight: Responsive.getWidth(6),
    },
    modalBodyclose: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    titleText: {
      ...COMMON_STYLE.textStyle(15, theme?.colors?.BLACK_414, 'BOLD'),
      marginBottom: Responsive.getWidth(2),
      textAlign: 'center',
    },
    detailText: {
      ...COMMON_STYLE.textStyle(14, theme?.colors?.SUBLABEL_GREY),
      ...COMMON_STYLE.marginStyle(0, 0, 2, 1),
      textAlign: 'center',
    },
    SafeAreaView: {
      flex: 1,
    },
    userName: {
      ...STYLES.textStyle(20, theme?.colors?.GRAY_50, 'BOLD', 'left'),
      marginBottom: 10,
    },
    sendButton: {
      backgroundColor: theme?.colors?.RED_500,
      padding: Responsive.getWidth(3),
      paddingHorizontal: Responsive.getHeight(4),
      borderRadius: 30,
      marginTop: Responsive.getHeight(2),
      alignSelf: 'center',
    },
    sendButtonTxt: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_50, 'BASE', 'center'),
    },
    connectionTxt1: {
      ...STYLES.textStyle(16, theme?.colors?.GRAY_50, 'BOLD', 'center'),
      marginBottom: Responsive.getHeight(0.5),
    },
    connectionTxt2: {
      ...STYLES.textStyle(9, theme?.colors?.GRAY_50, 'BASE', 'center'),
      opacity: 0.7,
    },
    RowItemsStyle: {
      borderBottomWidth: 0,
    },
    RowItemsLeftIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_50, 'BOLD'),
    },
  });
