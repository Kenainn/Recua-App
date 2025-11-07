import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([{ name: 'Matemáticas' }, { name: 'Química' }, { name: 'Programación' }]);
  const [newSubject, setNewSubject] = useState('');

  const addSubject = () => {
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñ\s]{3,20}$/.test(newSubject)) return alert('Nombre inválido');
    setSubjects([...subjects, { name: newSubject }]);
    setNewSubject('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Materias</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <View style={styles.card}><Text style={styles.cardText}>{item.name}</Text></View>}
      />
      <TextInput style={styles.input} placeholder="Agregar materia..." value={newSubject} onChangeText={setNewSubject} />
      <TouchableOpacity style={styles.btn} onPress={addSubject}>
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
