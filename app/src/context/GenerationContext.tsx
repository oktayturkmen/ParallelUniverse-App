import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Asset } from 'react-native-image-picker';
import { Universe } from '../constants/universes';

interface GenerationContextType {
    selectedImage: Asset | null;
    setSelectedImage: (image: Asset | null) => void;
    selectedUniverse: Universe | null;
    setSelectedUniverse: (universe: Universe | null) => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider = ({ children }: { children: ReactNode }) => {
    const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
    const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);

    return (
        <GenerationContext.Provider
            value={{
                selectedImage,
                setSelectedImage,
                selectedUniverse,
                setSelectedUniverse,
            }}
        >
            {children}
        </GenerationContext.Provider>
    );
};

export const useGeneration = () => {
    const context = useContext(GenerationContext);
    if (!context) {
        throw new Error('useGeneration must be used within a GenerationProvider');
    }
    return context;
};
