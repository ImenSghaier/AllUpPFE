import React from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

const QRCodeScreen = ({ route }) => {
  const { offre, reservationId } = route.params;
  const { user: userInfo } = useSelector((state) => state.auth);
  const decodedUser = userInfo?.token ? jwtDecode(userInfo.token) : null;

  // Vérification plus complète des données
  if (!offre || !decodedUser || !reservationId) {
    Alert.alert("Erreur", "Données manquantes pour générer le QR code");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Données manquantes...</Text>
      </View>
    );
  }

  // Structure des données pour le QR code
  const qrData = {
    reservationId: reservationId,
    offreId: offre._id,
    userId: decodedUser._id,
    titre: offre.titre,
    date: new Date().toISOString()
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.overlay}>
        <Text style={styles.title}>QR Code de Réservation</Text>
        
        <View style={styles.qrContainer}>
          <QRCode 
            value={JSON.stringify(qrData)}
            size={250}
            color="#011F5B"
            backgroundColor="white"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.offerTitle}>{offre.titre}</Text>
          {/* <Text style={styles.reservationId}>ID Réservation: {reservationId}</Text> */}
        </View>

        <Text style={styles.instructions}>
          Présentez ce code à le fournisseur pour confirmer votre réservation.
        </Text>
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
    marginTop: 40,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 30,
    color: '#011F5B',
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 5,
    textAlign: 'center',
  },
  reservationId: {
    fontSize: 14,
    color: '#555',
  },
  instructions: {
    fontSize: 16,
    color: '#011F5B',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default QRCodeScreen;