import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Dữ liệu dự phòng trường hợp bạn chưa kịp tạo đề thi trên Firestore collection 'exams'
const FALLBACK_QUESTIONS = [
    { id: 1, text: 'What is the result of 5 + 5 + "5" in Java?', options: ['105', '555', 'Compilation Error', '15'], correctAnswer: '105' },
    { id: 2, text: 'Which of the following is NOT a data structure?', options: ['Array', 'LinkedList', 'For Loop', 'Tree'], correctAnswer: 'For Loop' },
    { id: 3, text: 'What is the time complexity of Binary Search?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(log n)'], correctAnswer: 'O(log n)' },
    { id: 4, text: 'Which keyword is used to inherit a class in Java?', options: ['implements', 'extends', 'inherit', 'super'], correctAnswer: 'extends' },
    { id: 5, text: 'What does API stand for?', options: ['Application Programming Interface', 'Android Programming Interface', 'Automated Program Integration', 'Application Process Integration'], correctAnswer: 'Application Programming Interface' },
    { id: 6, text: 'Which standard Java class is most efficient for modifying strings in a loop?', options: ['String', 'Scanner', 'StringBuilder', 'StringBuffer'], correctAnswer: 'StringBuilder' },
    { id: 7, text: 'Which standard class is typically used to read input from the console in Java?', options: ['BufferedReader', 'Scanner', 'System.in', 'ConsoleReader'], correctAnswer: 'Scanner' },
    { id: 8, text: 'What algorithm technique is often used to optimize range sum queries in an array?', options: ['Prefix Sum', 'Binary Search', 'Bubble Sort', 'Backtracking'], correctAnswer: 'Prefix Sum' },
    { id: 9, text: 'In React Native, which component is recommended for rendering long, scrollable lists efficiently?', options: ['ScrollView', 'ListView', 'FlatList', 'SectionList'], correctAnswer: 'FlatList' },
    { id: 10, text: 'Which of the following is NOT a primitive data type in Java?', options: ['int', 'boolean', 'String', 'char'], correctAnswer: 'String' },
];

const QuizExecutionScreen = ({ route, navigation }) => {
    const { testTitle } = route.params;
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300); // 300 giây = 5 phút
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const snapshot = await firestore().collection('exams').where('title', '==', testTitle).get();
                if (!snapshot.empty) {
                    const examData = snapshot.docs[0].data();
                    setQuestions(examData.questions || FALLBACK_QUESTIONS);
                    setTimeLeft(examData.duration || 300);
                } else {
                    setQuestions(FALLBACK_QUESTIONS); // Dùng dự phòng nếu Firestore trống
                }
            } catch (error) {
                setQuestions(FALLBACK_QUESTIONS);
            }
            setLoading(false);
        };
        fetchQuestions();
    }, [testTitle]);

    useEffect(() => {
        if (loading || submitting) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, loading, submitting]);

    const handleSelectOption = (option) => {
        setUserAnswers({ ...userAnswers, [currentIndex]: option });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        let correctCount = 0;

        questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const totalQuestions = questions.length;
        const score = (correctCount / totalQuestions) * 10;
        const user = auth().currentUser;

        if (user) {
            try {
                await firestore().collection('exam_results').add({
                    studentEmail: user.email,
                    studentUid: user.uid,
                    testTitle: testTitle,
                    score: score,
                    correctAnswers: correctCount,
                    totalQuestions: totalQuestions,
                    submittedAt: firestore.FieldValue.serverTimestamp(),
                    userAnswers: userAnswers
                });
            } catch (error) {
                console.log('Save Error:', error);
            }
        }

        // Điều hướng sang trang Kết quả an toàn với đầy đủ tham số đã sửa đổi
        navigation.replace('QuizResult', {
            score,
            correctAnswers: correctCount,
            totalQuestions,
            testTitle,
            userAnswers,
            questions
        });
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;

    const currentQ = questions[currentIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progress}>Question {currentIndex + 1}/{questions.length}</Text>
                <Text style={styles.timer}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
            </View>

            <Text style={styles.questionText}>{currentQ.text}</Text>

            {currentQ.options.map((option, index) => {
                const isSelected = userAnswers[currentIndex] === option;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, isSelected && styles.selectedOption]}
                        onPress={() => handleSelectOption(option)}
                    >
                        <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{option}</Text>
                    </TouchableOpacity>
                );
            })}

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
                    onPress={() => setCurrentIndex(prev => prev - 1)}
                    disabled={currentIndex === 0}
                >
                    <Text style={styles.navText}>Previous</Text>
                </TouchableOpacity>

                {currentIndex === questions.length - 1 ? (
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={submitting}>
                        {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>Submit</Text>}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navButton} onPress={() => setCurrentIndex(prev => prev + 1)}>
                        <Text style={styles.navText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20, paddingTop: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    progress: { fontSize: 18, fontWeight: '700', color: '#6B7280' },
    timer: { fontSize: 18, fontWeight: '800', color: '#EF4444' },
    questionText: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 30, lineHeight: 30 },
    optionButton: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E5E7EB' },
    selectedOption: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
    optionText: { fontSize: 16, color: '#374151', fontWeight: '500' },
    selectedOptionText: { color: '#4F46E5', fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20 },
    navButton: { backgroundColor: '#E5E7EB', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
    disabledButton: { opacity: 0.5 },
    navText: { fontSize: 16, fontWeight: '700', color: '#374151' },
    submitButton: { backgroundColor: '#10B981', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
    submitText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' }
});

export default QuizExecutionScreen;