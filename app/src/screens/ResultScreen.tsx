import React from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GenerationResult } from '../services/generationService';

const ResultScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { result } = route.params as { result: GenerationResult };

    if (!result) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Sonuç bulunamadı!</Text>
                <Button title="Geri" onPress={() => navigation.navigate('Welcome' as never)} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: result.generated_image_url }}
                        style={styles.generatedImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Senin Hikayen</Text>
                    <Text style={styles.storyText}>{result.story}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Karakter Kartı</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{result.character_card.name}</Text>
                        <Text style={styles.cardClass}>
                            {result.character_card.class_name} - Level {result.character_card.level}
                        </Text>

                        <View style={styles.statsContainer}>
                            {Object.entries(result.character_card.stats).map(([key, value]) => {
                                const statWidth = value.toString() + '%';
                                return (
                                    <View key={key} style={styles.statRow}>
                                        <Text style={styles.statLabel}>{key.toUpperCase()}</Text>
                                        <View style={styles.statBarContainer}>
                                            <View style={[styles.statBar, { width: statWidth }]} />
                                        </View>
                                        <Text style={styles.statValue}>{value}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <Button title="Yeni Oluştur" onPress={() => navigation.navigate('Welcome' as never)} />
                    <View style={{ marginTop: 10 }} />
                    <Button title="Galeri" onPress={() => navigation.navigate('Gallery' as never)} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        padding: 20,
    },
    imageContainer: {
        width: '100%',
        height: 400,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 30,
        backgroundColor: '#1E1E1E',
    },
    generatedImage: {
        width: '100%',
        height: '100%',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    storyText: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: '#333',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 5,
    },
    cardClass: {
        fontSize: 16,
        color: '#CCCCCC',
        marginBottom: 20,
    },
    statsContainer: {
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        flex: 1,
        fontSize: 12,
        color: '#888',
        fontWeight: 'bold',
    },
    statBarContainer: {
        flex: 3,
        height: 20,
        backgroundColor: '#333',
        borderRadius: 10,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    statBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    statValue: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
        width: 40,
        textAlign: 'right',
    },
    actions: {
        marginTop: 20,
        marginBottom: 40,
    },
    errorText: {
        fontSize: 18,
        color: '#FF5252',
        marginBottom: 20,
    },
});

export default ResultScreen;
