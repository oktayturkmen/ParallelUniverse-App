import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStoredGenerations } from '../utils/storageService';
import { GenerationResult } from '../services/generationService';

interface StoredGeneration {
    id: string;
    result: GenerationResult;
    timestamp: number;
    universeId: string;
}

const GalleryScreen = () => {
    const navigation = useNavigation();
    const [generations, setGenerations] = useState<StoredGeneration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGenerations();
    }, []);

    const loadGenerations = async () => {
        try {
            const stored = await getStoredGenerations();
            setGenerations(stored);
        } catch (error) {
            console.error('Error loading generations:', error);
            Alert.alert('Hata', 'Geçmiş yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerationPress = (item: StoredGeneration) => {
        navigation.navigate('Result' as never, { result: item.result } as never);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    if (generations.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Henüz hiç oluşturma yok</Text>
                <Text style={styles.emptySubtext}>İlk avatar'ınızı oluşturun!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={generations}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.gridItem}
                        onPress={() => handleGenerationPress(item)}
                    >
                        <Image
                            source={{ uri: item.result.generated_image_url }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                        <View style={styles.overlay}>
                            <Text style={styles.universeText}>{item.universeId.toUpperCase()}</Text>
                            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    emptyText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#888',
    },
    listContainer: {
        padding: 10,
    },
    gridItem: {
        flex: 1,
        margin: 5,
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
        maxWidth: '48%',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 8,
    },
    universeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 10,
        color: '#CCCCCC',
    },
});

export default GalleryScreen;
