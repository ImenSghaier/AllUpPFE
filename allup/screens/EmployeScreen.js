import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TopBar from '../components/TopBar';
import EmployeOffres from './EmployeOffres';
import EmployeProfil from './EmployeProfil';
import EmployeSuggestions from './EmployeSuggestions';
import EmployeSubventions from './EmployeSubventions';
import MesOffres from './MesOffres';
import { Ionicons } from '@expo/vector-icons';

export default function EmployeScreen() {
  const [selectedTab, setSelectedTab] = useState('offres');

  const renderContent = () => {
    switch (selectedTab) {
      case 'offres':
        return <EmployeOffres />;
      case 'profil':
        return <EmployeProfil />;
      case 'suggestion':
        return <EmployeSuggestions />;
      case 'subvention':
        return <EmployeSubventions />;
      case 'mesOffres':
        return <MesOffres />;
      default:
        return <EmployeOffres />;
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.bottomBar}>
        <Tab icon="pricetag" label="Offres" onPress={() => setSelectedTab('offres')} active={selectedTab === 'offres'} />
        <Tab icon="bulb" label="Suggestions" onPress={() => setSelectedTab('suggestion')} active={selectedTab === 'suggestion'} />
        <Tab icon="pricetags-outline" label="Mes Offres" onPress={() => setSelectedTab('mesOffres')} active={selectedTab === 'mesOffres'} />
        <Tab icon="cash" label="Subventions" onPress={() => setSelectedTab('subvention')} active={selectedTab === 'subvention'} />
        <Tab icon="person" label="Profil" onPress={() => setSelectedTab('profil')} active={selectedTab === 'profil'} />
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


// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import TopBar from '../components/TopBar';
// import EmployeOffres from './EmployeOffres';
// import EmployeProfil from './EmployeProfil';
// import EmployeSuggestions from './EmployeSuggestions';
// import EmployeSubventions from './EmployeSubventions';
// import EmployeChat from './EmployeChat';
// import { Ionicons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native';

// export default function EmployeScreen() {
//   const [selectedTab, setSelectedTab] = useState('offres');

//   const renderContent = () => {
//     switch (selectedTab) {
//       case 'offres':
//         return <EmployeOffres />;
//       case 'profil':
//         return <EmployeProfil />;
//       case 'suggestion':
//         return <EmployeSuggestions />;
//       case 'subvention':
//         return <EmployeSubventions />;
//       case 'chat':
//         return <EmployeChat />;
//       default:
//         return <EmployeOffres />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TopBar />
//       <View style={styles.content}>{renderContent()}</View>
//       <View style={styles.bottomBar}>
//         <Tab icon="pricetag" label="Offres" onPress={() => setSelectedTab('offres')} active={selectedTab === 'offres'} />
//         <Tab icon="bulb" label="Suggestion" onPress={() => setSelectedTab('suggestion')} active={selectedTab === 'suggestion'} />
//         <Tab icon="cash" label="Subventions" onPress={() => setSelectedTab('subvention')} active={selectedTab === 'subvention'} />
//         <Tab icon="chatbubble" label="Chat" onPress={() => setSelectedTab('chat')} active={selectedTab === 'chat'} />
//         <Tab icon="person" label="Profil" onPress={() => setSelectedTab('profil')} active={selectedTab === 'profil'} />
//       </View>
//     </View>
//   );
// }

// function Tab({ icon, label, onPress, active }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={styles.tab}>
//       <Ionicons name={icon} size={23} color={active ? '#FFAA00' : '#081b4e'} />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content: { flex: 1 },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     paddingVertical: 10
//   },
//   tab: {
//     alignItems: 'center'
//   }
// });
