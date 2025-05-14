import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDemandesEmployeAction } from '../redux/actions/demandeActions';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function EmployeSubventions() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const demandesEmployeState = useSelector((state) => state.demande);
  const { demandesEnvoyees, loading, error } = demandesEmployeState;

  const [filter, setFilter] = useState('TOUS'); // État pour gérer le filtre sélectionné

  useEffect(() => {
    if (token) {
      dispatch(getDemandesEmployeAction(token));
    }
  }, [dispatch, token]);

  const getStatusStyle = (statut) => {
    switch (statut) {
      case 'APPROUVÉE':
        return { color: '#2E7D32' };
      case 'REJETÉE':
        return { color: '#C62828' };
      default:
        return { color: '#FFAA00' };
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status); // Change l'état du filtre
  };

  const filteredDemandes = demandesEnvoyees.filter((demande) => {
    if (filter === 'TOUS') return true;
    if (filter === 'EN_ATTENTE' && demande.statut !== 'APPROUVÉE' && demande.statut !== 'REJETÉE') return true;
    if (filter === 'APPROUVEE' && demande.statut === 'APPROUVÉE') return true;
    if (filter === 'REJETEE' && demande.statut === 'REJETÉE') return true;
    return false;
  });

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      useNativeDriver
    >
      <View style={[styles.card, { borderLeftColor: getStatusStyle(item.statut).color }]} >
        <Text style={styles.offreTitle}>
          <Icon name="local-offer" size={18} color="#011F5B" /> Offre : {item.id_offre?.titre || 'Non spécifiée'}
        </Text>
        <Text style={styles.contenue}>
          <Icon name="description" size={16} color="#011F5B" /> {item.contenue}
        </Text>
        <Text style={styles.date}>
          <Icon name="event" size={14} color="#888" /> Envoyée le : {new Date(item.date_demande).toLocaleDateString()}
        </Text>
        <Text style={[styles.status, getStatusStyle(item.statut)]}>
          <Icon name="info" size={16} /> Statut : {item.statut}
        </Text>
      </View>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center'  , marginBottom: 20 }}>
        <MaterialIcons name="assignment" size={25} color="#011F5B" style={{ marginRight: 5, marginTop: -12 }} />
        <Text style={styles.title}>Mes Demandes de Subvention</Text>
      </View>
      {/* Barre de filtres */}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => handleFilterChange('TOUS')} style={styles.filterButton}>
          <Icon name="filter-list" size={24} color={filter === 'TOUS' ? '#011F5B' : '#555'} />
          <Text style={[styles.filterText, { color: filter === 'TOUS' ? '#011F5B' : '#555' }]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('EN_ATTENTE')} style={styles.filterButton}>
          <Icon name="hourglass-empty" size={24} color={filter === 'EN_ATTENTE' ? '#FFAA00' : '#555'} />
          <Text style={[styles.filterText, { color: filter === 'EN_ATTENTE' ? '#FFAA00' : '#555' }]}>En Attente</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('APPROUVEE')} style={styles.filterButton}>
          <Icon name="check-circle" size={24} color={filter === 'APPROUVEE' ? '#2E7D32' : '#555'} />
          <Text style={[styles.filterText, { color: filter === 'APPROUVEE' ? '#2E7D32' : '#555' }]}>Approuvée</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFilterChange('REJETEE')} style={styles.filterButton}>
          <Icon name="cancel" size={24} color={filter === 'REJETEE' ? '#C62828' : '#555'} />
          <Text style={[styles.filterText, { color: filter === 'REJETEE' ? '#C62828' : '#555' }]}>Rejetée</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#011F5B" />}
      {error && <Text style={styles.errorText}><Icon name="error-outline" size={18} /> Erreur : {error}</Text>}

      {!loading && filteredDemandes?.length === 0 && (
        <Text style={styles.infoText}>
          <Icon name="info-outline" size={18} /> Aucune demande envoyée.
        </Text>
      )}

      <FlatList
        data={filteredDemandes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#DFE6E9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#011F5B',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  offreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171F5D',
    marginBottom: 6,
  },
  contenue: {
    fontSize: 14,
    color: '#011F5B',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    marginVertical: 10,
  },
  infoText: {
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
    marginTop: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    marginTop: 4,
  },
});
