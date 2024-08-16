import React, {useState, useRef, useContext} from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {localize} from '../../languages';
import {IMAGES} from '../../theme';
import {AppContext} from '../../theme/AppContextProvider';
import {style} from './style';
import {useNavigation} from '@react-navigation/native';
import {setIsOnBoardingFinishedAction} from '../../store/action/actions';
import {useDispatch} from 'react-redux';

interface OnboardingScreensProps {
  navigation: any; // Adjust the type according to your navigation setup
}

const OnboardingScreens: React.FC<OnboardingScreensProps> = ({navigation}) => {
  const context = useContext(AppContext);
  const dispatch = useDispatch();
  if (!context) {
    return null; // or some fallback UI
  }

  const {theme} = context;
  const styles = style(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList | null>(null);

  const data = [
    {id: '0', image: IMAGES.sliderImageOne},
    {id: '1', image: IMAGES.sliderImageTwo},
    {id: '2', image: IMAGES.sliderImageThree},
  ];

  const textData = [
    {
      id: 0,
      title: 'A GROUP CHAT ECOSYSTEM',
      text: 'Bringing friends and family together in one convenient place.',
    },
  ];

  // const onViewableItemsChanged = ({viewableItems}) => {
  //   if (viewableItems && viewableItems.length > 0) {
  //     setActiveIndex(viewableItems[0].index);
  //   }
  // };

  // const renderItem = ({item}) => {
  //   return (
  //     <View
  //       style={{width: Dimensions.get('window').width, alignItems: 'center'}}>
  //       <Image source={item.image} style={styles.sliderImage} />
  //     </View>
  //   );
  // };

  const renderDot = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          flatListRef.current?.scrollToIndex({animated: true, index})
        }
        style={[styles.dot, index === activeIndex ? styles.activeDot : null]}
      />
    );
  };

  const renderDots = () => {
    return data.map((item, index) => renderDot(index));
  };

  const nextButtonOnPress = () => {
    if (activeIndex !== data.length - 1) {
      setActiveIndex(activeIndex + 1);
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: activeIndex + 1,
      });
    }
  };

  const backButtonOnPress = () => {
    if (activeIndex) {
      setActiveIndex(activeIndex - 1);
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: activeIndex - 1,
      });
    }
  };

  const moveToRegisterScreen = () => {
    dispatch(setIsOnBoardingFinishedAction(true));
    navigation.reset({
      index: 0,
      routes: [{name: 'LOGIN'}],
    });
  };

  const isLastItem = activeIndex === data.length - 1;

  return (
    <ImageBackground
      source={require('../../assets/images/background/background.png')}
      style={styles.backgroundImage}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView style={styles.mainView}>
        <View style={styles.headerView}>
          <View style={styles.backView}>
            <TouchableOpacity onPress={backButtonOnPress}>
              {/* <Image source={IMAGES.backArrow} style={styles.headerIcon} /> */}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{marginTop: 55}}>
            <Text style={styles.welcome}>Welcome to Sidenote</Text>
          </View>
        </View>
        <View
          style={[
            styles.listView,
            {flex: 1, justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Image
            source={require('../../assets/images/background/Group1.png')}
            style={[
              styles.sliderImage,
              {justifyContent: 'center', alignItems: 'center'},
            ]}
          />
        </View>
        <View style={{marginTop: 90}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.listTitleTextBlue}>
              {textData[activeIndex].title}
            </Text>
          </View>
          <View style={{marginTop: 3, marginHorizontal: 30}}>
            <Text style={styles.detailsText}>{textData[activeIndex].text}</Text>
          </View>
        </View>
        {isLastItem ? (
          <View style={styles.buttonView}>
            {/* <TouchableOpacity
              style={styles.buttonContinue}
              onPress={moveToRegisterScreen}>
              <Text style={styles.textView}>{localize('CONTINUE')}</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.buttonContinue}
              onPress={moveToRegisterScreen}>
              <Text style={styles.textView}>{localize('NEXT')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default OnboardingScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});
