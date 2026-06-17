import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TaskManagerScreen = () => {
    const [tasks, setTasks] = useState([]);

    const [taskId, setTaskId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        const subscriber = firestore()
            .collection('tasks')
            .onSnapshot(querySnapshot => {
                const taskList = [];
                querySnapshot.forEach(doc => {
                    taskList.push({ id: doc.id, ...doc.data() });
                });
                setTasks(taskList);
            }, error => {
                console.error("Lỗi khi tải dữ liệu: ", error);
            });

        return () => subscriber();
    }, []);

    const handleClear = () => {
        setTaskId(null);
        setTitle('');
        setDescription('');
        setPriority('');
        setDueDate('');
    };

    const handleAddOrUpdate = async () => {
        if (!title || !description || !priority || !dueDate) {
            Alert.alert('Error', 'Please fill in all fields!');
            return;
        }

        const taskData = {
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate
        };

        try {
            if (taskId) {
                await firestore().collection('tasks').doc(taskId).update(taskData);
            } else {
                await firestore().collection('tasks').add(taskData);
            }
            handleClear();
        } catch (error) {
            Alert.alert('Error', 'Something went wrong: ' + error.message);
        }
    };

    const handleEdit = (item) => {
        setTaskId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setPriority(item.priority);
        setDueDate(item.dueDate);
    };

    const handleDelete = async (id) => {
        try {
            await firestore().collection('tasks').doc(id).delete();
        } catch (error) {
            Alert.alert('Error', 'Could not delete task: ' + error.message);
        }
    };

    const renderTaskItem = ({ item }) => (
        <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskText}>Description: {item.description}</Text>
            <Text style={styles.taskText}>Priority: {item.priority}</Text>
            <Text style={styles.taskText}>Due Date: {item.dueDate}</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.buttonText}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.buttonText}>DELETE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Task Management</Text>

            {/* KHU VỰC FORM THÊM/SỬA TASK */}
            <View style={styles.formContainer}>
                <Text style={styles.formHeader}>Add Task</Text>
                <TextInput
                    style={styles.input} placeholder="Title"
                    value={title} onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input} placeholder="Description"
                    value={description} onChangeText={setDescription}
                />
                <TextInput
                    style={styles.input} placeholder="Priority"
                    value={priority} onChangeText={setPriority}
                />
                <TextInput
                    style={styles.input} placeholder="Due Date"
                    value={dueDate} onChangeText={setDueDate}
                />

                <View style={styles.formActionRow}>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
                        {/* Đổi tên nút thành UPDATE nếu đang ở chế độ sửa */}
                        <Text style={styles.buttonText}>{taskId ? 'UPDATE' : 'ADD'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                        <Text style={styles.buttonText}>CLEAR</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.listHeader}>Task List</Text>

            {/* KHU VỰC HIỂN THỊ DANH SÁCH (FlatList) */}
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={renderTaskItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF', paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },

    formContainer: { borderWidth: 1, borderColor: '#A0A0A0', padding: 15, marginBottom: 20 },
    formHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    input: { borderWidth: 1, borderColor: '#A0A0A0', padding: 10, marginBottom: 10 },
    formActionRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 5 },

    addButton: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 2 },
    clearButton: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 2 },

    listHeader: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },

    taskCard: { borderWidth: 1, borderColor: '#A0A0A0', padding: 15, marginBottom: 15 },
    taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 5 },
    taskText: { fontSize: 14, color: '#000', marginBottom: 2 },

    actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 15 },
    editButton: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 2 },
    deleteButton: { backgroundColor: '#2196F3', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 2 },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});

export default TaskManagerScreen;