import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, NativeModules, TouchableOpacity, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

const { DeviceModule } = NativeModules;

const App = () => {
  const [activeTab, setActiveTab] = useState<'brightness' | 'battery'>('battery');
  const [battery, setBattery] = useState(80);
  const [brightness, setBrightness] = useState(0.5);

  const fetchBattery = async () => {
    try {
      const level = await DeviceModule.getBatteryLevel();
      setBattery(level);
    } catch (e) {
      console.log("Error fetching battery: ", e);
    }
  };

  useEffect(() => {
    // Kiểm tra xem DeviceModule có thực sự tồn tại không
    console.log("Kiem tra DeviceModule: ", DeviceModule);

    if (DeviceModule && DeviceModule.getBatteryLevel) {
      fetchBattery();
    } else {
      console.warn("⚠️ DeviceModule chưa được link thành công!");
    }
    fetchBattery();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* KHU VỰC NỘI DUNG */}
      <View style={styles.content}>

        {activeTab === 'battery' ? (
          /* MÀN HÌNH 1: HIỂN THỊ PIN */
          <View style={styles.batteryContainer}>
            <View style={styles.batteryCard}>
              <Text style={styles.cardTitle}>Battery</Text>

              <View style={styles.batteryBody}>
                <View style={styles.batteryCap} />
                <View style={styles.batteryOutline}>
                  {/* Thanh Pin sử dụng Gradient */}
                  <LinearGradient
                    colors={['#00FFD1', '#00BA98']}
                    style={[styles.batteryFill, { height: `${battery}%` }]}
                  />
                  <View style={styles.centeredText}>
                    <Text style={styles.batteryNum}>{battery}</Text>
                    <Text style={styles.percentSign}>%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

        ) : (

          /* MÀN HÌNH 2: ĐIỀU CHỈNH ĐỘ SÁNG */
          <View style={styles.brightnessScreen}>
            {/* Vòng tròn hiển thị % độ sáng */}
            <View style={styles.circleContainer}>
              <View style={styles.dashedCircle}>
                <View style={styles.innerCircle}>
                  <Text style={styles.brightnessValue}>{Math.round(brightness * 100)}%</Text>
                </View>
              </View>
            </View>

            {/* Khung Slider điều khiển */}
            <View style={styles.controlCard}>
              <Text style={styles.label}>Brightness</Text>
              <View style={styles.sliderRow}>
                <Text style={styles.icon}>☀️</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={brightness}
                  minimumTrackTintColor="#4A90E2"
                  maximumTrackTintColor="#D3D3D3"
                  onValueChange={(val) => {
                    setBrightness(val);
                    DeviceModule.setBrightness(val); // Áp dụng độ sáng lập tức
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* THANH TAB BAR */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('brightness')} style={styles.tabButton}>
          <Text style={[styles.tabLabel, activeTab === 'brightness' && styles.activeText]}>
            Brightness
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab('battery')} style={styles.tabButton}>
          <Text style={[styles.tabLabel, activeTab === 'battery' && styles.activeTextBlue]}>
            Battery
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* BATTERY UI */
  batteryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  batteryCard: { backgroundColor: '#1C2521', width: 220, height: 400, borderRadius: 25, alignItems: 'center', padding: 20 },
  cardTitle: { color: 'white', marginBottom: 30, fontSize: 16, fontWeight: '600' },
  batteryBody: { alignItems: 'center' },
  batteryCap: { width: 45, height: 10, backgroundColor: '#333', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  batteryOutline: { width: 140, height: 230, borderWidth: 3, borderColor: '#333', borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end', position: 'relative' },
  batteryFill: { width: '100%', position: 'absolute', bottom: 0 },
  batteryNum: { color: 'white', fontSize: 55, fontWeight: 'bold' },
  percentSign: { color: 'white', fontSize: 20, marginTop: 20, marginLeft: 2 },
  centeredText: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },

  /* BRIGHTNESS UI */
  brightnessScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  circleContainer: { marginBottom: 50 },
  dashedCircle: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderStyle: 'dashed', borderColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  brightnessValue: { fontSize: 22, color: '#555', fontWeight: '500' },
  controlCard: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 15, elevation: 4 },
  label: { fontSize: 16, color: '#333', fontWeight: '500', marginBottom: 15 },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 22, marginRight: 15 },
  slider: { flex: 1, height: 40 },

  /* TAB BAR UI */
  tabBar: { flexDirection: 'row', height: 80, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF', paddingBottom: 15 },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabLabel: { color: '#B0B0B0', fontSize: 16 },
  activeText: { color: '#333', fontWeight: 'bold' },
  activeTextBlue: { color: '#4A90E2', fontWeight: 'bold' }
});

export default App;