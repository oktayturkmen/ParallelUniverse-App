import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';
import { Universe } from '../constants/universes';

interface UniverseCardProps {
    universe: Universe;
    onPress: (universe: Universe) => void;
    isSelected?: boolean;
}

const UniverseCard = ({ universe, onPress, isSelected = false }: UniverseCardProps) => {
    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={() => onPress(universe)}
            activeOpacity={0.8}
        >
            <Image source={{ uri: universe.imageUrl }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.name}>{universe.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {universe.description}
                </Text>
            </View>
            {isSelected && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#4CAF50',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        opacity: 0.7,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        color: '#CCCCCC',
        fontSize: 14,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
});

export default UniverseCard;
