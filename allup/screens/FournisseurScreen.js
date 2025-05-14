import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import FournisseurOffres from './FournisseurOffres';
import FournisseurContrats from './FournisseurContrats';
import ScannerQRCode from './ScannerQRCode';

export default function FournisseurScreen() {
  const [selectedTab, setSelectedTab] = useState('offres');

  const renderContent = () => {
    switch (selectedTab) {
      case 'offres':
        return <FournisseurOffres />;
      case 'contrats':
        return <FournisseurContrats />;
      case 'scanner':
        return <ScannerQRCode />;
      default:
        return <FournisseurOffres />;
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.bottomBar}>
        <Tab icon="pricetags" label="Offres" onPress={() => setSelectedTab('offres')} active={selectedTab === 'offres'} />
        <Tab icon="document-text" label="Contrats" onPress={() => setSelectedTab('contrats')} active={selectedTab === 'contrats'} />
        <Tab icon="qr-code-outline" label="Scan QR" onPress={() => setSelectedTab('scanner')} active={selectedTab === 'scanner'} />
      </View>
    </View>
  );
}

function Tab({ icon, label, onPress, active }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tab}>
      <Ionicons name={icon} size={24} color={active ? '#FFAA00' : '#171F5D'} />
      <Text style={[styles.tabLabel, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#171F5D',
    marginTop: 2,
  },
  activeLabel: {
    color: '#FFAA00',
    fontWeight: 'bold',
  },
});
