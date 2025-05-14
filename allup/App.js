import React from "react";
import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Ajout de l'import
import store from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      {/* Envelopper AppNavigator dans GestureHandlerRootView */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
}
