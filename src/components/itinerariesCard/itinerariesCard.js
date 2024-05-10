import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native';

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
class ItinerariesCard extends React.PureComponent<Props> {
  static contextType = AppContext;

  render() {
    const { theme } = this.context;
    const styles = style(theme);

    const { item, isEvent, navigation, index, isDraft } = this.props;

    // const startTime = new Date(item?.start_time)
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          isEvent
            ? navigation?.navigate('EVENT_DETAILS', { eventId: item?.id })
            : navigation?.navigate('New_Itinerary_Details', {
                id: item?.id,
              })
        }
      >
        <View style={styles.eventImgView}>
          <Image source={item?.media?.length ? { uri: item.media[0]?.url } : IMAGES?.image} style={styles.eventImage} />
          {isDraft ? (
            <View style={[styles.imgBadge, { backgroundColor: theme?.colors?.BLUE_200 }]}>
              <Text style={styles.imgBadgeTxt}>Draft</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.dayTxt}>{item.day}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item?.user?.image }} style={styles.userImgCircle} />
            <Text style={styles.userName}>{item?.user?.name}</Text>
          </View>
          {isEvent ? (
            <Text style={styles.eventTime1}>{moment(item?.date).format('ddd, MMM D')}</Text>
          ) : item?.start_time ? (
            <Text style={styles.eventTime1}>
              {moment(item?.start_time, ['h:mm A']).utc().format('h:mm A')}- {moment(item?.end_time, ['h:mm A']).utc().format('h:mm A')}
            </Text>
          ) : (
            <Text style={styles.eventTime1}>{'Fullday'}</Text>
          )}
          <Text style={styles.eventTitle}>{item.title}</Text>
          {isEvent ? (
            item?.is_fullday ? (
              <Text style={styles.eventTime2}>FullDay</Text>
            ) : (
              <Text style={styles.eventTime2}>
                {moment(item?.start_time, ['h:mm A']).utc().format('h:mm A')}- {moment(item?.end_time, ['h:mm A']).utc().format('h:mm A')}
              </Text>
            )
          ) : item?.events?.length ? (
            <Text style={styles.eventTime2}>{item.events?.length} event</Text>
          ) : null}
          {/* <Text style={styles.eventTime2}>{item.event}</Text> */}
          {isDraft ? (
            <TouchableOpacity style={styles.purpleBtn}>
              <Text style={styles.purpleBtnTxt}>Draft</Text>
            </TouchableOpacity>
          ) : null}
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
export default connect(mapStateToProps, mapDispatchToProps)(ItinerariesCard);
