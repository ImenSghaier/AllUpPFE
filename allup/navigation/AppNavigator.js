// navigation/AppNavigator.js
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import EmployeScreen from "../screens/EmployeScreen";
import FournisseurScreen from "../screens/FournisseurScreen";
import MotDePasseOublie from "../screens/MotDePasseOublie";
import DetailsOffre from "../screens/DetailsOffre";
import DetailsOffreInactive from "../screens/DetailsOffreInactive";
import FormulaireDemande from "../screens/FormulaireDemande";
import QRCode from "../screens/QRCode";
import MesOffres from "../screens/MesOffres";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MotDePasseOublie" component={MotDePasseOublie}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Employe" component={EmployeScreen} />
        <Stack.Screen name="Fournisseur" component={FournisseurScreen} />
        <Stack.Screen name="DetailsOffre" component={DetailsOffre} />
        <Stack.Screen name="DetailsOffreInactive" component={DetailsOffreInactive} />
        <Stack.Screen name="FormulaireDemande" component={FormulaireDemande} />
        <Stack.Screen name="QRCode" component={QRCode} />
        <Stack.Screen name="MesOffres" component={MesOffres} />
        <Stack.Screen name="EmployeScreen" component={EmployeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
