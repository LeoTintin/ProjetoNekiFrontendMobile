import React, { useState } from 'react';
import { View, Text, TextInput, Button,TouchableOpacity, Alert,Image } from 'react-native';
import { styled } from './style';

const SignUpScreen = ({ navigation }: any) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (password === confirmPassword) {
      // Call your sign-up endpoint here
      Alert.alert('Success', 'Cadastro realizado!');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error', 'Senhas não conferem');
    }
  };

  return (
    
    <View style={styled.container}>
      <TextInput style={styled.Input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput style={styled.Input}
        placeholder="Senha"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput style={styled.Input}   
        placeholder="Confirmar senha"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styled.Button} 
        onPress={() => setShowPassword(!showPassword)}
      ><Text style={styled.Text} >{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text></TouchableOpacity>
      <TouchableOpacity style={styled.Button} onPress={handleSignUp}><Text style={styled.Text} >Cadastrar</Text></TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
