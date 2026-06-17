import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password) return Alert.alert('Error', 'Please enter all fields');
        setLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(email.trim(), password);
            setLoading(false);
            Alert.alert('Success', 'Account created! Please log in.');
            navigation.goBack(); // Quay lại trang Login
        } catch (error) {
            setLoading(false);
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                <Text style={styles.linkText}>Already have an account? Log In</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9FAFB' },
    title: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 30, textAlign: 'center' },
    input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 15, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    linkText: { color: '#4F46E5', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});

export default SignupScreen;