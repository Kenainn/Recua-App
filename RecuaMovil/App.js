import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, Alert, Modal } from 'react-native';

// Configuración de la API
const API_URL = 'https://recua-app.onrender.com';

// --- COMPONENTES DE UI ---

const InputField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, multiline }) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#999"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType || 'default'}
    multiline={multiline}
    numberOfLines={multiline ? 3 : 1}
    style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
  />
);

const PrimaryButton = ({ title, onPress, color = '#4CAF50', cargando, outline }) => (
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: outline ? 'transparent' : color, borderWidth: outline ? 1 : 0, borderColor: color }
    ]}
    onPress={onPress}
    disabled={cargando}
  >
    {cargando ? <ActivityIndicator color={outline ? color : "#fff"} /> : <Text style={[styles.buttonText, { color: outline ? color : '#fff' }]}>{title}</Text>}
  </TouchableOpacity>
);

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [tabActiva, setTabActiva] = useState('dashboard');

  // Estados de sesión/usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [grupo, setGrupo] = useState('');
  const [usuario, setUsuario] = useState(null);

  // Estados de Tareas
  const [tareasHoy, setTareasHoy] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ exp: 0, nivel: 1, racha: 0, mejorRacha: 0, completadas: 0 });

  // Modal Tarea
  const [modalTareaVisible, setModalTareaVisible] = useState(false);
  const [editandoTareaId, setEditandoTareaId] = useState(null);
  const [taskForm, setTaskForm] = useState({ titulo: '', descripcion: '', materia_id: '', fecha: '', dificultad: 'medio' });

  // Otros estados
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario) cargarDatos();
  }, [usuario]);

  const cargarDatos = async () => {
    try {
      const fetchOpts = { credentials: 'include' };
      const [resTareas, resMaterias, resProgreso] = await Promise.all([
        fetch(`${API_URL}/api/tareas/hoy`, fetchOpts),
        fetch(`${API_URL}/api/materias`, fetchOpts),
        fetch(`${API_URL}/api/progreso`, fetchOpts)
      ]);

      const dataTareas = await resTareas.json();
      const dataMaterias = await resMaterias.json();
      const dataProgreso = await resProgreso.json();

      if (dataTareas.success) setTareasHoy(dataTareas.tareas);
      if (dataMaterias.success) setMaterias(dataMaterias.materias);
      if (dataProgreso.success) {
        setEstadisticas({
          exp: dataProgreso.estadisticas.exp,
          nivel: dataProgreso.estadisticas.nivel,
          racha: dataProgreso.estadisticas.racha,
          mejorRacha: dataProgreso.estadisticas.mejorRacha,
          completadas: dataProgreso.estadisticas.tareasCompletadas
        });
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const login = async () => {
    if (!email || !password) return setMensaje('Llena todos los campos');
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUsuario(data.user);
        setPantalla('main');
        setMensaje('');
      } else setMensaje(data.message);
    } catch (err) {
      setMensaje('Error de conexión');
    } finally { setCargando(false); }
  };

  const signup = async () => {
    if (!nombre || !email || !password || !matricula || !grupo) return setMensaje('Llena todos los campos');
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, password, rol: 'alumno', matricula, grupo })
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('¡Éxito! Inicia sesión');
        setPantalla('login');
      } else setMensaje(data.message);
    } catch (err) { setMensaje('Error de conexión'); } finally { setCargando(false); }
  };

  // --- LÓGICA DE TAREAS ---

  const abrirModalNuevaTarea = () => {
    setEditandoTareaId(null);
    setTaskForm({
      titulo: '',
      descripcion: '',
      materia_id: materias[0]?.id || '',
      fecha: new Date().toISOString().split('T')[0],
      dificultad: 'medio'
    });
    setModalTareaVisible(true);
  };

  const abrirModalEditarTarea = (tarea) => {
    setEditandoTareaId(tarea.id);
    setTaskForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      materia_id: tarea.materia_id,
      fecha: tarea.fecha_entrega.split('T')[0],
      dificultad: tarea.dificultad || 'medio'
    });
    setModalTareaVisible(true);
  };

  const guardarTarea = async () => {
    if (!taskForm.titulo || !taskForm.materia_id || !taskForm.fecha) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    setCargando(true);
    try {
      const method = editandoTareaId ? 'PUT' : 'POST';
      const url = editandoTareaId ? `${API_URL}/api/tareas/${editandoTareaId}` : `${API_URL}/api/tareas`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titulo: taskForm.titulo,
          descripcion: taskForm.descripcion,
          materia_id: taskForm.materia_id,
          fecha_entrega: taskForm.fecha,
          dificultad: taskForm.dificultad
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalTareaVisible(false);
        cargarDatos();
      } else Alert.alert('Error', data.message);
    } catch (err) {
      Alert.alert('Error', 'Fallo al conectar con el servidor');
    } finally { setCargando(false); }
  };

  const eliminarTarea = (id) => {
    Alert.alert('Eliminar Tarea', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/tareas/${id}`, { method: 'DELETE', credentials: 'include' });
            const data = await res.json();
            if (data.success) cargarDatos();
          } catch (err) { console.error(err); }
        }
      }
    ]);
  };

  const toggleTareaEstado = async (id, actual) => {
    try {
      const action = actual === 'completada' ? 'deshacer' : 'completar';
      const res = await fetch(`${API_URL}/api/tareas/${id}/${action}`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) cargarDatos();
    } catch (err) { console.error(err); }
  };

  // --- RENDER ---

  const TaskItem = ({ tarea }) => {
    const esCompletada = tarea.estado === 'completada';
    return (
      <Card style={[styles.itemCard, esCompletada && { opacity: 0.7, borderLeftColor: '#999' }]}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, esCompletada && { textDecorationLine: 'line-through', color: '#888' }]}>{tarea.titulo}</Text>
          <Text style={styles.itemSub}>{tarea.materia_nombre || 'Sin materia'} • {tarea.dificultad?.toUpperCase()}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => toggleTareaEstado(tarea.id, tarea.estado)} style={[styles.actionBtn, { backgroundColor: esCompletada ? '#999' : '#4CAF50' }]}>
            <Text style={styles.actionBtnText}>{esCompletada ? '↩️' : '✅'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => abrirModalEditarTarea(tarea)} style={[styles.actionBtn, { backgroundColor: '#2196F3' }]}>
            <Text style={styles.actionBtnText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminarTarea(tarea.id)} style={[styles.actionBtn, { backgroundColor: '#f44336' }]}>
            <Text style={styles.actionBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (pantalla === 'login' || pantalla === 'signup') {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>{pantalla === 'login' ? 'Bienvenido' : 'Registro'}</Text>
            {pantalla === 'signup' && (
              <>
                <InputField placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                <InputField placeholder="Matrícula" value={matricula} onChangeText={setMatricula} />
                <InputField placeholder="Grupo" value={grupo} onChangeText={setGrupo} />
              </>
            )}
            <InputField placeholder="Correo" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <InputField placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title={pantalla === 'login' ? 'Entrar' : 'Registrar'} onPress={pantalla === 'login' ? login : signup} cargando={cargando} />
            <TouchableOpacity onPress={() => setPantalla(pantalla === 'login' ? 'signup' : 'login')}>
              <Text style={styles.switchText}>{pantalla === 'login' ? '¿No tienes cuenta? Regístrate' : 'Ya tengo cuenta'}</Text>
            </TouchableOpacity>
            {mensaje ? <Text style={styles.errorText}>{mensaje}</Text> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {tabActiva === 'dashboard' && (
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>Hola, {usuario?.nombre?.split(' ')[0]} 👋</Text>
              <Text style={styles.subGreeting}>A darle con todo hoy</Text>
            </View>

            {/* Barra de Yak */}
            <View style={styles.expContainer}>
              <View style={styles.expHeader}>
                <Text style={styles.expLevel}>Nivel {estadisticas.nivel}</Text>
                <Text style={styles.expText}>{estadisticas.exp} / {estadisticas.nivel * 200} XP</Text>
              </View>
              <View style={styles.expBarBg}>
                <View style={[styles.expBarFill, { width: `${Math.min((estadisticas.exp / (estadisticas.nivel * 200)) * 100, 100)}%` }]} />
              </View>
            </View>

            <View style={styles.statsRow}>
              <Card style={styles.statCard}><Text style={styles.statEmoji}>🔥</Text><Text style={styles.statValue}>{estadisticas.racha}</Text><Text style={styles.statLabel}>Racha</Text></Card>
              <Card style={styles.statCard}><Text style={styles.statEmoji}>🏆</Text><Text style={styles.statValue}>{estadisticas.mejorRacha}</Text><Text style={styles.statLabel}>Mejor</Text></Card>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tareas de Hoy</Text>
              <TouchableOpacity onPress={abrirModalNuevaTarea} style={styles.addBtnSmall}>
                <Text style={styles.addBtnText}>+ Agregar</Text>
              </TouchableOpacity>
            </View>

            {tareasHoy.length > 0 ? tareasHoy.map(t => <TaskItem key={t.id} tarea={t} />) : (
              <Text style={styles.emptyText}>¡Todo listo por hoy!</Text>
            )}
          </>
        )}

        {tabActiva === 'materias' && (
          <>
            <Text style={styles.sectionTitle}>Mis Materias</Text>
            {materias.map(m => (
              <Card key={m.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{m.nombre}</Text>
                  <Text style={styles.itemSub}>{m.horario || 'Sin horario'}</Text>
                </View>
                <Text style={styles.emojiLarge}>📚</Text>
              </Card>
            ))}
          </>
        )}

        {tabActiva === 'perfil' && (
          <View style={styles.profileContainer}>
            <View style={styles.avatarLarge}><Text style={styles.avatarTextLarge}>{usuario?.nombre?.charAt(0)}</Text></View>
            <Text style={styles.profileName}>{usuario?.nombre}</Text>
            <Text style={styles.profileEmail}>{usuario?.correo}</Text>
            <View style={styles.profileStats}>
              <Text style={styles.pStat}>🎯 {estadisticas.completadas} Tareas</Text>
              <Text style={styles.pStat}>⭐ Nivel {estadisticas.nivel}</Text>
            </View>
            <PrimaryButton title="Cerrar Sesión" outline color="#f44336" onPress={() => { setUsuario(null); setPantalla('login'); }} />
          </View>
        )}
      </ScrollView>

      {/* MODAL TAREA */}
      <Modal visible={modalTareaVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editandoTareaId ? 'Editar Tarea' : 'Nueva Tarea'}</Text>

            <Text style={styles.label}>Materia:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15, maxHeight: 40, minHeight: 40 }}>
              {materias.map(m => (
                <TouchableOpacity key={m.id} onPress={() => setTaskForm({ ...taskForm, materia_id: m.id })} style={[styles.difBtn, { marginRight: 8, paddingHorizontal: 15, flex: 0, minWidth: 80 }, taskForm.materia_id === m.id && styles.difBtnActive]}>
                  <Text style={[styles.difBtnText, taskForm.materia_id === m.id && styles.difBtnTextActive]}>{m.nombre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <InputField placeholder="Título de la tarea" value={taskForm.titulo} onChangeText={t => setTaskForm({ ...taskForm, titulo: t })} />
            <InputField placeholder="Descripción (opcional)" multiline value={taskForm.descripcion} onChangeText={t => setTaskForm({ ...taskForm, descripcion: t })} />

            <Text style={styles.label}>Fecha de Entrega (AAAA-MM-DD):</Text>
            <InputField placeholder="YYYY-MM-DD" value={taskForm.fecha} onChangeText={t => setTaskForm({ ...taskForm, fecha: t })} />

            <Text style={styles.label}>Dificultad:</Text>
            <View style={styles.difRow}>
              {['facil', 'medio', 'dificil'].map(d => (
                <TouchableOpacity key={d} onPress={() => setTaskForm({ ...taskForm, dificultad: d })} style={[styles.difBtn, taskForm.dificultad === d && styles.difBtnActive]}>
                  <Text style={[styles.difBtnText, taskForm.dificultad === d && styles.difBtnTextActive]}>{d.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <PrimaryButton title="Cancelar" outline color="#999" onPress={() => setModalTareaVisible(false)} />
              <PrimaryButton title="Guardar" color="#4CAF50" onPress={guardarTarea} cargando={cargando} />
            </View>
          </View>
        </View>
      </Modal>

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
  // Auth
  authContainer: { flex: 1, backgroundColor: '#f5f7fa' },
  authCard: { backgroundColor: '#fff', padding: 30, margin: 20, borderRadius: 25, elevation: 10, shadowOpacity: 0.1 },
  authTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#f0f2f5', padding: 15, borderRadius: 12, marginBottom: 12, fontSize: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  switchText: { marginTop: 15, color: '#4CAF50', textAlign: 'center' },
  errorText: { color: 'red', marginTop: 10, textAlign: 'center' },

  // Dashboard
  mainContainer: { flex: 1, backgroundColor: '#fcfdfa' },
  content: { flex: 1, padding: 20 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { color: '#666' },

  expContainer: { marginBottom: 25 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  expLevel: { fontWeight: 'bold', color: '#4CAF50' },
  expText: { fontSize: 12, color: '#888' },
  expBarBg: { height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  expBarFill: { height: '100%', backgroundColor: '#4CAF50' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 0.48, alignItems: 'center', padding: 15, borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#999' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  addBtnSmall: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 10, elevation: 3, shadowOpacity: 0.05 },
  itemCard: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemSub: { fontSize: 12, color: '#777' },
  itemActions: { flexDirection: 'row', gap: 5 },
  actionBtn: { padding: 8, borderRadius: 8 },
  actionBtnText: { fontSize: 14 },

  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  emojiLarge: { fontSize: 24 },

  // Perfil
  profileContainer: { alignItems: 'center', marginTop: 20 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarTextLarge: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold' },
  profileEmail: { color: '#666', marginBottom: 15 },
  profileStats: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  pStat: { fontSize: 14, fontWeight: '600', color: '#444' },

  // Modales
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  difRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  difBtn: { flex: 0.3, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, alignItems: 'center' },
  difBtnActive: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  difBtnText: { fontSize: 10, fontWeight: 'bold', color: '#666' },
  difBtnTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },

  // Tab Bar
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', paddingBottom: 20, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 12, color: '#999' },
  tabActive: { color: '#4CAF50', fontWeight: 'bold' }
});
