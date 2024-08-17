import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import Toast from 'react-native-toast-message';
import {initialWindowSafeAreaInsets} from 'react-native-safe-area-context';
// import { Responsive } from '@helpers';
import {styles} from './style';
import {Responsive} from '../../../helper';

const ToastAlert: React.FC = () => {
  const toastHeight =
    Responsive.getHeight(12) + initialWindowSafeAreaInsets.top;
  const [animation] = useState(new Animated.Value(-toastHeight));
  const toastTimeout = useRef<number | null>(null);
  const [toastData, setToastData] = useState<{
    toastTitle: string;
    toastMsg: string;
  }>({
    toastTitle: '',
    toastMsg: '',
  });

  useEffect(() => {
    const {toastTitle, toastMsg} = toastData;
    if (toastTitle && toastMsg) {
      Toast.show({
        type: toastTitle.toLowerCase() === 'error' ? 'error' : 'success',
        text1: toastTitle,
        text2: toastMsg,
        visibilityTime: 5000,
        autoHide: true,
        onPress: () => {
          // Handle press if needed
        },
        onShow: () => {
          // Handle toast shown
        },
        onHide: () => {
          // Handle toast hidden
        },
      });

      showToast();
    }
  }, [toastData]);

  const showToast = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      toastTimeout.current = setTimeout(() => {
        hideToast();
      }, 5000) as any; // Cast setTimeout return value to any
    });
  };

  const hideToast = () => {
    Animated.timing(animation, {
      toValue: -toastHeight,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      toastTimeout.current = null;
      setToastData({toastTitle: '', toastMsg: ''});
    });
  };

  const transformStyle = {
    transform: [{translateY: animation}],
  };

  // Expose showToast function for external use
  const showToastExternal = (data: {toastTitle: string; toastMsg: string}) => {
    setToastData(data);
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, transformStyle]}>
      <View style={styles.safeAreaStyle}>
        <View style={styles.alertBoxStyle}>
          <Text numberOfLines={1} style={styles.titleStyle}>
            {toastData.toastTitle}
          </Text>
          <Text numberOfLines={2} style={styles.descriptionStyle}>
            {toastData.toastMsg}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default ToastAlert;
// export {showToastExternal};
