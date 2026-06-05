import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditScreen = ({ route, navigation }: any) => {
    const { note } = route.params;
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const handleSave = async () => {
        try {
            const currentUser = auth().currentUser; // Lấy user hiện tại

            if (!note.id) {
                // Đóng dấu userId vào ghi chú mới tạo
                await firestore().collection('notes').add({
                    title: title || 'Untitled',
                    content: content,
                    color: note.color,
                    userId: currentUser?.uid || '', // <-- DÒNG NÀY LÀ LINH HỒN CỦA BÀI LAB 6
                    createdAt: firestore.FieldValue.serverTimestamp()
                });
            } else {
                await firestore().collection('notes').doc(note.id).update({
                    title: title,
                    content: content
                });
            }
            navigation.goBack();
        } catch (e) {
            console.error("Lỗi khi lưu dữ liệu: ", e);
            Alert.alert('Lỗi', 'Không thể lưu ghi chú');
        }
    };

    const handleDelete = () => {
        Alert.alert('Xóa ghi chú', 'Thao tác này không thể hoàn tác.', [
            { text: 'Hủy' },
            {
                text: 'Xóa ngay', onPress: async () => {
                    await firestore().collection('notes').doc(note.id).delete();
                    navigation.goBack();
                }
            },
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: note.color || '#FFF' }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.iconText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Note</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {note.id && (
                            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 20 }}>
                                <Text style={[styles.iconText, { color: '#C0392B' }]}>🗑️</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Homework"
                    placeholderTextColor="#7F8C8D"
                />

                <TextInput
                    style={styles.contentInput}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    placeholder="Start writing..."
                    placeholderTextColor="#95A5A6"
                />

                <View style={styles.toolbar}>
                    <Text style={styles.toolItem}>B</Text>
                    <Text style={styles.toolItem}>I</Text>
                    <Text style={styles.toolItem}>U</Text>
                    <Text style={styles.toolItem}>🖼️</Text>
                    <Text style={styles.toolItem}>🎙️</Text>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
    iconText: { fontSize: 26, color: '#333' },
    saveText: { fontSize: 18, fontWeight: 'bold', color: '#4A90E2' },
    titleInput: { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
    contentInput: { fontSize: 18, flex: 1, textAlignVertical: 'top', color: '#444', lineHeight: 28 },
    toolbar: {
        flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.4)',
        padding: 15, borderRadius: 20, justifyContent: 'space-around', marginBottom: 20
    },
    toolItem: { fontSize: 18, fontWeight: 'bold', color: '#333' }
});

export default EditScreen;