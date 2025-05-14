import React, { useEffect } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";

// Importer les images depuis le dossier assets
import backgroundImage from "../assets/background.jpg";  // Remplace par le chemin correct vers ton image de fond
import logoImage from "../assets/logo-all-up.png";  // Remplace par le chemin correct vers ton logo

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  }, [navigation]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",  // Assure que l'image de fond couvre toute la surface
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,  
    height: 150, 
  },
});
