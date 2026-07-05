/* eslint-env jest */

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(async () => undefined),
  resetGenericPassword: jest.fn(async () => undefined),
}));

jest.mock('react-native-tts', () => ({
  setDefaultLanguage: jest.fn(),
  setDefaultRate: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
