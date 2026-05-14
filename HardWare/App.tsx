import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, NativeModules, NativeEventEmitter, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { HardwareModule } = NativeModules;
const hardwareEmitter = new NativeEventEmitter(HardwareModule);
const { width } = Dimensions.get('window');

const App = () => {
  const [activeTab, setActiveTab] = useState<'compass' | 'nfc'>('compass');
  const [degree, setDegree] = useState<number>(0);
  const [nfcData, setNfcData] = useState<string>('Đưa thẻ NFC lại gần điện thoại...');

  useEffect(() => {
    HardwareModule.startCompass();

    const compassSub = hardwareEmitter.addListener('CompassUpdate', (newDegree: number) => {
      setDegree(newDegree);
    });

    const nfcSub = hardwareEmitter.addListener('NFCUpdate', (tagId: string) => {
      setNfcData(`Tag ID: ${tagId}`);
      setActiveTab('nfc');
    });

    return () => {
      HardwareModule.stopCompass();
      compassSub.remove();
      nfcSub.remove();
    };
  }, []);

  const getDirectionName = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    if (deg >= 292.5 && deg < 337.5) return 'NW';
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{activeTab === 'compass' ? 'Compass' : 'NFC Reader'}</Text>

      <View style={styles.content}>
        {activeTab === 'compass' ? (
          /* MÀN HÌNH LA BÀN */
          <View style={styles.compassContainer}>
            {/* Vòng ngoài xoay ngược chiều để mô phỏng la bàn thật */}
            <View style={[styles.compassDial, { transform: [{ rotate: `${360 - degree}deg` }] }]}>
              <Text style={[styles.cardinal, styles.north]}>N</Text>
              <Text style={[styles.cardinal, styles.east]}>E</Text>
              <Text style={[styles.cardinal, styles.south]}>S</Text>
              <Text style={[styles.cardinal, styles.west]}>W</Text>
            </View>

            {/* Vòng trong cố định hiển thị số */}
            <View style={styles.centerReadout}>
              <Text style={styles.degreeText}>{degree}°</Text>
              <Text style={styles.directionText}>{getDirectionName(degree)}</Text>
            </View>
          </View>
        ) : (
          /* MÀN HÌNH NFC */
          <View style={styles.nfcContainer}>
            <View style={styles.nfcCard}>
              <Text style={styles.nfcTitle}>Thông tin thẻ NFC</Text>
              <Text style={styles.nfcResult}>{nfcData}</Text>
            </View>
          </View>
        )}
      </View>

      {/* ĐIỀU HƯỚNG */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('compass')} style={styles.tabButton}>
          <Text style={[styles.tabLabel, activeTab === 'compass' && styles.activeTab]}>Compass</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('nfc')} style={styles.tabButton}>
          <Text style={[styles.tabLabel, activeTab === 'nfc' && styles.activeTab]}>NFC</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Compass Styles
  compassContainer: { justifyContent: 'center', alignItems: 'center', width: width * 0.8, height: width * 0.8 },
  compassDial: { width: '100%', height: '100%', borderRadius: width * 0.4, borderWidth: 2, borderColor: '#EEE', backgroundColor: '#FFF', position: 'relative', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardinal: { position: 'absolute', fontSize: 24, fontWeight: 'bold', color: '#888' },
  north: { top: 10, left: '50%', transform: [{ translateX: -10 }], color: '#E74C3C' },
  south: { bottom: 10, left: '50%', transform: [{ translateX: -10 }] },
  east: { right: 10, top: '50%', transform: [{ translateY: -15 }] },
  west: { left: 10, top: '50%', transform: [{ translateY: -15 }] },

  centerReadout: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', elevation: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 5 },
  degreeText: { fontSize: 36, fontWeight: '800', color: '#333' },
  directionText: { fontSize: 18, fontWeight: '600', color: '#7F8C8D', marginTop: 5 },

  // NFC Styles
  nfcContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  nfcCard: { backgroundColor: '#FFF', padding: 30, borderRadius: 15, width: '80%', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  nfcTitle: { fontSize: 18, color: '#555', marginBottom: 15, fontWeight: 'bold' },
  nfcResult: { fontSize: 20, color: '#27AE60', fontWeight: 'bold', textAlign: 'center' },

  // Tabs
  tabBar: { flexDirection: 'row', height: 70, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE', paddingBottom: 10 },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabLabel: { fontSize: 16, color: '#95A5A6', fontWeight: '600' },
  activeTab: { color: '#2C3E50', fontWeight: '800' }
});

export default App;