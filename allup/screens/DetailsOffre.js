import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createReservationAction } from '../redux/actions/reservationAction';
import { url } from '../context/functions';
import jwtDecode from 'jwt-decode';

const DetailsOffre = ({ route }) => {
  const { offre } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Récupération des informations utilisateur depuis Redux
  const { user: userInfo } = useSelector((state) => state.auth);
  const decodedUser = userInfo?.token ? jwtDecode(userInfo.token) : null;

  console.log("Utilisateur décodé:", decodedUser);

  const {
    titre,
    description,
    prix,
    type,
    pourcentage_reduction,
    prix_apres_reduction,
    date_debut,
    date_fin,
    categorie,
    image,
    _id: offreId,
  } = offre;

  const isReduction = type === 'REDUCTION';

  // Animation 3D
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      rotateX.value = e.translationY / 10;
      rotateY.value = -e.translationX / 10;
    })
    .onEnd(() => {
      rotateX.value = withSpring(0);
      rotateY.value = withSpring(0);
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  // Fonction pour obtenir l'offre
  const handleGetOffer = async () => {
    if (!decodedUser || !decodedUser._id) {
      Alert.alert("Erreur", "Vous devez être connecté pour réserver cette offre.");
      return;
    }
  
    try {
      const result = await dispatch(
        createReservationAction({
          id_employe: decodedUser._id,
          id_offre: offreId,
        })
      );
  
      if (result?.success) {
        Alert.alert("Succès", "Offre réservée avec succès !");
        navigation.navigate('Employe', { offre });
      } else {
        Alert.alert("Erreur", result?.error || "Impossible de réserver cette offre.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image principale */}
      <View style={styles.headerImage}>
        <Image source={{ uri: `${url}/uploads/${image}` }} style={styles.imageBackground} />
        <View style={styles.overlay} />
      </View>

      {/* Logo central */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/image.png')} style={styles.logo} />
      </View>

      {/* Carte prix animée */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.priceCard, animatedCardStyle]}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.prixA}>{prix} TND</Text>
            </View>

            {isReduction && (
              <View style={styles.infoBox}>
                <Text style={styles.pour}>-{pourcentage_reduction}%</Text>
              </View>
            )}

            <View style={styles.infoBox}>
              <Text style={styles.infoValue}>{prix_apres_reduction} TND</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Titre et description */}
      <Text style={styles.title}>{titre}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Validité */}
      <View style={styles.dateContainer}>
        <Icon name="calendar-range" size={18} color="#555" />
        <Text style={styles.dateText}>
          {' '}Valable du {moment(date_debut).format('DD/MM/YYYY')} au {moment(date_fin).format('DD/MM/YYYY')}
        </Text>
      </View>

      {/* Catégorie */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Icon name="shape" size={14} color="#fff" />
          <Text style={styles.badgeText}>{categorie}</Text>
        </View>
      </View>

      {/* Bouton obtenir l'offre */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleGetOffer}>
        <Icon name="gift-outline" size={20} color="#fff" />
        <Text style={styles.btnTextPrimary}> Obtenir l’offre</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F1F1',
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerImage: {
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  logoContainer: {
    position: 'absolute',
    top: 210,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 6,
    borderColor: '#FFA500',
    borderWidth: 2,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 60,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'transparent',
  },
  infoBox: {
    marginTop: 60,
    flex: 1,
    alignItems: 'center',
  },
  prixA: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    textDecorationLine: 'line-through',
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 2,
    borderColor: '#FFAA00',
    borderRadius: 10,
  },
  pour: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#011F5B',
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 2,
    borderColor: '#011F5B',
    borderRadius: 100,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#FFAA00',
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#011F5B',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#777',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#011F5B',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    elevation: 5,
  },
  btnTextPrimary: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default DetailsOffre;
