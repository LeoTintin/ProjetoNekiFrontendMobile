import React, { useState } from 'react';
import { View, Text, Image, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { styled } from './style';
interface Skill {
  id: number;
  imageUrl: string;
  name: string;
  level: string;
  description: string;
}

const initialSkills: Skill[] = [
  {
    id: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1MndL-Xp1JcnqaB0YOqTp6zDjrwYyGKsPA&s',
    name: 'React',
    level: 'Iniciante',
    description: 'O React é uma biblioteca front-end JavaScript de código aberto com foco em criar interfaces de usuário em páginas web.',
  },
  {
    id: 2,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1200px-Unofficial_JavaScript_logo_2.svg.png',
    name: 'Java',
    level: 'Intermediário',
    description: 'JavaScript é uma linguagem de programação interpretada estruturada, de script em alto nível com tipagem dinâmica fraca e multiparadigma',
  },
  {
    id: 3,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUmnFYeOmmAlNV9_ZTu5cYgS2L55Q1pt9QyA&s',
    name: 'Postgres',
    level: 'Avançado',
    description: 'PostgreSQL é um sistema gerenciador de banco de dados objeto relacional, desenvolvido como projeto de código aberto.',
  }
  // Adicione mais skills conforme necessário
];

export const Home: React.FC = ({navigation}:any) => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLevelModal, setShowLevelModal] = useState<boolean>(false);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [newLevel, setNewLevel] = useState<string>('');

  const handleImageClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowModal(true);
  };

  const handleLevelClick = (id: number, currentLevel: string) => {
    setEditingSkillId(id);
    setNewLevel(currentLevel);
    setShowLevelModal(true);
  };

  const handleLevelChange = (level: string) => {
    setSkills(
      skills.map((skill) =>
        skill.id === editingSkillId ? { ...skill, level: level } : skill
      )
    );
    setShowLevelModal(false);
    setEditingSkillId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
  };

  const handleDeleteSkill = (id: number) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleAddSkill = () => {
    setShowModal(true);
  };

  const handleSaveSkill = (newSkill: Skill) => {
    setSkills([...skills, newSkill]);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <View style={styled.container}>
      <Text style={styles.title}>Skills</Text>
      <View style={styles.skillset}>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skill}>
            <TouchableOpacity onPress={() => handleImageClick(skill)}>
              <Image source={{ uri: skill.imageUrl }} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.name}>{skill.name}</Text>
            <TouchableOpacity style={styled.Button} onPress={() => handleLevelClick(skill.id, skill.level)}><Text style={styled.Text}>{`${skill.level}`}</Text></TouchableOpacity>
            <TouchableOpacity style={styled.Button} onPress={() => handleDeleteSkill(skill.id)}><Text style={styled.Text}>Excluir</Text></TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styled.Button} onPress={handleAddSkill}><Text style={styled.Text}>Adicionar Skill</Text></TouchableOpacity>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Skill</Text>
            <Text>Selecione uma skill:</Text>
            <Button title="React" onPress={() => handleSaveSkill({
              id: skills.length + 1,
              imageUrl: '',
              name: 'Nova Skill',
              level: 'Iniciante',
              description: 'Descrição da nova skill',
            })} />
            <Button title="Cancelar" onPress={handleCancel} />
          </View>
        </View>
      </Modal>

      {selectedSkill && (
        <Modal visible={showModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedSkill.name}</Text>
              <Text>{selectedSkill.description}</Text>
              <TouchableOpacity style={styled.Button2} onPress={handleCloseModal}><Text style={styled.Text}>FECHAR</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {showLevelModal && (
        <Modal visible={showLevelModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Nível</Text>
              <TouchableOpacity style={styled.Button2} onPress={() => handleLevelChange('Iniciante')}><Text style={styled.Text}>Iniciante</Text></TouchableOpacity>
              <TouchableOpacity style={styled.Button2} onPress={() => handleLevelChange('Intermediario')}><Text style={styled.Text}>Intermediario</Text></TouchableOpacity>
              <TouchableOpacity style={styled.Button2} onPress={() => handleLevelChange('Avancado')}><Text style={styled.Text}>Avançado</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity style={styled.Button} onPress={() => navigation.navigate('Login')}><Text style={styled.Text}>Log-out</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'#ddd'
  },
  skillset: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    margin: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#ddd'
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
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
export default Home