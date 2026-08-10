import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { colors, radius, spacing, typography } from '../theme';

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language.title')}</Text>
      <Text style={styles.subtitle}>{t('language.subtitle')}</Text>
      <View style={styles.options}>
        {SUPPORTED_LANGUAGES.map(item => {
          const selected = item.code === language;
          return (
            <Pressable
              key={item.code}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${t('language.current')}: ${item.nativeName}`}
              onPress={() => setLanguage(item.code)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <View>
                <Text style={styles.nativeName}>{item.nativeName}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <Ionicons
                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={selected ? colors.primary : colors.onSurfaceVariant}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.stackLg, marginBottom: spacing.stackMd },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
  },
  options: { gap: spacing.stackSm },
  option: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  nativeName: { ...typography.labelMd, color: colors.onSurface },
  name: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
});
