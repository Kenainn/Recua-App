import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Función de login
  const login = async () => {
    try {
      const res = await fetch('http://192.168.1.18:3000/login', { //conectar a su IP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'alumno' })
      });
      const data = await res.json();
      if (data.success) {
        setUsuario(data.user);
        setPantalla('index');
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      console.log(err);
      setMensaje('Error de conexión');
    }
  };

  // Función de signup
  const signup = async () => {
    try {
      const res = await fetch('http://192.168.1.18:3000/signup', { //conectar a su IP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'alumno' })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('Registro exitoso, ahora inicia sesión');
        setPantalla('login');
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      console.log(err);
      setMensaje('Error de conexión');
    }
  };

  // Pantallas
  if (pantalla === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title="Iniciar Sesión" onPress={login} />
        <Button title="Ir a Registro" onPress={() => setPantalla('signup')} />
        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
      </View>
    );
  }

  if (pantalla === 'signup') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title="Registrarse" onPress={signup} />
        <Button title="Ir a Login" onPress={() => setPantalla('login')} />
        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
      </View>
    );
  }

  if (pantalla === 'index') {
    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Text style={styles.title}>Bienvenido, {usuario.nombre}</Text>
        <Text style={styles.title}>Resumen de la semana</Text>
        <Text style={styles.title}>Tareas: {usuario.tareas}</Text>
        <Button title="Cerrar Sesión" onPress={() => { setUsuario(null); setPantalla('login'); }} />
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  mensaje: { color: 'red', marginTop: 10, textAlign: 'center' }
});
