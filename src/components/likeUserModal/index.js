import { Text, View, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { Component } from 'react';
import { style } from './style';
import { IMAGES, COMMON_STYLE } from '@themes';
import { AppContext } from '../../themes/AppContextProvider';

export default class LikeUserModal extends Component {
  constructor(props) {
    super(props);
  }
  static contextType = AppContext;

  render() {
    const { visible, inVisible, userList, likeMessage } = this.props;
    const { theme } = this.context;
    const styles = style(theme);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          inVisible();
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={[styles.modalBodyclose]} onPress={() => inVisible()}></TouchableOpacity>
          <View style={[styles.modalView, { marginTop: 80, alignItems: 'center' }]}>
            <Image source={IMAGES?.like} style={{ height: 30, width: 30, marginBottom: 20 }} />
            <Text style={COMMON_STYLE?.textStyle(12, theme?.colors?.WHITE)}>{likeMessage ? likeMessage : ''}</Text>
            <FlatList
              bounces={false}
              data={userList || []}
              numColumns={4}
              contentContainerStyle={{ marginTop: 30 }}
              renderItem={({ item }) => {
                return (
                  <View style={{ padding: 10, alignItems: 'center' }}>
                    <Image
                      source={{ uri: item?.user_image }}
                      style={{ height: 50, width: 50, borderRadius: 30, backgroundColor: 'white' }}
                    />
                    <View style={{ marginTop: 10 }}>
                      <Text style={COMMON_STYLE?.textStyle(10, theme?.colors?.WHITE)}>{item?.user_name}</Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
