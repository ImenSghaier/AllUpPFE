import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

const QRCodeScreen = ({ route }) => {
  const { offre } = route.params;
  const { user: userInfo } = useSelector((state) => state.auth);
  const decodedUser = userInfo?.token ? jwtDecode(userInfo.token) : null;

  if (!offre || !decodedUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }
// Dans la fonction handleGetOffer de DetailsOffre.js
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
      navigation.navigate('QRCode', { 
        offre,
        reservationId: result.payload._id // Ajoutez l'ID de réservation
      });
    } else {
      Alert.alert("Erreur", result?.error || "Impossible de réserver cette offre.");
    }
  } catch (error) {
    Alert.alert("Erreur", "Une erreur est survenue lors de la réservation.");
  }
};

// Dans QRCodeScreen.js
const qrData = {
  offreId: offre._id,
  utilisateurId: decodedUser._id,
  reservationId: route.params.reservationId, // Ajoutez l'ID de réservation
  titre: offre.titre,
  date: new Date().toISOString(),
};

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>QR Code de l’Offre</Text>

        <View style={styles.qrContainer}>
          <QRCode value={JSON.stringify(qrData)} size={250} />
        </View>
    
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    
  },
  overlay: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,

  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#011F5B',
  },
  title: {
    marginTop: 60,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    color: '#011F5B',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#011F5B',
  },
 
  
});

export default QRCodeScreen;
