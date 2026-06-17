import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ScoreHistoryScreen = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) return;

        // Bỏ .orderBy() ở đây để tránh lỗi đòi hỏi Composite Index của Firebase
        const subscriber = firestore()
            .collection('exam_results')
            .where('studentEmail', '==', user.email)
            .onSnapshot(
                querySnapshot => {
                    // Xử lý an toàn nếu snapshot bị null do mạng hoặc lỗi
                    if (!querySnapshot) {
                        setLoading(false);
                        return;
                    }

                    const data = [];
                    querySnapshot.forEach(doc => {
                        data.push({ id: doc.id, ...doc.data() });
                    });

                    // Dùng Javascript để sắp xếp bài thi mới nhất lên trên cùng
                    data.sort((a, b) => {
                        const timeA = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : 0;
                        const timeB = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : 0;
                        return timeB - timeA;
                    });

                    setHistory(data);
                    setLoading(false);
                },
                error => {
                    console.log('Firebase fetch error: ', error);
                    setLoading(false);
                }
            );

        return () => subscriber();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.testTitle}</Text>
                <Text style={styles.date}>Answers: {item.correctAnswers}/{item.totalQuestions}</Text>
            </View>
            <View style={styles.scoreBox}>
                <Text style={styles.score}>{item.score.toFixed(1)}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Exam History</Text>
            {loading ? <ActivityIndicator size="large" color="#4F46E5" /> : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text style={styles.empty}>No exams completed yet.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20, paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20 },
    card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 1 },
    title: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 4 },
    date: { fontSize: 14, color: '#6B7280' },
    scoreBox: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
    score: { color: '#4F46E5', fontSize: 18, fontWeight: '800' },
    empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 50, fontSize: 16 }
});

export default ScoreHistoryScreen;