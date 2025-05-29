import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView, 
  ImageBackground,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfil, updateProfil } from "../redux/actions/profilAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

const AnimatedView = Animatable.createAnimatableComponent(View);

export default function EmployeProfil() {
  const dispatch = useDispatch();
  const profil = useSelector((state) => state.profil.data);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: ''
  });

  useEffect(() => {
    const getTokenAndFetchProfil = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        dispatch(fetchProfil(token));
      }
    };
    getTokenAndFetchProfil();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, [dispatch]);

  useEffect(() => {
    if (profil) {
      setFormData({
        nom: profil.nom || '',
        email: profil.email || '',
        telephone: profil.telephone || ''
      });
    }
  }, [profil]);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // On envoie seulement les champs modifiables
        const dataToUpdate = {
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone
        };
        
        await dispatch(updateProfil(token, dataToUpdate));
        setIsEditing(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Échec de la mise à jour');
    }
  };

  const renderEditableField = (icon, label, fieldName) => (
    <AnimatedView animation="fadeInRight" duration={800} style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={22} color="#FFAA00" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.value}
            value={formData[fieldName]}
            onChangeText={(text) => setFormData({...formData, [fieldName]: text})}
          />
        ) : (
          <Text style={styles.value}>{profil[fieldName]}</Text>
        )}
      </View>
    </AnimatedView>
  );

  const renderStaticField = (icon, label, value) => (
    <AnimatedView animation="fadeInRight" duration={800} style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={22} color="#FFAA00" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </AnimatedView>
  );

  if (!profil) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFAA00" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.background}
      blurRadius={2}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View 
          style={[
            styles.card,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleValue }] 
            }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Icon name="account" size={40} color="#FFF" />
            </View>
            {isEditing ? (
              <TextInput
                style={styles.title}
                value={formData.nom}
                onChangeText={(text) => setFormData({...formData, nom: text})}
              />
            ) : (
              <Text style={styles.title}>{profil.nom}</Text>
            )}
            <Text style={styles.subtitle}>{profil.role}</Text>
          </View>

          <View style={styles.infoContainer}>
            {renderEditableField("email", "Email", "email")}
            {renderEditableField("phone", "Téléphone", "telephone")}
            
            {/* Champ Entreprise - Non modifiable */}
            {profil.role === "Employé" && (
              renderStaticField(
                "office-building", 
                "Entreprise", 
                profil.entrepriseNom || "Non affilié"
              )
            )}
          </View>

          {isEditing ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.editButtonTexte}>
                  <Icon name="close" size={16} /> Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.editButtonTexte}>
                  <Icon name="check" size={16} /> Enregistrer
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>
                <Icon name="pencil" size={16} /> Modifier le profil
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
}

// Vos styles existants conservés inchangés
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    color: "#FFAA00",
    fontSize: 16,
  },
  card: {
    marginTop:-15,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 24,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFAA00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#171F5D",
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#FFAA00",
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: "#171F5D",
    fontWeight: '500',
  },
  editButton: {
    marginTop: 25,
    backgroundColor: '#171F5D',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
  editButtonTexte: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 5,
    paddingLeft: 5,
    paddingRight: 5,  
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    marginRight: 10,
    flex: 1,
  },
});