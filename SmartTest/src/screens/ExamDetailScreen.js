import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ExamDetailScreen = ({ route, navigation }) => {
    const { testTitle } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{testTitle}</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Questions:</Text>
                    <Text style={styles.value}>10</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Duration:</Text>
                    <Text style={styles.value}>5 Minutes</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Format:</Text>
                    <Text style={styles.value}>Multiple Choice</Text>
                </View>

                <Text style={styles.warning}>
                    * Once started, the timer cannot be paused. Make sure you have a stable internet connection.
                </Text>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.replace('QuizExecution', { testTitle })}
                >
                    <Text style={styles.startButtonText}>Start Exam</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, elevation: 3 },
    title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 20, textAlign: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6' },
    label: { fontSize: 16, color: '#6B7280', fontWeight: '600' },
    value: { fontSize: 16, color: '#111827', fontWeight: '700' },
    warning: { color: '#EF4444', marginTop: 20, marginBottom: 30, fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
    startButton: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
    startButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    cancelButton: { padding: 16, alignItems: 'center' },
    cancelButtonText: { color: '#6B7280', fontSize: 16, fontWeight: '600' }
});

export default ExamDetailScreen;