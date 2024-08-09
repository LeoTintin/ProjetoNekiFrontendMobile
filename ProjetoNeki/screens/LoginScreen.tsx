import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,TouchableOpacity,ImageBackground } from 'react-native';
// import {CheckBox} from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from './style';

const LoginScreen = ({ navigation }: any) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // Call your login endpoint here
    if (login && password) {
      // Assuming login is successful
      if (rememberMe) {
        await AsyncStorage.setItem('login', login);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('login');
        await AsyncStorage.removeItem('password');
      }
      navigation.navigate('Home');
    } else {
      Alert.alert('Error', 'Insira login e senha');
    }
  };

  const handleRememberMeChange = async () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      await AsyncStorage.setItem('login', login);
      await AsyncStorage.setItem('password', password);
    } else {
      await AsyncStorage.removeItem('login');
      await AsyncStorage.removeItem('password');
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
      <TouchableOpacity style={styled.Button} onPress={() => setShowPassword(!showPassword)}><Text style={styled.Text}>{showPassword ? 'Ocultar senha' : 'Mostrar senha'}</Text></TouchableOpacity>
      
      {/* <View>
        <CheckBox value={rememberMe} onValueChange={handleRememberMeChange} />
        <Text>Remember Me</Text>
      </View> */}
      <TouchableOpacity style={styled.Button} onPress={handleLogin}><Text style={styled.Text}>Login</Text></TouchableOpacity>
      <TouchableOpacity style={styled.Button} onPress={() => navigation.navigate('SignUp')}><Text style={styled.Text} >Cadastre-se</Text></TouchableOpacity>
    </View>
  );
};


export default LoginScreen;
