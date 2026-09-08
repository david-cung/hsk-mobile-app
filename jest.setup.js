/* eslint-env jest */

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(async () => undefined),
  resetGenericPassword: jest.fn(async () => undefined),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(async () => ({ type: 'cancelled', data: null })),
    signOut: jest.fn(async () => null),
  },
}));

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => undefined),
  setDefaultLanguage: jest.fn(),
  setDefaultPitch: jest.fn(),
  setDefaultRate: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@sentry/react-native', () => ({ init: jest.fn() }));
