import { StyleSheet } from 'react-native';

import { COMMON_STYLE } from '@themes';
import { Responsive } from '@helpers';

export const styles = StyleSheet.create({
  ...COMMON_STYLE,
  sheetListContainer: {
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listLabel: {
    fontSize: 16,
  },
});
