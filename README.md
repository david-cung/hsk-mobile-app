# HSK Chinese Master — React Native CLI

Native mobile app (iOS & Android) using **React Native CLI** (not Expo).

## Requirements

- Node.js 20.19.4+ (or a supported Node 22/24 release)
- Xcode + CocoaPods (iOS)
- Android Studio + SDK (Android)
- API running at `http://localhost:8000` (see repo root README)

## API URL

Edit [`src/config.ts`](src/config.ts):

| Target | URL |
|--------|-----|
| iOS Simulator | `http://localhost:8000` |
| Android Emulator | `http://10.0.2.2:8000` (default) |
| Physical device | Your Mac LAN IP, e.g. `http://192.168.1.10:8000` |

## Run

```bash
# Terminal 1 — Metro
npm start

# Terminal 2 — iOS
npm run ios

# Terminal 2 — Android
npm run android
```

First iOS run (if needed):

```bash
cd ios && bundle exec pod install && cd ..
```

## Google Sign-In Setup

The app sends a Google ID token to the backend; it never contains a Google
client secret.

1. Create Android, iOS, and Web OAuth clients in Google Cloud.
2. Set `GOOGLE_WEB_CLIENT_ID` to the Web client ID used by the backend's
   `GOOGLE_CLIENT_ID`.
3. Set `GOOGLE_IOS_CLIENT_ID` for iOS, or add `GoogleService-Info.plist` to the
   Xcode target.
4. Configure Android package `com.hskchinesemaster` and its signing SHA-1/SHA-256.
5. Run `cd ios && bundle exec pod install` after installing dependencies.

Example:

```bash
GOOGLE_WEB_CLIENT_ID=...apps.googleusercontent.com \
GOOGLE_IOS_CLIENT_ID=...apps.googleusercontent.com \
npm start
```

Password reset currently accepts a reset token in the app. Configure the
`hsk://reset-password` deep link in the mobile platform projects when the
production email provider is connected.

## Stack

- React Native 0.85
- React Navigation
- TanStack Query
- `react-native-keychain` (access + refresh tokens)
- `@react-native-google-signin/google-signin` (Google ID-token acquisition)
- `react-native-tts` (Chinese pronunciation)
- `react-native-vector-icons` (Ionicons)

## Legacy Expo app

Previous Expo project is preserved at [`../mobile-expo-legacy`](../mobile-expo-legacy) for reference.
