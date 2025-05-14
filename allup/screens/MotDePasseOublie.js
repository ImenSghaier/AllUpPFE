import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/authAction";

const MotDePasseOublieScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { resetPasswordMessage, resetPasswordError } = useSelector(state => state.auth);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      dispatch({ 
        // type: FORGOT_PASSWORD_FAIL, 
        payload: "Adresse e-mail invalide" 
      });
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(forgotPassword(email));
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   return () => {
  //     // Nettoyer les messages lors du démontage du composant
  //     dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: null });
  //     dispatch({ type: FORGOT_PASSWORD_FAIL, payload: null });
  //   };
  // }, []);

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Image 
            source={require("../assets/logo-all-up.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />

          <Text style={styles.title}>Mot de passe oublié</Text>
          <Text style={styles.subtitle}>
            Entrez votre adresse email pour recevoir les instructions de réinitialisation
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {resetPasswordMessage && (
            <Text style={styles.successMessage}>{resetPasswordMessage}</Text>
          )}

          {resetPasswordError && (
            <Text style={styles.errorMessage}>{resetPasswordError}</Text>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Envoyer les instructions</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop:-200,
    borderWidth: 1,
    borderColor: "#FFAA00",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 17,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#011F5B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FFAA00',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFAA00',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successMessage: {
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 15,
  },
  errorMessage: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 15,
  },
  backButton: {
    alignSelf: 'center',
  },
  backText: {
    color: '#011F5B',
    fontWeight: '600',
  },
});

export default MotDePasseOublieScreen;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   Image,
// } from "react-native";
// import { useDispatch } from "react-redux";
// import { forgotPassword } from "../redux/actions/authAction";

// const MotDePasseOublieScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const dispatch = useDispatch();

//   const handleResetPassword = async () => {
//     setMessage("");
//     setError("");

//     if (!email.includes("@")) {
//       setError("Adresse e-mail invalide.");
//       return;
//     }

//     try {
//       const res = await dispatch(forgotPassword(email));
//       setMessage(res?.message || "Un email de confirmation a été envoyé.");
//       setEmail("");
//     } catch (err) {
//       setError(err?.toString());
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../assets/background.jpg")}
//       style={styles.container}
//       resizeMode="cover"
//     >
//       <View style={styles.innerContainer}>
//         <Image source={require("../assets/logo-all-up.png")} style={styles.logo} />
//         <Text style={styles.title}>Récupération du mot de passe</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Entrez votre adresse email"
//           placeholderTextColor="#666"
//           onChangeText={setEmail}
//           value={email}
//         />

//         {message !== "" && <Text style={[styles.message, { color: "#4CAF50" }]}>{message}</Text>}
//         {error !== "" && <Text style={[styles.message, { color: "#f00" }]}>{error}</Text>}

//         <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
//           <Text style={styles.buttonText}>Envoyer</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backText}>← Retour à la connexion</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// };

// export default MotDePasseOublieScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#171F5D",
//     alignItems: "center",
//   },
//   innerContainer: {
//     marginTop: 100,
//     // width: "85%",
//     padding: 20,
//     borderRadius: 12,
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//   },
//   logo: {
//     width: 90,
//     height: 90,
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#171F5D",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "white",
//     borderWidth: 1,
//     borderColor: "#171F5D",
//     padding: 12,
//     marginBottom: 20,
//     width: "100%",
//     borderRadius: 8,
//     fontSize: 16,
//   },
//   message: {
//     marginBottom: 10,
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   button: {
//     backgroundColor: "#FFAA00",
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 15,
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   backText: {
//     marginTop: 375,
//     color: "#171F5D",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });
