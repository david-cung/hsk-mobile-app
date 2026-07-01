import { Platform } from 'react-native';

/**
 * API base URL for React Native CLI (no Expo env).
 * - iOS Simulator: localhost
 * - Android Emulator: 10.0.2.2 maps to host machine
 * - Physical device: set your Mac LAN IP, e.g. http://192.168.1.10:8000
 */
export const API_URL =
  process.env.API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');
