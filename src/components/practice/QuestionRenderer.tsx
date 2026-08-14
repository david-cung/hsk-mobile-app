import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type {
  PracticeAnswer,
  PracticeOption,
  PracticeQuestion,
} from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { localizeText } from '../../i18n/content';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../Button';

type QuestionProps = {
  question: PracticeQuestion;
  answer?: PracticeAnswer;
  onChange: (answer: PracticeAnswer) => void;
  disabled?: boolean;
};

function optionLabel(
  option: PracticeOption,
  language: 'en' | 'vi',
): string {
  return localizeText(option.translations, language, option.text);
}

export function MultipleChoiceQuestion({
  question,
  answer,
  onChange,
  disabled,
}: QuestionProps) {
  const { language } = useI18n();
  const selected = typeof answer === 'string' ? answer : '';
  return (
    <View>
      {question.configuration.options?.map(option => (
        <Pressable
          key={option.id}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === option.id, disabled }}
          disabled={disabled}
          onPress={() => onChange(option.id)}
          style={[
            styles.option,
            selected === option.id && styles.optionSelected,
            disabled && styles.disabled,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              selected === option.id && styles.optionTextSelected,
            ]}
          >
            {optionLabel(option, language)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function MultipleSelectQuestion({
  question,
  answer,
  onChange,
  disabled,
}: QuestionProps) {
  const { language } = useI18n();
  const selected = Array.isArray(answer) ? answer : [];
  return (
    <View>
      {question.configuration.options?.map(option => {
        const active = selected.includes(option.id);
        return (
          <Pressable
            key={option.id}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active, disabled }}
            disabled={disabled}
            onPress={() =>
              onChange(
                active
                  ? selected.filter(item => item !== option.id)
                  : [...selected, option.id],
              )
            }
            style={[
              styles.option,
              active && styles.optionSelected,
              disabled && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                active && styles.optionTextSelected,
              ]}
            >
              {optionLabel(option, language)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function TextInputQuestion({
  answer,
  onChange,
  disabled,
}: QuestionProps) {
  const { t } = useI18n();
  return (
    <TextInput
      accessibilityLabel={t('practiceSession.answerLabel')}
      value={typeof answer === 'string' ? answer : ''}
      onChangeText={onChange}
      editable={!disabled}
      autoCapitalize="none"
      autoCorrect={false}
      multiline
      placeholder={t('practiceSession.answerPlaceholder')}
      placeholderTextColor={colors.onSurfaceVariant}
      style={styles.input}
    />
  );
}

export function FillBlankQuestion(props: QuestionProps) {
  return <TextInputQuestion {...props} />;
}

export function TranslationQuestion(props: QuestionProps) {
  return <TextInputQuestion {...props} />;
}

export function OrderingQuestion({
  question,
  answer,
  onChange,
  disabled,
}: QuestionProps) {
  const { language, t } = useI18n();
  const selected = Array.isArray(answer) ? answer : [];
  const items = question.configuration.items ?? [];
  const byId = new Map(items.map(item => [item.id, item]));
  const remaining = items.filter(item => !selected.includes(item.id));
  return (
    <View>
      <Text style={styles.helper}>{t('practiceSession.orderingHint')}</Text>
      <View style={styles.chips}>
        {selected.map(itemId => {
          const item = byId.get(itemId);
          return item ? (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={optionLabel(item, language)}
              disabled={disabled}
              onPress={() =>
                onChange(selected.filter(selectedId => selectedId !== item.id))
              }
              style={[styles.chip, styles.chipSelected]}
            >
              <Text style={styles.chipSelectedText}>
                {optionLabel(item, language)}
              </Text>
            </Pressable>
          ) : null;
        })}
      </View>
      <View style={styles.chips}>
        {remaining.map(item => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={optionLabel(item, language)}
            disabled={disabled}
            onPress={() => onChange([...selected, item.id])}
            style={styles.chip}
          >
            <Text style={styles.chipText}>{optionLabel(item, language)}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        title={t('practiceSession.reset')}
        variant="ghost"
        disabled={disabled || selected.length === 0}
        onPress={() => onChange([])}
        style={styles.resetButton}
      />
    </View>
  );
}

export function MatchingQuestion({
  question,
  answer,
  onChange,
  disabled,
}: QuestionProps) {
  const { language, t } = useI18n();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const matches =
    answer && !Array.isArray(answer) && typeof answer === 'object'
      ? answer
      : {};
  const items = question.configuration.items ?? [];
  const targets = question.configuration.targets ?? [];
  return (
    <View>
      <Text style={styles.helper}>{t('practiceSession.matchingHint')}</Text>
      {items.map(item => (
        <View key={item.id} style={styles.matchRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={optionLabel(item, language)}
            disabled={disabled}
            onPress={() => setActiveItem(item.id)}
            style={[
              styles.matchItem,
              activeItem === item.id && styles.optionSelected,
            ]}
          >
            <Text style={styles.optionText}>{optionLabel(item, language)}</Text>
          </Pressable>
          <Text style={styles.arrow}>→</Text>
          <Text style={styles.matchValue}>
            {targets.find(target => target.id === matches[item.id])?.text ??
              t('practiceSession.notMatched')}
          </Text>
        </View>
      ))}
      <View style={styles.chips}>
        {targets.map(target => (
          <Pressable
            key={target.id}
            accessibilityRole="button"
            accessibilityLabel={optionLabel(target, language)}
            disabled={disabled || !activeItem}
            onPress={() => {
              if (!activeItem) return;
              onChange({ ...matches, [activeItem]: target.id });
              setActiveItem(null);
            }}
            style={[styles.chip, (!activeItem || disabled) && styles.disabled]}
          >
            <Text style={styles.chipText}>{optionLabel(target, language)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function GrammarQuestion(props: QuestionProps) {
  return props.question.configuration.options?.length ? (
    <MultipleChoiceQuestion {...props} />
  ) : (
    <TextInputQuestion {...props} />
  );
}

export function QuestionRenderer(props: QuestionProps) {
  switch (props.question.question_type) {
    case 'multiple_choice':
    case 'reading':
      return <MultipleChoiceQuestion {...props} />;
    case 'multiple_select':
      return <MultipleSelectQuestion {...props} />;
    case 'fill_blank':
      return <FillBlankQuestion {...props} />;
    case 'matching':
      return <MatchingQuestion {...props} />;
    case 'ordering':
      return <OrderingQuestion {...props} />;
    case 'translation':
      return <TranslationQuestion {...props} />;
    case 'grammar':
      return <GrammarQuestion {...props} />;
    default:
      return <TextInputQuestion {...props} />;
  }
}

const styles = StyleSheet.create({
  option: {
    padding: spacing.stackMd,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    marginBottom: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLow,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  optionText: { ...typography.bodyMd, color: colors.onSurface },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  disabled: { opacity: 0.55 },
  input: {
    ...typography.bodyMd,
    minHeight: 96,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.lg,
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow,
    textAlignVertical: 'top',
  },
  helper: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.stackSm,
    marginBottom: spacing.stackMd,
  },
  chip: {
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackSm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
  },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { ...typography.bodyMd, color: colors.onSurface },
  chipSelectedText: { ...typography.bodyMd, color: colors.onPrimary },
  resetButton: { alignSelf: 'flex-start' },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.stackSm,
  },
  matchItem: {
    flex: 1,
    padding: spacing.stackSm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  arrow: { marginHorizontal: spacing.stackSm, color: colors.onSurfaceVariant },
  matchValue: { ...typography.bodyMd, color: colors.primary, flex: 1 },
});
