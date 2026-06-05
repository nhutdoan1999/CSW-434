// File: App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initMessaging, registerNotificationHandlers } from './src/services/messaging';

// Tạo biến ref để có thể điều hướng từ ngoài Component
export const navigationRef = createNavigationContainerRef<any>();

const App = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    initMessaging()
      .then(() => {
        console.log('FCM Initialized successfully!');

        unsubscribe = registerNotificationHandlers((message) => {
          console.log('Đã bấm vào thông báo mang dữ liệu:', message);

          if (navigationRef.isReady()) {
            navigationRef.navigate('Home');
          }
        });
      })
      .catch(error => {
        console.error('FCM init error:', error);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;