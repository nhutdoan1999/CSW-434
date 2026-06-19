import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const NoteDetailScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminderTime, setReminderTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [showPicker, setShowPicker] = useState(false);
    const [fcmToken, setFcmToken] = useState('');

    // State chứa danh sách ghi chú
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Lấy FCM Token
        const getToken = async () => {
            try {
                const token = await messaging().getToken();
                setFcmToken(token);
            } catch (error) {
                console.log('Lỗi lấy token:', error);
            }
        };
        getToken();

        // Lắng nghe dữ liệu từ Firestore để hiển thị ngay lập tức
        const subscriber = firestore()
            .collection('notes')
            .onSnapshot(querySnapshot => {
                const list = [];
                querySnapshot?.forEach(doc => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setNotes(list);
            }, error => console.error(error));

        return () => subscriber();
    }, []);

    const showMode = (currentMode) => {
        setShowPicker(true);
        setMode(currentMode);
    };

    const handleSaveNote = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Vui lòng nhập tiêu đề!');
            return;
        }

        const noteData = {
            title: title,
            description: description,
            reminderTime: firestore.Timestamp.fromDate(reminderTime),
            fcmToken: fcmToken,
            isNotified: false,
            createdAt: firestore.FieldValue.serverTimestamp()
        };

        try {
            await firestore().collection('notes').add(noteData);
            Alert.alert('Thành công', 'Đã lưu ghi chú!');

            // --- RESET FORM SAU KHI LƯU ---
            setTitle('');
            setDescription('');
            setReminderTime(new Date());

        } catch (error) {
            Alert.alert('Lỗi', error.message);
        }
    };

    // Giao diện cho từng item trong danh sách
    const renderItem = ({ item }) => (
        <View style={styles.noteCard}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.cardTime}>
                ⏰ Hẹn giờ: {item.reminderTime ? item.reminderTime.toDate().toLocaleString() : 'N/A'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* KHU VỰC FORM */}
            <View style={styles.formContainer}>
                <Text style={styles.header}>Thêm Ghi Chú Mới</Text>
                <TextInput style={styles.input} placeholder="Tiêu đề..." value={title} onChangeText={setTitle} />
                <TextInput style={[styles.input, { height: 80 }]} placeholder="Mô tả..." value={description} onChangeText={setDescription} multiline />

                <View style={styles.reminderSection}>
                    <Text style={styles.timeText}>Giờ nhắc: {reminderTime.toLocaleString()}</Text>
                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.btnTime} onPress={() => showMode('date')}><Text style={styles.btnText}>📅 Ngày</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btnTime} onPress={() => showMode('time')}><Text style={styles.btnText}>⏰ Giờ</Text></TouchableOpacity>
                    </View>
                    {showPicker && (
                        <DateTimePicker
                            value={reminderTime} mode={mode} display="default"
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) setReminderTime(selectedDate);
                            }}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNote}>
                    <Text style={styles.saveBtnText}>LƯU GHI CHÚ</Text>
                </TouchableOpacity>
            </View>

            {/* KHU VỰC DANH SÁCH */}
            <Text style={styles.listHeader}>Danh sách Ghi chú</Text>
            <FlatList
                data={notes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
    formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5, fontSize: 15 },
    reminderSection: { marginBottom: 10 },
    timeText: { fontSize: 14, marginBottom: 10, fontWeight: 'bold', color: '#555' },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
    btnTime: { backgroundColor: '#FF9800', padding: 10, borderRadius: 5, alignItems: 'center', flex: 0.48 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    saveBtn: { backgroundColor: '#4CAF50', padding: 12, alignItems: 'center', borderRadius: 5, marginTop: 10 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    noteCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#2196F3', elevation: 2 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    cardDesc: { fontSize: 14, color: '#666', marginBottom: 5 },
    cardTime: { fontSize: 13, color: '#FF9800', fontWeight: 'bold' }
});

export default NoteDetailScreen;