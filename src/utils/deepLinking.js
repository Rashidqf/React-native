import React from 'react';
import { Share, View, Button, Linking } from 'react-native';

const onShare = async (message, title) => {
  try {
    const result = await Share.share({
      message: 'Please join me on Sidenote. \n \n' + message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

export default onShare;
