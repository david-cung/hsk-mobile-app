import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { audioApi, speakingApi } from '../../api/endpoints';
import type { PracticeAnswer, PracticeQuestion } from '../../api/types';
import { canonicalQuestionType, questionConfig } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { localizeText } from '../../i18n/content';
import { colors, radius, spacing, typography } from '../../theme';
import { countChineseCharacters } from '../../utils/writing';
import { AudioRecorder, AudioRecordingResult } from '../audio/AudioRecorder';
import { AudioPlaybackState, AudioPlayer } from '../audio/AudioPlayer';
import { ScreenState } from '../ScreenState';

export type { PracticeAnswer } from '../../api/types';

export type SpeakingAnswer = {
  recording_id?: number;
  recording_uri?: string;
  duration_seconds?: number;
};

interface QuestionProps {
  question: PracticeQuestion;
  answer?: PracticeAnswer;
  disabled?: boolean;
  onChange: (answer: PracticeAnswer) => void;
  onPlaybackChange?: (state: AudioPlaybackState) => void;
}

function optionLabel(option: { id: string; text: string; translations?: { en?: string; vi?: string; english?: string; vietnamese?: string } }, language?: 'en' | 'vi') {
  if (language && option.translations) {
    return localizeText(option.translations, language, option.text || option.id);
  }
  return option.text || option.id;
}

function cfg(question: PracticeQuestion) {
  return questionConfig(question);
}

function preferredRecordingMimeType(question: PracticeQuestion) {
  const recording = cfg(question).recording;
  if (recording && typeof recording === 'object' && !Array.isArray(recording)) {
    const value = (recording as Record<string, unknown>).preferred_mime_type;
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return 'audio/mp4';
}

export function MultipleChoiceQuestion({ question, answer, disabled, onChange }: QuestionProps) {
  const selected = String(answer || '');
  return (
    <View>
      {cfg(question).options?.map(option => (
        <Pressable
          key={option.id}
          disabled={disabled}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === option.id }}
          style={[styles.option, selected === option.id && styles.optionSelected]}
          onPress={() => onChange(option.id)}
        >
          <Text style={[styles.optionText, selected === option.id && styles.optionTextSelected]}>
            {optionLabel(option)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function MultipleSelectQuestion({ question, answer, disabled, onChange }: QuestionProps) {
  const selected = new Set(Array.isArray(answer) ? answer.map(String) : []);
  return (
    <View>
      {cfg(question).options?.map(option => {
        const isSelected = selected.has(option.id);
        return (
          <Pressable
            key={option.id}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => {
              const next = new Set(selected);
              if (next.has(option.id)) {
                next.delete(option.id);
              } else {
                next.add(option.id);
              }
              onChange(Array.from(next));
            }}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {optionLabel(option)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function FillBlankQuestion(props: QuestionProps) {
  return <TextInputQuestion {...props} />;
}

export function TranslationQuestion(props: QuestionProps) {
  return <TextInputQuestion {...props} multiline />;
}

export function GrammarQuestion(props: QuestionProps) {
  return cfg(props.question).options?.length ? (
    <MultipleChoiceQuestion {...props} />
  ) : (
    <TextInputQuestion {...props} />
  );
}

export function TextInputQuestion({
  question,
  answer,
  disabled,
  onChange,
  multiline,
}: QuestionProps & { multiline?: boolean }) {
  return (
    <TextInput
      value={typeof answer === 'string' ? answer : ''}
      editable={!disabled}
      onChangeText={onChange}
      placeholder={String(cfg(question).placeholder ?? '')}
      placeholderTextColor={colors.outline}
      autoCapitalize="none"
      autoCorrect={false}
      multiline={multiline}
      style={[styles.input, multiline && styles.multilineInput]}
    />
  );
}

export function OrderingQuestion({ question, answer, disabled, onChange }: QuestionProps) {
  const selected = Array.isArray(answer) ? answer.map(String) : [];
  const items = cfg(question).items ?? cfg(question).tokens ?? [];
  const remaining = items.filter(item => !selected.includes(item.id));

  return (
    <View>
      <View style={styles.wordBank}>
        {remaining.map(item => (
          <Pressable
            key={item.id}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={item.text}
            style={styles.chip}
            onPress={() => onChange([...selected, item.id])}
          >
            <Text style={styles.chipText}>{item.text}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.answerRow}>
        {selected.map(itemId => {
          const item = items.find(candidate => candidate.id === itemId);
          return (
            <Pressable
              key={itemId}
              disabled={disabled}
              style={[styles.chip, styles.selectedChip]}
              onPress={() => onChange(selected.filter(id => id !== itemId))}
            >
              <Text style={styles.chipText}>{item?.text ?? itemId}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function GuidedWritingQuestion({
  question,
  answer,
  disabled,
  onChange,
}: QuestionProps) {
  const { t, formatNumber } = useI18n();
  const value = typeof answer === 'string' ? answer : '';
  const count = countChineseCharacters(value);
  const min = typeof cfg(question).min_characters === 'number' ? cfg(question).min_characters : null;
  const max = typeof cfg(question).max_characters === 'number' ? cfg(question).max_characters : null;
  const rangeLabel = [
    min != null ? t('writing.minCharacters', { count: formatNumber(min) }) : null,
    max != null ? t('writing.maxCharacters', { count: formatNumber(max) }) : null,
  ].filter(Boolean).join(' · ');

  return (
    <View>
      <TextInputQuestion
        question={question}
        answer={answer}
        disabled={disabled}
        onChange={onChange}
        multiline
      />
      <View style={styles.writingMetaRow}>
        <Text style={styles.writingMeta}>
          {t('writing.characterCount', { count: formatNumber(count) })}
        </Text>
        {rangeLabel ? <Text style={styles.writingMeta}>{rangeLabel}</Text> : null}
      </View>
      {cfg(question).required_vocabulary?.length ? (
        <Text style={styles.writingTargets}>
          {t('writing.vocabularyTargets')}: {(cfg(question).required_vocabulary ?? []).join(', ')}
        </Text>
      ) : null}
      {cfg(question).required_grammar?.length ? (
        <Text style={styles.writingTargets}>
          {t('writing.grammarTargets')}: {(cfg(question).required_grammar ?? []).join(', ')}
        </Text>
      ) : null}
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
  const config = cfg(question);
  const items = config.items ?? config.left ?? [];
  const targets = config.targets ?? config.right ?? [];
  const matches: Record<string, string> =
    answer && !Array.isArray(answer) && typeof answer === 'object' && !('recording_id' in answer)
      ? (answer as Record<string, string>)
      : {};
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

export function ListeningQuestion(props: QuestionProps) {
  const { t } = useI18n();
  const audioAssetId = Number(cfg(props.question).audio_asset_id);
  const audioQuery = useQuery({
    queryKey: ['audio-url', audioAssetId],
    queryFn: () => audioApi.url(audioAssetId),
    enabled: Number.isFinite(audioAssetId),
    staleTime: 10 * 60 * 1000,
  });
  const answerType = canonicalQuestionType(
    String(cfg(props.question).answer_type ?? 'multiple_choice'),
  );
  const nestedQuestion: PracticeQuestion = {
    ...props.question,
    question_type: answerType,
  };

  return (
    <View>
      {audioQuery.isLoading ? (
        <ScreenState type="loading" title={t('audio.loading')} compact />
      ) : audioQuery.isError ? (
        <ScreenState
          type="error"
          title={t('audio.unavailable')}
          message={audioQuery.error instanceof Error ? audioQuery.error.message : undefined}
          actionLabel={t('common.tryAgain')}
          onAction={() => audioQuery.refetch()}
          compact
        />
      ) : (
        <AudioPlayer
          sourceUrl={audioQuery.data?.url}
          provider={audioQuery.data?.provider}
          autoPlay={Boolean(cfg(props.question).auto_play)}
          allowSeek={Boolean(cfg(props.question).allow_seek)}
          replayLimit={
            typeof cfg(props.question).replay_limit === 'number'
              ? cfg(props.question).replay_limit
              : null
          }
          onPlaybackChange={props.onPlaybackChange}
        />
      )}
      <QuestionRenderer {...props} question={nestedQuestion} />
    </View>
  );
}

export function SpeakingQuestion(props: QuestionProps) {
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastRecording, setLastRecording] = useState<AudioRecordingResult | null>(null);
  const audioAssetId = Number(cfg(props.question).audio_asset_id);
  const hasReferenceAudio = Number.isFinite(audioAssetId) && audioAssetId > 0;
  const audioQuery = useQuery({
    queryKey: ['speaking-audio-url', audioAssetId],
    queryFn: () => audioApi.url(audioAssetId),
    enabled: hasReferenceAudio,
    staleTime: 10 * 60 * 1000,
  });

  const uploadRecording = async (recording: AudioRecordingResult) => {
    setLastRecording(recording);
    setUploading(true);
    setUploadError(null);
    try {
      const upload = await speakingApi.requestUpload({
        filename: recording.filename,
        mime_type: recording.mimeType,
        size_bytes: recording.sizeBytes,
        duration_seconds: recording.durationSeconds,
        language: 'zh-CN',
        metadata: { local_uri: recording.uri },
      });
      await speakingApi.completeUpload(upload.recording_id, {
        size_bytes: recording.sizeBytes,
        duration_seconds: recording.durationSeconds,
        metadata: { local_uri: recording.uri, upload_url: upload.upload_url },
      });
      props.onChange({
        recording_id: upload.recording_id,
        recording_uri: recording.uri,
        duration_seconds: recording.durationSeconds,
      });
    } catch (exc) {
      setUploadError(exc instanceof Error ? exc.message : t('speaking.uploadFailed'));
      props.onChange({});
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <View style={styles.speakingTarget}>
        <Text style={styles.speakingText}>
          {String(cfg(props.question).display_text || cfg(props.question).expected_text || props.question.prompt)}
        </Text>
        {cfg(props.question).pinyin ? <Text style={styles.speakingPinyin}>{String(cfg(props.question).pinyin)}</Text> : null}
        {cfg(props.question).translation ? (
          <Text style={styles.speakingTranslation}>{String(cfg(props.question).translation)}</Text>
        ) : null}
      </View>
      {hasReferenceAudio ? (
        audioQuery.isLoading ? (
          <ScreenState type="loading" title={t('audio.loading')} compact />
        ) : audioQuery.isError ? (
          <ScreenState
            type="error"
            title={t('audio.unavailable')}
            actionLabel={t('common.tryAgain')}
            onAction={() => audioQuery.refetch()}
            compact
          />
        ) : (
          <AudioPlayer
            sourceUrl={audioQuery.data?.url}
            provider={audioQuery.data?.provider}
            transcript={String(cfg(props.question).expected_text || '')}
            allowSeek
            onPlaybackChange={props.onPlaybackChange}
          />
        )
      ) : null}
      <AudioRecorder
        disabled={props.disabled || uploading}
        preferredMimeType={preferredRecordingMimeType(props.question)}
        onRecordingReady={uploadRecording}
      />
      {uploading ? <ScreenState type="loading" title={t('speaking.uploading')} compact style={styles.inlineState} /> : null}
      {uploadError ? (
        <ScreenState
          type="error"
          title={t('speaking.uploadFailed')}
          message={uploadError}
          actionLabel={t('common.tryAgain')}
          onAction={() => {
            if (lastRecording) {
              uploadRecording(lastRecording);
            }
          }}
          compact
          style={styles.inlineState}
        />
      ) : null}
    </View>
  );
}

export function QuestionRenderer(props: QuestionProps) {
  switch (canonicalQuestionType(props.question.question_type)) {
    case 'multiple_choice':
    case 'reading':
      return <MultipleChoiceQuestion {...props} />;
    case 'listening':
      return <ListeningQuestion {...props} />;
    case 'speaking':
    case 'pronunciation':
      return <SpeakingQuestion {...props} />;
    case 'multiple_select':
      return <MultipleSelectQuestion {...props} />;
    case 'fill_blank':
    case 'dictation':
      return <FillBlankQuestion {...props} />;
    case 'ordering':
    case 'word_order':
    case 'sentence_reorder':
      return <OrderingQuestion {...props} />;
    case 'matching':
      return <MatchingQuestion {...props} />;
    case 'translation':
    case 'translation_to_chinese':
      return <TranslationQuestion {...props} />;
    case 'guided_writing':
    case 'writing':
      return <GuidedWritingQuestion {...props} />;
    case 'grammar':
      return <GrammarQuestion {...props} />;
    case 'text_input':
    case 'vocabulary_recall':
    default:
      return <TextInputQuestion {...props} />;
  }
}

const styles = StyleSheet.create({
  option: {
    padding: spacing.stackMd,
    borderRadius: radius.md,
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
  input: {
    ...typography.bodyMd,
    minHeight: 52,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLow,
  },
  multilineInput: { minHeight: 112, textAlignVertical: 'top' },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm, marginBottom: spacing.stackMd },
  answerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm, minHeight: 44 },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLowest,
  },
  selectedChip: { backgroundColor: colors.primaryFixed },
  chipText: { ...typography.bodyMd, color: colors.onSurface },
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
  disabled: { opacity: 0.55 },
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
  matchText: { ...typography.bodyMd, color: colors.onSurface },
  matchOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm },
  smallOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: spacing.stackSm,
  },
  smallOptionText: { ...typography.labelMd, color: colors.onSurface },
  speakingTarget: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.stackMd,
    marginBottom: spacing.stackMd,
  },
  speakingText: { ...typography.bodyZh, color: colors.onSurface, fontSize: 26 },
  speakingPinyin: { ...typography.bodyMd, color: colors.primary, marginTop: spacing.stackSm },
  speakingTranslation: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  inlineState: { marginTop: spacing.stackSm },
  writingMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.stackSm, marginTop: spacing.stackSm },
  writingMeta: { ...typography.labelSm, color: colors.onSurfaceVariant },
  writingTargets: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: spacing.stackSm },
});
