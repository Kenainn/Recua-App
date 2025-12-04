import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { colors, commonStyles } from '../colors/style';
import TaskCard from '../componentes/TaskCard';

export default function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    { id: '1', nombre: 'Examen APIs', materia: 'Progra Web', fecha: '29/10/2025', estado: 'pendiente', descripcion: 'Estudiar endpoints REST' },
    { id: '2', nombre: 'Proyecto Móvil', materia: 'Progra Móvil', fecha: '29/10/2025', estado: 'entregado', descripcion: 'App con React Native' },
    { id: '3', nombre: 'Problema Cisco', materia: 'Sistemas Distribuidos', fecha: '30/10/2025', estado: 'calificado', descripcion: 'Configuración de routers' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    nombre: '',
    materia: '',
    fecha: '',
    descripcion: '',
  });

  const [filter, setFilter] = useState('todas'); // todas, pendiente, entregado, calificado

  const handleAddTask = () => {
    if (!newTask.nombre || !newTask.materia || !newTask.fecha) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const task = {
      id: Date.now().toString(),
      nombre: newTask.nombre,
      materia: newTask.materia,
      fecha: newTask.fecha,
      descripcion: newTask.descripcion,
      estado: 'pendiente',
    };

    setTasks([...tasks, task]);
    setModalVisible(false);
    setNewTask({ nombre: '', materia: '', fecha: '', descripcion: '' });
  };

  const filteredTasks = filter === 'todas'
    ? tasks
    : tasks.filter(task => task.estado.toLowerCase() === filter);

  return (
    <View style={styles.container}>
      {/* Header con filtros */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tareas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {['todas', 'pendiente', 'entregado', 'calificado'].map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[
                styles.filterText,
                filter === filterOption && styles.filterTextActive
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de tareas */}
      <ScrollView style={styles.taskList} contentContainerStyle={styles.taskListContent}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onPress={() => { }} />
          ))
        ) : (
          <View style={[styles.emptyState, commonStyles.card]}>
            <Text style={styles.emptyText}>
              {filter === 'todas' ? '📝 No tienes tareas' : `No hay tareas ${filter}s`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Botón flotante para agregar tarea */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar tarea */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Tarea</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la tarea *"
              value={newTask.nombre}
              onChangeText={(text) => setNewTask({ ...newTask, nombre: text })}
              placeholderTextColor={colors.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Materia *"
              value={newTask.materia}
              onChangeText={(text) => setNewTask({ ...newTask, materia: text })}
              placeholderTextColor={colors.gray}
            />

            <TextInput
              style={styles.input}
              placeholder="Fecha (DD/MM/YYYY) *"
              value={newTask.fecha}
              onChangeText={(text) => setNewTask({ ...newTask, fecha: text })}
              placeholderTextColor={colors.gray}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              value={newTask.descripcion}
              onChangeText={(text) => setNewTask({ ...newTask, descripcion: text })}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.gray}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 16,
    paddingTop: 20,
    ...commonStyles.shadow,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.white,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    padding: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...commonStyles.shadow,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: colors.white,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
