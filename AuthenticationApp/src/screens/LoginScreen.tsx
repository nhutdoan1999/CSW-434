import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        // Cấu hình Google Sign-in
        GoogleSignin.configure({
            webClientId: '147715245576-dpunfh1mr3fort77tmksrdqli55j67tj.apps.googleusercontent.com',
        });
    }, []);

    // Hàm Xử lý Đăng ký bằng Email
    const handleRegister = async () => {
        if (!email || !password) return Alert.alert('Lỗi', 'Vui lòng nhập Email và Password');
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            Alert.alert('Thành công', 'Đăng ký tài khoản hoàn tất!');
        } catch (error: any) {
            Alert.alert('Lỗi Đăng ký', error.message);
        }
    };

    // Hàm Xử lý Đăng nhập bằng Email
    const handleLogin = async () => {
        if (!email || !password) return Alert.alert('Lỗi', 'Vui lòng nhập Email và Password');
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (error: any) {
            Alert.alert('Lỗi Đăng nhập', 'Sai email hoặc mật khẩu!');
        }
    };

    // Hàm Xử lý Đăng nhập bằng Google
    // Hàm Xử lý Đăng nhập bằng Google (Đã cập nhật cấu trúc mới)
    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Lấy toàn bộ cục dữ liệu trả về thay vì bóc tách trực tiếp
            const response = await GoogleSignin.signIn() as any;

            // Tự động tìm idToken ở cả cấu trúc cũ (idToken) và cấu trúc mới (data.idToken)
            const idToken = response.idToken || response.data?.idToken;

            if (!idToken) {
                return Alert.alert('Lỗi', 'Không lấy được Token xác thực từ Google.');
            }

            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredential);

        } catch (error: any) {
            console.error('Chi tiết lỗi Google Sign-In:', error);
            Alert.alert('Lỗi', 'Đăng nhập Google bị hủy hoặc thất bại.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Taking- Note</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username , Email & Phone Number"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                />
            </View>

            <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister} style={styles.registerLink}>
                <Text style={styles.registerText}>Create new account (Sign up)</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or Sign up With</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                <Text style={styles.googleButtonText}>G</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 30, justifyContent: 'center' },
    title: { fontSize: 36, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 50 },
    subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 50, fontWeight: '600' },
    inputContainer: { marginBottom: 10 },
    input: { backgroundColor: '#F7F7F7', borderRadius: 15, padding: 18, marginBottom: 15, fontSize: 15, color: '#333' },
    forgotPassword: { textAlign: 'right', color: '#333', fontWeight: 'bold', marginBottom: 30, fontSize: 13 },
    loginButton: { backgroundColor: '#E790F8', padding: 18, borderRadius: 15, alignItems: 'center' },
    loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    registerLink: { alignItems: 'center', marginTop: 15 },
    registerText: { color: '#E790F8', fontWeight: 'bold', fontSize: 14 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 40 },
    divider: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
    dividerText: { marginHorizontal: 15, color: '#888', fontWeight: '500' },
    googleButton: { alignSelf: 'center', backgroundColor: '#FFF', elevation: 4, width: 55, height: 55, borderRadius: 27.5, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
    googleButtonText: { fontSize: 24, fontWeight: 'bold', color: '#DB4437' }
});

export default LoginScreen;