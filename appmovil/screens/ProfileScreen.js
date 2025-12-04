import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../colors/style';

export default function ProfileScreen({ navigation, user, onLogout }) {
  const stats = [
    { label: 'Racha Actual', value: '5 días', icon: '🔥' },
    { label: 'Mejor Racha', value: '12 días', icon: '🏆' },
    { label: 'Materias Activas', value: '3', icon: '📚' },
    { label: 'Tareas Completadas', value: '8', icon: '✅' },
    { label: 'Nivel Yak', value: '3', icon: '🦌' },
    { label: 'Experiencia', value: '150 / 200', icon: '⭐' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header del perfil */}
        <View style={[styles.profileHeader, commonStyles.shadow]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.nombre?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.nombre || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || 'usuario@recua.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.rol || 'Estudiante'}</Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Mis Estadísticas</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, commonStyles.shadow]}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Opciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configuración</Text>

          <TouchableOpacity style={[styles.optionButton, commonStyles.shadow]}>
            <Text style={styles.optionIcon}>🔔</Text>
            <Text style={styles.optionText}>Notificaciones</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionButton, commonStyles.shadow]}>
            <Text style={styles.optionIcon}>🎨</Text>
            <Text style={styles.optionText}>Tema</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionButton, commonStyles.shadow]}>
            <Text style={styles.optionIcon}>ℹ️</Text>
            <Text style={styles.optionText}>Acerca de</Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          style={[styles.logoutButton, commonStyles.shadow]}
          onPress={onLogout}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
  profileHeader: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  optionArrow: {
    fontSize: 24,
    color: colors.gray,
  },
  logoutButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  logoutText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
