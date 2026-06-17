import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>SmartTest</Text>
                <Text style={styles.subtitle}>Your Academic Testing Platform</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.replace('Login')}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#4F46E5', justifyContent: 'space-between', padding: 24 },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#E0E7FF' },
    button: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
    buttonText: { color: '#4F46E5', fontSize: 18, fontWeight: '700' }
});

export default WelcomeScreen;