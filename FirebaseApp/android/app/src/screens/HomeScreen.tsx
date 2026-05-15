import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { NOTE_COLORS } from '../utils/colors'; // Đảm bảo đường dẫn này đúng với file colors.ts của bạn

const HomeScreen = ({ navigation }: any) => {
    const [notes, setNotes] = useState<any[]>([]);

    // 1. Lấy dữ liệu Real-time bằng onSnapshot [cite: 63]
    useEffect(() => {
        const subscriber = firestore()
            .collection('notes')
            .onSnapshot(querySnapshot => {
                const notesData: any[] = [];
                querySnapshot?.forEach(doc => {
                    notesData.push({ id: doc.id, ...doc.data() });
                });
                setNotes(notesData);
            }, error => {
                console.error("Firestore Error: ", error);
            });

        return () => subscriber();
    }, []);

    // 2. Xóa ghi chú khi nhấn giữ (Yêu cầu bài lab) [cite: 59]
    const confirmDelete = (id: string) => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa ghi chú này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', onPress: () => firestore().collection('notes').doc(id).delete() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.icon}>☰</Text>
                <Text style={styles.headerTitle}>Recent Notes</Text>
                <Text style={styles.icon}>🔍</Text>
            </View>

            <FlatList
                data={notes}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: item.color || '#FFF' }]}
                        onPress={() => navigation.navigate('Edit', { note: item })}
                        onLongPress={() => confirmDelete(item.id)}
                    >
                        <Text style={styles.cardTitle}>{item.title || 'Untitled'}</Text>
                        <Text numberOfLines={6} style={styles.cardContent}>{item.content}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* NÚT ADD (FAB) - Chọn màu ngẫu nhiên và truyền sang EditScreen */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    const selectedColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
                    navigation.navigate('Edit', {
                        note: { title: '', content: '', color: selectedColor, id: null }
                    });
                }}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    icon: { fontSize: 24, color: '#333' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    listContent: { paddingHorizontal: 10, paddingBottom: 100 },
    card: { flex: 1, margin: 8, padding: 15, borderRadius: 20, height: 180, elevation: 3 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    cardContent: { fontSize: 13, color: '#555', lineHeight: 18 },
    fab: {
        position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#E74C3C',
        width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 10
    },
    fabText: { color: 'white', fontSize: 40, fontWeight: '300' }
});

export default HomeScreen;