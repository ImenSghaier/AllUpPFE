import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground ,Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createDemandeAction } from "../redux/actions/demandeActions";
import { useNavigation } from "@react-navigation/native";

const FormulaireDemande = ({ route }) => {
  const dispatch = useDispatch();
  const { offre } = route.params;
  const [contenu, setContenu] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigation = useNavigation();

  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (!token) {
      setError("Utilisateur non authentifié");
    }
  }, [token]);

  const handleEnvoyerDemande = () => {
    if (!contenu.trim()) {
      setError("Le contenu de la demande ne peut pas être vide.");
      return;
    }
  
    const demandeData = {
      id_offre: offre._id,
      contenue: contenu.trim(),
    };
  
    dispatch(createDemandeAction(token, demandeData))
      .then(() => {
        setSuccessMessage("Demande envoyée avec succès !");
        setContenu("");
        setError("");
  
        // Attendre 2 secondes, puis rediriger
        setTimeout(() => {
          navigation.navigate("EmployeScreen"); // le nom défini dans ton navigator
        }, 2000);
      })
      .catch((err) => {
        setError("Erreur lors de l’envoi de la demande.");
        console.error(err);
      });
  };
  

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.backgroundImage}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Image source={require("../assets/image.png")} style={styles.logo} />
            <Text style={styles.title}>Demande de Subvention</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <TextInput
              style={styles.textInput}
              placeholder="Rédigez ici votre demande..."
              value={contenu}
              onChangeText={setContenu}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.button} onPress={handleEnvoyerDemande}>
              <Text style={styles.buttonText}>Envoyer la Demande</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: 80,
    paddingBottom: 5,
  },
  container: {
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.9)", // pour que le texte reste lisible
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#011F5B",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#011F5B",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    borderColor: "#FFAA00",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: "#171F5D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#171F5D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
   width: "60%",
   alignSelf: "center",
   borderWidth: 1,
    
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#D00000",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  successText: {
    color: "#007E33",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 70,
    height: 50,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 0,
    

  },
});

export default FormulaireDemande;

// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { createDemandeAction } from "../redux/actions/demandeActions";

// const FormulaireDemande = ({ route }) => {
//   const dispatch = useDispatch();
//   const { offre } = route.params;
//   const [contenu, setContenu] = useState("");
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const { token } = useSelector(state => state.auth);

//   useEffect(() => {
//     if (!token) {
//       setError("Utilisateur non authentifié");
//     }
//   }, [token]);

//   const handleEnvoyerDemande = () => {
//     if (!contenu.trim()) {
//       setError("Le contenu de la demande ne peut pas être vide.");
//       return;
//     }

//     const demandeData = {
//       id_offre: offre._id,
//       contenue: contenu.trim(),
//     };

//     dispatch(createDemandeAction(token, demandeData))
//       .then(() => {
//         setSuccessMessage("Demande envoyée avec succès !");
//         setContenu("");
//         setError("");
//       })
//       .catch((err) => {
//         setError("Erreur lors de l’envoi de la demande.");
//         console.error(err);
//       });
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Demande de Subvention</Text>

//           {error ? <Text style={styles.errorText}>{error}</Text> : null}
//           {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

//           <TextInput
//             style={styles.textInput}
//             placeholder="Rédigez ici votre demande..."
//             value={contenu}
//             onChangeText={setContenu}
//             multiline
//             numberOfLines={6}
//             textAlignVertical="top"
//             placeholderTextColor="#999"
//           />

//           <TouchableOpacity style={styles.button} onPress={handleEnvoyerDemande}>
//             <Text style={styles.buttonText}>Envoyer la Demande</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     // justifyContent: "center",
//     marginTop: 40,
//     paddingBottom: 20,
//     backgroundColor: "#F1F1F1",
//   },
//   container: {
//     padding: 24,
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginTop: 40,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#011F5B",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   textInput: {
//     borderColor: "#171F5D",
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//     marginBottom: 24,
//     backgroundColor: "#FAFAFA",
//   },
//   button: {
//     backgroundColor: "#171F5D",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     shadowColor: "#171F5D",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   errorText: {
//     color: "#D00000",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   successText: {
//     color: "#007E33",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 10,
//   },
// });

// export default FormulaireDemande;
