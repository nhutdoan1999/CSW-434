import 'react-native-gesture-handler'; // Bắt buộc dòng này ở trên cùng
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './android/app/src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;