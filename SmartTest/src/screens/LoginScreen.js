import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
    const previousScore = 8.5;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '982878293951-emeuih4jjidbbgp87u4p59j54tbaj3us.apps.googleusercontent.com',
        });
    }, []);

    const onEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Notice', 'Please enter both Email and Password');
            return;
        }
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email.trim(), password);
            setLoading(false);
            navigation.replace('Home');
        } catch (error) {
            setLoading(false);
            Alert.alert('Login Failed', 'Invalid email or password.');
        }
    };

    const onGoogleButtonPress = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken || response.idToken;

            if (!idToken) throw new Error('No token received');

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);

            setLoading(false);
            navigation.replace('Home');
        } catch (error) {
            setLoading(false);
            console.log('Google Sign-In Error:', error);
            Alert.alert('Google Sign-In Failed', 'Please check your internet connection or Google account.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SmartTest</Text>
            <Text style={styles.subtitle}>Latest Score: {previousScore.toFixed(1)}</Text>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Student Email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={[styles.button, styles.emailButton]} onPress={onEmailLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Log In</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.dividerText}>or</Text>

            <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={onGoogleButtonPress} disabled={loading}>
                <Text style={styles.buttonText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB' },
    title: { fontSize: 40, fontWeight: '900', color: '#4F46E5', marginBottom: 8, letterSpacing: 1 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40, fontWeight: '500' },
    formContainer: { width: '100%', marginBottom: 10 },
    input: { width: '100%', height: 55, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#111827', marginBottom: 16, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    button: { width: '100%', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, marginTop: 8 },
    emailButton: { backgroundColor: '#4F46E5' },
    googleButton: { backgroundColor: '#EF4444' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
    linkContainer: { marginTop: 15 },
    linkText: { color: '#4F46E5', fontSize: 15, fontWeight: '600' },
    dividerText: { color: '#9CA3AF', fontSize: 14, marginVertical: 20, fontWeight: '600', textTransform: 'uppercase' }
});

export default LoginScreen;