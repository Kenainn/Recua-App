import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../colors/style';
import StatsCard from '../componentes/StatsCard';
import TaskCard from '../componentes/TaskCard';

export default function HomeScreen({ navigation, user }) {
  // Datos simulados
  const [stats] = useState({
    currentStreak: 5,
    bestStreak: 12,
    activeSubjects: 3,
    completedTasks: 8,
    yakLevel: 3,
    yakExp: 150,
    yakMaxExp: 200,
  });

  const [todayTasks] = useState([
    { id: '1', nombre: 'Examen APIs', materia: 'Progra Web', fecha: '29/10/2025', estado: 'pendiente' },
    { id: '2', nombre: 'Proyecto Móvil', materia: 'Progra Móvil', fecha: '29/10/2025', estado: 'entregado' },
  ]);

  const expPercentage = (stats.yakExp / stats.yakMaxExp) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Saludo */}
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Hola, {user?.nombre || 'Usuario'}! 👋</Text>
          <Text style={styles.subtitle}>¿Listo para seguir aprendiendo con Yak?</Text>
        </View>

        {/* Yak Card */}
        <View style={[styles.yakCard, commonStyles.shadow]}>
          <View style={styles.yakContainer}>
            <View style={styles.yakAvatar}>
              <Text style={styles.yakEmoji}>🦌</Text>
              <View style={styles.yakLevel}>
                <Text style={styles.yakLevelText}>{stats.yakLevel}</Text>
              </View>
            </View>
            <View style={styles.yakInfo}>
              <Text style={styles.yakTitle}>Nivel {stats.yakLevel}</Text>
              <View style={styles.expBarContainer}>
                <View style={styles.expBarBackground}>
                  <View style={[styles.expBarFill, { width: `${expPercentage}%` }]} />
                </View>
                <Text style={styles.expText}>{stats.yakExp} / {stats.yakMaxExp} exp</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Estadísticas de Racha */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="🔥"
            value={stats.currentStreak}
            label="Racha Actual"
            color={colors.orange}
          />
          <StatsCard
            icon="🏆"
            value={stats.bestStreak}
            label="Mejor Racha"
            color={colors.gold}
          />
        </View>

        {/* Estadísticas Adicionales */}
        <View style={styles.statsRow}>
          <StatsCard
            icon="📚"
            value={stats.activeSubjects}
            label="Materias Activas"
            color={colors.blue}
          />
          <StatsCard
            icon="✅"
            value={stats.completedTasks}
            label="Tareas Completadas"
            color={colors.green}
          />
        </View>

        {/* Tareas de Hoy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 Tareas de Hoy</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => navigation.navigate('Tasks')}
              />
            ))
          ) : (
            <View style={[styles.emptyState, commonStyles.card]}>
              <Text style={styles.emptyText}>🎉 No tienes tareas para hoy</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  yakCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  yakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yakAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  yakEmoji: {
    fontSize: 60,
  },
  yakLevel: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  yakLevelText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  yakInfo: {
    flex: 1,
  },
  yakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  expBarContainer: {
    width: '100%',
  },
  expBarBackground: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  expBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: colors.gray,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
});
