import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    <View style={styled.container}>
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
      <TouchableOpacity style={styled.Button} onPress={() => setShowPassword(!showPassword)}>
        <Text style={styled.Text}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text>
      </TouchableOpacity>
      
      {/* Uncomment this block if you want to use CheckBox */}
      {/* <View>
        <CheckBox value={rememberMe} onValueChange={handleRememberMeChange} />
        <Text>Remember Me</Text>
      </View> */}
      
      <TouchableOpacity style={styled.Button} onPress={handleLogin}>
        <Text style={styled.Text}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styled.Button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styled.Text}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
