import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

export default function HomeScreen({ navigation, route }) {
  const { usuario } = route.params;

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Hola, {usuario} 👋</Text>
      <Text style={estilos.subtitulo}>Tu Yak sigue motivado 🐃</Text>

      <View style={estilos.botones}>
        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('Tareas')}>
          <Text style={estilos.textoBoton}>Ver Tareas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('Materias')}>
          <Text style={estilos.textoBoton}>Ver Materias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.boton} onPress={() => navigation.navigate('Perfil', { usuario })}>
          <Text style={estilos.textoBoton}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  titulo: { fontSize: 24, fontWeight: 'bold', color: colors.secondary },
  subtitulo: { fontSize: 16, color: colors.text, marginBottom: 30 },
  botones: { width: '80%' },
  boton: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  textoBoton: { color: '#fff', fontWeight: 'bold' }
});
