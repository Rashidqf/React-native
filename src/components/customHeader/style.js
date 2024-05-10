import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES, FONTS } from '@themes';


export const style = theme =>
StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        alignItems: 'center',
        height: 60,
        justifyContent: 'center', alignItems: 'center'
      },
      backView: {
        alignItems: 'flex-start',
      },
});