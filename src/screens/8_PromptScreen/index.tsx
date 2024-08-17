import React, {useContext} from 'react';
import {Image, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {style} from './style';
import {COMMON_STYLE, IMAGES} from '../../theme';
import {AppContext} from '../../theme/AppContextProvider';
import {SafeAreaWrapper} from '../../components/wrapper';

const PromptScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);

  return (
    <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000}>
      <View style={styles.loginContent}>
        <Image
          source={IMAGES.PromtNotification}
          style={[{justifyContent: 'center', alignItems: 'center'}]}
        />
        <View style={styles.topContent}>
          <Text style={[COMMON_STYLE.h5, styles.fontBold]}>
            Stay in the<Text style={styles.mainHeading}> Loop</Text>
          </Text>
          <Text style={[COMMON_STYLE.h4, styles.paddingBottomP]}>
            Activate Notifications for the Latest Updates
          </Text>
          <Button
            style={COMMON_STYLE.marginTop}
            buttonStyle={COMMON_STYLE.button}
            title={'Enable notifications'}
            titleStyle={COMMON_STYLE.buttonText}
            onPress={() =>
              navigation.replace('TAB_NAVIGATOR', {fromSignup: true})
            }
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default PromptScreen;
