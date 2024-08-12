import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { styled } from './style';

// Define a interface para Skill
interface Skill {
  id: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  level?: string;
}

// Define a interface para o token decodificado
interface DecodedToken {
  userId: string;
}

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLevelModal, setShowLevelModal] = useState<boolean>(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [newLevel, setNewLevel] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.userId;
      }
      return null;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      if (id) {
        setUserId(id);
      } else {
        // Redireciona para a tela de Login se o token não estiver presente
        navigation.navigate('Login');
      }
    };

    fetchUserId();
  }, [navigation]);

  useEffect(() => {
    const fetchSkills = async () => {
      if (userId) {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) throw new Error('Token não encontrado');
  
          const response = await fetch(`http://10.0.2.2:8080/usuarios/skills/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Adicione o Content-Type se a API exigir
            },
          });
  
          if (!response.ok) throw new Error('Erro ao carregar skills');
          const data = await response.json();
          
          // Verifique o formato dos dados retornados
          console.log('Skills carregadas:', data);
          setSkills(data);
        } catch (error) {
          console.error('Erro ao carregar skills:', error);
          Alert.alert('Erro', 'Não foi possível carregar as skills.');
        } finally {
          setLoading(false);
        }
      }
    };
  
    const fetchAvailableSkills = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
          if (!token) throw new Error('Token não encontrado');
        const response = await fetch('http://10.0.2.2:8080/skills', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Adicione o Content-Type se a API exigir
          },
        });
    
        if (!response.ok) {
          throw new Error(`Erro ao carregar habilidades disponíveis: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        // Verifique o formato dos dados retornados
        console.log('Habilidades disponíveis carregadas:', data);
        setAvailableSkills(data);
      } catch (error) {
        console.error('Erro ao carregar habilidades disponíveis:', error);
        Alert.alert('Erro', 'Não foi possível carregar as habilidades disponíveis.');
      }
    };
    
  
    fetchSkills();
    fetchAvailableSkills();
  }, [userId]);
  

  const handleDeleteSkill = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      await fetch(`http://10.0.2.2:8080/usuarios/skills/${userId}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error('Erro ao excluir skill:', error);
      Alert.alert('Erro', 'Não foi possível excluir a skill.');
    }
  };

  const handleLevelChange = async (level: string) => {
    if (editingSkillId && userId) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');
  
        const response = await fetch(`http://10.0.2.2:8080/usuarios/skills/${userId}/${editingSkillId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            level: level,
          }),
        });
  
        if (!response.ok) throw new Error('Erro ao atualizar skill');
        const updatedSkill = await response.json();
        setSkills(prevSkills => prevSkills.map(skill =>
          skill.id === editingSkillId ? updatedSkill : skill
        ));
        setShowLevelModal(false);
      } catch (error) {
        console.error('Erro ao atualizar skill:', error);
        Alert.alert('Erro', 'Não foi possível atualizar a skill.');
      }
    }
  };
  

  const handleSaveSkill = async () => {
    if (selectedOption && userId) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');

        const response = await fetch('http://10.0.2.2:8080/usuarios/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuarioId: userId,
            skillId: selectedOption,
            level: 'INICIANTE',
          }),
        });

        if (!response.ok) throw new Error('Erro ao salvar skill');
        const newSkill = await response.json();
        setSkills(prevSkills => [...prevSkills, newSkill]);
        setShowModal(false);
      } catch (error) {
        console.error('Erro ao salvar skill:', error);
        Alert.alert('Erro', 'Não foi possível adicionar a skill.');
      }
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenLevelModal = (id: string, currentLevel: string) => {
    setEditingSkillId(id);
    setNewLevel(currentLevel);
    setShowLevelModal(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://t3.ftcdn.net/jpg/01/09/93/84/360_F_109938452_lyfzlslq2nDMMxmnxVZUIsD2UujLKsbw.jpg' }}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Skills</Text>
        <View style={styles.skillset}>
          {skills.map(skill => (
            <View key={skill.id} style={styles.skill}>
              <TouchableOpacity onPress={() => setSelectedSkill(skill)}>
                <Image source={{ uri: skill.imagemUrl }} style={styles.image} />
              </TouchableOpacity>
              <Text style={styles.name}>{skill.nome}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleOpenLevelModal(skill.id, skill.level || '')}>
                <Text style={styles.buttonText}>{skill.level || 'Definir Nível'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleDeleteSkill(skill.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
          <Text style={styles.buttonText}>Adicionar Skill</Text>
        </TouchableOpacity>

        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Skill</Text>
              <View style={styles.modalActions}>
                {availableSkills.map(skill => (
                  <TouchableOpacity style={styles.button} key={skill.id} onPress={() => { setSelectedOption(skill.id); handleSaveSkill(); }}>
                    <Text style={styles.buttonText}>{skill.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showLevelModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alterar Nível</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleLevelChange('INICIANTE')}>
                <Text style={styles.buttonText}>Iniciante</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleLevelChange('INTERMEDIARIO')}>
                <Text style={styles.buttonText}>Intermediário</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleLevelChange('AVANCADO')}>
                <Text style={styles.buttonText}>Avançado</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowLevelModal(false)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  skillset: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skill: {
    width: '48%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalActions: {
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
