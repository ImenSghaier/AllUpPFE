import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Dimensions, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { createVoteAction } from '../redux/actions/voteActions';

const { width } = Dimensions.get('window');

const VoteModal = ({ visible, onClose, offreId }) => {
  const dispatch = useDispatch();
  const [commentaire, setCommentaire] = useState('');
  const [isPositive, setIsPositive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (isPositive === null) {
      Alert.alert('Erreur', 'Veuillez choisir un vote');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(createVoteAction(offreId, isPositive, commentaire));
      onClose();
      setIsPositive(null);
      setCommentaire('');
      Alert.alert('Succès', 'Votre vote a été enregistré');
    } catch (error) {
      if (error.response?.data?.message === "Vous avez déjà voté pour cette offre") {
        Alert.alert('Déjà voté', 'Vous avez déjà voté pour cette offre');
        onClose();
      } else {
        Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors du vote');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsPositive(null);
    setCommentaire('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Overlay color feedback */}
        <View
          style={[
            styles.voteFeedbackOverlay,
            isPositive === true && { backgroundColor: 'rgba(76, 175, 80, 0.3)' },
            isPositive === false && { backgroundColor: 'rgba(244, 67, 54, 0.3)' },
          ]}
        />

        {/* Large central icon */}
        {isPositive !== null && (
          <View style={styles.largeIconContainer}>
            <FontAwesome
              name={isPositive ? 'heart' : 'times'}
              size={100}
              color={isPositive ? '#E91E63' : '#F44336'}
            />
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>Donnez votre avis</Text>

        {/* Vote buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.fabButton,
              { backgroundColor: '#F44336' },
              isPositive === false && styles.negativeSelected,
            ]}
            onPress={() => setIsPositive(false)}
            disabled={isLoading}
          >
            <FontAwesome name="times" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.fabButton,
              { backgroundColor: '#4CAF50' },
              isPositive === true && styles.positiveSelected,
            ]}
            onPress={() => setIsPositive(true)}
            disabled={isLoading}
          >
            <FontAwesome name="heart" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* Comment input */}
        <TextInput
          style={styles.commentaireInput}
          placeholder="Ajouter un commentaire (optionnel)"
          multiline
          value={commentaire}
          onChangeText={setCommentaire}
          editable={!isLoading}
        />

        {/* Action buttons */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (isPositive === null || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleVote}
          disabled={isPositive === null || isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? 'Envoi...' : 'Valider'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={handleClose} disabled={isLoading}>
          <Text style={styles.closeText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  voteFeedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    borderRadius: 20,
  },
  largeIconContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    zIndex: 10,
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  fabButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  positiveSelected: {
    backgroundColor: '#388E3C', // Darker green for selection
  },
  negativeSelected: {
    backgroundColor: '#D32F2F', // Darker red for selection
  },
  commentaireInput: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    color: '#ccc',
    fontSize: 16,
  },
});

export default VoteModal;