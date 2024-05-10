import React, { useState } from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import themes
import { IMAGES } from '@themes';

//import languages
import { localize } from '@languages';

// import api functions
import { callApi } from '@apiCalls';

import { Responsive } from '@helpers';

//import style
import { style } from './style';
import Icon2 from 'react-native-vector-icons/Feather';
import ImageView from 'react-native-image-viewing';
import NoDataFound from '../../components/noDataFound';
import { AppContext } from '../../themes/AppContextProvider';

const galleryData = [
  { index: 0, img: IMAGES.MSG_IMG },
  { index: 1, img: IMAGES.MSG_IMG },
  { index: 2, img: IMAGES.MSG_IMG },
  { index: 3, img: IMAGES.MSG_IMG },
  { index: 4, img: IMAGES.MSG_IMG },
  { index: 5, img: IMAGES.MSG_IMG },
  { index: 6, img: IMAGES.MSG_IMG },
  { index: 7, img: IMAGES.MSG_IMG },
  { index: 8, img: IMAGES.MSG_IMG },
];

class ImageGalleryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryData: galleryData,
      chatId: this.props?.route?.params?.chatId,
      modalVisible: false,
      images: [],
      visible: { index: 0, visible: false },
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    this.getChatDetail();
    this.onImageEffect();
  }

  onImageEffect = () => {
    if (this?.props?.chatDetail?.media) {
      const finalArr = this?.props?.chatDetail?.media?.map(val => {
        const obj = {
          uri: val,
        };
        return obj;
      });

      this.setState({
        images: finalArr,
      });
    }
  };

  getChatDetail = () => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: this?.state?.chatId,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              if (resp.success) {
                this.props.getChatDetail(resp?.data);

                this.props.showLoading(false);
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {}
  };

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  _renderSwipeHiddenItem = ({ item, index }) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <TouchableOpacity style={styles.imgCol} onPress={() => this.setState({ visible: { index: index, visible: true } })}>
        <Image source={{ uri: item }} style={styles.galleryImg} resizeMode={'cover'} />
      </TouchableOpacity>
    );
  };

  render() {
    const chatDetail = this?.props?.chatDetail;
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        {/* <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0), }}> */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{'Image Gallery'}</Text>
          </View>
          <TouchableOpacity style={styles.headerRight} onPress={() => {}}>
            {/* <Icon2 name="more-horizontal" style={styles.headerRightIcon} /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {chatDetail.media.length !== 0 ? (
            <FlatList
              data={chatDetail.media}
              renderItem={(item, index) => this._renderSwipeHiddenItem(item, index)}
              //horizontal={true}
              contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <NoDataFound
              title="No Images yet"
              imageWidth={Responsive.getWidth(50)}
              imageHeight={Responsive.getWidth(40)}
              source={IMAGES.noChatImage}
              // text="Active chats will appear here"
              text="share media for list of image."
              titleColor={theme?.colors?.GRAY_50}
              textColor={theme?.colors?.GRAY_100}
            />
          )}
        </View>

        <ImageView
          images={this?.state?.images || []}
          imageIndex={this?.state?.visible?.index}
          visible={this?.state?.visible?.visible}
          onRequestClose={() => this.setState({ visible: false })}
          backgroundColor="black"
          HeaderComponent={() => (
            <SafeAreaView>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity onPress={() => this.setState({ visible: false })}>
                    <Image source={IMAGES.backArrow} style={styles.headerIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerBody}></View>
              </View>
            </SafeAreaView>
          )}
        />
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    chatDetail: state?.groupState?.chatDetail,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(ImageGalleryScreen);
