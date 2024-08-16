import {Dimensions, Platform, PixelRatio} from 'react-native';

const {height, width} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = width / (width < 450 ? 320 : 450);

export const Responsive = {
  // get height in percentage as per device total height
  getHeight: function (h: number): number {
    const screenHeight = width < height ? height : width;
    return PixelRatio.roundToNearestPixel(screenHeight * (h / 100));
  },

  // get width in percentage as per device total width
  getWidth: function (w: number): number {
    const screenWidth = width < height ? width : height;
    return PixelRatio.roundToNearestPixel(screenWidth * (w / 100));
  },

  // Manage font size as per the scale of device size
  getFontSize: function (size: number): number {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
  },
};
