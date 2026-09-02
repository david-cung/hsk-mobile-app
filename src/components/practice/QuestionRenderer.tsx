import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { audioApi, speakingApi } from '../../api/endpoints';
import type { PracticeQuestion } from '../../api/types';
import { useI18n } from '../../i18n/I18nContext';
import { colors, radius, spacing, typography } from '../../theme';
import { countChineseCharacters } from '../../utils/writing';
import { AudioRecorder, AudioRecordingResult } from '../audio/AudioRecorder';
import { AudioPlaybackState, AudioPlayer } from '../audio/AudioPlayer';
import { ScreenState } from '../ScreenState';

export type SpeakingAnswer = {
  recording_id?: number;
  recording_uri?: string;
  duration_seconds?: number;
};

export type PracticeAnswer = string | string[] | Array<{ left: string; right: string }> | SpeakingAnswer;

interface QuestionProps {
  question: PracticeQuestion;
  answer: PracticeAnswer;
  disabled?: boolean;
  onChange: (answer: PracticeAnswer) => void;
  onPlaybackChange?: (state: AudioPlaybackState) => void;
}

function optionLabel(option: { id: string; text: string }) {
  return option.text || option.id;
}

function preferredRecordingMimeType(question: PracticeQuestion) {
  const recording = question.config.recording;
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
      {question.config.options?.map(option => (
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
      {question.config.options?.map(option => {
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
  return props.question.config.options?.length ? <MultipleChoiceQuestion {...props} /> : <TextInputQuestion {...props} />;
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
      placeholder={String(question.config.placeholder ?? '')}
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
  const items = question.config.items ?? question.config.tokens ?? [];
  const remaining = items.filter(item => !selected.includes(item.id));

  return (
    <View>
      <View style={styles.wordBank}>
        {remaining.map(item => (
          <Pressable
            key={item.id}
            disabled={disabled}
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
  const min = typeof question.config.min_characters === 'number' ? question.config.min_characters : null;
  const max = typeof question.config.max_characters === 'number' ? question.config.max_characters : null;
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
      {question.config.required_vocabulary?.length ? (
        <Text style={styles.writingTargets}>
          {t('writing.vocabularyTargets')}: {question.config.required_vocabulary.join(', ')}
        </Text>
      ) : null}
      {question.config.required_grammar?.length ? (
        <Text style={styles.writingTargets}>
          {t('writing.grammarTargets')}: {question.config.required_grammar.join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

export function MatchingQuestion({ question, answer, disabled, onChange }: QuestionProps) {
  const pairs = Array.isArray(answer) ? answer as Array<{ left: string; right: string }> : [];
  const left = question.config.left ?? [];
  const right = question.config.right ?? [];

  return (
    <View style={styles.matching}>
      {left.map((leftItem, index) => {
        const selectedRight = pairs.find(pair => pair.left === leftItem.id)?.right ?? '';
        return (
          <View key={leftItem.id} style={styles.matchRow}>
            <Text style={styles.matchText}>{leftItem.text}</Text>
            <View style={styles.matchOptions}>
              {right.map(rightItem => {
                const selected = selectedRight === rightItem.id;
                return (
                  <Pressable
                    key={rightItem.id}
                    disabled={disabled}
                    style={[styles.smallOption, selected && styles.optionSelected]}
                    onPress={() => {
                      const withoutLeft = pairs.filter(pair => pair.left !== leftItem.id);
                      onChange([...withoutLeft, { left: leftItem.id, right: rightItem.id }]);
                    }}
                  >
                    <Text style={styles.smallOptionText}>{rightItem.text || String(index + 1)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function ListeningQuestion(props: QuestionProps) {
  const { t } = useI18n();
  const audioAssetId = Number(props.question.config.audio_asset_id);
  const audioQuery = useQuery({
    queryKey: ['audio-url', audioAssetId],
    queryFn: () => audioApi.url(audioAssetId),
    enabled: Number.isFinite(audioAssetId),
    staleTime: 10 * 60 * 1000,
  });
  const answerType = String(props.question.config.answer_type ?? 'MULTIPLE_CHOICE');
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
          autoPlay={Boolean(props.question.config.auto_play)}
          allowSeek={Boolean(props.question.config.allow_seek)}
          replayLimit={
            typeof props.question.config.replay_limit === 'number'
              ? props.question.config.replay_limit
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
  const audioAssetId = Number(props.question.config.audio_asset_id);
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
          {String(props.question.config.display_text || props.question.config.expected_text || props.question.prompt)}
        </Text>
        {props.question.config.pinyin ? <Text style={styles.speakingPinyin}>{String(props.question.config.pinyin)}</Text> : null}
        {props.question.config.translation ? (
          <Text style={styles.speakingTranslation}>{String(props.question.config.translation)}</Text>
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
            transcript={String(props.question.config.expected_text || '')}
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
  switch (props.question.question_type) {
    case 'MULTIPLE_CHOICE':
    case 'READING':
      return <MultipleChoiceQuestion {...props} />;
    case 'LISTENING':
      return <ListeningQuestion {...props} />;
    case 'SPEAKING':
    case 'PRONUNCIATION':
      return <SpeakingQuestion {...props} />;
    case 'MULTIPLE_SELECT':
      return <MultipleSelectQuestion {...props} />;
    case 'FILL_BLANK':
    case 'DICTATION':
      return <FillBlankQuestion {...props} />;
    case 'ORDERING':
    case 'WORD_ORDER':
    case 'SENTENCE_REORDER':
      return <OrderingQuestion {...props} />;
    case 'MATCHING':
      return <MatchingQuestion {...props} />;
    case 'TRANSLATION':
    case 'TRANSLATION_TO_CHINESE':
      return <TranslationQuestion {...props} />;
    case 'GUIDED_WRITING':
      return <GuidedWritingQuestion {...props} />;
    case 'GRAMMAR':
      return <GrammarQuestion {...props} />;
    case 'TEXT_INPUT':
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
  matching: { gap: spacing.stackMd },
  matchRow: { gap: spacing.stackSm },
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
