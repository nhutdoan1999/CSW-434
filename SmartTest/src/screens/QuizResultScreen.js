import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizResultScreen = ({ route, navigation }) => {
    const { score, correctAnswers, totalQuestions, testTitle, userAnswers, questions } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Exam Completed!</Text>
            <Text style={styles.subtitle}>{testTitle}</Text>

            <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
                <Text style={styles.maxScoreText}>/ 10.0</Text>
            </View>

            <Text style={styles.statsText}>Correct Answers: {correctAnswers} / {totalQuestions}</Text>

            <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigation.navigate('ReviewAnswers', { userAnswers, questions, testTitle })}
            >
                <Text style={styles.reviewButtonText}>Review Answers</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.replace('Home')}
            >
                <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#6B7280', marginBottom: 40, textAlign: 'center' },
    scoreCircle: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, marginBottom: 30, borderWidth: 8, borderColor: '#EEF2FF' },
    scoreText: { fontSize: 64, fontWeight: '900', color: '#4F46E5' },
    maxScoreText: { fontSize: 20, color: '#9CA3AF', fontWeight: '700', marginTop: -5 },
    statsText: { fontSize: 18, color: '#374151', fontWeight: '600', marginBottom: 50 },
    reviewButton: { backgroundColor: '#4F46E5', width: '100%', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
    reviewButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    homeButton: { width: '100%', padding: 18, borderRadius: 12, alignItems: 'center', backgroundColor: '#E5E7EB' },
    homeButtonText: { color: '#4B5563', fontSize: 18, fontWeight: '700' }
});

export default QuizResultScreen;