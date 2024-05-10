import React from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, ImageBackground, RefreshControl, TextInput } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

//import components
import { SafeAreaWrapper, ItinerariesCard, EventCard } from '@components';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import _ from 'lodash';
import { AppContext } from '../../themes/AppContextProvider';

class DraftsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle}>
            {/* <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Done</Text> */}
            <Image source={IMAGES.more} style={COMMON_STYLE.imageStyle(6)} />
          </TouchableOpacity>
        );
      },
    });

    this.state = {
      isVisible: true,
      isRefreshing: false,
      eventsList: [
        {
          id: 0,
          main_image: IMAGES.sliderImageOne,
          user_image: IMAGES.image1,
          user_name: 'Bryan J',
          day: '13 day',
          title: 'Family Reunion 2023',
          date: 'Friday, Sept 3 - Sun, Sept 5',
          event: '10 Events',
        },
      ],
      itinerariesList: [
        {
          id: 0,
          main_image: IMAGES.sliderImageOne,
          user_image: IMAGES.image1,
          user_name: 'Bryan J',
          day: '13 day',
          title: 'Family Reunion 2023',
          date: 'Friday, Sept 3 - Sun, Sept 5',
          event: '10 Events',
        },
        {
          id: 1,
          main_image: IMAGES.sliderImageOne,
          user_image: IMAGES.image1,
          user_name: 'Bryan J',
          day: '23 day',
          title: 'Mexico Trip',
          date: 'Friday, Sept 3 - Sun, Sept 5',
          event: '4 Events',
        },
      ],
      searchEventText: '',
      searchEventData: '',
      searchItinerariesText: '',
      searchItinerariesData: '',
    };
  }
  static contextType = AppContext;

  ToggleFunction = () => {
    this.setState(state => ({
      isVisible: !state.isVisible,
    }));
  };

  getDraftItineraryList(isTrue) {
    fetch(`${API_DATA.BASE_URL}/${API_DATA.GET_DRAFT_ITINERARY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.userData.access_token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        this?.setState({ isRefreshing: false });
        this.props.showLoading(false);
        this.props.getDraftItineraryList(res?.data);
        // console.log("get draft itinerary data ====>", res)
      })
      .catch(e => {
        this.props.showLoading(false);
        this?.setState({ isRefreshing: false });

        console.log('catch error =>>>>', e);
      });
  }

  searchItems = text => {
    this.state.isVisible ? this.setState({ searchEventText: text }) : this.setState({ searchItinerariesText: text });

    setTimeout(() => {
      if (text === '') {
      }
      if (this.state.isVisible) {
        let eventArray = this.props.itineraryDraftList?.event.filter(item => {
          const itemData = `${item?.title?.toLowerCase()}`;
          const textData = text.toLowerCase();
          if (text.length > 0) {
            return itemData.indexOf(textData) > -1;
          }
        });
        this.setState({ searchEventData: eventArray });
      } else {
        let itineraryArray = this.props.itineraryDraftList?.itinerary.filter(item => {
          const itemData = `${item?.title?.toLowerCase()}`;
          const textData = text.toLowerCase();
          if (text.length > 0) {
            return itemData.indexOf(textData) > -1;
          }
        });
        this.setState({ searchItinerariesData: itineraryArray });
      }
    }, 0);
  };

  componentDidMount() {
    this.props.showLoading(true);
    this?.getDraftItineraryList();
  }

  onRefresh() {
    this.props.showLoading(true);
    this?.setState({ isRefreshing: true });

    setTimeout(() => {
      this?.getDraftItineraryList();
    }, 500);
  }

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={[styles.tabNav2, { marginBottom: 0 }]}>
            <TouchableOpacity
              onPress={() => this.ToggleFunction()}
              style={this.state.isVisible ? styles.tabNavBtnActive2 : styles.tabNavBtn2}
            >
              <Text style={this.state.isVisible ? styles.tabTitleActive2 : styles.tabTitle}>Events</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.ToggleFunction()}
              style={this.state.isVisible ? styles.tabNavBtn2 : styles.tabNavBtnActive2}
            >
              <Text style={this.state.isVisible ? styles.tabTitle : styles.tabTitleActive2}>Itineraries</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchView}>
            <View style={{ padding: 15 }}>
              <Icon name="search" style={styles.sidenotHiddenColIcon} />
            </View>
            <TextInput
              value={this.state.isVisible ? this?.state?.searchEventText : this?.state?.searchItinerariesText}
              onChangeText={text => this.searchItems(text)}
              placeholder={this.state.isVisible ? 'Search Events' : 'Search Itineraries'}
              placeholderTextColor={theme?.colors?.GRAY_300}
              autoFocus={true}
              style={[styles.searchBar]}
            />
          </View>

          {this.state.isVisible ? (
            <FlatList
              refreshControl={
                <RefreshControl tintColor={theme?.colors?.WHITE} refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />
              }
              data={this?.state?.searchEventText ? this?.state?.searchEventData : this.props.itineraryDraftList?.event}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              nestedScrollEnabled={true}
              ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
              renderItem={({ item, index }) => (
                <EventCard item={item} isDraft={true} navigation={this?.props?.navigation} index={index} />
                // <ItinerariesCard item={item} isEvent={true} navigation={this?.props?.navigation} index={index} isDraft={true} />
              )}
              // contentContainerStyle={{ paddingTop: 50 }}
            />
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl tintColor={theme?.colors?.WHITE} refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />
              }
              data={this?.state?.searchItinerariesText ? this?.state?.searchItinerariesData : this.props.itineraryDraftList?.itinerary}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item + index}
              nestedScrollEnabled={true}
              ItemSeparatorComponent={() => <View style={styles.sepratorStyle} navigation={this?.props?.navigation} />}
              renderItem={({ item, index }) => (
                <ItinerariesCard item={item} isEvent={false} navigation={this?.props?.navigation} index={index} isDraft={true} />
              )}
              // contentContainerStyle={{ paddingTop: 50 }}
            />
          )}
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    itineraryDraftList: state?.dashboardState?.itineraryDraftList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(DraftsScreen);
