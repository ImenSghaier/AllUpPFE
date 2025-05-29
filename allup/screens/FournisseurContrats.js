import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Animated,
  Easing
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getReceivedContractsAction, validateContractAction, signContractAction } from "../redux/actions/contractAction";
import jwtDecode from "jwt-decode"; 
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
// Composant séparé pour la carte de contrat avec animation
const AnimatedContractCard = React.memo(({ 
  item, 
  index, 
  onValidate, 
  onRefuse, 
  onSign 
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
      delay: index * 100,
    }).start();
  }, []);

  const formatDateFr = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const getStatusText = (statut) => {
    const s = statut?.toUpperCase().trim();
    switch (s) {
      case "ACTIF": return "Validé";
      case "REFUSÉ": return "REFUSÉ";
      case "EXPIRÉ": return "EXPIRÉ";
      default: return "EN_ATTENTE";
    }
  };

  return (
    <Animated.View 
      style={[
        styles.contractCard,
        { 
          transform: [{ scale: scaleValue }],
          opacity: scaleValue
        }
      ]}
    >
      {/* <View style={styles.cardHeader}> */}
        <View style={styles.headerLeft}>
          <Icon name="business" size={20} color="#011F5B" />
          <Text style={styles.entrepriseName}>{item.id_entreprise.nom}</Text>
        </View>
        <View style={styles.headerRight}>
          <Icon name="work" size={16} color="#FFAA00" />
          <Text style={styles.offreTitle}>{item.id_offre.titre}</Text>
        </View>
      {/* </View> */}
      
      <View style={styles.clauseContainer}>
        <Icon name="description" size={16} color="#011F5B" style={styles.clauseIcon} />
        <Text style={styles.clauseText} numberOfLines={2}>{item.clause}</Text>
      </View>
      
      <View style={styles.datesContainer}>
        <View style={styles.dateItem}>
          <Icon name="event-available" size={16} color="#FFAA00" />
          <Text style={styles.dateText}>Début: {formatDateFr(item.date_debut)}</Text>
        </View>
        <View style={styles.dateItem}>
          <Icon name="event-busy" size={16} color="#FFAA00" />
          <Text style={styles.dateText}>Fin: {formatDateFr(item.date_fin)}</Text>
        </View>
      </View>
      
      <View style={styles.signaturesContainer}>
        <View style={styles.signatureItem}>
          <Text style={styles.signatureLabel}>Entreprise:</Text>
          <Icon 
            name={item.signature_entreprise ? "check-circle" : "radio-button-unchecked"} 
            color={item.signature_entreprise ? "#011F5B" : "#D2D3D9"} 
            size={20} 
          />
        </View>
        <View style={styles.signatureItem}>
          <Text style={styles.signatureLabel}>Fournisseur:</Text>
          <Icon 
            name={item.signature_fournisseur ? "check-circle" : "radio-button-unchecked"} 
            color={item.signature_fournisseur ? "#011F5B" : "#D2D3D9"} 
            size={20} 
          />
        </View>
      </View>
      
      <View style={[
        styles.statusContainer,
        item.statut === "ACTIF" && styles.statusActiveContainer,
        item.statut === "REFUSÉ" && styles.statusRefusedContainer,
        item.statut === "EXPIRÉ" && styles.statusExpiredContainer
      ]}>
        <Text style={styles.statusText}>
          {getStatusText(item.statut)}
        </Text>
        <Icon 
          name={
            item.statut === "ACTIF" ? "check" : 
            item.statut === "REFUSÉ" ? "close" : 
            item.statut === "EXPIRÉ" ? "timer" : "schedule"
          } 
          size={16} 
          color="#FFF" 
        />
      </View>
      
      {item.statut?.toUpperCase().trim() === "EN_ATTENTE" && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.validateButton]}
            onPress={() => onValidate(item._id)}
            activeOpacity={0.7}
          >
            <Icon name="check" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.refuseButton]}
            onPress={() => onRefuse(item._id)}
            activeOpacity={0.7}
          >
            <Icon name="close" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {item.statut?.toUpperCase().trim() === "ACTIF" && !item.signature_fournisseur && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.signButton]}
          onPress={() => onSign(item._id)}
          activeOpacity={0.7}
        >
          <Icon name="create" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Signer</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

const FournisseurContrats = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("TOUS");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const contractState = useSelector((state) => state.contract);
  const { receivedContracts = [], loading, error } = contractState;

  // Animation pour le message
  useEffect(() => {
    if (message) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setMessage(""));
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchContracts = useCallback(async () => {
    if (userId) {
      await dispatch(getReceivedContractsAction(userId));
    }
  }, [dispatch, userId]);

  useFocusEffect(
    useCallback(() => {
      const getUserId = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken._id);
          }
        } catch (error) {
          console.error("Error getting user ID:", error);
        }
      };
      getUserId();

      return () => {};
    }, [])
  );

  useEffect(() => {
    if (userId) {
      fetchContracts();
    }
  }, [userId, fetchContracts]);

  const showMessage = (text) => {
    setMessage(text);
  };

  const handleValiderContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "ACTIF"));
      showMessage("Contrat validé avec succès");
    } catch (error) {
      showMessage("Erreur lors de la validation");
    }
  };

  const handleRefuserContrat = async (id) => {
    try {
      await dispatch(validateContractAction(id, "REFUSÉ"));
      showMessage("Contrat refusé avec succès");
    } catch (error) {
      showMessage("Erreur lors du refus");
    }
  };

  const handleSignerContrat = async (id) => {
    try {
      await dispatch(signContractAction(id));
      showMessage("Contrat signé avec succès");
    } catch (error) {
      showMessage("Erreur lors de la signature");
    }
  };

   // Memoized filtering + sorting
   const filteredContrats = useMemo(() => {
    // 1. Status filter
    let list = receivedContracts.filter(c =>
      filtreStatut === "TOUS" || c.statut?.toUpperCase() === filtreStatut
    );
    // 2. Search filter
    const term = searchTerm.toLowerCase();
    list = list.filter(c => {
      const ent = c.id_entreprise?.nom?.toLowerCase() || "";
      const off = c.id_offre?.titre?.toLowerCase()  || "";
      return ent.includes(term) || off.includes(term);
    });
    // 3. Clone + sort by date_debut desc
    return [...list].sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
  }, [receivedContracts, filtreStatut, searchTerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContracts();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }) => (
    <AnimatedContractCard 
      item={item} 
      index={index}
      onValidate={handleValiderContrat}
      onRefuse={handleRefuserContrat}
      onSign={handleSignerContrat}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#011F5B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={40} color="#D2D3D9" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchContracts}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <View style={{ flexDirection: 'row', alignItems: 'center'  , marginBottom: 20 }}>
                <MaterialIcons name="assignment" size={25} color="#011F5B" style={{ marginRight: 5, marginTop: 2 }} />
        <Text style={styles.title}>Contrats Reçus</Text>
      </View>
      </View>
      
      {message ? (
        <Animated.View 
          style={[
            styles.messageContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Icon 
            name={message.includes("succès") ? "check-circle" : "error"} 
            size={20} 
            color={message.includes("succès") ? "#4CAF50" : "#F44336"} 
          />
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      ) : null}
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#011F5B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor="#D2D3D9"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
      
      <View style={styles.filterContainer}>
        {["TOUS", "EN_ATTENTE", "ACTIF", "REFUSÉ", "EXPIRÉ"].map((statut) => (
          <TouchableOpacity
            key={statut}
            style={[
              styles.filterButton,
              filtreStatut === statut && styles.activeFilter
            ]}
            onPress={() => setFiltreStatut(statut)}
            activeOpacity={0.7}
          >
            <Icon
              name={
                statut === "TOUS" ? "apps" :
                statut === "EN_ATTENTE" ? "schedule" :
                statut === "ACTIF" ? "check-circle" :
                statut === "REFUSÉ" ? "cancel" : "timer"
              }
              size={16}
              color={filtreStatut === statut ? "#FFF" : "#011F5B"}
            />
            <Text style={[
              styles.filterText,
              filtreStatut === statut && styles.activeFilterText
            ]}>
              {statut}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredContrats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="hourglass-empty" size={40} color="#D2D3D9" />
            <Text style={styles.emptyText}>Aucun contrat à afficher</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    marginBottom: 0,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#011F5B',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#011F5B',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginBottom: 10,
    minWidth: '18%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: '#011F5B',
    borderColor: '#011F5B',
  },
  filterText: {
    fontSize: 12,
    color: '#011F5B',
    marginLeft: 5,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  contractCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#011F5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    // borderWidth:1,
    // borderColor : "#011F5B",
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entrepriseName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#011F5B',
    marginLeft: 8,
  },
  offreTitle: {
    fontSize: 14,
    color: '#FFAA00',
    marginLeft: 5,
  },
  clauseContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  clauseIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  clauseText: {
    color: '#011F5B',
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#FFAA00',
    marginLeft: 5,
  },
  signaturesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  signatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signatureLabel: {
    fontSize: 13,
    color: '#011F5B',
    marginRight: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusActiveContainer: {
    backgroundColor: '#4CAF50',
  },
  statusRefusedContainer: {
    backgroundColor: '#F44336',
  },
  statusExpiredContainer: {
    backgroundColor: '#FFAA00',
  },
  statusText: {
    fontWeight: '600',
    color: '#FFF',
    marginRight: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  validateButton: {
    backgroundColor: '#4CAF50',
  },
  refuseButton: {
    backgroundColor: '#F44336',
  },
  signButton: {
    backgroundColor: '#011F5B',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  messageText: {
    color: '#2E7D32',
    marginLeft: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    color: '#F44336',
    marginVertical: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#011F5B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6C757D',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default FournisseurContrats;