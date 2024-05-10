import { StyleSheet } from 'react-native';
import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style = theme =>
  StyleSheet.create({
    ...COMMON_STYLE,
    ...STYLES,
    backgroundImage: {
      flex: 1,
    },
    sepratorStyle: {
      height: Responsive.getWidth(5),
      backgroundColor: theme?.colors?.BUTTON_GRAY,
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
    sidenotHiddenColIcon: {
      ...STYLES.textStyle(18, theme?.colors?.GRAY_300),
    },
    searchBar: {
      flex: 1,
      ...STYLES.textStyle(14, theme?.colors?.WHITE, 'BASE'),
    },
  });
