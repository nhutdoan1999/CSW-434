import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ProfileScreen = ({ navigation }) => {
    const user = auth().currentUser;
    const [avgScore, setAvgScore] = useState(0);

    useEffect(() => {
        if (!user) return;
        const subscriber = firestore()
            .collection('exam_results')
            .where('studentEmail', '==', user.email)
            .onSnapshot(querySnapshot => {
                let total = 0; let count = 0;
                querySnapshot.forEach(doc => { total += doc.data().score; count += 1; });
                setAvgScore(count > 0 ? total / count : 0);
            });
        return () => subscriber();
    }, [user]);

    const handleLogout = async () => {
        try {
            await auth().signOut();
            try {
                const isGoogleSignedIn = await GoogleSignin.isSignedIn();
                if (isGoogleSignedIn) await GoogleSignin.signOut();
            } catch (googleError) { console.log('Google signout bypassed'); }
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } catch (error) {
            Alert.alert('Error', 'Unable to log out at this time.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{user?.displayName || 'SmartTest Student'}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.statsLabel}>CUMULATIVE AVERAGE</Text>
                <Text style={styles.statsScore}>{avgScore.toFixed(1)}</Text>
            </View>

            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('ScoreHistory')}
            >
                <Text style={styles.historyButtonText}>View Full History</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', padding: 24, paddingTop: 60 },
    profileHeader: { alignItems: 'center', marginBottom: 40 },
    avatarCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    avatarText: { fontSize: 44, color: '#FFFFFF', fontWeight: '800' },
    name: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
    email: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
    statsContainer: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 20 },
    statsLabel: { fontSize: 13, color: '#9CA3AF', letterSpacing: 1.5, fontWeight: '700', marginBottom: 8 },
    statsScore: { fontSize: 56, color: '#10B981', fontWeight: '900' },
    historyButton: { backgroundColor: '#EEF2FF', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#C7D2FE' },
    historyButtonText: { color: '#4F46E5', fontSize: 16, fontWeight: '700' },
    logoutButton: { backgroundColor: '#FEE2E2', padding: 16, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 20 },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' }
});

export default ProfileScreen;