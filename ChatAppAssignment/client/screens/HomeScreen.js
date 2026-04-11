import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import socket from "../socket";

export default function HomeScreen({ navigation }) {
    const [userName, setUserName] = useState("");

    const handleStartChat = () => {
        const trimmedName = userName.trim();

        if (!trimmedName) {
            Alert.alert("Validation", "Please enter your name.");
            return;
        }

        socket.emit("join_user", trimmedName);

        navigation.navigate("Group", {
            userName: trimmedName,
        });
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Your Name</Text>
                <Text style={styles.subtitle}>
                    Please enter your name to start a new chat.
                </Text>

                <Text style={styles.label}>Your name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={userName}
                    onChangeText={setUserName}
                />

                <TouchableOpacity style={styles.button} onPress={handleStartChat}>
                    <Text style={styles.buttonText}>Start Chat</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
        color: "#222",
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        fontSize: 14,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        color: "#2a8f83",
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        fontSize: 16,
        paddingVertical: 10,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#2a8f83",
        paddingVertical: 14,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 22,
        letterSpacing: 1,
        fontWeight: "600",
    },
});