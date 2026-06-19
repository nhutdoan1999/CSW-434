import React, { useEffect } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
// import firestore from '@react-native-firebase/firestore';

import NoteDetailScreen from './src/screens/NoteDetailScreen';

// TÌM VÀ ẨN ĐOẠN NÀY ĐI BẠN NHÉ:
// if (__DEV__) {
//   firestore().useEmulator('10.0.2.2', 8080);
// }

function App() {
  useEffect(() => {
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('Đã cấp quyền thông báo');
      }
    };

    requestUserPermission();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title || '🔔 Nhắc nhở',
        remoteMessage.notification?.body || 'Bạn có một công việc đến hạn!',
        [{ text: 'Đã hiểu', style: 'cancel' }]
      );
    });

    // --- 2. THỦ THUẬT: TỰ ĐỘNG GỌI FUNCTION MỖI 30 GIÂY ---
    const interval = setInterval(() => {
      fetch('http://10.0.2.2:5001/lab7-2031200018/us-central1/checkAndSendReminders')
        .then(() => console.log('Đang quét thông báo ngầm...'))
        .catch(err => console.log('Lỗi quét ngầm:', err));
    }, 30000); // 30000 ms = 30 giây

    return () => {
      unsubscribe();
      clearInterval(interval); // Dọn dẹp bộ đếm khi tắt app
    };
  }, []);

  return (
    <View style={styles.container}>
      <NoteDetailScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default App;