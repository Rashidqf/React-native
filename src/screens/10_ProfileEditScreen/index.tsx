import React, {useState, useEffect, useContext} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  Pressable,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Import constants
import {ASYNC_KEYS, API_DATA} from '../../constants';

// Import themes
import {IMAGES, COMMON_STYLE, COLORS} from '../../theme';

// Import languages
import {localize} from '../../languages';

// Import services

// Import storage functions
import {StorageOperation} from '../../storage/asyncStorage';

// Import style
import {style} from './style';

// Import Utils
import {Validation} from '../../utils';

// Import helpers
// import HeaderComponent from '../../components/customHeader/Header';

// Import API calls
// import {callApi} from '@apiCalls';
import {SafeAreaWrapper} from '../../components/wrapper';
import TitleTextInput from '../../components/inputComponents/titleTextInput';
import {AppContext} from '../../theme/AppContextProvider';
import {callApi} from '../../apiCalls';
import {useAppSelector} from '../../store/hooks';

interface ProfileEditScreenProps {
  navigation: any;
  userData: any;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({navigation}) => {
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);
  const userData = useAppSelector(state => state.redState.userData);

  const [state, setState] = useState({
    fullname: {
      value: userData.userInfo.name,
      isError: false,
      title: 'Full Name',
      isfocused: true,
    },
    email: {
      value: userData.userInfo.email,
      isError: false,
      title: 'Email Address',
      extraProps: {
        keyboardType: 'email-address',
        inputStyle: {color: COLORS.INPUT_GRAY_COLOR},
      },
    },
    countryCode: userData.userInfo?.phone_code,
    masked: userData.userInfo.name,
    phone: {
      value: userData.userInfo.phone,
      isError: false,
      title: 'Enter your phone number',
      extraProps: {
        maxLength: 15,
        keyboardType: 'number-pad',
        mask: (text: string) => {
          return [
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
          ];
        },
      },
    },
    nickname: {
      value: userData.userInfo.nickname || '',
      isError: false,
      title: 'Nick Name',
      isfocused: true,
    },
    profilePic: Validation.isEmpty(userData.userInfo.image)
      ? 'profile_dummy'
      : userData.userInfo.image,
    profile: '',
    isShowPicker: false,
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={COMMON_STYLE.headerBtnStyle}
          onPress={() => updateProfile()}>
          <Text style={COMMON_STYLE.headerBtnTextStyle}>{'Save'}</Text>
        </Pressable>
      ),
    });

    setTimeout(() => {
      getProfileDetail();
    }, 500);
  }, []);

  const saveUserData = (resp: any) => {
    StorageOperation.setData([
      [ASYNC_KEYS.IS_LOGIN, 'true'],
      [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      [ASYNC_KEYS.ACCESS_TOKEN, resp.data.token],
    ]).then(() => {
      // handle user data save here
    });
  };

  const getProfileDetail = () => {
    try {
      const params = {
        url: API_DATA.PROFILE,
      };
      const accessToken = userData.access_token;
      // Show loading indicator here
      // callApi([params], accessToken)
      //   .then(response => {
      //     let resp = response[API_DATA.PROFILE];
      //     // Hide loading indicator here
      //     if (resp.success) {
      //       StorageOperation.setData([
      //         [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      //       ]).then(() => {
      //         saveUserData(resp);
      //       });
      //       // Save user data here
      //     } else {
      //       // Show error alert here
      //     }
      //   })
      //   .catch(error => {
      //     // Hide loading indicator here
      //   });
    } catch (e) {
      console.log('catch error >>> ', e);
    }
  };

  const checkValidation = () => {
    let isEmptyFullName = Validation.isEmpty(state.fullname.value);
    if (!isEmptyFullName) {
      return true;
    } else {
      let msg = '';
      if (Validation.isEmpty(state.fullname.value)) {
        msg = 'ENTER_FULLNAME_MSG';
      }

      // Show error alert here
      return false;
    }
  };

  const updateProfile = () => {
    if (checkValidation()) {
      try {
        const params = {
          url: API_DATA.UPDATEPROFILE,
          data: {
            email: state.email.value,
            name: state.fullname.value,
            image: state.profile,
            phone: state.phone.value,
            nickname: state.nickname.value,
            phone_code: state?.countryCode,
          },
        };
        const accessToken = userData.access_token;
        // Show loading indicator here
        // callApi([params], accessToken)
        //   .then(response => {
        //     // Hide loading indicator here
        //     let resp = response[API_DATA.UPDATEPROFILE];
        //     if (resp.success) {
        //       // Show success toast here
        //       navigation.navigate('TAB_NAVIGATOR');
        //       StorageOperation.setData([
        //         [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
        //       ]).then(() => {
        //         saveUserData(resp);
        //       });
        //       // Save user data here
        //     } else {
        //       // Show error alert here
        //     }
        //   })
        //   .catch(error => {
        //     // Hide loading indicator here
        //   });
      } catch (e) {
        console.log('catch error >>> ', e);
      }
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      localize('APP_NAME'),
      'Are you sure you want to delete your account?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('No Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            try {
              const params = {
                url: API_DATA.DELETE_ACCOUNT,
                data: {},
              };
              const accessToken = userData.access_token;
              // Show loading indicator here
              // callApi([params], accessToken)
              //   .then(response => {
              //     // Hide loading indicator here
              //     let resp = response[API_DATA.DELETE_ACCOUNT];
              //     // Show success toast here
              //     StorageOperation.removeData([
              //       ASYNC_KEYS.IS_LOGIN,
              //       ASYNC_KEYS.USER_DATA,
              //       ASYNC_KEYS.ACCESS_TOKEN,
              //     ]).then(value => {
              //       setTimeout(() => {
              //         navigation.reset({
              //           index: 0,
              //           routes: [{name: 'REGISTER'}],
              //         });
              //       }, 500);
              //     });
              //   })
              //   .catch(error => {
              //     // Hide loading indicator here
              //   });
            } catch (e) {
              console.log('catch error >>> ', e);
            }
          },
        },
      ],
    );
  };

  const renderPickerPopup = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={state.isShowPicker}>
        <TouchableWithoutFeedback
          onPress={() => setState({...state, isShowPicker: false})}>
          <SafeAreaView style={styles.safeAreaStyle}>
            <View style={styles.alertBoxStyle}>
              <Button
                buttonStyle={COMMON_STYLE.closeButtonStyle}
                icon={
                  <Image
                    style={styles.closeIconStyle}
                    source={IMAGES.clearIcon}
                  />
                }
                onPress={() => setState({...state, isShowPicker: false})}
              />
              <Text numberOfLines={2} style={styles.alertTitleStyle}>
                {localize('SELECT_PHOTO')}
              </Text>
              <Text style={styles.descriptionStyle}>
                {localize('SELECT_PHOTO_MSG')}
              </Text>
              <View style={styles.profileBtnViewStyle}>
                {renderButton(localize('CAMERA'), () =>
                  openImagePicker('camera'),
                )}
                {renderButton(localize('GALLERY'), () =>
                  openImagePicker('gallery'),
                )}
              </View>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderButton = (title: string, onPress: () => void, color?: string) => {
    return (
      <Button
        type="clear"
        title={title}
        buttonStyle={COMMON_STYLE.modalButton}
        titleStyle={COMMON_STYLE.modalButtonText}
        onPress={onPress}
      />
    );
  };

  const openImagePicker = (type: 'camera' | 'gallery') => {
    setState({...state, isShowPicker: false});
    setTimeout(() => {
      const configOption = {
        mediaType: 'photo' as const,
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8 as const,
      };

      if (type === 'camera') {
        launchCamera(configOption, response => handleImageResponse(response));
      } else {
        launchImageLibrary(configOption, response =>
          handleImageResponse(response),
        );
      }
    }, 1000);
  };

  const handleImageResponse = (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const source = response.assets ? response.assets[0].uri : null;
      setState({...state, profile: source, profilePic: source});
    }
  };

  const setFocus = (item: keyof typeof state) => {
    setState({
      ...state,
      [item]: {
        ...state[item],
        isfocused: true,
      },
    });
  };

  const renderBody = () => {
    return (
      <View style={COMMON_STYLE.viewStyle}>
        <ScrollView
          contentContainerStyle={COMMON_STYLE.scrollViewStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={COMMON_STYLE.headerIconViewStyle}>
              <ImageBackground
                source={{uri: state.profilePic}}
                style={COMMON_STYLE.profileImageBackgroundStyle}
                imageStyle={COMMON_STYLE.profileImageStyle}>
                <TouchableOpacity
                  style={COMMON_STYLE.imageUploadIconStyle}
                  onPress={() => setState({...state, isShowPicker: true})}>
                  <Image
                    source={IMAGES.imageUpload}
                    style={COMMON_STYLE.imageUploadStyle}
                  />
                </TouchableOpacity>
              </ImageBackground>
            </View>
            <TitleTextInput
              title={state.fullname.title}
              onChangeText={(value: string) =>
                setState({
                  ...state,
                  fullname: {...state.fullname, value, isError: false},
                })
              }
              isfocused={state.fullname.isfocused}
              onSubmitEditing={() => setFocus('email')}
              onBlur={() =>
                setState({
                  ...state,
                  fullname: {...state.fullname, isfocused: false},
                })
              }
              value={state.fullname.value}
              returnKeyType="next"
            />
            <TitleTextInput
              title={state.email.title}
              onChangeText={(value: string) =>
                setState({
                  ...state,
                  email: {...state.email, value, isError: false},
                })
              }
              isfocused={state.email.isfocused}
              onSubmitEditing={() => setFocus('phone')}
              onBlur={() =>
                setState({...state, email: {...state.email, isfocused: false}})
              }
              value={state.email.value}
              returnKeyType="next"
              extraProps={state.email.extraProps}
            />
            <TitleTextInput
              title={state.phone.title}
              onChangeText={(value: string) =>
                setState({
                  ...state,
                  phone: {...state.phone, value, isError: false},
                })
              }
              isfocused={state.phone.isfocused}
              onSubmitEditing={() => setFocus('nickname')}
              onBlur={() =>
                setState({...state, phone: {...state.phone, isfocused: false}})
              }
              value={state.phone.value}
              returnKeyType="next"
              extraProps={state.phone.extraProps}
            />
            <TitleTextInput
              title={state.nickname.title}
              onChangeText={(value: string) =>
                setState({
                  ...state,
                  nickname: {...state.nickname, value, isError: false},
                })
              }
              isfocused={state.nickname.isfocused}
              onSubmitEditing={() => {}}
              onBlur={() =>
                setState({
                  ...state,
                  nickname: {...state.nickname, isfocused: false},
                })
              }
              value={state.nickname.value}
              returnKeyType="done"
            />
            <View style={COMMON_STYLE.bottomViewStyle}>
              <Button
                title={'Delete Account'}
                buttonStyle={[COMMON_STYLE.mainBtnStyle, COMMON_STYLE.btnStyle]}
                titleStyle={COMMON_STYLE.btnTextStyle}
                onPress={deleteAccount}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaWrapper style={COMMON_STYLE.flex1}>
      {/* <HeaderComponent isRightIconVisible={false} title={localize('EDIT_PROFILE')} navigation={navigation} /> */}
      {renderBody()}
      {renderPickerPopup()}
    </SafeAreaWrapper>
  );
};

export default ProfileEditScreen;
