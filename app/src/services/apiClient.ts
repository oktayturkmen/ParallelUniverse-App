import axios from 'axios';
import { getDeviceId } from '../utils/deviceId';

// Using adb reverse for localhost connection
const BASE_URL =
    Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 90000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add device ID to all requests
apiClient.interceptors.request.use(async (config) => {
    const deviceId = await getDeviceId();
    config.headers['x-device-id'] = deviceId;
    return config;
});

export default apiClient;
