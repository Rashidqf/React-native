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

class InboxSidenotes extends React.Component {
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
      connectId : null,
      connectionList: [
        // { id: 0, img: IMAGES.image1, sidenoteName: "Sidenote Name", userImg: IMAGES.image1, userName: "Carla H" }
      ],
    };
  }

  static contextType = AppContext;

  ToggleFunction = () => {
    this.setState(state => ({
      isVisible: !state.isVisible,
    }));
  };
  componentDidMount() {
    this.getSideNotesData();
    
  }

  getSideNotesData = () => {
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_LIST,
        data: {},
      };
        this.props.showLoading(true);

      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_LIST];
              // console.log('responce', resp);
              this.setState({ isLoading: false });
            
                    if (resp.success) {
                     
                      this.setState({ connectionList: resp.data });
            } else {
          
            }
            });
          
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  };
  handleAccept = () => {
    // console.log("Hello")
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_JOIN,
        data: {
          invitation_id : this.state.connectId,
          is_accept : 1 
        },
      };
        this.props.showLoading(true);
      
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_JOIN];
              console.log('responce', resp);
              this.setState({ isLoading: false });
                    if (resp.success) {
                      
                    
            } else {
          
            }
            });
          
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }

  handleArchive = () => {
    try {
      const params = {
        url: API_DATA.GROUP_INVITATION_JOIN,
        data: {
          invitation_id : this.state.connectId,
          is_accept : 0 
        },
      };
        this.props.showLoading(true);      
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.GROUP_INVITATION_JOIN];
              console.log('responce', resp);
              this.setState({ isLoading: false });
                    if (resp.success) {
                      this.getSideNotesData()
                    // Copy the array and remove the item at the specified index
  const updatedConnectionList = [...this.state.connectionList];
  updatedConnectionList.splice(index, 1);
  
  // Update the state to re-render the FlatList without the hidden item
  this.setState({ connectionList: updatedConnectionList });
                      // this.setState({  modalShow : false });
            } else {
          
            }
            });
          
          })
          .catch(err => {
            this.setState({ isLoading: false });
            this.props.showLoading(false);
          });
      }, 500);
    } catch (e) {
      console.log('catch error >>>', e);
    }
  }


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
              <Image source={IMAGES.chat_name_icon} style={[styles.iconTabIcon, styles.iconTabIconActive]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Events_Screen')}>
              <Image source={IMAGES.calendar_icon2} style={styles.iconTabIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTabBtn} onPress={() => this?.props?.navigation?.navigate('Inbox_Task_Screens')}>
              <Image source={IMAGES.task_icon2} style={styles.iconTabIcon} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>

            {this.state.connectionList?.length !== 0 ? (
              
                            <FlatList
                            data={this.state.connectionList}
                            renderItem={({ item }) => {
                              // console.log("item ussuuss" , item)
                             
                                              return (
                                <View style={styles.listItem}>
                                  <Image source={{ uri :item.group.image}} style={styles.listItemUimg} />
                                  <View style={styles.listItemContent}>
                                    <View style={{ flexDirection: 'row' }}>
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.listItemTitle} numberOfLines={1}>{item.group.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                          <Image source={{ uri: item.user.image }} style={styles.userImg} />
                                          <Text style={styles.userImgName} numberOfLines={1}>{item.user.name}</Text>
                                        </View>
                                      </View>
                                      <View style={styles.multipleImgsView}>
                                        <Image source={{uri: item.group.members[0].user.image}} style={styles.multipleImgs1} />
                                        <Image source={{uri: item.group.members[0].user.image}} style={styles.multipleImgs2} />
                                        <Image source={{uri: item.group.members[0].user.image}} style={styles.multipleImgs3} />
                                        {/* <View style={styles.multipleImgsCount}>
                                          <Text style={styles.multipleImgsCountTxt}>+2</Text>
                                        </View> */}
              
                                        {item.group.total_members.length > 3 && (
                                          <View style={styles.multipleImgsCount}>
                                          <Text style={styles.multipleImgsCountTxt}>
                                            +{item.group.total_members.length - 3}
                                          </Text>
                                          </View>
                                        )}
                                        
                                      </View>
                                    </View>
                                    <View style={styles.listBtnRow}>
                                      <TouchableOpacity style={styles.btnOrange} onPress={() => this.setState({ modalShow: true })}>
                                        <Text style={styles.btnOrangeTxt}>Accept</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.btnOutlineGray}>
                                        <Text style={styles.btnOutlineGrayTxt} onPress={() => this.handleArchive()}>Archive</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              );
                            }}
                            contentContainerStyle={styles.flatlistContentContainerStyle}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={styles.itemSepratorStyle} 
                            
                            />}
                          />
            ) : (
              <NoDataFound
              title="Nothing to see"
              text="You don’t have any Sidenotes"
              titleColor={theme?.colors?.GRAY_50}
              textColor={theme?.colors?.GRAY_100}
              titleFontSize={20}
              source={IMAGES.noChatImage}
              imageWidth={205}
              imageHeight={156}
            />
            ) }
         



          </View>
        </SafeAreaWrapper>

        {/* Start Connection Modal */}
        <Modal animationType="slide" transparent={true} visible={this.state.modalShow}>
          <TouchableWithoutFeedback onPress={() => this.setState({ modalShow: false })}>
            <View source={IMAGES.onboardingScreen} style={styles.modalContainer}>
              <View style={styles.modalView}>
                <ImageBackground source={IMAGES.onboardingScreen} style={styles.modalbodyBg}>
                  <View style={styles.modalSafeAreaView}>
                    <TouchableOpacity style={styles.modalBtn}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.RED_500, 'BASE')} onPress={() => this.handleAccept()} >Join this sidenote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ modalShow: false })}>
                      <Text style={COMMON_STYLE.textStyle(14, theme?.colors?.WHITE, 'BASE')}>Cancel</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(InboxSidenotes);
