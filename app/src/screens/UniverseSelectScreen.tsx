import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UNIVERSES, Universe } from '../constants/universes';
import UniverseCard from '../components/UniverseCard';
import { useGeneration } from '../context/GenerationContext';

const UniverseSelectScreen = () => {
    const navigation = useNavigation();
    const { selectedUniverse, setSelectedUniverse, selectedImage } = useGeneration();

    const handleSelect = (universe: Universe) => {
        setSelectedUniverse(universe);
    };

    const handleGenerate = () => {
        if (!selectedImage) {
            Alert.alert('Error', 'No image selected. Please go back and upload a photo.');
            return;
        }
        if (!selectedUniverse) {
            Alert.alert('Select Universe', 'Please select a universe to continue.');
            return;
        }

        navigation.navigate('Generating' as never);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Choose Your Universe</Text>

            <FlatList
                data={UNIVERSES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <UniverseCard
                        universe={item}
                        onPress={handleSelect}
                        isSelected={selectedUniverse?.id === item.id}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <Button
                    title="Generate AI Avatar"
                    onPress={handleGenerate}
                    disabled={!selectedUniverse}
                    color={selectedUniverse ? '#4CAF50' : '#555'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    headerTitle: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
});

export default UniverseSelectScreen;
