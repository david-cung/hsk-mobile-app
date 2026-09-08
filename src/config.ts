import { Platform } from 'react-native';

const configuredApiUrl = process.env.API_URL ?? (Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000');
const appEnvironment = process.env.APP_ENV ?? 'development';

if (appEnvironment === 'production' && (!configuredApiUrl.startsWith('https://') || /localhost|127\.0\.0\.1/.test(configuredApiUrl))) {
  throw new Error('API_URL must be a public HTTPS URL in production builds');
}

export const API_URL = configuredApiUrl;
export const APP_ENV = appEnvironment;
export const APP_RELEASE = process.env.APP_RELEASE ?? 'dev';
export const AI_TUTOR_ENABLED = process.env.AI_TUTOR_ENABLED === 'true';
export const SPEAKING_ENABLED = appEnvironment === 'production' ? process.env.SPEAKING_ENABLED === 'true' : true;
export const SENTRY_DSN = process.env.SENTRY_DSN;

export const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
export const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID;
