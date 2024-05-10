import React from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  ImageBackground,
  SafeAreaView
} from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import components
import { SafeAreaWrapper } from '@components';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';

//import languages
import { localize } from '@languages';

//import style
import { style } from './style';
import { callApi } from '@apiCalls';

import { API_DATA } from '@constants';
import Icon from 'react-native-vector-icons/Ionicons';
import NoDataFound from '../../components/noDataFound';
import { Responsive } from '@helpers';
import { AppContext } from '../../themes/AppContextProvider';

class InboxTask extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      headerRight: () => {
        const { theme } = this.context;
        return (
          <TouchableOpacity style={COMMON_STYLE.headerBtnStyle}>
            {/* <Text style={[COMMON_STYLE.headerBtnTextStyle, { color: theme?.colors?.PURPLE_500 }]}>Chat</Text> */}
            <Image source={IMAGES.more} style={{ width: 24, height: 24, }} />
          </TouchableOpacity>
        );
      },
    });

    this.state = {
      isVisible: true,
      checked: true,
      modalShow: false,
      connectionList: [
        { id: 0, taskTitle: "Pick up cake from Publix", userImg: IMAGES.image1, name: "Bryan J", hours: "Today", day: "Tues, June 7", time: "7:30pm - 9:45pm", sidenoteName: "Sidenote Name", sidenoteCategory: "Category" },
      ],
      pinnedConnection: [
        { id: 0, img: IMAGES.image1, name: "Jazmine M", blueDote: 1, redDote: 1 },
        { id: 1, img: IMAGES.image1, name: "Marybeth L", blueDote: 1, },
        { id: 2, img: IMAGES.image1, name: "Jeff G", redDote: 1 },
      ],
      monthList: [
        { id: 0, month: "June", isActive: 1 },
        { id: 1, month: "July", count: "(2)" },
        { id: 2, month: "August", count: "(3)" },
        { id: 3, month: "September" },
        { id: 4, month: "October" },
        { id: 5, month: "November" },
      ]
    };
  }

  static contextType = AppContext;

  ToggleFunction = () => {
    this.setState(state => ({
      isVisible: !state.isVisible,
    }));
  };



  render() {
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <ImageBackground source={IMAGES.onboardingScreen} style={styles.backgroundImage}>
        <SafeAreaWrapper backgroundColor={theme?.colors?.TRANSPARENT} containerStyle={{ marginLeft: 0, marginRight: 0, marginTop: 100 }}>
          <View style={styles.iconTabNav}>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Connections_Screen')}>
              <Image source={IMAGES.link_circle_icon} style={[styles.iconTabIcon]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Sidenotes_Screen')}>
              <Image source={IMAGES.chat_name_icon} style={styles.iconTabIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Events_Screen')}>
              <Image source={IMAGES.calendar_icon2} style={[styles.iconTabIcon]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Task_Screen')}>
              <Image source={IMAGES.task_icon2} style={[styles.iconTabIcon, styles.iconTabIconActive]} />
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              data={this.state.monthList}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={item.isActive ? styles.monthItemActive : styles.monthItem}>
                    <Text style={item.isActive ? styles.monthItemTxtActive : styles.monthItemTxt}>
                      {item.month}{' '}{item.month ? <Text>{item.count}</Text> : null}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              style={{ marginTop: Responsive.getWidth(4) }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
          </View>
          <View>
            <FlatList
              data={this.state.pinnedConnection}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={styles.pinnedItem}>
                    <Image source={item.img} style={styles.pinnedItemImg} />
                    <Text style={styles.pinnedItemName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.pinnedDotsRow}>
                      {item.blueDote ? <View style={styles.blueDote} /> : null}
                      {item.redDote ? <View style={styles.redDote} /> : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
              style={{ marginTop: Responsive.getWidth(4) }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ paddingLeft: Responsive.getWidth(2) }}

              ItemSeparatorComponent={() => <View style={styles.hItemSepratorStyle} />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.connectionList}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.listItem}>
                    <View style={styles.listItemContent}>
                      <View style={styles.eventUsrRow}>
                        <Image source={item.userImg} style={styles.eventUsrImg} />
                        <Text style={styles.eventUsrName} numberOfLines={1}>{item.name}</Text>
                      </View>
                      <Text style={styles.taskTitle} numberOfLines={1}>
                        {item.taskTitle}
                      </Text>
                      <View style={styles.sidenoteRow}>
                        <Image source={IMAGES.new_sidenote2} style={styles.sidenoteIcon} />
                        <Text style={styles.sidenoteTxt}>
                          {' '}{item.sidenoteName},{' '}{item.sidenoteCategory}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.calendarBtn} onPress={() => this.setState({ modalShow: true })}>
                        <Image source={IMAGES.calAddIcon} style={styles.calendarBtnIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={styles.flatlistContentContainerStyle}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} />}
            />
          </View>
        </SafeAreaWrapper>

        {/* Start Connection Modal */}
        <Modal animationType="slide" transparent={true} visible={this.state.modalShow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ modalShow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.modalContainer}>
              <View style={styles.modalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.modalbodyBg}>
                  <View style={styles.modalSafeAreaView}>
                    <TouchableOpacity style={[styles.modalBtn]}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')}>Add to Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Archive</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ modalShow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.GRAY_200, 'BASE')}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* END Connection Modal */}
      </ImageBackground>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    userData: state.redState.userData,
    myConnections: state?.dashboardState?.myConnections,
    chatDetail: state?.groupState?.chatDetail,
    groupList: state?.dashboardState?.groupList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(InboxTask);
