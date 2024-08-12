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
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

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
const Home: React.FC = ({ navigation }: any) => {
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

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setUserId(decodedToken.userId);
        } else {
          // Redireciona para a tela de Login se o token não estiver presente
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
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
            },
          });

          if (!response.ok) throw new Error('Erro ao carregar skills');
          const data = await response.json();
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
        const response = await fetch('http://10.0.2.2:8080/skills');
        if (!response.ok) throw new Error('Erro ao carregar habilidades disponíveis');
        const data = await response.json();
        setAvailableSkills(data);
      } catch (error) {
        console.error('Erro ao carregar habilidades disponíveis:', error);
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
          body: JSON.stringify({ level }),
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
                <Button
                  key={skill.id}
                  title={skill.nome}
                  onPress={() => {
                    setSelectedOption(skill.id);
                    handleSaveSkill();
                  }}
                />
              ))}
              <Button title="Cancelar" onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>

      {selectedSkill && (
        <Modal visible={Boolean(selectedSkill)} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedSkill.nome}</Text>
              <Text>{selectedSkill.descricao}</Text>
              <TouchableOpacity style={styles.button} onPress={() => setSelectedSkill(null)}>
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showLevelModal && (
        <Modal visible={showLevelModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Nível</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLevelChange('INICIANTE')}
              >
                <Text style={styles.buttonText}>INICIANTE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLevelChange('INTERMEDIARIO')}
              >
                <Text style={styles.buttonText}>INTERMEDIÁRIO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLevelChange('AVANCADO')}
              >
                <Text style={styles.buttonText}>AVANÇADO</Text>
              </TouchableOpacity>
              <Button title="Cancelar" onPress={() => setShowLevelModal(false)} />
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={() => {
        AsyncStorage.removeItem('token');
        navigation.navigate('Login');
      }}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  skillset: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalActions: {
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Home;
