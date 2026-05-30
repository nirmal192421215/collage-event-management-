import { Platform } from 'react-native';

// For Android emulator to access localhost, use 10.0.2.2
// For Web or iOS simulator, use localhost
// For production, set EXPO_PUBLIC_API_URL in your deployment environment
export const API_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5005/api' : 'http://localhost:5005/api');
