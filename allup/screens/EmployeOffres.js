import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { getOffresEmploye, getOffresInactivesEmployeAction } from "../redux/actions/offreActions";
import { url } from "../context/functions";
import Icon from 'react-native-vector-icons/MaterialIcons';
const EmployeOffres = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [recherche, setRecherche] = useState("");

  const [categorieFiltre, setCategorieFiltre] = useState("");
  const [afficherActives, setAfficherActives] = useState(true);

  const offreEmploye = useSelector((state) => state.offreEmploye);
  const loading = offreEmploye?.loading;
  const offres = offreEmploye?.offres || [];
  const error = offreEmploye?.error;

  const categories = [
    { label: "Hotels & vacations", icon: require("../assets/icons/hotel.png") },
    { label: "Shopping", icon: require("../assets/icons/shopping.png") },
    { label: "Santé & bien-être", icon: require("../assets/icons/health.png") },
    { label: "Restaurant & lounge", icon: require("../assets/icons/restaurant.png") },
    { label: "Formation & workshop", icon: require("../assets/icons/training.png") },
    { label: "Transports", icon: require("../assets/icons/transport.png") },
    { label: "Événements & loisirs", icon: require("../assets/icons/event.png") },
    { label: "Culture", icon: require("../assets/icons/culture.png") },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        if (afficherActives) {
          dispatch(getOffresEmploye(token));
        } else {
          dispatch(getOffresInactivesEmployeAction(token));
        }
      }
    };
    fetchData();
  }, [dispatch, afficherActives]);

  const offresFiltrées = offres.filter((o) => {
    const correspondCategorie = categorieFiltre ? o.categorie === categorieFiltre : true;
    const correspondRecherche =
      recherche.length === 0 ||
      o.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      o.description.toLowerCase().includes(recherche.toLowerCase());
    return correspondCategorie && correspondRecherche;
  });
  

  const renderItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      useNativeDriver
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            afficherActives ? "DetailsOffre" : "DetailsOffreInactive",
            { offre: item }
          )
        }
        style={styles.card}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ position: "relative" }}>
            {item.image ? (
              <Image
                source={{ uri: `${url}/uploads/${item.image}` }}
                style={styles.imagePlaceholder}
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.titre}>{item.titre}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.prixContainer}>
              <Text style={styles.prixAncien}>{item.prix} DT</Text>
              <Text style={styles.prixNouveau}>{item.prix_apres_reduction} DT</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des offres...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            { backgroundColor: afficherActives ? "#FFAA00" : "#171F5D" },
          ]}
          onPress={() => setAfficherActives(true)}
        >
          <Text style={styles.toggleText(afficherActives)}>Offres Actives</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            { backgroundColor: !afficherActives ? "#FFAA00" : "#171F5D" },
          ]}
          onPress={() => setAfficherActives(false)}
        >
          <Text style={styles.toggleText(!afficherActives)}>Offres Inactives</Text>
        </TouchableOpacity>
      </View>
    

      <View style={styles.cat}>
        <Text style={styles.header}>Catégories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.label}
          contentContainerStyle={{ marginBottom: 15 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categorieBtn,
                categorieFiltre === item.label && styles.categorieBtnActive,
              ]}
              onPress={() =>
                setCategorieFiltre(item.label === categorieFiltre ? "" : item.label)
              }
            >
              <Image source={item.icon} style={styles.categorieIcon} />
              <Text style={styles.categorieLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="🔍 Rechercher une offre..."
    placeholderTextColor="#FFAA00"
    value={recherche}
    onChangeText={setRecherche}
  />
</View><View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
      <Icon name="local-offer" size={20} color="#011F5B" marginLeft={5} marginRight={-10} />
      <Text style={styles.headerO}>Offres</Text>
      </View>
      {offresFiltrées.length === 0 ? (
        <Text style={styles.empty}>Aucune offre disponible.</Text>
      ) : (
        <FlatList
          data={offresFiltrées}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingTop: 0,
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    marginTop: 0,
  },
  toggleBtn: {
    padding: 11,
    borderRadius: 35,
    marginHorizontal: 1,
    marginTop: 5,
    width: "50%",
    alignItems: "center",
  },
  toggleText: (isActive) => ({
    color: isActive ? "#fff" : "#ccc",
    fontWeight: "bold",
  }),
  searchContainer: {
    marginHorizontal: 50,
    marginBottom: -5,
    marginTop: 10,
    backgroundColor: "#fff",
    height: 43,
    borderRadius: 25,
    borderColor: "#FFAA00",
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 0,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#011F5B",
  },
  
  header: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    color: "#081b4e",
  },
  headerO: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 15,
    marginTop: 10,
    textAlign: "left",
    color: "#081b4e",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 11,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  titre: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#171F5D",
  },
  description: {
    color: "#171F5D",
    fontSize: 13,
    marginVertical: 2,
  },
  prixContainer: {
    flexDirection: "row",
    gap: 125,
    alignItems: "center",
  },
  prixAncien: {
    fontSize: 12,
    color: "#FF0000",
    textDecorationLine: "line-through",
  },
  prixNouveau: {
    fontSize: 14,
    color: "#fff",
    backgroundColor: "#FFAA00",
    fontWeight: "bold",
    padding: 2,
    borderRadius: 5,
    marginLeft: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  cat: {
    
    backgroundColor: "white",
    paddingBottom: -15,
    
    padding: 5,
    borderRadius: 10,
   
  },
  categorieBtn: {
    alignItems: "center",
    marginRight: 5,
    padding: 5,
    borderRadius: 15,
    width: 75,
    height: 85,
    borderWidth: 1,
    borderColor: "#FFAA00",
  },
  categorieBtnActive: {
    backgroundColor: "#171F5D",
    borderWidth: 1,
    borderColor: "#FFAA00",
  },
  categorieIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  categorieLabel: {
    fontSize: 11,
    textAlign: "center",
    color: "#011F5B",
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#FF0000",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default EmployeOffres;


