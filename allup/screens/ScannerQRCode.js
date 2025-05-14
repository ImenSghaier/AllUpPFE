// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { confirmReservationAction } from '../redux/actions/reservationAction';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import * as BarCodeScanner from 'expo-barcode-scanner';
// import * as Camera from 'expo-camera';

const ScannerQRCode = ({ navigation }) => {
  // const [hasPermission, setHasPermission] = useState(null);
  // const [scanned, setScanned] = useState(false);
  // const dispatch = useDispatch();
  // const { loading } = useSelector(state => state.reservation);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);

  // const handleBarCodeScanned = async ({ data }) => {
  //   try {
  //     setScanned(true);
  //     const qrData = JSON.parse(data);
      
  //     if (!qrData.offreId || !qrData.utilisateurId) {
  //       Alert.alert("Erreur", "QR Code invalide");
  //       return;
  //     }

  //     const result = await dispatch(confirmReservationAction(qrData.reservationId));
      
  //     if (result?.success) {
  //       Alert.alert(
  //         "Succès", 
  //         "Réservation confirmée!",
  //         [{ text: "OK", onPress: () => navigation.goBack() }]
  //       );
  //     } else {
  //       Alert.alert("Erreur", result?.error || "Erreur de confirmation");
  //     }
  //   } catch (err) {
  //     console.error("Erreur scan:", err);
  //     Alert.alert("Erreur", "Échec du scan");
  //   } finally {
  //     setScanned(false);
  //   }
  // };

  // if (hasPermission === null) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#011F5B" />
  //     </View>
  //   );
  // }

  // if (hasPermission === false) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.permissionText}>
  //         Autorisation caméra requise
  //       </Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Scanner QR Code</Text>
  //     <Text style={styles.subtitle}>
  //       Scannez le QR Code du client
  //     </Text>

  //     <View style={styles.scannerContainer}>
  //       <BarCodeScanner.BarCodeScanner
  //         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  //         style={StyleSheet.absoluteFillObject}
  //       />
        
  //       {loading && (
  //         <View style={styles.loadingOverlay}>
  //           <ActivityIndicator size="large" color="#011F5B" />
  //           <Text style={styles.loadingText}>Traitement...</Text>
  //         </View>
  //       )}
  //     </View>

  //     <View style={styles.guideContainer}>
  //       <Icon name="info-outline" size={24} color="#011F5B" />
  //       <Text style={styles.guideText}>
  //         Alignez le QR Code dans le cadre
  //       </Text>
  //     </View>
  //   </View>
  // );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#011F5B',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   scannerContainer: {
//     flex: 1,
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginBottom: 20,
//     position: 'relative',
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: '#011F5B',
//   },
//   guideContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 15,
//     backgroundColor: '#EFF2F7',
//     borderRadius: 10,
//   },
//   guideText: {
//     marginLeft: 10,
//     color: '#011F5B',
//   },
//   permissionText: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     padding: 20,
//   },
// });

export default ScannerQRCode;