import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/authAction';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function TopBar() {
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuVisible(false);
    navigation.replace('Login'); // remplace par le nom exact de ta page login
  };

  return (
    <View>
      {/* Top Bar */}
      <View style={styles.topContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleMenuToggle}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/image copy.png')} style={styles.logo} />
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Latéral */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity style={styles.menuItemRow}>
            <Ionicons name="person-outline" size={22} color="#081b4e" style={styles.menuIcon} />
            <Text style={styles.menuText}>Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemRow}>
            <Ionicons name="settings-outline" size={22} color="#081b4e" style={styles.menuIcon} />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItemRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#081b4e" style={styles.menuIcon} />
            <Text style={styles.menuText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: '#081b4e',
    paddingBottom: 12,
    paddingTop: 40,
    borderRadius: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 5,
    paddingTop: 8,
  },
  logo: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 999,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#081b4e',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#081b4e',
  },
});
