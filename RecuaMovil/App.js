import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';

// Configuración de la API - Cambia esta IP por la de tu servidor local
const API_URL = 'http://192.168.1.17:3000';

// --- COMPONENTES DE UI (Fuera de App para evitar pérdida de foco) ---

const InputField = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#999"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    style={styles.input}
  />
);

const PrimaryButton = ({ title, onPress, color = '#4CAF50', cargando }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress} disabled={cargando}>
    {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
  </TouchableOpacity>
);

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [tabActiva, setTabActiva] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Datos de la app
  const [tareasHoy, setTareasHoy] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ racha: 0, completadas: 0, activas: 0 });

  // Cargar datos cuando el usuario se loguea
  useEffect(() => {
    if (usuario) {
      cargarDatos();
    }
  }, [usuario]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resTareas, resMaterias] = await Promise.all([
        fetch(`${API_URL}/api/tareas/hoy`),
        fetch(`${API_URL}/api/materias`)
      ]);

      const dataTareas = await resTareas.json();
      const dataMaterias = await resMaterias.json();

      if (dataTareas.success) setTareasHoy(dataTareas.tareas);
      if (dataMaterias.success) {
        setMaterias(dataMaterias.materias);
        setEstadisticas(prev => ({ ...prev, activas: dataMaterias.materias.length }));
      }

      setEstadisticas(prev => ({ ...prev, racha: 5, completadas: 12 }));

    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setCargando(false);
    }
  };

  const login = async () => {
    if (!email || !password) {
      setMensaje('Por favor llena todos los campos');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'alumno' })
      });
      const data = await res.json();
      if (data.success) {
        setUsuario(data.user);
        setPantalla('main');
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const signup = async () => {
    if (!nombre || !email || !password) {
      setMensaje('Por favor llena todos los campos');
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol: 'alumno' })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('¡Registro exitoso! Inicia sesión');
        setPantalla('login');
      } else {
        setMensaje(data.message);
      }
    } catch (err) {
      setMensaje('Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  // --- PANTALLAS ---

  if (pantalla === 'login' || pantalla === 'signup') {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.authCard}>
          <Text style={styles.authTitle}>{pantalla === 'login' ? 'Bienvenido a Recua' : 'Crea tu cuenta'}</Text>
          <Text style={styles.authSubtitle}>Gestiona tus estudios de forma inteligente</Text>

          {pantalla === 'signup' && (
            <InputField placeholder="Nombre Completo" value={nombre} onChangeText={setNombre} />
          )}
          <InputField placeholder="Correo Electrónico" value={email} onChangeText={setEmail} />
          <InputField placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

          <PrimaryButton
            title={pantalla === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            onPress={pantalla === 'login' ? login : signup}
            cargando={cargando}
          />

          <TouchableOpacity onPress={() => { setPantalla(pantalla === 'login' ? 'signup' : 'login'); setMensaje(''); }}>
            <Text style={styles.switchText}>
              {pantalla === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Text>
          </TouchableOpacity>

          {mensaje ? <Text style={styles.errorText}>{mensaje}</Text> : null}
        </View>
      </SafeAreaView>
    );
  }

  // --- DASHBOARD PRINCIPAL ---

  const renderContent = () => {
    if (tabActiva === 'dashboard') {
      return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.greeting}>¡Hola, {usuario?.nombre?.split(' ')[0]}! 👋</Text>
            <Text style={styles.subGreeting}>¿Listo para seguir aprendiendo?</Text>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{estadisticas.racha}</Text>
              <Text style={styles.statLabel}>Días de Racha</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{estadisticas.completadas}</Text>
              <Text style={styles.statLabel}>Tareas</Text>
            </Card>
          </View>

          <Text style={styles.sectionTitle}>Tareas de Hoy</Text>
          {tareasHoy.length > 0 ? (
            tareasHoy.map((tarea, index) => (
              <Card key={index} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{tarea.titulo}</Text>
                  <Text style={styles.itemSub}>{tarea.materia_nombre}</Text>
                </View>
                <Text style={styles.itemTag}>Hoy</Text>
              </Card>
            ))
          ) : (
            <Text style={styles.emptyText}>No tienes tareas para hoy. ¡Buen trabajo!</Text>
          )}
        </ScrollView>
      );
    }

    if (tabActiva === 'materias') {
      return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <Text style={styles.sectionTitle}>Mis Materias</Text>
          {materias.map((materia, index) => (
            <Card key={index} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{materia.nombre}</Text>
                <Text style={styles.itemSub}>{materia.nombre_profesor || 'Sin profesor asignado'}</Text>
                <Text style={styles.itemTime}>{materia.horario}</Text>
              </View>
              <Text style={styles.itemEmoji}>📚</Text>
            </Card>
          ))}
        </ScrollView>
      );
    }

    if (tabActiva === 'perfil') {
      return (
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{usuario?.nombre?.charAt(0)}</Text>
            </View>
            <Text style={styles.profileName}>{usuario?.nombre}</Text>
            <Text style={styles.profileEmail}>{usuario?.correo}</Text>
            <Text style={styles.profileRole}>Estudiante</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => { setUsuario(null); setPantalla('login'); }}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      {renderContent()}

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTabActiva('dashboard')}>
          <Text style={[styles.tabText, tabActiva === 'dashboard' && styles.tabActive]}>🏠 Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTabActiva('materias')}>
          <Text style={[styles.tabText, tabActiva === 'materias' && styles.tabActive]}>📚 Materias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTabActiva('perfil')}>
          <Text style={[styles.tabText, tabActiva === 'perfil' && styles.tabActive]}>👤 Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Auth Styles
  authContainer: { flex: 1, backgroundColor: '#f5f7fa', justifyContent: 'center', padding: 20 },
  authCard: { backgroundColor: '#fff', padding: 30, borderRadius: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 10 },
  authTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
  authSubtitle: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f0f2f5', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, color: '#333' },
  button: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchText: { marginTop: 20, color: '#4CAF50', textAlign: 'center', fontWeight: '600' },
  errorText: { color: '#ff4444', marginTop: 15, textAlign: 'center' },

  // Main Styles
  mainContainer: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { flex: 1, padding: 20 },
  header: { marginBottom: 25, marginTop: 10 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subGreeting: { fontSize: 16, color: '#666', marginTop: 5 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { flex: 0.48, alignItems: 'center', padding: 20 },
  statEmoji: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, marginTop: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5 },
  itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemSub: { fontSize: 14, color: '#666', marginTop: 2 },
  itemTime: { fontSize: 12, color: '#4CAF50', marginTop: 4, fontWeight: '600' },
  itemTag: { backgroundColor: '#e8f5e9', color: '#4CAF50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  itemEmoji: { fontSize: 24 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20, fontSize: 15 },

  // Profile Styles
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 16, color: '#666', marginTop: 5 },
  profileRole: { fontSize: 14, color: '#4CAF50', fontWeight: 'bold', marginTop: 10, backgroundColor: '#e8f5e9', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, overflow: 'hidden' },
  logoutButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ff4444', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  logoutText: { color: '#ff4444', fontSize: 16, fontWeight: 'bold' },

  // Tab Bar Styles
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 25, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontSize: 14, color: '#999', fontWeight: '600' },
  tabActive: { color: '#4CAF50' }
});
