import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import màn hình Battery bạn đã tạo lúc nãy
// Lưu ý: Đảm bảo đường dẫn này khớp với nơi bạn lưu file nhé!
import BatteryTrackerScreen from './src/BatteryTrackerScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Hiển thị màn hình theo dõi pin ra màn hình chính */}
      <BatteryTrackerScreen />

    </SafeAreaProvider>
  );
}

export default App;