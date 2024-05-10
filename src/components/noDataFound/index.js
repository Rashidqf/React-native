import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
//import style
import { styles } from './style';

const NoDataFound = ({ title, text, titleColor, titleFontSize, titleFontFamily, source, imageWidth, textColor, imageHeight }) => {
  return (
    <View style={styles.container}>
      <Image source={source} style={[styles.profileImage, { width: imageWidth, height: imageHeight, resizeMode: 'contain' }]} />
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Text
          style={[
            styles.h4,
            { fontWeight: '800', paddingTop: 15 },
            titleColor ? { color: titleColor } : {},
            titleFontSize ? { fontSize: titleFontSize } : {},
            titleFontFamily ? { fontFamily: titleFontFamily } : {},
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.text, textColor ? { color: textColor } : { color: 'white' }, { textAlign: 'center' }]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

export default NoDataFound;
