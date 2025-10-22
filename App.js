import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [logueado, setLogueado] = useState(false);

  const iniciarSesion = () => {
    if (usuario === 'admin' && contrasena === '1234') {
      setLogueado(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

if (logueado) {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={[estilos.cajaLogin, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00695c' }}>¡Bienvenido, {usuario}!</Text>
        <Text style={{ marginTop: 10, fontSize: 16 }}>Esta es la página de tu app</Text>

        {/* Botón para regresar al login */}
        <TouchableOpacity
          style={[estilos.botonLogin, { backgroundColor: '#4db6ac', marginTop: 20, width: '60%' }]}
          onPress={() => setLogueado(false)}
        >
          <Text style={[estilos.textoLogin, { color: '#fff' }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


  return (
    <SafeAreaView style={estilos.contenedor}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={estilos.cajaLogin}>

          {/* MITAD SUPERIOR */}
          <View style={estilos.seccionSuperior}>
            <Image
              source={{ uri: 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' }}
              style={estilos.logo}
            />
            <Text style={estilos.titulo}>Bienvenido a Recua App</Text>
            <Text style={estilos.subtitulo}>Inicia sesión para continuar</Text>
          </View>

          {/* MITAD INFERIOR */}
          <View style={estilos.seccionInferior}>

            {/* Botón Google con fondo */}
            <TouchableOpacity style={estilos.botonGoogle}>
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                style={estilos.iconoGoogle}
              />
              <Text style={estilos.textoGoogle}>Continuar con Google</Text>
            </TouchableOpacity>

            {/* Separador barra o barra */}
            <View style={estilos.separador}>
              <View style={estilos.linea} />
              <Text style={estilos.textoSeparador}>o</Text>
              <View style={estilos.linea} />
            </View>

            {/* Campos de login sin etiquetas */}
            <TextInput
              style={estilos.campoInput}
              placeholder="Usuario"
              value={usuario}
              onChangeText={setUsuario}
              placeholderTextColor="#757575"
            />

            <TextInput
              style={estilos.campoInput}
              placeholder="Contraseña"
              secureTextEntry
              value={contrasena}
              onChangeText={setContrasena}
              placeholderTextColor="#757575"
            />

            {/* Botón de iniciar sesión */}
            <TouchableOpacity style={estilos.botonLogin} onPress={iniciarSesion}>
              <Text style={estilos.textoLogin}>Iniciar sesión</Text>
            </TouchableOpacity>

            {/* Enlaces inferiores */}
            <TouchableOpacity>
              <Text style={estilos.textoOlvido}>¿Has olvidado tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={estilos.textoRegistro}>¿Necesitas una cuenta? <Text style={estilos.linkRegistro}>Regístrate</Text></Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  cajaLogin: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  seccionSuperior: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitulo: {
    fontSize: 14,
    color: '#4a2a0eff',
  },
  seccionInferior: {
    marginTop: 10,
  },
  botonGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#919191ff',
    borderRadius: 12,
    width: '100%',
    paddingVertical: 10,
    marginBottom: 15,
  },
  iconoGoogle: {
    width: 20,
    height: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  textoGoogle: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  textoSeparador: {
    fontSize: 16,
    color: '#777',
  },
  campoInput: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  botonLogin: {
    backgroundColor: '#212121',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoLogin: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textoOlvido: {
    textAlign: 'center',
    color: '#00695c',
    marginTop: 10,
    fontSize: 13,
  },
  textoRegistro: {
    textAlign: 'center',
    marginTop: 5,
    color: '#212121',
    fontSize: 13,
  },
  linkRegistro: {
    color: '#4db6ac',
    fontWeight: '600',
  },
});
