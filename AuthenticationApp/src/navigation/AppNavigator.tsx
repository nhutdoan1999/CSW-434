import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import HomeScreen from '../screens/HomeScreen';
import EditScreen from '../screens/EditScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    // State lưu trữ trạng thái khởi tạo và thông tin người dùng
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        // Lắng nghe sự kiện đăng nhập/đăng xuất từ Firebase
        const subscriber = auth().onAuthStateChanged(currentUser => {
            setUser(currentUser);
            if (initializing) setInitializing(false);
        });
        return subscriber;
    }, [initializing]);

    if (initializing) return null; // Tránh nháy màn hình khi app đang check auth

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                // NHÓM 1: CHƯA ĐĂNG NHẬP
                <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
                // NHÓM 2: ĐÃ ĐĂNG NHẬP THÀNH CÔNG
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Edit" component={EditScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;