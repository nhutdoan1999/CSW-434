import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import thêm auth
import { NOTE_COLORS } from '../utils/colors';

const HomeScreen = ({ navigation }: any) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Lấy thông tin người dùng hiện tại
    const currentUser = auth().currentUser;

    // 1. Lọc dữ liệu Real-time theo User ID
    useEffect(() => {
        if (!currentUser) return;

        const subscriber = firestore()
            .collection('notes')
            .where('userId', '==', currentUser.uid) // QUAN TRỌNG: Chỉ lấy ghi chú của user này
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
    }, [currentUser]);

    // Logic Lọc dữ liệu cục bộ (Thanh Search)
    const filteredNotes = notes.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const contentMatch = note.content?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || contentMatch;
    });

    const confirmDelete = (id: string) => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa ghi chú này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', onPress: () => firestore().collection('notes').doc(id).delete() },
        ]);
    };

    // Hàm xử lý Đăng xuất
    const handleLogout = () => {
        Alert.alert('Đăng xuất', 'Bạn có muốn đăng xuất khỏi tài khoản?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đăng xuất', onPress: () => auth().signOut() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {isSearchActive ? (
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm..."
                            placeholderTextColor="#7F8C8D"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        <TouchableOpacity onPress={() => { setIsSearchActive(false); setSearchQuery(''); }}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Thay nút Menu bằng nút Đăng xuất */}
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.icon}>🚪</Text>
                        </TouchableOpacity>

                        <Text style={styles.headerTitle}>My Notes</Text>

                        <TouchableOpacity onPress={() => setIsSearchActive(true)}>
                            <Text style={styles.icon}>🔍</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <FlatList
                data={filteredNotes}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Chưa có ghi chú nào.</Text>
                }
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
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', height: 70 },
    icon: { fontSize: 24, color: '#333' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    searchBarContainer: { flexDirection: 'row', flex: 1, backgroundColor: '#F1F2F6', borderRadius: 15, paddingHorizontal: 15, alignItems: 'center', height: 45 },
    searchInput: { flex: 1, fontSize: 16, color: '#333', padding: 0 },
    closeIcon: { fontSize: 18, color: '#666', marginLeft: 10 },
    listContent: { paddingHorizontal: 10, paddingBottom: 100 },
    card: { flex: 1, margin: 8, padding: 15, borderRadius: 20, height: 180, elevation: 3 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    cardContent: { fontSize: 13, color: '#555', lineHeight: 18 },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
    fab: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#E74C3C', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    fabText: { color: 'white', fontSize: 40, fontWeight: '300' }
});

export default HomeScreen;