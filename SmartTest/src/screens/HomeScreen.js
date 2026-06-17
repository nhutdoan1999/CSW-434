import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const BASE_TEST_DATA = [
    { id: '1', title: 'Mid-term Exam: OOP', status: 'Upcoming', time: '10:00 AM - Today', score: null },
    { id: '2', title: 'Quiz 3: Data Structures', status: 'Upcoming', time: 'Available', score: null },
    { id: '3', title: 'Quiz 2: Algorithms', status: 'Upcoming', time: 'Available', score: null },
    { id: '4', title: 'Quiz 4: Prefix Sum & Arrays', status: 'Upcoming', time: 'Available', score: null },
    { id: '5', title: 'Lab 5: Sliding Window Technique', status: 'Upcoming', time: 'Available', score: null },
    { id: '6', title: 'Final Exam: React Native Development', status: 'Upcoming', time: 'Available', score: null },
];

const HomeScreen = ({ navigation }) => {
    const [testData, setTestData] = useState(BASE_TEST_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) return;

        const subscriber = firestore()
            .collection('exam_results')
            .where('studentEmail', '==', user.email)
            .onSnapshot(querySnapshot => {
                const results = {};
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (!results[data.testTitle] || data.score > results[data.testTitle]) {
                        results[data.testTitle] = data.score;
                    }
                });

                const updatedData = BASE_TEST_DATA.map(item => ({
                    ...item,
                    score: results[item.title] !== undefined ? results[item.title] : null,
                    status: results[item.title] !== undefined ? 'Completed' : 'Upcoming'
                }));

                setTestData(updatedData);
                setLoading(false);
            }, error => {
                console.log('Firestore Snapshot Error: ', error);
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const renderItem = ({ item }) => {
        const isUpcoming = item.status === 'Upcoming';
        return (
            <TouchableOpacity
                style={[styles.card, isUpcoming ? styles.activeCard : styles.inactiveCard]}
                onPress={() => {
                    if (isUpcoming) {
                        navigation.navigate('ExamDetail', { testTitle: item.title });
                    } else {
                        Alert.alert(
                            'Retake Exam',
                            `You have already completed this test with a highest score of ${item.score.toFixed(1)}.\n\nDo you want to retake it?`,
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Retake',
                                    onPress: () => navigation.navigate('ExamDetail', { testTitle: item.title })
                                }
                            ]
                        );
                    }
                }}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.testTitle} numberOfLines={2}>{item.title}</Text>
                    {item.score !== null && (
                        <View style={styles.scoreBadge}>
                            <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.testTime}>{item.time}</Text>
                <View style={[styles.statusBadge, { backgroundColor: isUpcoming ? '#FEF3C7' : '#D1FAE5' }]}>
                    <Text style={[styles.testStatus, { color: isUpcoming ? '#D97706' : '#059669' }]}>
                        {item.status}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, Student!</Text>
                <Text style={styles.subGreeting}>Your exams are synced and ready.</Text>
            </View>

            <Text style={styles.sectionTitle}>Available Exams</Text>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : (
                <FlatList
                    data={testData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20 },
    header: { marginTop: 60, marginBottom: 24 },
    greeting: { fontSize: 28, fontWeight: '800', color: '#111827' },
    subGreeting: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#374151', letterSpacing: 0.5 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    activeCard: { borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
    inactiveCard: { borderLeftWidth: 4, borderLeftColor: '#10B981' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    testTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, marginRight: 10, lineHeight: 24 },
    scoreBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    scoreText: { fontSize: 16, fontWeight: '800', color: '#4F46E5' },
    testTime: { fontSize: 14, color: '#6B7280', marginBottom: 12, fontWeight: '500' },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    testStatus: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }
});

export default HomeScreen;