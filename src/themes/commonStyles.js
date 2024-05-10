import { StyleSheet, Platform } from 'react-native';

import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

//import constants
import { COLORS } from './colors';
import { FONTS } from './fonts';

//import helpers
import { Responsive } from '@helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const STYLES = StyleSheet.create({
  textStyle: (size, color = COLORS.BLACK, font = 'BASE', align) => {
    return {
      fontSize: Responsive.getFontSize(size),
      fontFamily: FONTS[font],
      color: color,
      textAlign: align,
      lineHeight: Responsive.getFontSize(size) + 3,
    };
  },
  paddingStyle: (left, right, top, bottom) => {
    let paddingObj = {};
    if (left) {
      paddingObj.paddingLeft = Responsive.getWidth(left);
    }
    if (right) {
      paddingObj.paddingRight = Responsive.getWidth(right);
    }
    if (top) {
      paddingObj.paddingTop = Responsive.getHeight(top);
    }
    if (bottom) {
      paddingObj.paddingBottom = Responsive.getHeight(bottom);
    }

    return { ...paddingObj };
  },
  marginStyle: (left, right = 0, top = 0, bottom = 0) => {
    let marginObj = {};
    if (left) {
      marginObj.marginLeft = Responsive.getWidth(left);
    }
    if (right) {
      marginObj.marginRight = Responsive.getWidth(right);
    }
    if (top) {
      marginObj.marginTop = Responsive.getHeight(top);
    }
    if (bottom) {
      marginObj.marginBottom = Responsive.getHeight(bottom);
    }

    return { ...marginObj };
  },

  fillBtnStyle: (color = COLORS.WHITE, width, height = 7) => {
    return {
      height: Responsive.getHeight(height),
      width: width ? Responsive.getWidth(width) : '100%',
      borderRadius: Responsive.getWidth(7),
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    };
  },

  fillBtnTextStyle: (size, color = COLORS.BLACK, font = 'BASE', align) => {
    return {
      fontSize: Responsive.getFontSize(size),
      fontFamily: FONTS[font],
      color: color,
      textAlign: align,
    };
  },

  borderBtnStyle: (color = COLORS.LIGHT_OPACITY, width, height = 7) => {
    return {
      height: Responsive.getHeight(height),
      width: width ? Responsive.getWidth(width) : '100%',
      borderRadius: Responsive.getWidth(2),
      borderWidth: 1,
      borderColor: color,
      backgroundColor: COLORS.TRANSPARENT,
      justifyContent: 'center',
      alignItems: 'center',
    };
  },
  imageStyle: (size, color) => {
    return {
      width: Responsive.getWidth(size),
      height: Responsive.getWidth(size),
      resizeMode: 'contain',
      tintColor: color,
    };
  },
});

export const COMMON_STYLE = StyleSheet.create({
  ...STYLES,
  textStyle: (size, color = COLORS.BLACK, font = 'BASE', align) => {
    return STYLES.textStyle(size, color, font, align);
  },

  borderBtnStyle: (color = COLORS.LIGHT_OPACITY, width, height = 7) => {
    return {
      height: Responsive.getHeight(height),
      width: width ? Responsive.getWidth(width) : '100%',
      borderRadius: Responsive.getWidth(2),
      borderWidth: 1,
      borderColor: color,
      backgroundColor: COLORS.TRANSPARENT,
      justifyContent: 'center',
      alignItems: 'center',
    };
  },

  fillBtnStyle: (color = COLORS.WHITE, width, height = 7) => {
    return {
      height: Responsive.getHeight(height),
      width: width ? Responsive.getWidth(width) : '100%',
      borderRadius: Responsive.getWidth(2),
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
    };
  },

  fillBtnTextStyle: (size, color = COLORS.BLACK, font = 'BASE', align) => {
    return {
      fontSize: Responsive.getFontSize(size),
      fontFamily: FONTS[font],
      color: color,
      textAlign: align,
    };
  },

  imageStyle: (size, color) => {
    return {
      width: Responsive.getWidth(size),
      height: Responsive.getWidth(size),
      resizeMode: 'contain',
      tintColor: color,
    };
  },

  safeareaHeaderSize: 100 - initialWindowSafeAreaInsets.top,
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_1000,
  },
  ScrollView: {
    flexGrow: 1,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  headerButtonStyle: {
    ...STYLES.paddingStyle(5, 5),
    height: '100%',
  },
  headerBtnStyle: {
    ...STYLES.paddingStyle(5, 5),
  },
  headerBtnTextStyle: {
    ...STYLES.textStyle(13, COLORS.PURPLE_500, 'BASE', 'center'),
  },
  h5: {
    ...STYLES.textStyle(20, COLORS.WHITE, 'BOLD', 'center'),
  },
  h6: {
    ...STYLES.textStyle(13, COLORS.GRAY_300, 'BASE', 'left'),
  },
  h7: {
    ...STYLES.textStyle(14, COLORS.GRAY_50, 'BOLD', 'center'),
    lineHeight: Responsive.getWidth(6),
  },

  pageHeader: {
    ...STYLES.paddingStyle(6, 6, 2, 0),
  },
  pageTitle: {
    ...STYLES.textStyle(24, COLORS.GRAY_100, 'BOLD', 'left'),
    marginBottom: Responsive.getWidth(6),
  },
  sectionHeader: {
    ...STYLES.paddingStyle(6, 6),
  },
  sectionHeaderTitle: {
    ...STYLES.textStyle(17, COLORS.RED_500, 'BASE', 'left'),
  },
  preStyle: {
    ...STYLES.textStyle(13, COLORS.GRAY_100, 'BASE', 'center'),
    lineHeight: Responsive.getWidth(6),
  },
  pStyle: {
    ...STYLES.textStyle(12, COLORS.GRAY_100, 'BASE', 'center'),
    lineHeight: Responsive.getWidth(5),
    marginTop: Responsive.getWidth(8),
  },
  content: {
    flex: 1,
    ...STYLES.paddingStyle(0, 0, 2, 2),
  },
  marginTop: {
    marginTop: Responsive.getWidth(5),
  },
  buttonContainerStyle: {
    marginTop: Responsive.getWidth(10),
  },
  button: {
    ...STYLES.fillBtnStyle(COLORS.RED_500),
  },
  buttonText: {
    ...STYLES.fillBtnTextStyle(15, COLORS.WHITE, 'BOLD', 'center'),
  },
  buttonOutline: {
    ...STYLES.borderBtnStyle(COLORS.RED_500),
  },
  buttonOutlineText: {
    ...STYLES.fillBtnTextStyle(15, COLORS.RED_500, 'BOLD', 'center'),
  },
  buttonDisable: {
    ...STYLES.fillBtnStyle(COLORS.BUTTON_GRAY),
  },
  buttonDisableText: {
    ...STYLES.fillBtnTextStyle(15, COLORS.GRAY_3, 'BOLD', 'center'),
    opacity: 0.64,
  },
  buttonTrans: {
    ...STYLES.fillBtnStyle(COLORS.TRANSPARENT),
  },
  buttonTransText: {
    ...STYLES.fillBtnTextStyle(15, COLORS.RED_500, 'BOLD', 'center'),
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  linkLabel: {
    ...STYLES.textStyle(13, COLORS.LINK_COLOR, 'BASE', 'left'),
    ...STYLES.paddingStyle(0, 0, 1, 0),
  },
  linkIcon: {
    ...STYLES.imageStyle(4),
    tintColor: COLORS.LINK_COLOR,
    marginTop: Responsive.getWidth(2),
    marginRight: Responsive.getWidth(2),
  },
  logo: {
    ...STYLES.imageStyle(29),
    ...STYLES.marginStyle(0, 0, 0, 0),
    // backgroundColor: COLORS.DARK,
    alignSelf: 'center',
  },
  inputFocusStyle: {
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputViewStyle: {
    width: '100%',
    height: Responsive.getWidth(15),
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Responsive.getWidth(4),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  inputViewFocusStyle: {
    width: '100%',
    height: Responsive.getWidth(15),
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: COLORS.GRAY_100,
    borderRadius: Responsive.getWidth(4),
    backgroundColor: COLORS.GRAY_1000,
    overflow: 'hidden',
    alignItems: 'center',
  },
  inputStyle: {
    ...STYLES.textStyle(16, COLORS.GRAY_50, 'BOLD'),
    ...STYLES.paddingStyle(4, 4),
  },
  inputFocusStyle: {
    ...STYLES.textStyle(12, COLORS.GRAY_50, 'BASE'),
    ...STYLES.paddingStyle(4, 4),
    borderWidth: 2,
    borderColor: COLORS.GRAY_100,
  },
  countyCode: {
    ...STYLES.textStyle(14, COLORS.GRAY_100, 'BOLD', 'center'),
  },
  leftIconContainerStyle: {
    borderRightWidth: 1,
    borderColor: '#1A1F21',
    marginVertical: 0,
    height: '100%',
    ...STYLES.paddingStyle(4, 4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    justifyContent: 'space-between',
  },
  headerProfile: {
    width: Responsive.getWidth(10),
    height: Responsive.getWidth(10),
    borderRadius: Responsive.getWidth(6),
    overflow: 'hidden',
    backgroundColor: COLORS.RED_500,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerIcon: {
    ...STYLES.imageStyle(6),
  },
  twelveGrayStyle: {
    ...STYLES.textStyle(10, COLORS.GRAY_100, 'BASE', 'left'),
  },
  thirteenGrayStyle: {
    ...STYLES.textStyle(11, COLORS.GRAY_200, 'BASE', 'left'),
  },
  fourteenGrayStyle: {
    ...STYLES.textStyle(12, COLORS.GRAY_100, 'BASE', 'left'),
    lineHeight: Responsive.getWidth(5),
  },
  sixteenGrayStyle: {
    ...STYLES.textStyle(14, COLORS.GRAY_50, 'BASE', 'left'),
  },
  marginBottomXS: {
    marginBottom: 4,
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Responsive.getWidth(4),
    paddingHorizontal: Responsive.getWidth(6),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'transparent',
  },
  listItem2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemBg: {
    backgroundColor: COLORS.GRAY_900,
    borderBottomWidth: 0,
  },
  subListItem: {
    paddingLeft: Responsive.getWidth(16),
  },
  listIcon: {
    ...STYLES.imageStyle(6),
  },
  subListIcon: {
    ...STYLES.imageStyle(4.8),
  },
  listTitle: {
    ...STYLES.textStyle(14, COLORS.WHITE, 'BASE', 'left'),
    lineHeight: Responsive.getWidth(6),
  },
  left: {
    marginRight: Responsive.getWidth(4),
  },
  body: {
    flex: 1,
  },
  right: {
    marginLeft: Responsive.getWidth(4),
  },
  divide: {
    height: 8,
    backgroundColor: 'rgba(99, 94, 92, 0.24)',
  },
  addButton: {
    backgroundColor: COLORS.RED_500,
    borderRadius: Responsive.getWidth(5),
    paddingHorizontal: Responsive.getWidth(2),
    minWidth: Responsive.getWidth(15),
  },
  addButtonText: {
    ...STYLES.fillBtnTextStyle(12, COLORS.WHITE, 'BOLD', 'center'),
  },
  addedButton: {
    borderWidth: 1,
    borderColor: COLORS.RED_500,
    backgroundColor: 'transparent',
    minWidth: Responsive.getWidth(18),
  },
  addedButtonText: {
    color: COLORS.RED_500,
  },
  checkboxStyle: {
    ...STYLES.imageStyle(6),
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
  contatLabel: {
    ...STYLES.textStyle(14, COLORS.GRAY_50, 'BASE', 'left'),
  },
  contatText: {
    ...STYLES.textStyle(12, COLORS.GRAY_200, 'BASE', 'left'),
  },
  contactProfile: {
    width: Responsive.getWidth(13),
    height: Responsive.getWidth(13),
    borderRadius: Responsive.getWidth(7),
    overflow: 'hidden',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderBottomNull: {
    borderBottomWidth: 0,
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingRight: Responsive.getWidth(3),
    marginTop: 5,
  },
  metaIcon: {
    ...STYLES.imageStyle(4),
    marginRight: 5,
  },
  fabButton: {
    width: Responsive.getWidth(16),
    height: Responsive.getWidth(16),
    borderRadius: 75,
    backgroundColor: COLORS.RED_500,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    bottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.16,
    shadowRadius: 4.65,

    elevation: 8,
  },
  fabButtonIcon: {
    width: Responsive.getWidth(6),
    height: Responsive.getWidth(6),
    resizeMode: 'contain',
  },
  searchInput: {
    ...STYLES.textStyle(14, COLORS.WHITE, 'BASE', 'left'),
  },
  searchInputContainerStyle: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchInputStyle: {
    height: Responsive.getWidth(15),
    paddingHorizontal: Responsive.getWidth(6),
  },
  noBorderInputContainer: {
    borderWidth: 0,
  },
  ListItemSwipeable: {
    backgroundColor: COLORS.GRAY_1000,
    paddingLeft: Responsive.getWidth(6),
    paddingRight: Responsive.getWidth(6),
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectedText: {
    ...STYLES.textStyle(12, COLORS.RED_500, 'BASE', 'left'),
    marginTop: 5,
  },
  errorText: {
    ...STYLES.textStyle(12, COLORS.ERROR, 'BASE', 'left'),
    marginTop: 2,
  },
  // Tabs Style
  tabNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Responsive.getWidth(6),
    marginBottom: Responsive.getWidth(5),
    marginTop: Responsive.getWidth(3),
  },
  tabNavBtn: {
    paddingBottom: Responsive.getWidth(2),
    borderBottomWidth: 2,
    borderColor: COLORS.TRANSPARENT,
  },
  tabNavBtnActive: {
    paddingBottom: Responsive.getWidth(2),
    borderBottomWidth: 2,
    borderColor: COLORS.ORANGE_200,
  },
  tabTitle: {
    ...STYLES.textStyle(15, COLORS.GRAY_300, 'BASE', 'center'),
    paddingHorizontal: Responsive.getWidth(3),
  },
  tabTitleActive: {
    ...STYLES.textStyle(15, COLORS.ORANGE_200, 'BASE', 'center'),
    paddingHorizontal: Responsive.getWidth(3),
  },
  tabNav2: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    // paddingHorizontal: Responsive.getWidth(6),
    marginBottom: Responsive.getWidth(5),
    marginTop: Responsive.getWidth(3),
  },
  tabNavBtn2: {
    flex: 1,
    paddingBottom: Responsive.getWidth(2),
    borderBottomWidth: 2,
    borderColor: COLORS.TRANSPARENT,
  },
  tabNavBtnActive2: {
    flex: 1,
    paddingBottom: Responsive.getWidth(2),
    borderBottomWidth: 2,
    borderColor: COLORS.PURPLE_500,
  },
  tabTitleActive2: {
    ...STYLES.textStyle(15, COLORS.PURPLE_500, 'BASE', 'center'),
    paddingHorizontal: Responsive.getWidth(3),
  },
  iconTabNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: Responsive.getHeight(5),
  },
  iconTabBtn: {
    width: Responsive.getHeight(5),
    height: Responsive.getHeight(5),
    marginHorizontal: Responsive.getHeight(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTabIcon: {
    ...STYLES.imageStyle(6)
  },
  iconTabIconActive: {
    ...STYLES.imageStyle(6, COLORS.RED_500)
  },

});
