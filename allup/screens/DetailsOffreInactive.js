import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { url } from '../context/functions';

const DetailsOffreInactive = ({ route }) => {
  const { offre } = route.params;
  const navigation = useNavigation();
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
    statut,
  } = offre;

  const isReduction = type === 'REDUCTION';
  const handleDemandeSubvention = () => {
    navigation.navigate("FormulaireDemande", {
      offre: offre,
    });
  };

  // Animation 3D (tilt effect)
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

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image principale */}
      <View style={styles.headerImage}>
        <Image
          source={{ uri: `${url}/uploads/${image}` }}
          style={styles.imageBackground}
        />
        <View style={styles.overlay} />
      </View>

      {/* Logo central */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/image.png')}
          style={styles.logo}
        />
      </View>

      {/* Carte prix animée */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.priceCard, animatedCardStyle]}>
          <View style={styles.infoRow}>
            {/* Prix initial */}
            <View style={styles.infoBox}>
              <Text style={styles.prixA}>{prix} TND</Text>
            </View>

            {/* Si réduction */}
            {isReduction && (
              <View style={styles.infoBox}>
                <Text style={styles.pour}>-{pourcentage_reduction}%</Text>
              </View>
            )}

            {/* Prix après réduction */}
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

      {/* Catégorie et Statut */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Icon name="shape" size={14} color="#fff" />
          <Text style={styles.badgeText}>{categorie}</Text>
        </View>
        {/* <View style={[styles.badge, statut === 'Actif' ? styles.badgeActive : styles.badgeExpired]}>
          <Icon name="information" size={14} color="#fff" />
          <Text style={styles.badgeText}>{statut}</Text>
        </View> */}
      </View>

      <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleDemandeSubvention}
    >
      <View style={styles.content}>
        <Ionicons name="cash-outline" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.text}>Demande de subvention</Text>
      </View>
    </Pressable>
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
  // priceCard: {
   
  //   borderRadius: 15,
  //   padding: 15,
  //   marginTop: 90,
  //   alignItems: 'center',
  //   width: '90%',
  //   elevation: 6,
  // },
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
    color: '#FFAA00',
    textDecorationLine: 'line-through',
    textDecorationColor: '#011F5B',
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 2,
    borderColor: '#FFAA00',
    borderRadius: 30,
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
  badgeActive: {
    backgroundColor: '#28a745',
  },
  badgeExpired: {
    backgroundColor: '#dc3545',
  },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 10,
    width: '90%',
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
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#011F5B',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 15,
  },
  buttonPressed: {
    backgroundColor: '#011F5B99',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    color: '#011F5B',
  },
  text: {
    color: '#011F5B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailsOffreInactive;

