import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGeneration } from '../context/GenerationContext';
import { createGeneration, getGenerationStatus } from '../services/generationService';

const GeneratingScreen = () => {
    const navigation = useNavigation();
    const { selectedImage, selectedUniverse } = useGeneration();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('Başlatılıyor...');

    useEffect(() => {
        if (!selectedImage || !selectedUniverse) {
            Alert.alert('Hata', 'Fotoğraf veya evren seçilmemiş!');
            navigation.goBack();
            return;
        }

        startGeneration();
    }, []);

    const startGeneration = async () => {
        try {
            setStatus('AI işlem başlatılıyor...');

            const response = await createGeneration(selectedUniverse!.id, selectedImage!);
            setStatus('İşleniyor...');

            pollGenerationStatus(response.job_id);
        } catch (error) {
            console.error('Generation creation error:', error);
            Alert.alert('Hata', 'İşlem başlatılamadı. Lütfen tekrar deneyin.');
            navigation.goBack();
        }
    };

    const pollGenerationStatus = async (id: string) => {
        const pollInterval = setInterval(async () => {
            try {
                const statusResponse = await getGenerationStatus(id);
                setProgress(statusResponse.progress);

                if (statusResponse.status === 'PROCESSING') {
                    setStatus('AI çalışıyor...');
                } else if (statusResponse.status === 'COMPLETED') {
                    clearInterval(pollInterval);
                    setStatus('Tamamlandı!');

                    // Save to local storage
                    if (statusResponse.result) {
                        const { saveGenerationToStorage } = await import('../utils/storageService');
                        await saveGenerationToStorage(id, statusResponse.result, selectedUniverse!.id);
                    }

                    setTimeout(() => {
                        navigation.navigate('Result' as never, {
                            result: statusResponse.result
                        } as never);
                    }, 500);
                } else if (statusResponse.status === 'FAILED') {
                    clearInterval(pollInterval);
                    Alert.alert('Hata', 'İşlem başarısız oldu.');
                    navigation.goBack();
                }
            } catch (error) {
                console.error('Polling error:', error);
                clearInterval(pollInterval);
                Alert.alert('Hata', 'Bağlantı hatası.');
                navigation.goBack();
            }
        }, 2000);
    };

    const progressWidth = progress.toString() + '%';

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4CAF50" />

            <Text style={styles.title}>AI Avatar Oluşturuluyor...</Text>

            <Text style={styles.status}>{status}</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
            </View>

            <Text style={styles.hint}>
                Bu işlem birkaç saniye sürebilir...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        color: '#CCCCCC',
        marginBottom: 30,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    progressText: {
        fontSize: 18,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    hint: {
        fontSize: 14,
        color: '#888',
        marginTop: 30,
        textAlign: 'center',
    },
});

export default GeneratingScreen;
