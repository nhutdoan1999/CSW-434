import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ReviewAnswersScreen = ({ route, navigation }) => {
    const { userAnswers, questions, testTitle } = route.params;

    const renderItem = ({ item, index }) => {
        const userAnswer = userAnswers[index];
        const isSkipped = !userAnswer;

        return (
            <View style={styles.card}>
                <Text style={styles.questionText}>Q{index + 1}: {item.text}</Text>

                {item.options.map((option, i) => {
                    let bgColor = '#F9FAFB';
                    let textColor = '#374151';
                    let borderColor = '#E5E7EB';

                    if (option === item.correctAnswer) {
                        bgColor = '#D1FAE5'; textColor = '#065F46'; borderColor = '#34D399';
                    } else if (option === userAnswer && option !== item.correctAnswer) {
                        bgColor = '#FEE2E2'; textColor = '#991B1B'; borderColor = '#F87171';
                    }

                    return (
                        <View key={i} style={[styles.optionBox, { backgroundColor: bgColor, borderColor }]}>
                            <Text style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>{option}</Text>
                        </View>
                    );
                })}

                {isSkipped && <Text style={styles.skippedText}>You skipped this question.</Text>}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Review Answers</Text>
                <Text style={styles.subTitle}>{testTitle}</Text>
            </View>

            <FlatList
                data={questions}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Close Review</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { backgroundColor: '#4F46E5', padding: 20, paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
    subTitle: { fontSize: 16, color: '#E0E7FF', marginTop: 5 },
    card: { backgroundColor: '#FFFFFF', padding: 20, marginHorizontal: 20, marginTop: 20, borderRadius: 16, elevation: 2 },
    questionText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20, lineHeight: 26 },
    optionBox: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
    skippedText: { color: '#D97706', fontStyle: 'italic', marginTop: 10, fontWeight: '500' },
    footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#F3F4F6' },
    backButton: { backgroundColor: '#111827', padding: 18, borderRadius: 12, alignItems: 'center' },
    backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});

export default ReviewAnswersScreen;