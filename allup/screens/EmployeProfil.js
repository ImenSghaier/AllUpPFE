import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfil } from "../redux/actions/profilAction";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmployeProfil() {
  const dispatch = useDispatch();
  const profil = useSelector((state) => state.profil.data);

  useEffect(() => {
    const getTokenAndFetchProfil = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        dispatch(fetchProfil(token));
      }
    };
    getTokenAndFetchProfil();
  }, [dispatch]);

  if (!profil) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFAA00" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🧑 Profil Employé</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>{profil.nom}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profil.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Téléphone</Text>
          <Text style={styles.value}>{profil.telephone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Rôle</Text>
          <Text style={styles.value}>{profil.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Entreprise</Text>
          <Text style={styles.value}>{profil.id_entreprise}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#171F5D",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFAA00",
  },
  value: {
    fontSize: 16,
    color: "#171F5D",
    marginTop: 2,
  },
});



// import React, { useEffect } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProfil } from "../redux/actions/profilAction";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function EmployeProfil() {
//   const dispatch = useDispatch();
//   const profil = useSelector((state) => state.profil.data);
//   console.log("Profil :", profil);

//   useEffect(() => {
//     const getTokenAndFetchProfil = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         dispatch(fetchProfil(token));
//       }
//     };
//     getTokenAndFetchProfil();
//   }, [dispatch]);

//   if (!profil) {
//     return (
//       <View style={styles.container}>
//         <Text>Chargement du profil...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Nom :</Text>
//       <Text style={styles.value}>{profil.nom}</Text>

//       <Text style={styles.label}>Email :</Text>
//       <Text style={styles.value}>{profil.email}</Text>

//       <Text style={styles.label}>Téléphone :</Text>
//       <Text style={styles.value}>{profil.telephone}</Text>

//       <Text style={styles.label}>Rôle :</Text>
//       <Text style={styles.value}>{profil.role}</Text>

//       <Text style={styles.label}>Entreprise :</Text>
//       <Text style={styles.value}>{profil.id_entreprise}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   label: { fontWeight: "bold", fontSize: 16, marginTop: 10 },
//   value: { fontSize: 16, color: "#333" },
// });
