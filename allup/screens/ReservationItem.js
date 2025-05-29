

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5, Feather, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVotesAction } from '../redux/actions/voteActions';
import VoteModal from './VoteModal';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ReservationItem = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { statistics, userVotes, votes, loading } = useSelector(state => state.vote);
  const offreId = item.id_offre?._id;
  const navigation = useNavigation();

  const currentStats = statistics[offreId];
  const userVote = userVotes[offreId];
  const offerVotes = votes.filter(v => v.offre === offreId);

  useEffect(() => {
    if (offreId && !userVotes[offreId]) { // Ne fetch que si pas déjà de vote utilisateur
      dispatch(fetchVotesAction(offreId));
    }
  }, [dispatch, offreId]);

  const handlePress = () => {
    if (userVote) {
      Alert.alert(
        'Évaluation enregistrée',
        `Vous avez déjà donné un ${userVote.isPositive ? 'avis positif' : 'avis négatif'} pour cette offre`,
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Voir les détails',
            style: 'cancel',
            onPress: () => navigation.navigate('VoteDetails', { offreId })
          }
        ]
      );
    } else {
      setModalVisible(true);
    }
  };

  const renderVoteStats = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFAA00" />
        </View>
      );
    }

    if (!currentStats || currentStats.totalVotes === 0) {
      return (
        <View style={styles.emptyStats}>
          <Ionicons name="stats-chart-outline" size={20} color="#64748B" />
          <Text style={styles.emptyStatsText}>Aucune statistique disponible</Text>
        </View>
      );
    }

    return (
      <View style={styles.statsContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${currentStats.positivePercentage}%` }
              ]}
            />
          </View>
          <Text style={styles.percentageText}>
            {currentStats.positivePercentage}% satisfaction
          </Text>
        </View>
        
        <View style={styles.statsDetails}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.positiveIcon]}>
              <FontAwesome name="heart" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText}>{currentStats.positiveVotes} positifs</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.negativeIcon]}>
              <FontAwesome name="times" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText}>{currentStats.negativeVotes} négatifs</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, styles.neutralIcon]}>
              <Feather name="bar-chart-2" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.statText}>{currentStats.totalVotes} total</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.reservationCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="ticket-alt" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.offreTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.id_offre?.titre || 'Offre sans titre'}
          </Text>
          
          {userVote ? (
            <View style={[
              styles.voteBadge,
              userVote.isPositive ? styles.positiveBadge : styles.negativeBadge
            ]}>
              <FontAwesome
                name={userVote.isPositive ? "heart" : "times"} 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
          ) : (
            <View style={styles.voteCta}>
              <Text style={styles.voteCtaText}>Évaluer</Text>
              <Feather name="edit-3" size={16} color="#FFAA00" />
            </View>
          )}
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color="#64748B" />
            <Text style={styles.infoText}>
              Réservé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          
          {/* <View style={styles.infoRow}>
            <MaterialIcons name="business" size={16} color="#64748B" />
            <Text style={styles.infoText}>
              {item.id_offre?.id_entreprise?.nom || 'Entreprise non spécifiée'}
            </Text>
          </View> */}
        </View>

        {renderVoteStats()}
      </TouchableOpacity>
      
      <VoteModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        offreId={offreId}
        reservationId={item._id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#011F5B',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  offreTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  voteBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  positiveBadge: {
    backgroundColor: '#10B981',
  },
  negativeBadge: {
    backgroundColor: '#EF4444',
  },
  voteCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  voteCtaText: {
    color: '#FFAA00',
    fontWeight: '500',
    marginRight: 4,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 14,
  },
  statsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  loadingContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  emptyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyStatsText: {
    marginLeft: 8,
    color: '#64748B',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  percentageText: {
    color: '#011F5B',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
  },
  statsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  positiveIcon: {
    backgroundColor: '#10B981',
  },
  negativeIcon: {
    backgroundColor: '#EF4444',
  },
  neutralIcon: {
    backgroundColor: '#64748B',
  },
  statText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ReservationItem;