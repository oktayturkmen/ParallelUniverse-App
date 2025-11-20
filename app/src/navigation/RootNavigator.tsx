import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import UploadScreen from '../screens/UploadScreen';
import UniverseSelectScreen from '../screens/UniverseSelectScreen';
import GeneratingScreen from '../screens/GeneratingScreen';
import ResultScreen from '../screens/ResultScreen';
import GalleryScreen from '../screens/GalleryScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Upload"
                component={UploadScreen}
                options={{ title: 'Upload Photo' }}
            />
            <Stack.Screen
                name="UniverseSelect"
                component={UniverseSelectScreen}
                options={{ title: 'Select Universe' }}
            />
            <Stack.Screen
                name="Generating"
                component={GeneratingScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Gallery"
                component={GalleryScreen}
                options={{ title: 'Gallery' }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;
