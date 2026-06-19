/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);
// Hàm này giúp điện thoại nhận được thông báo kể cả khi bạn đã vuốt tắt ứng dụng
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Nhận thông báo khi chạy ngầm:', remoteMessage.notification);
});
