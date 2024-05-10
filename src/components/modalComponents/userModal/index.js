import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import helpers
import { Responsive } from '@helpers';

// import Languages
import { localize } from '@languages';

//import style
import { style } from './style';

import { IMAGES } from '@themes';
import { callApi } from '@apiCalls';

import { RowItems } from '../../rowItems/index';
import { AppContext } from '../../../themes/AppContextProvider';
import on from 'socket.io-client/lib/on';
import onShare from '../../../utils/deepLinking';
import { API_DATA } from '../../../constants/apiData';

class UserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatDetail: '',
    };
  }
  static contextType = AppContext;

  componentDidMount = () => {
    this.getChatDetail();
  };

  getChatDetail = () => {
    try {
      const params = {
        url: API_DATA.CHATDETAIL,
        data: {
          chat_id: this.props.chat_id,
        },
      };
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.CHATDETAIL];
              if (resp.success) {
                this.props.getChatDetail(resp?.data);
              } else {
              }
            });
          })
          .catch(err => {});
      }, 500);
    } catch (e) {}
  };
  handleSendRequest = () => {
    try {
      const params = {
        url: API_DATA.INVITEFRIEND,
        data: {
          phone: this.props.userDetails.phone,
        },
      };
      this.props.showLoading(true);
      setTimeout(() => {
        callApi([params], this.props.userData.access_token)
          .then(response => {
            this.props.showLoading(false).then(() => {
              let resp = response[API_DATA.INVITEFRIEND];
              if (resp.success) {
                // this?.props?.updateContactStatus(resp?.data);
                this.props.showLoading(false);
              } else {
                this.props.showLoading(false);
                // this.setState({ shareUrl: true });
                this.props.showErrorAlert(localize('ERROR'), resp.message);
              }
            });
          })
          .catch(err => {
            this.props.showLoading(false);
          });
      }, 1000);
    } catch (error) {
      console.log('catch error', error);
    }
  };

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const {
      visible,
      inVisible,
      sendMessage,
      chat_id,
      userDetails,
      onPressSendMsg,
      onPressModerator,
      onPressAddtoSidenote,
      onPressSharedSidenote,
      onPressBlock,
      onPressInvite,
      isFromGroup,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          // visible={true}
          onRequestClose={() => {
            inVisible();
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={[styles.modalBodyclose]} onPress={() => inVisible()}></TouchableOpacity>
            <View style={[styles.modalView]}>
              <View style={styles.modalImageView}>
                <View style={styles.modalImageViewBody}>
                  <Text style={styles.userName}>{userDetails?.name}</Text>
                  <Text style={[styles.contatText]}>
                    {userDetails?.user_phone_code} {userDetails?.phone}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: Responsive.getWidth(3) }}>
                    {userDetails?.chat_id !== '' &&
                    this?.state?.chatDetail?.common_groups_count &&
                    this?.state?.chatDetail?.common_groups_count !== 0 ? (
                      <TouchableOpacity
                        style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => {
                          this.setState({ modalVisible: false });
                          this?.props?.navigation?.navigate('SHARED_SIDENOTE_LIST', { chatId: this.state.userDetails?.chat_id });
                        }}
                      >
                        <Text style={styles.connectionTxt1}>{this?.state?.chatDetail?.common_groups_count}</Text>
                        <Text style={styles.connectionTxt2}>Shared{'\n'}Sidenotes</Text>
                      </TouchableOpacity>
                    ) : null}
                    {this?.state?.chatDetail?.mutual_connections_count !== 0 && this?.state?.chatDetail?.mutual_connections_count ? (
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.connectionTxt1}>{this?.state?.chatDetail?.mutual_connections_count}</Text>
                        <Text style={styles.connectionTxt2}>Mutual{'\n'}Connections</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <Image source={{ uri: userDetails?.image }} style={styles.userProfileImage} />
              </View>
              {!sendMessage ? (
                <>
                  {userDetails?.channel ? (
                    <>
                      {/* {userDetails?.connection_id != '' ? ( */}
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => {
                          inVisible();
                          onPressSendMsg();
                        }}
                      >
                        <Text style={[styles.modalTitle, { marginTop: 7 }]}>Send Message</Text>
                      </TouchableOpacity>
                      {/* ) : (
                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={() => {
                            handleSendRequest();
                          }}
                        >
                          <Text style={[styles.modalTitle, { marginTop: 7 }]}>Connect</Text>
                        </TouchableOpacity>
                      )} */}
                      <View style={{ marginTop: Responsive.getWidth(10) }}>
                        {isFromGroup ? (
                          userDetails?.is_moderator === 0 ? (
                            <RowItems
                              theme={theme}
                              leftIcon={'users'}
                              title={`Add Moderator`}
                              containerStyle={[styles.RowItemsStyle]}
                              onPress={() => {
                                inVisible();
                                onPressModerator();
                              }}
                            />
                          ) : (
                            <RowItems
                              theme={theme}
                              leftIcon={'users'}
                              title={`Remove Moderator`}
                              containerStyle={[styles.RowItemsStyle]}
                              onPress={() => {
                                inVisible();
                                onPressModerator();
                              }}
                            />
                          )
                        ) : null}

                        {chat_id !== '' ? (
                          <RowItems
                            theme={theme}
                            leftIcon={'users'}
                            title={`Shared Sidenotes`}
                            containerStyle={[styles.RowItemsStyle]}
                            onPress={() => {
                              inVisible();
                              onPressSharedSidenote();
                            }}
                          />
                        ) : null}
                        <RowItems
                          theme={theme}
                          leftIcon={'message-square'}
                          title={`Add to Sidenote`}
                          containerStyle={[styles.RowItemsStyle]}
                          rightIconStyle={{ opacity: 0 }}
                          onPress={() => {
                            inVisible();
                            onPressAddtoSidenote();
                          }}
                        />
                        <RowItems
                          theme={theme}
                          leftIcon={'plus'}
                          title={'Add to System Contacts'}
                          containerStyle={[styles.RowItemsStyle]}
                          rightIconStyle={{ opacity: 0 }}
                          onPress={() => inVisible()}
                        />
                        <RowItems
                          theme={theme}
                          leftIcon={'slash'}
                          title={userDetails?.is_block ? 'Unblock' : 'Block'}
                          containerStyle={[styles.RowItemsStyle]}
                          rightIconStyle={{ opacity: 0 }}
                          onPress={() => {
                            inVisible();
                            onPressBlock();
                          }}
                        />
                      </View>
                    </>
                  ) : userDetails?.connection_id === '' ? (
                    <>
                      <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => {
                          inVisible();
                          // onPressInvite();
                          this.handleSendRequest();
                        }}
                      >
                        <Text style={[styles.modalTitle, { marginTop: 7 }]}>Connect</Text>
                      </TouchableOpacity>
                      <RowItems
                        theme={theme}
                        leftIcon={'slash'}
                        title={userDetails?.is_block ? 'Unblock' : 'Block'}
                        containerStyle={[styles.RowItemsStyle]}
                        rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          inVisible();
                          onPressBlock();
                        }}
                      />
                    </>
                  ) : (
                    <View style={{ marginTop: Responsive.getWidth(10) }}>
                      {isFromGroup ? (
                        <RowItems
                          theme={theme}
                          leftIcon={'users'}
                          title={`Choose As a Moderator`}
                          containerStyle={[styles.RowItemsStyle]}
                          onPress={() => {
                            inVisible();
                            onPressModerator();
                          }}
                        />
                      ) : null}
                      <RowItems
                        theme={theme}
                        leftIcon={'share'}
                        title={'Make a Friend Connection'}
                        containerStyle={[styles.RowItemsStyle]}
                        // rightIconStyle={{ opacity: 0 }}
                        onPress={() => {
                          onPressInvite();
                          // inVisible();
                        }}
                      />
                    </View>
                  )}
                </>
              ) : null}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
    chatDetail: state?.groupState?.chatDetail,
    userData: state.redState.userData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(UserModal);
