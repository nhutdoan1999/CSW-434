import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import GroupScreen from "./screens/GroupScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Practice Assignment 1" }}
        />
        <Stack.Screen
          name="Group"
          component={GroupScreen}
          options={{ title: "Group CSE 434" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}