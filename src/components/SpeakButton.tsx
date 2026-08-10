import { Alert, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useI18n } from '../i18n/I18nContext';
import { speakChinese } from '../utils/speech';
import { colors, radius } from '../theme';

interface SpeakButtonProps {
  text: string;
  size?: number;
}

export function SpeakButton({ text, size = 22 }: SpeakButtonProps) {
  const { t } = useI18n();

  return (
    <Pressable
      onPress={() => {
        speakChinese(text).catch(error => {
          const message =
            error instanceof Error
              ? error.message
              : t('speech.checkAudio');
          Alert.alert(t('speech.couldNotPlay'), message);
        });
      }}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityLabel={t('speech.playPronunciation')}
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
