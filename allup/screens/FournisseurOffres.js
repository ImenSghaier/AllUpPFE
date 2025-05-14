import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Button, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getOffres, deleteOffre, addOffre, updateOffre } from '../redux/actions/offreFAction';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { url } from '../context/functions';

const { width } = Dimensions.get('window');

const FournisseurOffres = () => {
  const dispatch = useDispatch();
  const { offres, loading, error, pagination } = useSelector(state => state.offre);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOffre, setCurrentOffre] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    type: 'REDUCTION',
    pourcentage_reduction: '0',
    date_debut: new Date(),
    date_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    categorie: 'Hotels & vacations'
  });

  const types = ['REDUCTION', 'PROMOTION'];
  const categories = [
    'Hotels & vacations',
    'Shopping',
    'Santé & bien-être',
    'Restaurant & lounge',
    'Formation & workshop',
    'Transports',
    'Événements & loisirs',
    'Culture'
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission d\'accès à la galerie refusée.');
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(getOffres());
  }, [dispatch]);

  const filteredOffres = offres.filter(offre => {
    const matchesSearch = offre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.categorie.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? offre.categorie === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate, field) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange(field, selectedDate);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.IMAGE,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const offreData = {
        ...formData,
        prix: parseFloat(formData.prix),
        pourcentage_reduction: parseFloat(formData.pourcentage_reduction),
        date_debut: formData.date_debut.toISOString(),
        date_fin: formData.date_fin.toISOString()
      };

      if (editMode && currentOffre) {
        await dispatch(updateOffre(currentOffre._id, offreData));
      } else {
        await dispatch(addOffre(offreData, imageUri));
      }

      resetForm();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette offre ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => dispatch(deleteOffre(id)) }
      ]
    );
  };

  const handleEdit = (offre) => {
    setCurrentOffre(offre);
    setEditMode(true);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      prix: offre.prix.toString(),
      type: offre.type,
      pourcentage_reduction: offre.pourcentage_reduction?.toString() || '0',
      date_debut: new Date(offre.date_debut),
      date_fin: new Date(offre.date_fin),
      categorie: offre.categorie
    });
    setImageUri(offre.image ? { uri: `${url}/uploads/${offre.image}` } : null);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      prix: '',
      type: 'REDUCTION',
      pourcentage_reduction: '0',
      date_debut: new Date(),
      date_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      categorie: 'Hotels & vacations'
    });
    setImageUri(null);
    setCurrentOffre(null);
    setEditMode(false);
  };

  const toggleCategoryFilter = () => {
    setShowCategories(!showCategories);
  };

  const selectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setShowCategories(false);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setShowCategories(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.offreCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Icon name={getCategoryIcon(item.categorie)} size={20} color="#011F5B" />
          <Text style={styles.offreCategory}>{item.categorie}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.statut === 'ACTIF' ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>{item.statut}</Text>
        </View>
      </View>
      
      {item.image && (
        <Image 
          source={{ uri: `${url}/uploads/${item.image}` }} 
          style={styles.offreImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.offreContent}>
        <Text style={styles.offreTitle}>{item.titre}</Text>
        <Text style={styles.offreDescription}>{item.description}</Text>
        
        <View style={styles.priceContainer}>
          {item.type === 'REDUCTION' ? (
            <>
              <Text style={styles.originalPrice}>{item.prix} DNT</Text>
              <Text style={styles.discountBadge}>-{item.pourcentage_reduction}%</Text>
              <Text style={styles.discountedPrice}>{item.prix_apres_reduction} DNT</Text>
            </>
          ) : (
            <Text style={styles.promoPrice}>{item.prix} DNT</Text>
          )}
        </View>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Icon name="event-available" size={16} color="#011F5B" />
            <Text style={styles.dateText}>
              {new Date(item.date_debut).toLocaleDateString()}
            </Text>
          </View>
          <Icon name="arrow-forward" size={16} color="#011F5B" marginRight={15}/>
          <View style={styles.dateItem}>
            <Icon name="event-busy" size={16} color="#011F5B" />
            <Text style={styles.dateText}>
              {new Date(item.date_fin).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEdit(item)}
        >
          <Icon name="edit" size={20} color="#FFAA00" />
          <Text style={styles.actionButtonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDelete(item._id)}
        >
          <Icon name="delete" size={20} color="#F44336" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Hotels & vacations': return 'hotel';
      case 'Shopping': return 'shopping-cart';
      case 'Santé & bien-être': return 'spa';
      case 'Restaurant & lounge': return 'restaurant';
      case 'Formation & workshop': return 'school';
      case 'Transports': return 'directions-car';
      case 'Événements & loisirs': return 'event';
      case 'Culture': return 'museum';
      default: return 'local-offer';
    }
  };

  if (loading && offres.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#011F5B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={40} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with search and add button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Offres</Text>
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#011F5B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              placeholderTextColor="#011F5B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedCategory && styles.filterButtonActive]}
          onPress={toggleCategoryFilter}
        >
          <Icon name="filter-list" size={20} color={selectedCategory ? 'white' : '#011F5B'} />
          <Text style={[styles.filterButtonText, selectedCategory && styles.filterButtonTextActive]}>
            {selectedCategory || 'Filtrer par catégorie'}
          </Text>
          {selectedCategory && (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={clearCategoryFilter}
            >
              <Icon name="close" size={16} color="white" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {showCategories && (
          <View style={styles.categoryFilterDropdown}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilterItem,
                  selectedCategory === category && styles.categoryFilterItemSelected
                ]}
                onPress={() => selectCategory(category)}
              >
                <Icon 
                  name={getCategoryIcon(category)} 
                  size={18} 
                  color={selectedCategory === category ? 'white' : '#011F5B'} 
                />
                <Text style={[
                  styles.categoryFilterText,
                  selectedCategory === category && styles.categoryFilterTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Offres List */}
      <FlatList
        data={filteredOffres}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="info-outline" size={40} color="#D2D3D9" />
            <Text style={styles.emptyText}>Aucune offre disponible</Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addFirstButtonText}>Ajouter votre première offre</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Modifier Offre' : 'Nouvelle Offre'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#011F5B" />
              </TouchableOpacity>
            </View>

            {/* Image Picker */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri.uri || imageUri }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Icon name="add-a-photo" size={40} color="#D2D3D9" />
                  <Text style={styles.imagePlaceholderText}>Ajouter une image</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Form Inputs */}
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Titre de l'offre</Text>
              <TextInput
                style={styles.input}
                placeholder="Titre attractif..."
                value={formData.titre}
                onChangeText={(text) => handleInputChange('titre', text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Détails de l'offre..."
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Prix</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="00.00"
                  keyboardType="numeric"
                  value={formData.prix}
                  onChangeText={(text) => handleInputChange('prix', text)}
                />
                <Text style={styles.currency}>DNT</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.sectionTitle}>Type d'offre</Text>
              <View style={styles.radioGroup}>
                {types.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.radioOption,
                      formData.type === type && styles.radioOptionSelected
                    ]}
                    onPress={() => handleInputChange('type', type)}
                  >
                    <Icon 
                      name={type === 'REDUCTION' ? 'money-off' : 'local-offer'} 
                      size={20} 
                      color={formData.type === type ? 'white' : '#011F5B'} 
                    />
                    <Text style={[
                      styles.radioLabel,
                      formData.type === type && styles.radioLabelSelected
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {formData.type === 'REDUCTION' && (
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Pourcentage de réduction</Text>
                <View style={styles.discountInputContainer}>
                  <TextInput
                    style={[styles.input, styles.discountInput]}
                    placeholder="0-100"
                    keyboardType="numeric"
                    value={formData.pourcentage_reduction}
                    onChangeText={(text) => handleInputChange('pourcentage_reduction', text)}
                  />
                  <Text style={styles.percentSymbol}>%</Text>
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.sectionTitle}>Catégorie</Text>
              <View style={styles.categoryGrid}>
                {categories.map(categorie => (
                  <TouchableOpacity
                    key={categorie}
                    style={[
                      styles.categoryButton,
                      formData.categorie === categorie && styles.categoryButtonSelected
                    ]}
                    onPress={() => handleInputChange('categorie', categorie)}
                  >
                    <Icon 
                      name={getCategoryIcon(categorie)} 
                      size={20} 
                      color={formData.categorie === categorie ? 'white' : '#011F5B'} 
                    />
                    <Text style={[
                      styles.categoryText,
                      formData.categorie === categorie && styles.categoryTextSelected
                    ]}>
                      {categorie}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.sectionTitle}>Période de validité</Text>
              <View style={styles.dateRowContainer}>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.inputLabel}>Date de début</Text>
                  <TouchableOpacity 
                    style={styles.dateInput} 
                    onPress={() => {
                      setDatePickerMode('date');
                      setShowDatePicker(true);
                    }}
                  >
                    <Icon name="event" size={20} color="#011F5B" />
                    <Text style={styles.dateText}>
                      {formData.date_debut.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dateInputContainer}>
                  <Text style={styles.inputLabel}>Date de fin</Text>
                  <TouchableOpacity 
                    style={styles.dateInput} 
                    onPress={() => {
                      setDatePickerMode('date');
                      setShowDatePicker(true);
                    }}
                  >
                    <Icon name="event" size={20} color="#011F5B" />
                    <Text style={styles.dateText}>
                      {formData.date_fin.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={datePickerMode === 'date_debut' ? formData.date_debut : formData.date_fin}
                mode={datePickerMode}
                display="default"
                onChange={(event, date) => handleDateChange(event, date, datePickerMode === 'date_debut' ? 'date_debut' : 'date_fin')}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editMode ? 'Enregistrer' : 'Créer Offre'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#011F5B',
  },
  addButton: {
    backgroundColor: '#011F5B',
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filterContainer: {
    paddingHorizontal: 15,
    marginBottom: 3,
    zIndex: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#011F5B',
    borderColor: '#011F5B',
  },
  filterButtonText: {
    marginLeft: 10,
    color: '#011F5B',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  clearFilterButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryFilterDropdown: {
    position: 'absolute',
    top: 50,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100,
  },
  categoryFilterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryFilterItemSelected: {
    backgroundColor: '#011F5B',
  },
  categoryFilterText: {
    marginLeft: 10,
    color: '#011F5B',
  },
  categoryFilterTextSelected: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  addFirstButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#011F5B',
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 25,
  },
  offreCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offreCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#011F5B',
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  offreImage: {
    width: '100%',
    height: 180,
  },
  offreContent: {
    padding: 15,
  },
  offreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 8,
  },
  offreDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  originalPrice: {
    fontSize: 16,
    color: '#F44336',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: 'white',
    color: '#FFAA00',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFAA00',
    fontSize: 14,
    padding: 5,
    fontWeight: 'bold',
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFAA00',
    fontStyle: 'italic',
    textDecorationColor: '#FFAA00',
  },
  promoPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#011F5B',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    marginBottom: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    marginLeft: 80,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#FFAA00',
    fontWeight: '500',
  },
  deleteButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  deleteButtonText: {
    color: '#F44336',
  },
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#011F5B',
  },
  closeButton: {
    padding: 5,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 25,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#011F5B',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
    color: '#011F5B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#F8FAFC',
  },
  radioOptionSelected: {
    backgroundColor: '#011F5B',
    borderColor: '#011F5B',
  },
  radioLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  radioLabelSelected: {
    color: 'white',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryButton: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    backgroundColor: '#F8FAFC',
  },
  categoryButtonSelected: {
    backgroundColor: '#011F5B',
    borderColor: '#011F5B',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  categoryTextSelected: {
    color: 'white',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
  },
  currency: {
    fontSize: 16,
    color: '#011F5B',
    fontWeight: '600',
  },
  discountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountInput: {
    flex: 1,
    marginRight: 10,
  },
  percentSymbol: {
    fontSize: 16,
    color: '#011F5B',
    fontWeight: '600',
  },
  dateRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    width: '48%',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#011F5B',
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#011F5B',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#FFAA00',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#011F5B',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FournisseurOffres;