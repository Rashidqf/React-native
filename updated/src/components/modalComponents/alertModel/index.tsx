import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// Import helpers
import {localize} from '../../../languages';
// Import style
import {styles} from './style';

// Import constants
import {IMAGES, COLORS, COMMON_STYLE} from '../../../theme';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {hideErrorAlert} from '../../../store/action/actions';

interface Props {
  alertImage?: any; // Adjust type as per your actual image type
  successBtnTitle?: string;
  cancelBtnTitle?: string;
}

const AlertModel: React.FC<Props> = ({
  alertImage = IMAGES.help,
  successBtnTitle = localize('OK'),
  cancelBtnTitle = localize('CANCEL'),
}) => {
  const dispatch = useAppDispatch();
  const alertData = useAppSelector(state => state.redState.alertData);

  const renderButton = (obj: {
    color: string;
    onPress: () => void;
    btnTitle: string;
  }) => (
    <TouchableOpacity style={styles.btnStyle} onPress={obj.onPress}>
      <Text style={{color: 'red'}}>{obj.btnTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={alertData.isShowAlert}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <View style={styles.alertBoxStyle}>
          {alertImage && (
            <Image
              style={[COMMON_STYLE.alertImageStyle, {resizeMode: 'contain'}]}
              source={alertImage}
            />
          )}

          {alertData.alertTitle && (
            <Text numberOfLines={2} style={styles.titleStyle}>
              {alertData.alertTitle}
            </Text>
          )}

          <ScrollView bounces={false}>
            <Text style={styles.descriptionStyle}>{alertData.alertMsg}</Text>
          </ScrollView>

          <View style={styles.buttonViewStyle}>
            {renderButton({
              btnTitle: successBtnTitle,
              color: 'red',
              onPress: () => {
                try {
                  alertData.onPressOk();
                } catch (e) {}
                dispatch(hideErrorAlert());
              },
            })}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AlertModel;
