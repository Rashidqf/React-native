import React from 'react';
import { SafeAreaView, View, Image, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppContext } from '../../themes/AppContextProvider';
import { Button } from 'react-native-elements';
import { COMMON_STYLE, IMAGES, STYLES } from '@themes';
import { style } from './style';

class WebViewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = AppContext;
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <SafeAreaView style={{ backgroundColor: theme?.colors?.GRAY_1000, flex: 1 }}>
        <View style={{ height: 70, flexDirection: 'row', alignItems: 'center' }}>
          <Button
            buttonStyle={COMMON_STYLE.headerButtonStyle}
            type={'clear'}
            icon={<Image source={IMAGES.backArrow} style={COMMON_STYLE.imageStyle(4, theme?.colors?.GRAY_100)} />}
            onPress={() => this?.props?.navigation?.goBack()}
          />
          <View style={{ justifyContent: 'center', marginLeft: 70 }}>
            <Text style={styles.headerTitleStyle}>{this?.props?.route?.params?.name}</Text>
          </View>
        </View>
        <WebView source={{ uri: 'https://www.doyousidenote.com/privacy-policy' }} />
      </SafeAreaView>
    );
  }
}

export default WebViewScreen;
