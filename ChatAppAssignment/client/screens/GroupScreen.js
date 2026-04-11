import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import socket from "../socket";

export default function GroupScreen({ route }) {
    const { userName } = route.params;
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    useEffect(() => {
        const onReceiveMessage = (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        const onUserJoined = (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.on("receive_message", onReceiveMessage);
        socket.on("user_joined", onUserJoined);

        return () => {
            socket.off("receive_message", onReceiveMessage);
            socket.off("user_joined", onUserJoined);
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    }, [messages]);

    const handleSendMessage = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        socket.emit("send_message", {
            userName,
            text: trimmedMessage,
        });

        setMessage("");
    };

    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderMessage = ({ item }) => {
        if (item.type === "system") {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                    <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                </View>
            );
        }

        const isMyMessage = item.userName === userName;

        return (
            <View
                style={[
                    styles.messageRow,
                    isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
                    ]}
                >
                    {!isMyMessage && <Text style={styles.senderName}>{item.userName}</Text>}
                    <Text
                        style={[
                            styles.messageText,
                            isMyMessage ? styles.myMessageText : styles.otherMessageText,
                        ]}
                    >
                        {item.text}
                    </Text>
                    <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Make message..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    messageList: {
        padding: 12,
        paddingBottom: 8,
    },
    messageRow: {
        marginBottom: 10,
        flexDirection: "row",
    },
    myMessageRow: {
        justifyContent: "flex-end",
    },
    otherMessageRow: {
        justifyContent: "flex-start",
    },
    messageBubble: {
        maxWidth: "78%",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    myMessageBubble: {
        backgroundColor: "#2a8f83",
    },
    otherMessageBubble: {
        backgroundColor: "#f0f0f0",
    },
    senderName: {
        fontWeight: "700",
        marginBottom: 4,
        color: "#333",
    },
    messageText: {
        fontSize: 15,
    },
    myMessageText: {
        color: "#fff",
    },
    otherMessageText: {
        color: "#222",
    },
    messageTime: {
        marginTop: 4,
        fontSize: 11,
        color: "#ddd",
        textAlign: "right",
    },
    systemMessageContainer: {
        alignItems: "center",
        marginVertical: 6,
    },
    systemMessageText: {
        color: "#666",
        fontStyle: "italic",
        fontSize: 13,
    },
    timeText: {
        fontSize: 11,
        color: "#999",
        marginTop: 2,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        fontSize: 15,
    },
    sendButton: {
        backgroundColor: "#2a8f83",
        paddingHorizontal: 16,
        paddingVertical: 11,
        borderRadius: 20,
    },
    sendButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
});