import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../themes/colors';
import { FONTS } from '../../themes/fonts';

class HeaderComponent extends Component {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity onPress={this.props.onSave}>
            <Text style={{ color: COLORS.PURPLE_500, fontSize: 16 }}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={{ color: COLORS.WHITE, fontSize: 18, fontFamily: FONTS.BASE }}>{title}</Text>
        </View>

        <View style={styles.right}>
          <TouchableOpacity onPress={this.props.onCancel}>
            <Text style={{ color: COLORS.PURPLE_500, fontFamily: FONTS.BOLD, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 50,
    backgroundColor: 'transparent',
    // marginTop: 60,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default HeaderComponent;
