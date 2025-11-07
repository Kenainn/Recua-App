import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from "react-native";

export default function App() {
  const [pantalla, setPantalla] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

  // Simulación de usuarios
  const usuarios = {
    "alumno@recua.com": { nombre: "Kevin Flores", rol: "estudiante", password: "123456" },
    "profe@recua.com": { nombre: "Profa. Alma", rol: "profesor", password: "123456" },
  };

  // Datos simulados
  const materias = [
    { id: "1", nombre: "Matemáticas", progreso: "80%" },
    { id: "2", nombre: "Programación", progreso: "60%" },
    { id: "3", nombre: "Bases de Datos", progreso: "90%" },
  ];

  const tareas = [
    { id: "1", nombre: "Ejercicio 1", estado: "Entregado" },
    { id: "2", nombre: "Proyecto Final", estado: "Pendiente" },
    { id: "3", nombre: "Examen Parcial", estado: "Calificado" },
  ];

  const evaluaciones = [
    { id: "1", materia: "Matemáticas", calificacion: 85 },
    { id: "2", materia: "Programación", calificacion: 90 },
    { id: "3", materia: "Bases de Datos", calificacion: 95 },
  ];

  // -------- LOGIN --------
  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*]{6,20}$/;

    if (!emailRegex.test(email)) { alert("Correo inválido"); return; }
    if (!passwordRegex.test(password)) { alert("Contraseña inválida"); return; }

    if (usuarios[email] && usuarios[email].password === password) {
      setUsuario(usuarios[email]);
      setPantalla("inicio");
    } else {
      alert("Correo o contraseña incorrectos");
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setEmail("");
    setPassword("");
    setPantalla("login");
  };

  // ----------------- PANTALLAS -----------------
  if (pantalla === "login") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Recua</Text>
        <TextInput placeholder="Correo" style={styles.input} value={email} onChangeText={setEmail} />
        <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (pantalla === "inicio") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hola {usuario.nombre}</Text>
        <Text style={styles.subtitle}>Tus Materias</Text>
        <FlatList
          data={materias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => { setMateriaSeleccionada(item); setPantalla("tareas"); }}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text>Progreso: {item.progreso}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPantalla("evaluaciones")}>
          <Text style={styles.secondaryText}>Ver Evaluaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPantalla("perfil")}>
          <Text style={styles.secondaryText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}><Text style={styles.buttonText}>Cerrar Sesión</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (pantalla === "tareas") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{materiaSeleccionada.nombre}</Text>
        <Text style={styles.subtitle}>Tareas</Text>
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text>Estado: {item.estado}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPantalla("inicio")}>
          <Text style={styles.secondaryText}>Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (pantalla === "perfil") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Nombre: {usuario.nombre}</Text>
        <Text style={styles.subtitle}>Rol: {usuario.rol}</Text>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPantalla("inicio")}>
          <Text style={styles.secondaryText}>Volver al inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}><Text style={styles.buttonText}>Cerrar sesión</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (pantalla === "evaluaciones") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Evaluaciones</Text>
        <FlatList
          data={evaluaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.materia}</Text>
              <Text>Calificación: {item.calificacion}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setPantalla("inicio")}>
          <Text style={styles.secondaryText}>Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

// -------- ESTILOS --------
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#e0f2f1", padding: 20 },
  title: { fontSize: 28, fontWeight: "600", color: "#00695c", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#212121", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderRadius: 10, backgroundColor: "#fff", marginBottom: 10, borderWidth: 1, borderColor: "#80cbc4" },
  button: { backgroundColor: "#4db6ac", padding: 10, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 15, width: "100%", marginBottom: 10 },
  cardTitle: { fontWeight: "600", fontSize: 18, color: "#00695c" },
  secondaryBtn: { marginTop: 10 },
  secondaryText: { color: "#00695c", fontWeight: "500" },
});
