import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from './style';

const LoginScreen = ({ navigation }: any) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (login && password) {
      console.log('Login attempt:', login, password); // Log para depuração

      try {
        const response = await fetch('http://10.0.2.2:8080/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: login,
            password: password,
          }),
        });

        console.log('Response status:', response.status); // Log para depuração

        if (response.ok) {
          const responseData = await response.json();
          const { token } = responseData; // Certifique-se de que o token está sendo retornado

          if (rememberMe) {
            await AsyncStorage.setItem('login', login);
            await AsyncStorage.setItem('password', password);
          } else {
            await AsyncStorage.removeItem('login');
            await AsyncStorage.removeItem('password');
          }
          
          // Armazena o token no AsyncStorage
          await AsyncStorage.setItem('token', token);

          console.log('Login successful, navigating to Home'); // Log para depuração
          navigation.navigate('Home');
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Login falhou');
        }
      } catch (error) {
        console.error('Error during login:', error); // Log para depuração
        Alert.alert('Error', 'Erro na conexão com o servidor');
      }
    } else {
      Alert.alert('Error', 'Insira login e senha');
    }
  };

  const handleRememberMeChange = async () => {
    setRememberMe(!rememberMe);
    if (rememberMe) {
      await AsyncStorage.removeItem('login');
      await AsyncStorage.removeItem('password');
    } else {
      await AsyncStorage.setItem('login', login);
      await AsyncStorage.setItem('password', password);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://t3.ftcdn.net/jpg/01/09/93/84/360_F_109938452_lyfzlslq2nDMMxmnxVZUIsD2UujLKsbw.jpg' }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TextInput
          style={styled.Input}
          placeholder="Login"
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styled.Input}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styled.Button2} onPress={() => setShowPassword(!showPassword)}>
          <Text style={styled.Text}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styled.Button2} onPress={handleLogin}>
          <Text style={styled.Text}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styled.Button2} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styled.Text}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adiciona um fundo branco semi-transparente para o conteúdo
    borderColor:"#fff",
    borderWidth:1,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginScreen;
