import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { colors } from './colors/style';

// Importar pantallas
import HomeScreen from './screens/homeScreen';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';
import Sidebar from './componentes/Sidebar';

// Pantalla de Login simplificada
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { View: RNView, Text: RNText, TextInput, TouchableOpacity: RNTouchableOpacity, StyleSheet: RNStyleSheet, SafeAreaView } = require('react-native');

  const handleLogin = () => {
    const usuarios = {
      'alumno@recua.com': { nombre: 'Kevin Flores', email: 'alumno@recua.com', rol: 'estudiante', password: '123456' },
      'profe@recua.com': { nombre: 'Profa. Alma', email: 'profe@recua.com', rol: 'profesor', password: '123456' },
    };

    if (usuarios[email] && usuarios[email].password === password) {
      onLogin(usuarios[email]);
    } else {
      alert('Correo o contraseña incorrectos\nUsa: alumno@recua.com / 123456');
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <RNView style={loginStyles.content}>
        <RNView style={loginStyles.logoContainer}>
          <RNView style={loginStyles.logo}>
            <RNText style={loginStyles.logoText}>R</RNText>
          </RNView>
        </RNView>

        <RNText style={loginStyles.title}>Recua</RNText>
        <RNText style={loginStyles.subtitle}>Inicia sesión para continuar</RNText>

        <RNView style={loginStyles.form}>
          <TextInput
            style={loginStyles.input}
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.gray}
          />

          <TextInput
            style={loginStyles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.gray}
          />

          <RNTouchableOpacity style={loginStyles.button} onPress={handleLogin}>
            <RNText style={loginStyles.buttonText}>Iniciar Sesión</RNText>
          </RNTouchableOpacity>
        </RNView>

        <RNText style={loginStyles.footer}>
          Usa: alumno@recua.com / 123456
        </RNText>
      </RNView>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 32,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
});

const Drawer = createDrawerNavigator();

// Componente personalizado para el drawer
function CustomDrawerContent(props) {
  return (
    <Sidebar
      navigation={props.navigation}
      onClose={() => props.navigation.closeDrawer()}
      userName={props.user?.nombre}
      userEmail={props.user?.email}
      onLogout={props.onLogout}
    />
  );
}

// Wrapper para las pantallas con el header personalizado
function ScreenWrapper({ children, navigation, title }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      {children}
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent {...props} user={user} onLogout={handleLogout} />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="Home">
          {(props) => (
            <ScreenWrapper navigation={props.navigation} title="Inicio">
              <HomeScreen {...props} user={user} />
            </ScreenWrapper>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Tasks">
          {(props) => (
            <ScreenWrapper navigation={props.navigation} title="Tareas">
              <TasksScreen {...props} />
            </ScreenWrapper>
          )}
        </Drawer.Screen>

        <Drawer.Screen name="Profile">
          {(props) => (
            <ScreenWrapper navigation={props.navigation} title="Perfil">
              <ProfileScreen {...props} user={user} onLogout={handleLogout} />
            </ScreenWrapper>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
});
