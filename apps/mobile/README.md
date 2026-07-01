# HSK Chinese Master — React Native CLI

Native mobile app (iOS & Android) using **React Native CLI** (not Expo).

## Requirements

- Node.js 20+
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

## Stack

- React Native 0.85
- React Navigation
- TanStack Query
- `react-native-keychain` (auth token)
- `react-native-tts` (Chinese pronunciation)
- `react-native-vector-icons` (Ionicons)

## Legacy Expo app

Previous Expo project is preserved at [`../mobile-expo-legacy`](../mobile-expo-legacy) for reference.
