import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { requestCameraPermission } from '../utils/permissions';
import { useGeneration } from '../context/GenerationContext';

const UploadScreen = () => {
    const navigation = useNavigation();
    const { setSelectedImage } = useGeneration();
    const [localImage, setLocalImage] = useState<Asset | null>(null);

    const handleCameraLaunch = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
        }

        launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                Alert.alert('Error', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setLocalImage(response.assets[0]);
            }
        });
    };

    const handleGalleryLaunch = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled gallery');
            } else if (response.errorCode) {
                console.log('Gallery Error: ', response.errorMessage);
                Alert.alert('Error', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                setLocalImage(response.assets[0]);
            }
        });
    };

    const handleContinue = () => {
        if (localImage) {
            setSelectedImage(localImage);
            navigation.navigate('UniverseSelect' as never);
        } else {
            Alert.alert('No Image', 'Please select or take a photo first.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload Photo</Text>

            <View style={styles.previewContainer}>
                {localImage ? (
                    <Image source={{ uri: localImage.uri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>No Image Selected</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Take Photo" onPress={handleCameraLaunch} />
                <View style={styles.spacer} />
                <Button title="Choose from Gallery" onPress={handleGalleryLaunch} />
            </View>

            {localImage && (
                <View style={styles.continueButtonContainer}>
                    <Button title="Continue" onPress={handleContinue} color="#4CAF50" />
                </View>
            )}
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
        marginBottom: 20,
        fontWeight: 'bold',
    },
    previewContainer: {
        width: 300,
        height: 300,
        marginBottom: 30,
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#888',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    spacer: {
        width: 20,
    },
    continueButtonContainer: {
        width: '100%',
        marginTop: 10,
    },
});

export default UploadScreen;

