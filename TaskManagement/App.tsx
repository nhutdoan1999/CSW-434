import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TaskManagerScreen from './src/screens/TaskManagerScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Gọi màn hình Quản lý công việc ra hiển thị */}
      <TaskManagerScreen />

    </SafeAreaProvider>
  );
}

export default App;