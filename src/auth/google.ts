import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '../config';


export const isGoogleSignInConfigured = Boolean(GOOGLE_WEB_CLIENT_ID);

if (GOOGLE_WEB_CLIENT_ID) {
  GoogleSignin.configure(
    GOOGLE_IOS_CLIENT_ID
      ? {
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iosClientId: GOOGLE_IOS_CLIENT_ID,
        }
      : {
          webClientId: GOOGLE_WEB_CLIENT_ID,
          googleServicePlistPath: 'GoogleService-Info',
        },
  );
}

export async function getGoogleIdToken(): Promise<string | null> {
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Google Sign-In is not configured.');
  }
  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();
  if (response.type !== 'success') {
    return null;
  }
  if (!response.data.idToken) {
    throw new Error('Google did not return an ID token.');
  }
  return response.data.idToken;
}

export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // App logout must still clear our own session if Google sign-out is unavailable.
  }
}
