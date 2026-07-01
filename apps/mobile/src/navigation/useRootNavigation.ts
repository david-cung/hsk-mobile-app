import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';

/** Navigate to stack screens from inside tab navigator. */
export function useRootNavigation() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  return parent ?? navigation;
}
