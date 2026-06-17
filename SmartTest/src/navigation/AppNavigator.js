import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import 10 màn hình
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ExamDetailScreen from '../screens/ExamDetailScreen';
import QuizExecutionScreen from '../screens/QuizExecutionScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import ReviewAnswersScreen from '../screens/ReviewAnswersScreen';
import ScoreHistoryScreen from '../screens/ScoreHistoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Nhóm Tab cho Home và Profile
const MainTabs = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4F46E5' }}>
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Exams' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Home" component={MainTabs} />
                <Stack.Screen name="ExamDetail" component={ExamDetailScreen} />
                <Stack.Screen name="QuizExecution" component={QuizExecutionScreen} />
                <Stack.Screen name="QuizResult" component={QuizResultScreen} />
                <Stack.Screen name="ReviewAnswers" component={ReviewAnswersScreen} />
                <Stack.Screen name="ScoreHistory" component={ScoreHistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;