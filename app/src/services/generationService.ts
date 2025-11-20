import apiClient from './apiClient';
import { Asset } from 'react-native-image-picker';

export interface GenerationCreateResponse {
    job_id: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface CharacterCard {
    name: string;
    class_name: string;
    level: number;
    stats: {
        strength: number;
        agility: number;
        intelligence: number;
        charisma: number;
        luck: number;
    };
}

export interface GenerationResult {
    generated_image_url: string;
    story: string;
    character_card: CharacterCard;
}

export interface GenerationStatusResponse {
    id: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress: number;
    result: GenerationResult | null;
    created_at: string;
    updated_at: string;
}

export const createGeneration = async (
    universeId: string,
    image: Asset
): Promise<GenerationCreateResponse> => {
    const formData = new FormData();
    formData.append('universe_id', universeId);

    // Prepare image for upload
    formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || 'photo.jpg',
    } as any);

    const response = await apiClient.post<GenerationCreateResponse>(
        '/api/generations',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};

export const getGenerationStatus = async (
    jobId: string
): Promise<GenerationStatusResponse> => {
    const response = await apiClient.get<GenerationStatusResponse>(
        `/api/generations/${jobId}`
    );
    return response.data;
};

export const getUserGenerations = async (): Promise<GenerationStatusResponse[]> => {
    const deviceId = await import('../utils/deviceId').then(m => m.getDeviceId());
    const response = await apiClient.get<GenerationStatusResponse[]>(
        `/api/generations/user/${deviceId}`
    );
    return response.data;
};
