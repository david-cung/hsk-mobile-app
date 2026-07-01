import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { speakChinese } from '../utils/speech';
import { colors, radius } from '../theme';

interface SpeakButtonProps {
  text: string;
  size?: number;
}

export function SpeakButton({ text, size = 22 }: SpeakButtonProps) {
  return (
    <Pressable
      onPress={() => {
        speakChinese(text).catch(() => {});
      }}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel="Play pronunciation"
      hitSlop={8}
    >
      <Ionicons name="volume-medium" size={size} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryFixed,
  },
  pressed: { opacity: 0.7 },
});
