import React from 'react';
import {
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
// import {connect, ConnectedProps} from 'react-redux';
// import {ActionCreators} from '@actions';
// import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Foundation';

// Import style
import {style} from './style';

interface Props {
  containerStyle?: ViewStyle;
  leftIconStyle?: TextStyle;
  title: string;
  titleStyle?: TextStyle;
  rightIconStyle?: TextStyle;
  theme: string;
  leftIcon?: string;
  leftIcon2?: string;
  leftIcon3?: string;
  leftIcon4?: string;
  rightIcon?: string;
  onPress: () => void;
}

const RowItems: React.FC<Props> = ({
  containerStyle,
  leftIconStyle,
  title,
  titleStyle,
  rightIconStyle,
  theme,
  leftIcon,
  leftIcon2,
  leftIcon3,
  leftIcon4,
  rightIcon,
  onPress,
}) => {
  const styles = style(theme);

  return (
    <TouchableOpacity
      style={[styles.rowItem, containerStyle]}
      onPress={onPress}>
      {leftIcon && (
        <Icon name={leftIcon} style={[styles.leftIcon, leftIconStyle]} />
      )}
      {leftIcon2 && (
        <Icon1 name={leftIcon2} style={[styles.leftIcon, leftIconStyle]} />
      )}
      {leftIcon3 && (
        <Icon2 name={leftIcon3} style={[styles.leftIcon, leftIconStyle]} />
      )}
      {leftIcon4 && (
        <Icon3 name={leftIcon4} style={[styles.leftIcon, leftIconStyle]} />
      )}
      <Text style={[styles.rowItemTxt, titleStyle]}>{title}</Text>
      {rightIcon ? (
        <Icon name={rightIcon} style={[styles.rightIcon, rightIconStyle]} />
      ) : (
        <Icon name="chevron-right" style={[styles.rightIcon, rightIconStyle]} />
      )}
    </TouchableOpacity>
  );
};

// const mapStateToProps = (state: any) => ({
//   alertData: state.redState.alertData,
// });

// const mapDispatchToProps = (dispatch: any) => bindActionCreators(ActionCreators, dispatch);

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type PropsFromRedux = ConnectedProps<typeof connector>;

export default RowItems;
