import React from "react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";
import Toast from "react-native-toast-message"; // ✅ Import du composant Toast
import { View } from "react-native";
import Icon from "react-native-vector-icons/Feather"; // ou autre selon ton projet
import { StyleSheet, Text } from "react-native"; // Pour customisation

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          {/* ✅ Ajout du composant Toast ici */}
          <Toast
            position="top"
            topOffset={50}
            config={{
              success: ({ text1, text2 }) => (
                <View style={toastStyles.successContainer}>
                  <Icon name="check-circle" size={24} color="#FFF" />
                  <View style={toastStyles.textContainer}>
                    <Text style={toastStyles.text1}>{text1}</Text>
                    <Text style={toastStyles.text2}>{text2}</Text>
                  </View>
                </View>
              ),
              error: ({ text1, text2 }) => (
                <View style={toastStyles.errorContainer}>
                  <Icon name="alert-circle" size={24} color="#FFF" />
                  <View style={toastStyles.textContainer}>
                    <Text style={toastStyles.text1}>{text1}</Text>
                    <Text style={toastStyles.text2}>{text2}</Text>
                  </View>
                </View>
              ),
            }}
          />
        </View>
      </GestureHandlerRootView>
    </Provider>
  );
}

const toastStyles = StyleSheet.create({
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  text1: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  text2: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 2,
  },
});
