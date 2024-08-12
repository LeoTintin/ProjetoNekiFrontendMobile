import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import { styled } from './style';

const SignUpScreen = ({ navigation }: any) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (password === confirmPassword) {
      try {
        const response = await fetch('http://10.0.2.2:8080/auth/cadastro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: login,
            password: password,
            role: 'ADMIN',
          }),
        });

        if (response.ok) {
          Alert.alert('Success', 'Cadastro realizado!');
          navigation.navigate('Login');
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Erro ao cadastrar');
        }
      } catch (error) {
        Alert.alert('Error', 'Erro na conexão com o servidor');
      }
    } else {
      Alert.alert('Error', 'Senhas não conferem');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://t3.ftcdn.net/jpg/01/09/93/84/360_F_109938452_lyfzlslq2nDMMxmnxVZUIsD2UujLKsbw.jpg' }}
      style={styles.backgroundImage}
    >
      <Text style={styles.title}>Cadastro</Text>
      <View style={styles.container}>
        <TextInput
          style={styled.Input}
          placeholder="Login"
          placeholderTextColor="#fff" // Cor do placeholder
          value={login}
          onChangeText={setLogin}
        />
        <TextInput
          style={styled.Input}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          placeholderTextColor="#fff" // Cor do placeholder
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styled.Input}
          placeholder="Confirmar senha"
          secureTextEntry={!showPassword}
          placeholderTextColor="#fff" // Cor do placeholder
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styled.Button2}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styled.Text}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styled.Button2} onPress={handleSignUp}>
          <Text style={styled.Text}>Cadastrar</Text>
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
    borderColor: "#fff",
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#fff"
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  }
});

export default SignUpScreen;
