import { Text, View, Image, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import { IMAGES, COMMON_STYLE } from '@themes';
import { style } from './style';
import { FONTS } from '../../themes/fonts';
import { COLORS } from '../../themes/colors';

class CustomHeader extends Component {
  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40 }}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <TouchableOpacity style={{ marginLeft: 8 }} onPress={this.props.onPressBack}>
            <Image source={IMAGES.backArrow} style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 0 }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: COLORS.GRAY_100, fontSize: 18, fontFamily: FONTS.BOLD }}>{this.props.title}</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}

export default CustomHeader;
