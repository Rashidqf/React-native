import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import constants

//import themes
import { IMAGES } from '@themes';

//import style
import { style } from './style';
import sound1 from '../../sounds/sound1.mp3';
import sound2 from '../../sounds/sound2.mp3';
import sound3 from '../../sounds/sound3.mp3';
import sound4 from '../../sounds/sound4.mp3';
import Sound from 'react-native-sound';
import { AppContext } from '../../themes/AppContextProvider';

const data = [
  {
    name: 'sound1.mp3',
    title: 'sound1',
    sound: sound1,
  },
  {
    name: 'sound2.mp3',
    title: 'sound2',
    sound: sound2,
  },
  {
    name: 'sound3.mp3',
    title: 'sound3',
    sound: sound3,
  },
  {
    name: 'sound4.mp3',
    title: 'sound4',
    sound: sound4,
  },
];

const soundDing = data?.map(item => {
  return new Sound(item?.sound, error => {
    if (error) {
      return;
    }
  });
});
class SidenoteSoundsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soundsArray: [],
      selectedSound: this?.props?.route?.params?.selectedSidenoteSound,
      selectedS: this?.props?.route?.params?.selectedSidenoteSound,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.handleSoundDing.forEach(item => {
      item();
    });
    this?.props?.navigation?.setParams({ handleSubmitSound: this?.handleSubmitSound });
  }

  handleSubmitSound = () => {
    this?.props?.navigation?.goBack();
  };

  handleSoundDing = soundDing.map(item => {
    return () => {
      item.setVolume(1);
      return () => {
        item.release();
      };
    };
  });

  playPause = soundDing.map(item => {
    return () => {
      item.play(success => {
        if (success) {
        } else {
        }
      });
    };
  });

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES?.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={{}}>
          <View style={{ marginTop: 100 }}>
            <FlatList
              data={data}
              renderItem={({ item, index }) => (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        this?.playPause[index]();
                        this?.props?.soundSidenoteName(item);
                        this?.props?.navigation?.goBack();
                      }}
                    >
                      <Text style={styles.soundTitle}>{item?.title}</Text>
                    </TouchableOpacity>
                    {this.state.selectedSound === item?.title ? (
                      <Image source={IMAGES.check2} style={[styles.checkIcon, { marginTop: 20 }]} />
                    ) : null}
                  </View>
                </>
              )}
              keyExtractor={item => item.index}
            />
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(SidenoteSoundsScreen);
