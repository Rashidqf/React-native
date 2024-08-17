import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {styles} from './style';
import {COMMON_STYLE} from '../../theme';

interface NoDataFoundProps {
  title?: string;
  message: string;
  titleColor?: string;
  titleFontSize?: number;
  titleFontFamily?: string;
  source?: ImageSourcePropType;
  imageWidth?: number;
  imageHeight?: number;
  textColor?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title,
  message,
  titleColor = 'black',
  titleFontSize = 16,
  titleFontFamily = 'Arial',
  source,
  imageWidth,
  imageHeight,
  textColor = 'white',
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={[
          COMMON_STYLE.profileImage,
          {width: imageWidth, height: imageHeight, resizeMode: 'contain'},
        ]}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <Text
          style={[
            styles.h4,
            {fontWeight: '800', paddingTop: 15},
            {color: titleColor},
            {fontSize: titleFontSize},
            {fontFamily: titleFontFamily},
          ]}>
          {title}
        </Text>
        <Text style={[styles.text, {color: textColor}, {textAlign: 'center'}]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default NoDataFound;
