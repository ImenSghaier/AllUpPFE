import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmployeSuggestions() {
  return (
    <View style={styles.container}>
      <Text>Offres disponibles pour l'employé</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
