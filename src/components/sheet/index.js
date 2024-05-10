import React, { useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
// import styles from '../config/AppStyle';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BottomSheetList } from '../../constants/bottomSheetList';
import { PERMISSIONS, request, check } from 'react-native-permissions';
import { launchCamera, launchImageLibrary, showImagePicker } from 'react-native-image-picker';
import { styles } from './style';
import ImagePicker from 'react-native-image-crop-picker';
import { AppContext } from '../../themes/AppContextProvider';

const BottomSheet = props => {
  const { isOpen, setClose } = props;
  const RESULTS = {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    LIMITED: 'limited',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
  };
  const { theme } = useContext(AppContext);
  let sheetRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (isOpen) {
        sheetRef?.open();
      }
    }, 500);
  }, [isOpen]);

  const _pickImageFromGallery = async () => {
    if (props.multiple === false) {
      let options = {
        allowEditing: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      // launchImageLibrary(options, response => {
      //   console.log('Response = ', response);

      //   if (response?.didCancel) {
      //     console.log('User cancelled image picker');
      //   } else if (response?.error) {
      //     console.log('ImagePicker Error: ', response?.error);
      //   } else if (response?.customButton) {
      //     console.log('User tapped custom button: ', response?.customButton);
      //     alert(response?.customButton);
      //   } else {
      //     const source = { uri: response?.assets[0]?.uri };
      //     if (source?.uri) {
      //       if (props.setFieldValue) {
      //         props.setFieldValue('image', source?.uri);
      //       } else {
      //         props.setImage(source?.uri);
      //       }
      //     }
      //   }
      // });
    } else {
      _pickFromLibrary(props.values, props.setFieldValue, props.setFieldTouched);
    }
  };

  const _pickImageFromCamera = async () => {
    let options = {
      allowEditing: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    // launchCamera(options, response => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else if (response.error) {
    //     console.log('ImagePicker Error: ', response.error);
    //   } else if (response.customButton) {
    //     console.log('User tapped custom button: ', response.customButton);
    //     alert(response.customButton);
    //   } else {
    //     console.log('Use button: ', response);

    //     const source = { uri: response?.assets[0]?.uri };
    //     if (props.setFieldValue) {
    //       if (props.multiple === true) {
    //         props.setFieldValue('images', [...props.values.images, source]);
    //       } else {
    //         props.setFieldValue('image', source?.uri);
    //       }
    //     } else {
    //       props.setImage(source?.uri);
    //     }
    //   }
    // });
  };

  const _pickFromLibrary = async (values, setFieldValue, setFieldTouched) => {
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.MEDIA_LIBRARY);
    if (status === 'granted') {
      props.navigation.navigate('Image Picker', {
        images: values.images,
        setFieldValue,
        setFieldTouched,
      });
    }
  };

  const getStatus = (result, handleGranted, handleDenied, handleUnavailable, handleLimited, handleBlocked) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        // console.log('This feature is not available (on this device / in this context)');
        handleUnavailable && handleUnavailable();
        break;
      case RESULTS.DENIED:
        handleDenied && handleDenied();
        break;
      case RESULTS.LIMITED:
        // console.log('The permission is limited: some actions are possible');
        handleLimited && handleLimited();
        break;
      case RESULTS.GRANTED:
        handleGranted && handleGranted();
        break;
      case RESULTS.BLOCKED:
        // console.log('The permission is denied and not requestable anymore');
        handleBlocked && handleBlocked();
        break;
    }
  };

  const onSheetButtonPress = async label => {
    sheetRef.close();
    switch (label) {
      case BottomSheetList[0].label:
        setTimeout(() => {
          ImagePicker.openPicker({
            width: 200,
            height: 100,
            // cropping: true,

            compressImageMaxHeight: 400,
            compressImageMaxWidth: 400,
          }).then(image => {
            getStatus(image, _pickImageFromGallery);
            props.setFieldValue('image', image?.path);
          });
          // check(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result =>
          //   getStatus(result, _pickImageFromGallery, () => {
          //     request(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res =>
          //       getStatus(res, _pickImageFromGallery),
          //     );
          //   }),
          // );
        }, 500);

        break;

      case BottomSheetList[1].label:
        setTimeout(() => {
          // check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(result =>
          //   getStatus(result, _pickImageFromCamera, () => {
          //     console.log('camera'),
          //       request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(res =>
          //         getStatus(res, _pickImageFromCamera),
          //       );
          //   }),
          // );
          ImagePicker.openCamera({
            width: 200,
            height: 100,
            // cropping: true,
          }).then(image => {
            getStatus(image, _pickImageFromCamera);
            props.setFieldValue('image', image?.path);
          });
        }, 500);

        break;

      case BottomSheetList[2].label:
        break;
    }
  };

  return (
    <RBSheet
      ref={ref => {
        sheetRef = ref;
      }}
      height={230}
      onClose={() => setClose(false)}
    >
      <View style={styles.sheetListContainer}>
        <Text style={styles.listTitle}>Choose Picture From</Text>
        {BottomSheetList.map(list => (
          <TouchableOpacity
            key={list?.icon}
            style={styles.listButton}
            onPress={() => {
              onSheetButtonPress(list.label);
            }}
          >
            <Text style={styles.listLabel}>{list.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </RBSheet>
  );
};

export default BottomSheet;
