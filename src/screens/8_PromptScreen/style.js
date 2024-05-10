import { StyleSheet } from 'react-native';

import { COMMON_STYLE, STYLES } from '@themes';
import { Responsive } from '@helpers';

export const style=(theme) => StyleSheet.create({
  ...COMMON_STYLE,
  ...STYLES, 
  loginContent:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  topContent:{
    paddingTop: Responsive.getHeight(5),
    paddingBottom: Responsive.getHeight(5),
    width:'100%'
  }, 
});
