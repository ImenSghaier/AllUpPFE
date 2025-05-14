import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOffres,
  ajouterOffre,
  modifierOffre,
  supprimerOffre,
} from '../redux/actions/offreFAction';

const OffresComponent = () => {
  const dispatch = useDispatch();
  const { offres } = useSelector((state) => state.offre);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffre, setEditingOffre] = useState(null);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    type: '',
    categorie: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const offresParPage = 10;

  useEffect(() => {
    dispatch(fetchOffres());
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ titre: '', description: '', type: '', categorie: '' });
    setEditingOffre(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (offre) => {
    setForm(offre);
    setEditingOffre(offre);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (editingOffre) {
      dispatch(modifierOffre(editingOffre._id, form));
    } else {
      dispatch(ajouterOffre(form));
    }
    setModalVisible(false);
    resetForm();
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmation', 'Supprimer cette offre ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => dispatch(supprimerOffre(id)) },
    ]);
  };

  const offresAffichees = offres.slice(
    (currentPage - 1) * offresParPage,
    currentPage * offresParPage
  );

  const totalPages = Math.ceil(offres.length / offresParPage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Offres</Text>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Ajouter une offre</Text>
      </TouchableOpacity>

      <FlatList
        data={offresAffichees}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.offreCard}>
            <Text style={styles.offreTitle}>{item.titre}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.offreInfo}>{item.type} - {item.categorie}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
                <Text style={styles.btnText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                <Text style={styles.btnText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((p) => p - 1)}
        >
          <Text style={styles.pageBtn}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>
          Page {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((p) => p + 1)}
        >
          <Text style={styles.pageBtn}>➡️</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingOffre ? 'Modifier Offre' : 'Nouvelle Offre'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={form.titre}
              onChangeText={(text) => handleInputChange('titre', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.description}
              onChangeText={(text) => handleInputChange('description', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Type (PROMOTION / RÉDUCTION)"
              value={form.type}
              onChangeText={(text) => handleInputChange('type', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Catégorie"
              value={form.categorie}
              onChangeText={(text) => handleInputChange('categorie', text)}
            />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={handleSubmit}>
                <Text style={styles.btnText}>{editingOffre ? 'Modifier' : 'Ajouter'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OffresComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  offreCard: {
    backgroundColor: 'white',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  offreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  offreInfo: {
    color: 'gray',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    alignItems: 'center',
  },
  pageBtn: {
    fontSize: 20,
    paddingHorizontal: 12,
    color: '#2980b9',
  },
  pageNumber: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000099',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 24,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    borderColor: '#ccc',
    padding: 8,
  },
});
