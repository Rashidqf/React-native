//import react
import React, { useEffect } from 'react';

import PushNotification from 'react-native-push-notification';

//import third pasrt library
import messaging from '@react-native-firebase/messaging';

//import constants
import { ASYNC_KEYS } from '@constants';

//import storage functions
import { StorageOperation } from '@storage';

class FirebaseSvc {
  async firebasePushSetup() {
    const authStatus = await messaging().requestPermission({ sound: true });
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging()
        .getToken()
        .then(fcmToken => {
          // console.log('getToken', fcmToken);
          StorageOperation.setData([[ASYNC_KEYS.FCM_TOKEN, fcmToken]]);
        })
        .catch(error => {
          console.log('token error >>> ', error);
        });
    }

    // console.log('Authorization status:', enabled);

    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: `Default channel`, // (required)
      },
      created => console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );

    this.setNotificationListner();
  }

  async hasNotificationPermission() {
    const hasPermission = await messaging().hasPermission();

    return new Promise((resolve, reject) => {
      resolve(hasPermission);
    });
  }

  //get fcm token from firebase
  async getNotificationToken() {
    const fcmToken = await messaging().getToken();

    return new Promise((resolve, reject) => {
      StorageOperation.getData([ASYNC_KEYS.FCM_TOKEN]).then(value => {
        if (value[0][1] == null) {
          StorageOperation.setData([[ASYNC_KEYS.FCM_TOKEN, fcmToken]]).then(() => resolve(fcmToken));
        } else {
          resolve(value[0][1]);
        }
      });
    });
  }

  setNotificationListner() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Notification caused app to open from foreground state:', remoteMessage.notification);
      this.handleLocalNotification(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  handleLocalNotification(remoteMessage) {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'default-channel-id', // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      /* iOS and Android properties */
      title: remoteMessage.notification.title, // (optional)
      message: remoteMessage.notification.body, // (required)
      userInfo: { ...remoteMessage.data, is_local_notification: true }, // (optional) default: {} (using null throws a JSON value '<null>' error)
    });
  }
}

const FirebaseService = new FirebaseSvc();
export default FirebaseService;
