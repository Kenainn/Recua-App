import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([{ title: 'Tarea 1 - Química', done: false }]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return alert('Escribe una tarea');
    setTasks([...tasks, { title: newTask, done: false }]);
    setNewTask('');
  };

  const toggleDone = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.card, item.done && { backgroundColor: '#80cbc4' }]} onPress={() => toggleDone(index)}>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput style={styles.input} placeholder="Agregar tarea..." value={newTask} onChangeText={setNewTask} />
      <TouchableOpacity style={styles.btn} onPress={addTask}>
        <Text style={styles.btnText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e0f2f1' },
  title: { fontSize: 24, color: '#00695c', fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#4db6ac', padding: 15, borderRadius: 10, marginVertical: 5 },
  cardText: { color: '#fff', fontSize: 16 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginTop: 20 },
  btn: { backgroundColor: '#00695c', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
