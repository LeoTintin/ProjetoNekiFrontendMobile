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
  TextInput,
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
  const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false); // Novo estado para o modal de descrição
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
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) throw new Error('Erro ao carregar skills');
          const data = await response.json();
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
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar habilidades disponíveis: ${response.statusText}`);
        }

        const data = await response.json();
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

  const handleOpenDescriptionModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowDescriptionModal(true);
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
              <TouchableOpacity onPress={() => handleOpenDescriptionModal(skill)}>
                <Image source={{ uri: skill.imagemUrl }} style={styles.image} />
              </TouchableOpacity>
              <Text style={styled.Text2}>{skill.nome}</Text>
              <TouchableOpacity style={styled.Button} onPress={() => handleOpenLevelModal(skill.id, skill.level || '')}>
                <Text style={styled.Text2}>{skill.level || 'Definir nível'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styled.Button3} onPress={() => handleDeleteSkill(skill.id)}>
                <Text style={styled.Text}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styled.Button2} onPress={handleOpenModal}>
          <Text style={styled.Text}>Adicionar Skill</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Descrição */}
      <Modal
        visible={showDescriptionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedSkill && (
              <>
                <Text style={styles.modalTitle}>{selectedSkill.nome}</Text>
                <Text style={styled.Text2}>{selectedSkill.descricao}</Text>
                <TouchableOpacity style={styled.Button2} onPress={() => setShowDescriptionModal(false)}>
                  <Text style={styled.Text}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para Adicionar Skill */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Skill</Text>
            <ScrollView>
              {availableSkills.map(skill => (
                <TouchableOpacity 
                  key={skill.id}
                  style={styles.modalButton}
                  onPress={() => setSelectedOption(skill.id)}
                >
                  <Text style={styled.Text2}>{skill.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styled.Button2} onPress={handleSaveSkill}>
              <Text style={styles.modalButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styled.Button2} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para Editar Nível */}
      <Modal visible={showLevelModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Alterar Nível</Text>
              <TouchableOpacity style={styled.Button} onPress={() => handleLevelChange('INICIANTE')}>
                <Text style={styled.Text2}>Iniciante</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styled.Button} onPress={() => handleLevelChange('INTERMEDIARIO')}>
                <Text style={styled.Text2}>Intermediário</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styled.Button} onPress={() => handleLevelChange('AVANCADO')}>
                <Text style={styled.Text2}>Avançado</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styled.Button2} onPress={() => setShowLevelModal(false)}>
                <Text style={styled.Text}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#fff"
  },
  skillset: {
    width: '80%',
    backgroundColor:  "#D3D3D3",
    borderRadius:23
  },
  skill: {
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    width:330,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginVertical: 5,
    alignItems:'center'
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
