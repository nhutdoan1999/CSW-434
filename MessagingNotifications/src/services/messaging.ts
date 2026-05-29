// File: src/services/messaging.ts
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

const { NotificationModule } = NativeModules;
const NOTES_TOPIC = 'notes';

type NotificationTapHandler = (message: FirebaseMessagingTypes.RemoteMessage) => void;

export async function initMessaging(): Promise<void> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  await messaging().registerDeviceForRemoteMessages();
  await messaging().subscribeToTopic(NOTES_TOPIC);
}

export function registerNotificationHandlers(onTap: NotificationTapHandler): () => void {
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      NotificationModule.displayNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    }
  });

  const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(message => {
    onTap(message);
  });

  messaging()
    .getInitialNotification()
    .then(message => {
      if (message) onTap(message);
    });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnNotificationOpened();
  };
}