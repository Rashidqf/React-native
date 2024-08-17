import React, {useState} from 'react';
import {
  StyleSheet,
  Modal,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {COLORS} from '../../../theme';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({isLoading}) => {
  // No need for Redux state; manage loading state internally
  // const isLoading = useSelector((state) => state.redState.isLoading); // Example removed

  return (
    <Modal animationType="fade" transparent={true} visible={isLoading}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <AnimatedLottieView
          autoPlay
          source={require('./loading.json')}
          loop={true}
          speed={1}
          style={{width: 160, height: 160}}
          resizeMode="contain"
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.DARK_OPACITY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});

export default LoadingIndicator;
