import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, NativeModules, NativeEventEmitter } from 'react-native';

const { BatteryModule } = NativeModules;
const batteryEmitter = new NativeEventEmitter(BatteryModule);

const BatteryTrackerScreen = () => {
    const [batteryInfo, setBatteryInfo] = useState({
        level: 0,
        isCharging: false,
        status: 'Unknown',
        health: 'Unknown',
        plugged: 'Unknown',
        temperature: 0,
        voltage: 0
    });
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        const subscription = batteryEmitter.addListener('BatteryStatusChanged', (info) => {
            setBatteryInfo(info);
        });

        return () => {
            subscription.remove();
            if (BatteryModule && BatteryModule.stopTracking) {
                BatteryModule.stopTracking();
            }
        };
    }, []);

    const handleStartTracking = () => {
        if (BatteryModule && BatteryModule.startTracking) {
            BatteryModule.startTracking();
            setIsTracking(true);
        }
    };

    const handleStopTracking = () => {
        if (BatteryModule && BatteryModule.stopTracking) {
            BatteryModule.stopTracking();
            setIsTracking(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Battery Status Tracker</Text>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Battery: {batteryInfo.level ? batteryInfo.level.toFixed(1) : '0.0'}%</Text>
                <Text style={styles.infoText}>Charging: {batteryInfo.isCharging ? 'Yes' : 'No'}</Text>
                <Text style={styles.infoText}>Status: {batteryInfo.status}</Text>
                <Text style={styles.infoText}>Health: {batteryInfo.health}</Text>
                <Text style={styles.infoText}>Source: {batteryInfo.plugged}</Text>
                <Text style={styles.infoText}>Temperature: {batteryInfo.temperature ? batteryInfo.temperature.toFixed(1) : '0.0'} °C</Text>
                <Text style={styles.infoText}>Voltage: {batteryInfo.voltage} mV</Text>
                <Text style={styles.infoText}>Tracking: {isTracking ? 'ON' : 'OFF'}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleStartTracking}>
                <Text style={styles.buttonText}>START TRACKING</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleStopTracking}>
                <Text style={styles.buttonText}>STOP TRACKING</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 60
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000000'
    },
    infoBox: {
        borderWidth: 1,
        borderColor: '#A0A0A0',
        padding: 15,
        marginBottom: 20
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000000'
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 2
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default BatteryTrackerScreen;