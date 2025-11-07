import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/profile.png')} style={styles.image} />
      <Text style={styles.name}>Kevin Flores</Text>
      <Text style={styles.role}>Estudiante</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Login')}>
        <Text style={styles.btnText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f2f1' },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#00695c' },
  role: { fontSize: 16, color: '#4db6ac', marginBottom: 40 },
  btn: { backgroundColor: '#00695c', padding: 12, borderRadius: 10, width: '60%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
