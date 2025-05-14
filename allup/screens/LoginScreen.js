import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authAction";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleLogin = () => {
    dispatch(login(email, mot_de_passe, navigation));
  };

  const goToForgotPassword = () => {
    navigation.navigate("MotDePasseOublie"); // adapte le nom si besoin
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.innerContainer}>
        <Image source={require("../assets/logo-all-up.png")} style={styles.logo} />
        <Text style={styles.welcomeText}>Bienvenue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={setMotDePasse}
          value={mot_de_passe}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotPasswordLink}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171F5D",
    alignItems: "center",
    paddingTop: 80,
  },
  innerContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFAA00",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#171F5D",
    padding: 12,
    marginBottom: 15,
    width: "100%",
    borderRadius: 8,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFAA00",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 15,
    width: "50%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordLink: {
    marginTop:280,
  },
  forgotPasswordText: {
    color: "#171F5D",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});
