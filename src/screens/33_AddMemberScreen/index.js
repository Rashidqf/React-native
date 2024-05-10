import React from 'react';

import { Image, Text, View, TouchableOpacity, FlatList, ImageBackground } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

//import components
import { SafeAreaWrapper, TitleTextInput } from '@components';

//import constants
import { ASYNC_KEYS, API_DATA } from '@constants';

//import themes
import { IMAGES, COMMON_STYLE, STYLES } from '@themes';

//import languages
import { localize } from '@languages';

import { Responsive } from '@helpers';

// import api functions
import { callApi } from '@apiCalls';

// import firebase services
import { FirebaseService } from '@services';

//import storage functions
import { StorageOperation } from '@storage';

//import style
import { style } from './style';
import NoDataFound from '../../components/noDataFound';
import { Button, Input, Switch } from 'react-native-elements';
import { AppContext } from '../../themes/AppContextProvider';

class AddMemberScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMember: this?.props?.route?.params?.selectedMember,
      memberTitle: this?.props?.route?.params?.memberTitle,
      detail: this?.props?.route?.params?.detail,
    };
  }
  static contextType = AppContext;

  componentDidMount() {
    // this.getMyConnectionsList();
    this.getUserAllList();
    this?.props?.navigation?.setParams({
      // handleOpenChat: this.handleOpenChat,
      selectedMember: this.state.selectedMember,
      memberTitle: this.state.memberTitle,
    });
  }

  initialValues = {
    title: '',
  };

  getUserAllList() {
    try {
      const params = {
        url: API_DATA.USERALL,
        data: {},
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.USERALL];
              if (resp.success) {
                this?.props?.saveUserAll(resp.data);
                this.setState({ isMoreLoading: false });
              } else {
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  onChange(id, memberTitle, item) {
    if (!this?.state?.selectedMember?.some(val => val?.user_id === id)) {
      this.setState({
        selectedMember: [...this?.state?.selectedMember, item],
        memberTitle: '',
      });
      this?.props?.navigation?.setParams({
        selectedMember: [...this?.state?.selectedMember, item],
        memberTitle: '',
      });
    } else {
      this.setState({
        selectedMember: this?.state?.selectedMember?.filter(val => val.user_id !== id),
        memberTitle: memberTitle,
      });
      this?.props?.navigation?.setParams({
        selectedMember: this?.state?.selectedMember?.filter(val => val.user_id !== id),
        memberTitle: memberTitle,
      });
    }
    // if (id === this.state.selectedMember) {
    //   this.setState({
    //     selectedMember: null,
    //     memberTitle: '',
    //   });
    //   this?.props?.navigation?.setParams({
    //     selectedMember: null,
    //     memberTitle: '',
    //   });
    // } else {
    //   this.setState({
    //     selectedMember: id,
    //     memberTitle: memberTitle,
    //   });
    //   this?.props?.navigation?.setParams({
    //     selectedMember: id,
    //     memberTitle: memberTitle,
    //   });
    // }
  }
  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={{ flex: 1 }}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={{ flex: 1, paddingVertical: 10 }}>
            {this?.state?.detail ? (
              <>
                {this?.state?.detail?.length === 0 ? (
                  <NoDataFound
                    title="No Group yet"
                    text="No group appear here"
                    imageWidth={Responsive.getWidth(50)}
                    imageHeight={Responsive.getWidth(50)}
                    source={IMAGES.noChatImage}
                    titleColor={theme?.colors?.WHITE}
                  />
                ) : (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={this?.state?.detail || []}
                    keyExtractor={(item, index) => String(index)}
                    onEndReachedThreshold={0.5}
                    renderItem={({ item, index }) => {
                      return (
                        item.user_id !== this.props?.userData?.userInfo?.id && (
                          <TouchableOpacity style={[styles.listItem, { borderBottomWidth: 0 }]} onPress={() => this.onChange(item.user_id, item.user_name, item)}>
                            <Image
                              source={{ uri: item?.user_image ? item?.user_image : IMAGES.sortIcon }}
                              style={{ borderRadius: 50, width: 50, height: 50 }}
                            />
                            <View style={[styles.body, { paddingLeft: 20 }]}>
                              <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BOLD', 'left')}>{item?.user_name}</Text>
                            </View>
                            <View style={[styles.right, styles.listIcon]}>
                              {this?.state?.selectedMember?.some(val => val?.user_id === item?.user_id) ? (
                                <Image source={IMAGES.checkIcon2} style={styles.listIcon} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        )
                      );
                    }}
                  />
                )}
              </>
            ) : null}
          </View>
        </SafeAreaWrapper>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    userList: state?.dashboardState?.userList,
    myConnections: state?.dashboardState?.myConnections,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(AddMemberScreen);
