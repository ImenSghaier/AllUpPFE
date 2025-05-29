import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getReservationsConfirmeesByEmployeAction } from '../redux/actions/reservationAction';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReservationItem from './ReservationItem';

const EmployeSuggestions = ({ navigation }) => {
  const dispatch = useDispatch();
  const { confirmedReservations, error, loading } = useSelector(state => state.reservation);
  const [employeeId, setEmployeeId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployeeId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setEmployeeId(decoded._id);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const loadReservations = () => {
    if (employeeId) {
      dispatch(getReservationsConfirmeesByEmployeAction(employeeId));
    }
  };

  useEffect(() => {
    fetchEmployeeId();
  }, []);

  useEffect(() => {
    loadReservations();
  }, [dispatch, employeeId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEmployeeId();
    await loadReservations();
    setRefreshing(false);
  };

  if (!employeeId) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="hourglass-top" size={32} color="#FFAA00" />
        <Text style={styles.loadingText}>Chargement en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Évaluez Vos Réservations</Text>
        <Text style={styles.headerSubtitle}>Donnez votre avis sur les offres utilisées</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={20} color="#FFFFFF" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {confirmedReservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="clipboard-check" size={60} color="#011F5B" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Aucune réservation à évaluer</Text>
          <Text style={styles.emptyMessage}>Vous n'avez aucune réservation confirmée disponible pour évaluation.</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Feather name="refresh-cw" size={18} color="#FFFFFF" />
            <Text style={styles.refreshButtonText}>Actualiser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={confirmedReservations}
          renderItem={({ item }) => <ReservationItem item={item} />}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FFAA00']}
              tintColor="#FFAA00"
            />
          }
          //ListHeaderComponent={
            // <View style={styles.statsHeader}>
            //   <MaterialIcons name="info-outline" size={18} color="#011F5B" />
            //   <Text style={styles.statsText}>
            //     {confirmedReservations.length} réservation(s) à évaluer
            //   </Text>
            // </View>
          //}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#011F5B',
    fontSize: 16,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#011F5B',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  statsText: {
    marginLeft: 8,
    color: '#011F5B',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.8,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#011F5B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFAA00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default EmployeSuggestions;