import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getReservationsByEmployeAction } from '../redux/actions/reservationAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../context/functions';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const MesOffres = () => {
  const dispatch = useDispatch();
  const { reservations } = useSelector((state) => state.reservation);
  const [idEmploye, setIdEmploye] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTokenAndDispatch = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwt_decode(token);
        setIdEmploye(decoded._id);
        dispatch(getReservationsByEmployeAction(decoded._id));
      }
    };
    fetchTokenAndDispatch();
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="info-circle" size={22} color="#011F5B" style={{ marginRight: 8 }} />
        <Text style={styles.title}>Mes Réservations</Text>
      </View>

      {reservations && reservations.length > 0 ? (
        reservations.map((res, index) => (
          <Animatable.View
            key={res._id}
            animation="fadeInUp"
            delay={index * 100}
            duration={600}
            useNativeDriver
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('QRCode', { offre: res.id_offre })}
            >
              <Image
                source={{ uri: `${url}/uploads/${res.id_offre.image}` }}
                style={styles.image}
              />
              <View style={styles.content}>
                <Text style={styles.offerTitle}>{res.id_offre.titre}</Text>
                <Text style={styles.description}>{res.id_offre.description}</Text>
                <Text style={styles.detail}>
                  <Icon name="calendar" size={14} color="#FFAA00" /> Du{' '}
                  {format(new Date(res.id_offre.date_debut), 'dd/MM/yyyy')} au{' '}
                  {format(new Date(res.id_offre.date_fin), 'dd/MM/yyyy')}
                </Text>
                <Text style={styles.detail}>
                  <Icon name="clock-o" size={14} color="#FFAA00" /> Réservé le :{' '}
                  {format(new Date(res.date_reservation), 'dd/MM/yyyy HH:mm')}
                </Text>
                <Text style={styles.status}>
                  Statut :{' '}
                  <Text
                    style={[
                      styles.statusBadge,
                      res.statut === 'EN_ATTENTE'
                        ? styles.statusPending
                        : res.statut === 'CONFIRMÉE'
                        ? styles.statusConfirmed
                        : styles.statusRejected,
                    ]}
                  >
                    {res.statut}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))
      ) : (
        <Text style={styles.emptyText}>Aucune réservation trouvée.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F1F4F6',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: '#011F5B',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 14,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#011F5B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    overflow: 'hidden',
  },
  statusPending: {
    backgroundColor: '#f59e0b',
  },
  statusConfirmed: {
    backgroundColor: '#16a34a',
  },
  statusRejected: {
    backgroundColor: '#dc2626',
  },
  emptyText: {
    color: '#777',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MesOffres;
