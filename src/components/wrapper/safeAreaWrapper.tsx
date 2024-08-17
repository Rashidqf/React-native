// import React, { Fragment, ReactNode } from 'react';
// import {
//   View,
//   StatusBar,
//   Image,
//   StyleSheet,
//   SafeAreaView,
// } from 'react-native';
// import { connect, ConnectedProps } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { ActionCreators } from '@actions';
// import { COLORS, IMAGES, COMMON_STYLE } from '../../theme';
// import { Responsive } from '../../helper';
// import { localize } from '../../languages';

// // Define the props types for the component
// interface WrapperProps extends PropsFromRedux {
//   backgroundColor?: string;
//   statusBarColor?: string;
//   bgImage?: any;
//   isTranslucent?: boolean;
//   containerStyle?: object;
//   children: ReactNode;
// }

// // Define default props for the component
// const defaultProps: Partial<WrapperProps> = {
//   backgroundColor: COLORS.WHITE,
//   statusBarColor: COLORS.TRANSPARENT,
//   bgImage: '',
//   isTranslucent: true,
// };

// const Wrapper: React.FC<WrapperProps> = (props) => {
//   const {
//     isTranslucent,
//     backgroundColor,
//     statusBarColor,
//     containerStyle,
//     children,
//     bgImage,
//   } = props;

//   return (
//     <Fragment>
//       <StatusBar
//         backgroundColor={statusBarColor}
//         translucent={isTranslucent}
//         barStyle="light-content"
//       />
//       <View style={styles.safeAreaViewStyle(backgroundColor)}>
//         <Image style={styles.backgroundStyle} source={bgImage} />
//         <View style={styles.containerViewStyle}>
//           <SafeAreaView style={[styles.containerStyle, containerStyle]}>
//             {children}
//           </SafeAreaView>
//         </View>
//       </View>
//     </Fragment>
//   );
// };

// Wrapper.defaultProps = defaultProps;

// const styles = StyleSheet.create({
//   safeAreaViewStyle: (color: string) => ({
//     flex: 1,
//     backgroundColor: color,
//   }),
//   backgroundStyle: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'stretch',
//   },
//   containerViewStyle: {
//     position: 'absolute',
//     height: '100%',
//     width: '100%',
//   },
//   containerStyle: {
//     flex: 1,
//     ...COMMON_STYLE.marginStyle(6, 6),
//   },
// });

// const mapStateToProps = (state: any) => ({
//   isOnline: state.redState.isOnline,
// });

// const mapDispatchToProps = (dispatch: any) => bindActionCreators(ActionCreators, dispatch);

// const connector = connect(mapStateToProps, mapDispatchToProps);

// type PropsFromRedux = ConnectedProps<typeof connector>;

// export const SafeAreaWrapper = connector(Wrapper);
import React, {Fragment, ReactNode} from 'react';
import {View, StatusBar, Image, StyleSheet, SafeAreaView} from 'react-native';
import {COLORS, COMMON_STYLE} from '../../theme';

// Define the props types for the component
interface WrapperProps {
  backgroundColor?: string;
  statusBarColor?: string;
  bgImage?: any;
  isTranslucent?: boolean;
  containerStyle?: object;
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({
  backgroundColor = COLORS.WHITE,
  statusBarColor = COLORS.TRANSPARENT,
  bgImage = '',
  isTranslucent = true,
  containerStyle,
  children,
}) => {
  return (
    <Fragment>
      <StatusBar
        backgroundColor={statusBarColor}
        translucent={isTranslucent}
        barStyle="light-content"
      />
      <View style={[styles.safeAreaViewStyle, {backgroundColor}]}>
        <Image
          style={styles.backgroundStyle}
          source={require('../../assets/images/background/background.png')}
        />
        <View style={styles.containerViewStyle}>
          <SafeAreaView style={[styles.containerStyle, containerStyle]}>
            {children}
          </SafeAreaView>
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
  },
  backgroundStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  containerViewStyle: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  containerStyle: {
    flex: 1,
    ...COMMON_STYLE.marginStyle(6, 6),
  },
});

export const SafeAreaWrapper = Wrapper;
