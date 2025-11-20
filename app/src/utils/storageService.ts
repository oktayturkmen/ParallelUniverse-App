import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenerationResult } from '../services/generationService';

const STORAGE_KEY = '@parallel_universe_generations';

interface StoredGeneration {
    id: string;
    result: GenerationResult;
    timestamp: number;
    universeId: string;
}

export const saveGenerationToStorage = async (
    id: string,
    result: GenerationResult,
    universeId: string
): Promise<void> => {
    try {
        const existing = await getStoredGenerations();
        const newGeneration: StoredGeneration = {
            id,
            result,
            timestamp: Date.now(),
            universeId,
        };

        const updated = [newGeneration, ...existing];
        // Keep only last 50 generations
        const limited = updated.slice(0, 50);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
        console.error('Error saving generation to storage:', error);
    }
};

export const getStoredGenerations = async (): Promise<StoredGeneration[]> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    } catch (error) {
        console.error('Error reading generations from storage:', error);
        return [];
    }
};

export const clearStoredGenerations = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing generations from storage:', error);
    }
};
