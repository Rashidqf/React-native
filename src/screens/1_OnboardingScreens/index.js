import { View, Image, FlatList, TouchableOpacity, ImageBackground, Dimensions, Text, StatusBar, ScrollView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import languages
import { localize } from '@languages';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES } from '@themes';

import { AppContext } from '../../themes/AppContextProvider';
import { style } from './style';

import React, { Component, createRef } from 'react';
class OnboardingScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };

    this.flatListRef = createRef();
  }
  static contextType = AppContext;

  data = [
    { id: '0', image: IMAGES.sliderImageOne },
    { id: '1', image: IMAGES.sliderImageTwo },
    { id: '2', image: IMAGES.sliderImageThree },
  ];

  textData = [
    {
      id: 0,
      title: 'A GROUP CHAT ECOSYSTEM',
      text: 'Bringing friends and family together in one convenient place.',
    },
    {
      id: 1,
      title: 'ORGANIZE',
      text: 'Stay organized, and productive with Sidenote that empowers you to effortlessly create and manage tasks on the go!',
    },
    {
      id: 2,
      title: 'CREATE EVENTS',
      text: 'Unlock the power of seamless collaboration and connection, where you can effortlessly create events and bring your group together!',
    },
  ];

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      this.setState({ activeIndex: viewableItems[0].index });
    }
  };

  renderItem = ({ item }) => {
    const { theme } = this?.context;
    const styles = style(theme);
    return (
      <View style={{ width: Dimensions.get('window').width, alignItems: 'center' }}>
        <Image source={item.image} style={styles.sliderImage} />
      </View>
    );
  };

  renderDot = index => {
    const { theme } = this?.context;
    const styles = style(theme);
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.flatList.scrollToIndex({ animated: true, index })}
        style={[styles.dot, index === this.state.activeIndex ? styles.activeDot : null]}
      />
    );
  };

  renderDots() {
    return this.data.map((item, index) => this.renderDot(index));
  }

  nextButtonOnPress = () => {
    if (this.state.activeIndex !== this.data.length - 1) {
      this.setState({ activeIndex: this.state.activeIndex + 1 });
      this.flatListRef?.current?.scrollToIndex({
        animated: true,
        index: this.state.activeIndex + 1,
      });
    }
  };

  backButtonOnPress = () => {
    if (this.state.activeIndex) {
      this.setState({ activeIndex: this.state.activeIndex - 1 });
      this.flatListRef?.current?.scrollToIndex({
        animated: true,
        index: this.state.activeIndex - 1,
      });
    }
  };

  moveToRegisterScreen = () => {
    this.props?.setIsOnBoardingFinished(true);
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: 'REGISTER' }],
    });
  };

  // skipButtonOnPress = () => {
  //   this.setState({ activeIndex: this.data.length - 1 });
  //   this.flatListRef?.current?.scrollToIndex({
  //     animated: true,
  //     index: this.data.length - 1,
  //   });
  // };

  render() {
    const { theme } = this?.context;
    const styles = style(theme);
    const isLastItem = this.state.activeIndex === this.data.length - 1;
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <StatusBar translucent backgroundColor="transparent" />
        <ScrollView style={styles.mainView}>
          <View style={styles.headerView}>
            {/* <View style={styles.backView}>
              {this.state.activeIndex ? (
                <TouchableOpacity onPress={this.backButtonOnPress}>
                  <Image source={IMAGES.backArrow} style={styles.headerIcon} />
                </TouchableOpacity>
              ) : null}
            </View> */}
            {/* <View style={styles.skipView}>
              {!isLastItem && (
                <TouchableOpacity onPress={() => this.moveToRegisterScreen()}>
                  <Text style={styles.textView}>{localize('SKIP')}</Text>
                </TouchableOpacity>
              )}
            </View> */}
            <View style={styles.backView}>
              <TouchableOpacity onPress={this.backButtonOnPress}>
                <Image source={IMAGES.backArrow} style={styles.headerIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={{ marginTop: 55 }}>
              <Text style={styles.welcome}>{'Welcome to Sidenote'}</Text>
            </View>
          </View>
          {/* <Image source={IMAGES.sortIcon} style={styles.headerAppIcon} /> */}
          <View style={styles.listView}>
            <FlatList
              data={this.data}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={this.onViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              ref={this.flatListRef}
            />
            {/* <View style={{ alignItems: 'center' }}>
              <Image source={IMAGES.sliderImageOne} style={styles.sliderImage} />
            </View> */}
            <View style={styles.dotView}>{this.renderDots()}</View>
          </View>
          <View style={{ marginTop: 90 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.listTitleTextBlue}>{this.textData[this.state.activeIndex].title}</Text>
            </View>
            <View style={{ marginTop: 3, marginHorizontal: 30 }}>
              <Text style={styles.detailsText}>{this.textData[this.state.activeIndex].text}</Text>
            </View>
          </View>
          {isLastItem ? (
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.buttonContinue} onPress={() => this.moveToRegisterScreen()}>
                <Text style={styles.textView}>{localize('CONTINUE')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonView}>
              <TouchableOpacity style={styles.buttonContinue} onPress={() => this.nextButtonOnPress()}>
                <Text style={styles.textView}>{localize('NEXT')}</Text>
              </TouchableOpacity>
            </View>

            // <View style={styles.nextButtonView}>
            //     <TouchableOpacity onPress={() => this.nextButtonOnPress()}>
            //       <ImageBackground source={IMAGES.rectangleBtn} style={styles.nextButton}>
            //         <Text style={[styles.detailsText, { marginTop: 20, marginLeft: 10 }]}>{localize('NEXT').toUpperCase()}</Text>
            //       </ImageBackground>
            //     </TouchableOpacity>
            //   </View>
          )}
        </ScrollView>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    isOnboardingFinished: state.redState.isOnboardingFinished,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreens);
