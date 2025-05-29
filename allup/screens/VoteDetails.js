

import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVotesAction } from '../redux/actions/voteActions';
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart';

const VoteDetailsScreen = ({ route, navigation }) => {
  const { offreId } = route.params;
  const dispatch = useDispatch();
  const { votes, statistics, loading } = useSelector(state => state.vote);
  const currentStats = statistics[offreId];
  const offerVotes = votes.filter(v => v.offre === offreId);

  useEffect(() => {
    dispatch(fetchVotesAction(offreId));
  }, [dispatch, offreId]);

  // Préparer les données pour le graphique (évolution des votes dans le temps)
  const prepareChartData = () => {
    const sortedVotes = [...offerVotes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    let positiveCount = 0;
    let negativeCount = 0;
    const data = [];
    
    sortedVotes.forEach((vote, index) => {
      if (vote.isPositive) positiveCount++;
      else negativeCount++;
      
      data.push({
        x: index + 1,
        y: Math.round(positiveCount / (index + 1)) * 100
      });
    });
    
    return data;
  };

  const chartData = prepareChartData();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#011F5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails des votes</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAA00" />
        </View>
      ) : (
        <>
          {/* Carte de résumé */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <FontAwesome5 name="poll" size={20} color="#FFAA00" />
              <Text style={styles.summaryTitle}>Résumé des votes</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentStats?.positivePercentage || 0}%</Text>
                <Text style={styles.statLabel}>Satisfaction</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentStats?.totalVotes || 0}</Text>
                <Text style={styles.statLabel}>Total votes</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.positiveStat]}>
                  {currentStats?.positiveVotes || 0}
                </Text>
                <Text style={styles.statLabel}>Positifs</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.negativeStat]}>
                  {currentStats?.negativeVotes || 0}
                </Text>
                <Text style={styles.statLabel}>Négatifs</Text>
              </View>
            </View>
          </View>

          {/* Graphique d'évolution */}
          <View style={styles.chartCard}>
            <View style={styles.summaryHeader}>
              <MaterialIcons name="trending-up" size={20} color="#FFAA00" />
              <Text style={styles.summaryTitle}>Évolution de la satisfaction</Text>
            </View>
            
            {chartData.length > 0 ? (
              <View style={styles.chartContainer}>
                <Chart
                  style={{ height: 200 }}
                  data={chartData}
                  padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                  xDomain={{ min: 1, max: chartData.length }}
                  yDomain={{ min: 0, max: 100 }}
                >
                  <VerticalAxis 
                    tickCount={6} 
                    theme={{ labels: { formatter: (v) => v.toFixed(0) } }} 
                  />
                  <HorizontalAxis tickCount={5} />
                  <Area 
                    theme={{ 
                      gradient: { 
                        from: { color: '#FFAA00', opacity: 0.4 }, 
                        to: { color: '#FFAA00', opacity: 0.1 } 
                      } 
                    }} 
                  />
                  <Line 
                    theme={{ 
                      stroke: { color: '#FFAA00', width: 2 },
                      scatter: { default: { width: 4, height: 4, rx: 2 } }
                    }} 
                  />
                </Chart>
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyText}>Pas assez de données pour afficher le graphique</Text>
              </View>
            )}
          </View>

          {/* Liste des votes */}
          <View style={styles.votesCard}>
            <View style={styles.summaryHeader}>
              <Feather name="list" size={20} color="#FFAA00" />
              <Text style={styles.summaryTitle}>Derniers votes</Text>
            </View>
            
            {offerVotes.length > 0 ? (
              offerVotes.slice(0, 5).map((vote, index) => (
                <View key={index} style={styles.voteItem}>
                  <View style={[
                    styles.voteIcon,
                    vote.isPositive ? styles.positiveVote : styles.negativeVote
                  ]}>
                    <Feather 
                      name={vote.isPositive ? "thumbs-up" : "thumbs-down"} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  
                  <View style={styles.voteInfo}>
                    <Text style={styles.voteUser}>
                      {vote.employe?.prenom} {vote.employe?.nom}
                    </Text>
                    <Text style={styles.voteDate}>
                      {new Date(vote.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  <Text style={[
                    styles.voteComment,
                    !vote.comment && styles.emptyComment
                  ]}>
                    {vote.comment || 'Pas de commentaire'}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyVotes}>
                <Text style={styles.emptyText}>Aucun vote enregistré</Text>
              </View>
            )}
            
            {offerVotes.length > 5 && (
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => navigation.navigate('AllVotes', { offreId })}
              >
                <Text style={styles.seeAllText}>Voir tous les votes ({offerVotes.length})</Text>
                <Feather name="chevron-right" size={18} color="#FFAA00" />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#011F5B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  votesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#011F5B',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    padding: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#011F5B',
    marginBottom: 4,
  },
  positiveStat: {
    color: '#10B981',
  },
  negativeStat: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  chartContainer: {
    marginTop: 8,
  },
  emptyChart: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  voteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  voteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  positiveVote: {
    backgroundColor: '#10B981',
  },
  negativeVote: {
    backgroundColor: '#EF4444',
  },
  voteInfo: {
    flex: 1,
  },
  voteUser: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  voteDate: {
    fontSize: 12,
    color: '#64748B',
  },
  voteComment: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
    maxWidth: '40%',
  },
  emptyComment: {
    color: '#94A3B8',
  },
  emptyVotes: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  seeAllText: {
    color: '#FFAA00',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default VoteDetailsScreen;