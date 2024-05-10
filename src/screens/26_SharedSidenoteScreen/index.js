import React, { useState } from 'react';

import { Image, ScrollView, Text, View, TouchableOpacity, Switch } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { RowItems } from '@components';

//import themes
import { IMAGES } from '@themes';

//import style
import { style } from './style';
import Icon2 from 'react-native-vector-icons/Feather';
import { AppContext } from '../../themes/AppContextProvider';

class ChatProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidenotViewData: [{}],
    };

    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  }
  static contextType = AppContext;

  loginHandler = () => {
    this.props.navigation.navigate('DrewerNav');
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <View style={{ flex: 1, backgroundColor: theme?.colors?.GRAY_1000 }}>
        {/* <SafeAreaWrapper backgroundColor={theme?.colors?.GRAY_1000} containerStyle={{ ...COMMON_STYLE.marginStyle(0, 0), }}> */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => this.props.navigation.goBack()}>
            <Icon2 name="chevron-left" style={styles.headerLeftIcon} />
          </TouchableOpacity>
          <View style={styles.headerCenter} />
          <TouchableOpacity style={styles.headerRight} onPress={() => {}}>
            <Icon2 name="more-horizontal" style={styles.headerRightIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollView} nestedScrollEnabled={false}>
          <View style={styles.container}>
            <View style={styles.profileView}>
              <TouchableOpacity style={styles.profileWrap}>
                <Image source={IMAGES.sortIcon} style={styles.profileImg1} resizeMode={'cover'} />
                <Image source={IMAGES.sortIcon} style={styles.profileImg2} resizeMode={'cover'} />
                <Image source={IMAGES.sortIcon} style={styles.profileImg3} resizeMode={'cover'} />
                <Text style={styles.profileImgTxt}>{'+2'}</Text>
              </TouchableOpacity>
              <Text style={styles.userName}>{'Classmates'}</Text>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchTxt}>{'Mute sidenote'}</Text>
              <Switch
                // trackColor={{ false: "#767577", true: "#81b0ff" }}
                // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                trackColor={theme?.colors?.GRAY_500}
                thumbColor={theme?.colors?.GRAY_800}
                // ios_backgroundColor="#3e3e3e"
                // onValueChange={toggleSwitch}
                // value={isEnabled}
              />
            </View>
            <RowItems theme={theme} leftIcon={'users'} title={'5 Members'} onPress={() => this.props.navigation.navigate('MEMBERS')} />
            <RowItems
              theme={theme}
              leftIcon={'image'}
              title={'Image Gallery'}
              onPress={() => this.props.navigation.navigate('IMAGE_GALLERY')}
            />
            <RowItems
              theme={theme}
              leftIcon={'hash'}
              title={'3 Categories'}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => this.props.navigation.navigate('CATEGORIES')}
            />
            <Text style={styles.rowItemsTitle}>{'Privacy and Support'}</Text>
            <RowItems theme={theme} leftIcon={'minus-circle'} title={'Remove a member'} onPress={() => {}} />
            <RowItems theme={theme} leftIcon={'slash'} title={'Block a member'} onPress={() => {}} />
            <RowItems
              theme={theme}
              leftIcon={'log-out'}
              title={'Leave Sidenote'}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => {}}
            />
          </View>
        </ScrollView>
        {/* </SafeAreaWrapper> */}
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ChatProfileScreen);
