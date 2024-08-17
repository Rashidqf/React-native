import React, {useState, useContext} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {Button} from 'react-native-elements';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

import {localize} from '../../languages';
import {COMMON_DATA, API_DATA} from '../../components';
import {StorageOperation} from '../../storage/asyncStorage';
import {style} from './style';
import {Responsive} from '../../helper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaWrapper} from '../../components/wrapper';
import TitleTextInput from '../../components/inputComponents/titleTextInput';
import {ASYNC_KEYS} from '../../components';
import {COLORS, COMMON_STYLE, FONTS, IMAGES} from '../../theme';
import {AppContext} from '../../theme/AppContextProvider';
import {useAppSelector} from '../../store/hooks';
import axios from 'axios';
import LoadingIndicator from '../../components/modalComponents/loadingModel';

interface ProfilePictureScreenProps {
  userData: {
    userInfo: any;
    access_token: string;
  };
  route: any;
}

const ProfilePictureScreen: React.FC<ProfilePictureScreenProps> = ({
  userData,
  route,
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const data = useAppSelector(state => state.redState.userData);
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const {theme} = context;
  const styles = style(theme);

  const [fullname, setFullname] = useState({
    value: '',
    isError: false,
    title: 'Full Name',
  });
  const [email, setEmail] = useState({
    value: '',
    isError: false,
    title: 'Email Address',
    extraProps: {keyboardType: 'email-address'},
  });
  const [password, setPassword] = useState({
    value: '',
    isError: false,
    title: 'Enter your password',
    extraProps: {isPassword: true},
  });
  const [isChangePicker, setIsChangePicker] = useState(false);
  const [profilePic, setProfilePic] = useState<string>('');
  const [profile, setProfile] = useState<any>('');
  const saveUserData = (resp: any) => {
    StorageOperation.setData([
      [ASYNC_KEYS.IS_LOGIN, 'true'],
      [ASYNC_KEYS.USER_DATA, JSON.stringify(resp.data)],
      [ASYNC_KEYS.ACCESS_TOKEN, userData.access_token],
    ]);
  };

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const params = {
        data: {
          email: route?.params?.email,
          name: route?.params?.name,
          phone: route?.params?.mobileNo,
          phone_code: route?.params?.phone_code,
          image: profilePic,
        },
      };
      const response = await axios.post(
        'https://api.prod.doyousidenote.com/api/v1/vcode/verify',
        params.data,
        data?.access_token,
      );
      if (!response.data.success) {
        saveUserData(response);
        navigation.reset({
          index: 0,
          routes: [{name: 'PROMPT'} as never],
        });
      }
      console.log('response ', response, data?.access_token);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputComponent = (
    key: string,
    state: any,
    setState: React.Dispatch<React.SetStateAction<any>>,
  ) => (
    <TitleTextInput
      title={state[key].title}
      value={state[key].value}
      onChangeText={(masked: string) =>
        setState({...state, [key]: {...state[key], value: masked}})
      }
      {...state[key].extraProps}
    />
  );

  const openImagePicker = (type: 'camera' | 'gallery') => {
    setIsChangePicker(false);

    setTimeout(() => {
      const options = {
        mediaType: 'photo' as MediaType,
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8 as PhotoQuality,
      };

      if (type === 'camera') {
        launchCamera(options, response => handleImageResponse(response));
      } else {
        launchImageLibrary(options, response => handleImageResponse(response));
      }
    }, 1000);
  };

  const handleImageResponse = (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      setProfilePic(response.assets[0].uri);
      setProfile({
        uri: response.assets[0].uri,
        type: response.assets[0].type,
        name: response.assets[0].fileName,
      });
    }
  };

  const _renderBotton = (
    title: string,
    onPress: () => void,
    color?: string,
  ) => {
    const styles = style(theme);
    return (
      <Button
        type="clear"
        title={title}
        buttonStyle={COMMON_STYLE.button}
        titleStyle={COMMON_STYLE.buttonText}
        onPress={onPress}
      />
    );
  };

  const _renderImagePickerPopup = () => {
    const styles = style(theme);
    return (
      <Modal animationType="fade" transparent={true} visible={isChangePicker}>
        <TouchableWithoutFeedback onPress={() => setIsChangePicker(false)}>
          <SafeAreaView style={[styles.safeAreaStyle, {}]}>
            <View
              style={{
                width: '100%',
                maxHeight: Responsive.getHeight(85),
                borderRadius: Responsive.getWidth(5),
                backgroundColor: 'rgba(24, 24, 24, 0.7)',
              }}>
              <View style={styles.BtnViewStyle}>
                <TouchableOpacity
                  onPress={() => openImagePicker('gallery')}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: FONTS.BASE,
                      fontSize: 18,
                      color: COLORS.WHITE,
                    }}>
                    {localize('CHANGE_IMAGE')}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{height: 1, backgroundColor: theme.colors.WHITE}}
                />
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                  onPress={() => {
                    setProfile('');
                    setProfilePic('');
                    setIsChangePicker(false);
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.BASE,
                      fontSize: 18,
                      color: COLORS.WHITE,
                    }}>
                    {localize('REMOVE_IMAGE')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                width: '100%',
                // borderRadius: 20,
                backgroundColor: 'rgba(24, 24, 24, 0.7)',
                borderRadius: Responsive.getWidth(5),
              }}>
              <TouchableOpacity
                onPress={() => setIsChangePicker(false)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.BASE,
                    fontSize: 18,
                    color: COLORS.ORANGE_200,
                  }}>
                  {localize('CANCEL')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <ImageBackground
      source={IMAGES.onboardingScreen}
      style={styles.backgroundImage}>
      <LoadingIndicator isLoading={isLoading} />
      <SafeAreaWrapper>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={COMMON_STYLE.ScrollView}>
          <View style={styles.loginContent}>
            <View style={styles.middelContent}>
              <View style={styles.profilePhoto}>
                {!profilePic ? (
                  <TouchableOpacity onPress={() => openImagePicker('gallery')}>
                    <Image
                      source={IMAGES.plusThin}
                      style={{
                        tintColor: COLORS.ORANGE_200,
                        height: 75,
                        width: 75,
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <>
                    <Image
                      source={{uri: profilePic}}
                      style={styles.profileImg}
                    />
                    <TouchableOpacity
                      style={styles.addIconStyle}
                      onPress={() => setIsChangePicker(true)}>
                      <Image
                        source={IMAGES.closeIconBorder}
                        style={styles.addIcon}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            <View style={styles.topContent}>
              {!profilePic ? (
                <Text style={styles.pictureText}>Add a profile picture</Text>
              ) : (
                <>
                  <Text style={styles.pictureText}>
                    Your name will be displayed as
                  </Text>
                  <Text style={styles.userName}>Rashid Yousufzai</Text>
                </>
              )}
            </View>
            <View style={styles.bottomContent}>
              {profilePic && (
                <Button
                  buttonStyle={COMMON_STYLE.button}
                  title={localize('NEXT')}
                  titleStyle={COMMON_STYLE.buttonText}
                  onPress={updateProfile}
                />
              )}
            </View>
          </View>
          {_renderImagePickerPopup()}
        </ScrollView>
      </SafeAreaWrapper>
    </ImageBackground>
  );
};

export default ProfilePictureScreen;
