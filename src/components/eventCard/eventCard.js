import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';

//import third-party packages
import { ActionCreators } from '@actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import style
import { style } from './style';

//import themes
import { IMAGES, COMMON_STYLE } from '@themes';
import { AppContext } from '../../themes/AppContextProvider';
import moment from 'moment';
import { compareDate } from '../../utils/validations';
class EventCard extends React.PureComponent<Props> {
  static contextType = AppContext;

  render() {
    const { theme } = this.context;
    const styles = style(theme);
    const { item, containerStyle, navigation, index, isDraft, fromCalendarScreen, groupName, subGroupName } = this.props;
    console.log('event card', item);
    return (
      <TouchableOpacity
        style={[styles.card, containerStyle]}
        onPress={() => {
          navigation?.navigate('EVENT_DETAILS', { eventId: item?.id });
        }}
      >
        <View style={styles.eventImgView}>
          <Image
            source={item?.media?.length ? { uri: item.media[item?.media?.length - 1]?.url } : IMAGES?.image}
            style={styles.eventImage}
          />
          {isDraft ? (
            <View style={[styles.imgBadge, { backgroundColor: theme?.colors?.BLUE_200 }]}>
              <Text style={styles.imgBadgeTxt}>Draft</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.dayTxt}>{item?.date ? `${compareDate(item?.date)}` : null}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item?.createdBy ? item?.createdBy?.image : item?.user?.image }} style={styles.userImgCircle} />
            <Text style={styles.userName} numberOfLines={1}>
              {item?.createdBy ? item?.createdBy?.name : item?.user?.name}
            </Text>
          </View>

          <Text style={styles.eventTime} numberOfLines={1}>
            {moment(item?.date).format('ddd, MMM D')}
            {'  •  '}
            {item?.start_time ? `${moment(item?.start_time, ['h:mm A']).utc().format('h:mm A')}` : null}
            {item?.end_time ? ` - ${moment(item?.end_time, ['h:mm A']).utc().format('h:mm A')}` : null}
            {item?.is_fullday === 1 ? 'Full day' : null}
          </Text>

          <Text style={styles.eventTitle} numberOfLines={1}>
            {item?.title}
          </Text>
          {fromCalendarScreen ? (
            item?.chat_name ? (
              <>
                <View style={styles.chatRow}>
                  <Image source={IMAGES.chat_icon} style={styles.chatIcon} />
                  <Text style={styles.chatTxt}>
                    {item?.chat_name} {' , '}
                    {item?.chat_category}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.chatRow}>
                  <Image source={IMAGES.chat_icon} style={styles.chatIcon} />
                  <Text style={styles.chatTxt}>{'Not created in chats'}</Text>
                </View>
              </>
            )
          ) : groupName ? (
            <>
              <View style={styles.chatRow}>
                <Image source={IMAGES.chat_icon} style={styles.chatIcon} />
                <Text style={styles.chatTxt}>
                  {groupName}
                  {' , '}
                  {subGroupName}
                </Text>
              </View>
            </>
          ) : null}
          {isDraft ? (
            <TouchableOpacity style={styles.purpleBtn}>
              <Text style={styles.purpleBtnTxt}>Draft</Text>
            </TouchableOpacity>
          ) : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {item?.participants?.length ? (
              <FlatList
                data={item?.participants || ''}
                renderItem={({ item }) => (
                  <View style={[styles.usersRow]}>
                    <View style={styles.usersImgRow}>
                      <Image source={{ uri: item.user_image }} style={styles.usersImg} />
                      {item?.length > 3 ? <Text style={styles.usersRowTxt}>+ {item?.length - 3}</Text> : null}
                    </View>
                  </View>
                )}
                nestedScrollEnabled={true}
                keyExtractor={(item, index) => index.toString()}
                maxToRenderPerBatch={3}
                horizontal={false}
                numColumns={3}
              />
            ) : null}
          </View>
          {/* <View style={styles.usersRow}>
            
            <Text style={styles.usersRowTxt}>+12</Text>
          </View> */}
        </View>
        {!isDraft ? <View style={[styles.coloredBorder, styles.bgPurple]} /> : null}
      </TouchableOpacity>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    alertData: state.redState.alertData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

//Connect Everything
export default connect(mapStateToProps, mapDispatchToProps)(EventCard);
