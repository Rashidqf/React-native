import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import style
import { style } from './style';

import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { ASYNC_KEYS, API_DATA } from '@constants';
import { callApi } from '@apiCalls';
import { localize } from '@languages';
// import constants
import { AppContext } from '../../themes/AppContextProvider';

class categoriesDropdown extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      dropdownListData: this.props.dropdownListData,
      groupName: this?.props?.title,
    };
    this.onPress = this.onPress.bind(this);
  }
  static contextType = AppContext;

  onPress() {
    this.setState({ isHidden: !this.state.isHidden });
  }

  _renderListItem = ({ item, index }) => {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <TouchableOpacity
        style={styles.dropdownListItem}
        onPress={() => {
          this.setState({ isHidden: false }), item.onPress(this.props.id);
        }}
      >
        <Text style={styles.dropdownListItemTxt}>{item.listTitle}</Text>
        <Icon2 name="star" style={styles.dropdownListItemIcon} />
      </TouchableOpacity>
    );
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.dropdownListData?.length !== this.props.dropdownListData) {
      this.setState({ dropdownListData: this.props.dropdownListData });
    }
  }

  updateGroupProfile = () => {
    try {
      const params = {
        url: API_DATA.GROUPPROFILEUPDATE,
        data: {
          id: this?.props?.subGroupIdC,
          title: this.state.groupName,
        },
      };

      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props?.userData?.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUPPROFILEUPDATE];
              // this.handleGroupDetail();
              if (resp.success) {
                this.props.showToast(localize('SUCCESS'), resp.message);

                this.props.getGroupProfileUpdate(resp.data);
                this?.props?.subGroupIDData('');
                // this.getChatList();
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

  render() {
    const { containerStyle, leftIconStyle, title, titleStyle, rightIconStyle } = this.props;
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <>
        <View style={[styles.dropdown, containerStyle]}>
          <View style={styles.dropdownBtn}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => this?.props?.onPressLabel() !== undefined && this?.props?.onPressLabel()}>
                {this.props.id === this?.props?.subGroupIdC ? (
                  <TextInput
                    placeholder={this.props.title}
                    value={this.state.groupName}
                    style={[styles.dropdownBtnTxt, titleStyle]}
                    placeholderTextColor={theme?.colors?.WHITE}
                    onChangeText={text => this.setState({ groupName: text })}
                    autoFocus
                    // editable={this.state.updateName ? false : true}
                  />
                ) : (
                  <Text style={[styles.dropdownBtnTxt, titleStyle]}>{this.props.title}</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.onPress}>
              {this.props.id === this?.props?.subGroupIdC ? (
                <Text
                  style={[styles.dropdownBtnTxt, titleStyle, { color: theme?.colors?.PURPLE_500 }]}
                  onPress={() => {
                    // Keyboard.dismiss();
                    this.updateGroupProfile();
                  }}
                >
                  {'Update'}
                </Text>
              ) : (
                <Icon name="more-horizontal" style={[styles.dropdownBtnIcon, rightIconStyle]} />
              )}
            </TouchableOpacity>
          </View>
          {this.state.isHidden ? (
            <View style={styles.dropdownList}>
              <FlatList
                keyboardShouldPersistTaps="handled"
                data={this.state.dropdownListData}
                renderItem={this._renderListItem}
                //horizontal={true}
                keyExtractor={item => item.index}
                // style={{ height: 120 }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : null}
        </View>
      </>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
    userData: state.redState.userData,
    subGroupIdC: state.groupState.subGroupIdC,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(categoriesDropdown);
