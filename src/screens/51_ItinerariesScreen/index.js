import React from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, Platform, RefreshControl, ImageBackground, TextInput } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';

//import components
import { SafeAreaWrapper, ItinerariesCard } from '@components';

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

class ItinerariesScreen extends React.Component {
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
      isLoading: true,
      isRefreshing: false,
      listData: [
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
      searchText: '',
      searchData: [],
    };
  }
  static contextType = AppContext;

  getItineraryList() {
    fetch(`${API_DATA.BASE_URL}/${API_DATA.GET_ITINERARY}`, {
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
        this.props.getItineraryList(res?.data);
      })
      .catch(e => {
        this?.setState({ isRefreshing: false });

        this.props.showLoading(false);

        console.log('catch error =>>>>', e);
      });
  }
  componentDidMount() {
    this.props.showLoading(true);
    this.getItineraryList();
  }

  searchItems = text => {
    this.setState({ searchText: text });
    setTimeout(() => {
      if (text === '') {
      }
      let newArray = this.props?.itineraryList?.itinerary.filter(item => {
        const itemData = `${item?.title?.toLowerCase()}`;
        const textData = text.toLowerCase();
        if (text.length > 0) {
          return itemData.indexOf(textData) > -1;
        }
      });
      this.setState({ searchData: newArray });
    }, 0);
  };

  onRefresh() {
    this?.setState({ isRefreshing: true });

    // this.props.showLoading(true);
    setTimeout(() => {
      this.getItineraryList();
    }, 500);
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);

    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={styles.searchView}>
            <View style={{ padding: 15 }}>
              <Icon name="search" style={styles.sidenotHiddenColIcon} />
            </View>
            <TextInput
              value={this?.state?.searchText}
              onChangeText={text => this.searchItems(text)}
              placeholder="Search Itineraries"
              placeholderTextColor={theme?.colors?.GRAY_300}
              // autoFocus={true}
              style={[styles.searchBar]}
            />
          </View>
          <FlatList
            refreshControl={
              <RefreshControl tintColor={theme?.colors?.WHITE} refreshing={this.state.isRefreshing} onRefresh={() => this.onRefresh()} />
            }
            data={this?.state?.searchText ? this?.state?.searchData : this.props?.itineraryList?.itinerary}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            nestedScrollEnabled={true}
            ItemSeparatorComponent={() => <View style={styles.sepratorStyle} />}
            renderItem={({ item, index }) => (
              <ItinerariesCard item={item} navigation={this?.props?.navigation} index={index} isDraft={false} />
            )}
            contentContainerStyle={{ paddingTop: 10, paddingHorizontal: Responsive.getWidth(1) }}
          />
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    itineraryList: state?.dashboardState?.itineraryList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ItinerariesScreen);
