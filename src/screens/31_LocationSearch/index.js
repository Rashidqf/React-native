import React, { useEffect } from 'react';
import { ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, View, Alert, ImageBackground } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { IMAGES, COMMON_STYLE, STYLES } from '@themes';
import Icon from 'react-native-vector-icons/Ionicons';
import { style } from './style';
import { AppContext } from '../../themes/AppContextProvider';
//import components
import { SafeAreaWrapper } from '@components';

const GOOGLE_PLACES_API_KEY = 'AIzaSyCv_laQg1thSz-TocYa_o3YbbtN989eBEI';
class LocationSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
    };
    //
  }
  static contextType = AppContext;

  componentDidMount() {
    this.props.route.params.setFieldTouched('location', true);
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const { setFieldValue, setFieldTouched } = this.props.route.params;

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <KeyboardAvoidingView
            style={styles.KeyboardAvoidingView}
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            {/* <ScrollView contentContainerStyle={styles.ScrollView} keyboardShouldPersistTaps="always"> */}
            <View style={styles.searchRow}>
              <Icon name="search" style={styles.searchIcon} />
              <GooglePlacesAutocomplete
                placeholder="Search for a location"
                textInputProps={{ placeholderTextColor: theme?.colors?.GRAY_200 }}
                fetchDetails={true}
                returnKeyType={'search'}
                autoFocus={true}
                minLength={2}
                query={{
                  key: GOOGLE_PLACES_API_KEY,
                  language: 'en', // language of the results
                }}
                onPress={(data, details = null) => {
                  setFieldValue('location', data?.description);
                  setFieldValue('latitude', details?.geometry?.location?.lat);
                  setFieldValue('longitude', details?.geometry?.location?.lng);
                  this.props.navigation.goBack();
                }}
                onTimeout={() => console.log('Timed out')}
                onFail={error => Alert.alert('error', error)}
                container={{
                  backgroundColor: theme?.colors?.RED_500,
                }}
                styles={{
                  container: {
                    backgroundColor: theme?.colors?.TRANSPARENT,
                  },
                  textInputContainer: {
                    backgroundColor: theme?.colors?.TRANSPARENT,
                  },
                  textInput: {
                    backgroundColor: theme?.colors?.TRANSPARENT,
                    paddingLeft: 50,
                    ...STYLES.textStyle(13, theme?.colors?.GRAY_50, 'BOLD', 'left'),
                  },
                  predefinedPlacesDescription: {
                    ...STYLES.textStyle(14, theme?.colors?.RED_500, 'BASE', 'left'),
                  },
                  row: {
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    backgroundColor: theme?.colors?.TRANSPARENT,
                    overflow: 'hidden',
                  },
                  listView: {
                    backgroundColor: theme?.colors?.TRANSPARENT,
                  },
                  description: {
                    flex: 1,
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    ...STYLES.textStyle(12, theme?.colors?.WHITE, 'BASE', 'left'),
                    overflow: 'hidden',
                  },
                  separator: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  poweredContainer: {
                    display: 'none',
                  },
                }}
              />
            </View>
            {/* </ScrollView> */}
          </KeyboardAvoidingView>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

export default LocationSearch;
