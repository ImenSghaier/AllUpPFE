import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Animated, Easing } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { confirmReservationAction } from '../redux/actions/reservationAction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const SCAN_SIZE = width * 0.7;

export default function ScannerQRCode() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();
  const linePosition = new Animated.Value(0);

  // Animation de la ligne de scan
  React.useEffect(() => {
    const animateLine = () => {
      linePosition.setValue(0);
      Animated.timing(linePosition, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animateLine());
    };
    animateLine();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-off" size={60} color="#011F5B" style={styles.permissionIcon} />
        <Text style={styles.permissionTitle}>Autorisation requise</Text>
        <Text style={styles.permissionText}>Nous avons besoin d'accéder à votre caméra pour scanner les QR codes</Text>
        <Text onPress={requestPermission} style={styles.permissionButton}>
          Autoriser l'accès
        </Text>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      
      try {
        const qrData = JSON.parse(data);
        
        if (qrData?.reservationId) {
          const result = await dispatch(confirmReservationAction(qrData.reservationId));
          
          Alert.alert(
            result?.success ? 'Succès' : 'Erreur',
            result?.success 
              ? `Réservation confirmée !\n${qrData.titre || ''}`
              : result?.error || "Échec de la confirmation",
            [{ text: 'OK', onPress: () => setScanned(false) }]
          );
        } else {
          throw new Error('QR Code invalide');
        }
      } catch (error) {
        Alert.alert(
          'Erreur',
          error.message === 'QR Code invalide' 
            ? 'Ce QR code ne correspond pas à une réservation valide'
            : 'Impossible de lire le QR code',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    }
  };

  const translateY = linePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCAN_SIZE/2, SCAN_SIZE/2],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        <View style={styles.scanOverlay}>
          <View style={styles.scanFrame}>
            <Animated.View 
              style={[
                styles.scanLine,
                { transform: [{ translateY }] }
              ]} 
            />
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
          <Text style={styles.scanText}>Alignez le QR code dans le cadre</Text>
          <Icon name="qrcode-scan" size={40} color="white" style={styles.scanIcon} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  permissionIcon: {
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#011F5B',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#011F5B',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: '500',
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    height: 2,
    width: SCAN_SIZE - 40,
    backgroundColor: '#555',
    position: 'absolute',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#FFAA00',
    borderTopLeftRadius: 20,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#FFAA00',
    borderTopRightRadius: 20,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#FFAA00',
    borderBottomLeftRadius: 20,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#FFAA00',
    borderBottomRightRadius: 20,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
  },
  scanIcon: {
    marginTop: 20,
  },
});

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import { useDispatch } from 'react-redux';
// import { confirmReservationAction } from '../redux/actions/reservationAction';

// export default function ScannerQRCode() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);
//   const dispatch = useDispatch();

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>Nous avons besoin de votre permission pour accéder à la caméra</Text>
//         <Text onPress={requestPermission} style={styles.link}>Donner l'autorisation</Text>
//       </View>
//     );
//   }

//   const handleBarCodeScanned = async ({ data }) => {
//     if (!scanned) {
//       setScanned(true);
      
//       try {
//         // Essaye de parser les données JSON
//         let qrData;
//         try {
//           qrData = JSON.parse(data);
//         } catch (e) {
//           // Si le parsing direct échoue, essaye de nettoyer la chaîne
//           const cleanedData = data.replace(/^"|"$/g, '');
//           qrData = JSON.parse(cleanedData);
//         }

//         // Vérifie que les données nécessaires sont présentes
//         if (qrData && qrData.reservationId) {
//           const result = await dispatch(confirmReservationAction(qrData.reservationId));
          
//           if (result?.success) {
//             Alert.alert(
//               'Succès', 
//               `Réservation "${qrData.titre || ''}" confirmée avec succès!`,
//               [{ text: 'OK', onPress: () => setScanned(false) }]
//             );
//           } else {
//             Alert.alert(
//               'Erreur', 
//               result?.error || "Échec de la confirmation",
//               [{ text: 'OK', onPress: () => setScanned(false) }]
//             );
//           }
//         } else {
//           Alert.alert(
//             'QR Code invalide', 
//             'Le QR code scanné ne contient pas les informations nécessaires',
//             [{ text: 'OK', onPress: () => setScanned(false) }]
//           );
//         }
//       } catch (error) {
//         Alert.alert(
//           'Erreur', 
//           `Erreur lors de la lecture du QR code: ${error.message}`,
//           [{ text: 'OK', onPress: () => setScanned(false) }]
//         );
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: ['qr'],
//         }}
//       />
//       <View style={styles.overlay}>
//         <Text style={styles.scanText}>Scannez le QR code de la réservation</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: 'relative',
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 20,
//     alignItems: 'center',
//   },
//   scanText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   message: {
//     textAlign: 'center',
//     padding: 10,
//   },
//   link: {
//     color: 'blue',
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// export default function ScannerQRCode() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>Nous avons besoin de votre permission pour accéder à la caméra</Text>
//         <Text onPress={requestPermission} style={styles.link}>Donner l'autorisation</Text>
//       </View>
//     );
//   }

//   const handleBarCodeScanned = ({ type, data }) => {
//     if (!scanned) {
//       setScanned(true);
//       Alert.alert('QR Code scanné', `Type : ${type}\nDonnées : ${data}`);
//       // Remettre à false si tu veux autoriser un autre scan après un délai
//       setTimeout(() => setScanned(false), 3000);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         onBarcodeScanned={handleBarCodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: ['qr'], // Scanner uniquement les QR codes
//         }}
//       />
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   message: {
//     textAlign: 'center',
//     padding: 10,
//   },
//   link: {
//     color: 'blue',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   camera: {
//     flex: 1,
//   },
// });