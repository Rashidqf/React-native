import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  // console.log('FCMTOKEN OLD', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // console.log('the new generated token', fcmToken);
        await AsyncStorage.setItem('fcmTOken', fcmToken);
      }
    } catch (err) {
      console.log('err', err);
    }
  }
};

export const notificationLister = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log('notifications cased app', remoteMessage.notification, remoteMessage);
  });
  messaging().onMessage(async remoteMessage => {
    // console.log('rec.. for...', remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });
};
