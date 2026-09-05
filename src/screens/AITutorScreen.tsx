import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import { tutorApi } from '../api/endpoints';
import { ApiError } from '../api/client';
import type { AiMessageAction, AiTutorMessage, AiTutorMode, RolePlayScenario } from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenState } from '../components/ScreenState';
import { useI18n } from '../i18n/I18nContext';
import { localizeText } from '../i18n/content';
import { useRootNavigation } from '../navigation/useRootNavigation';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

const MODES: Array<{ id: AiTutorMode; labelKey: 'aiTutor.mode.freeChat' | 'aiTutor.mode.lesson' | 'aiTutor.mode.rolePlay' | 'aiTutor.mode.grammar' | 'aiTutor.mode.vocabulary' }> = [
  { id: 'FREE_CHAT', labelKey: 'aiTutor.mode.freeChat' },
  { id: 'LESSON_PRACTICE', labelKey: 'aiTutor.mode.lesson' },
  { id: 'ROLE_PLAY', labelKey: 'aiTutor.mode.rolePlay' },
  { id: 'GRAMMAR_PRACTICE', labelKey: 'aiTutor.mode.grammar' },
  { id: 'VOCABULARY_PRACTICE', labelKey: 'aiTutor.mode.vocabulary' },
];

const ACTIONS: Array<{ id: AiMessageAction; labelKey: 'aiTutor.action.explain' | 'aiTutor.action.correct' | 'aiTutor.action.pinyin' | 'aiTutor.action.translate' }> = [
  { id: 'explain', labelKey: 'aiTutor.action.explain' },
  { id: 'correct', labelKey: 'aiTutor.action.correct' },
  { id: 'pinyin', labelKey: 'aiTutor.action.pinyin' },
  { id: 'translate', labelKey: 'aiTutor.action.translate' },
];

export function AITutorScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'AiTutor'>>();
  const navigation = useRootNavigation();
  const { language, t } = useI18n();
  const queryClient = useQueryClient();
  const params = route.params;
  const [conversationId, setConversationId] = useState(params?.conversationId);
  const [selectedMode, setSelectedMode] = useState<AiTutorMode | undefined>(params?.mode);
  const [draft, setDraft] = useState('');
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const pendingKey = useRef<string | null>(null);
  const didAutoStart = useRef(false);

  const scenariosQuery = useQuery({
    queryKey: ['ai-scenarios'],
    queryFn: tutorApi.scenarios,
    enabled: !conversationId,
  });
  const conversationQuery = useQuery({
    queryKey: ['ai-conversation', conversationId],
    queryFn: () => tutorApi.detail(conversationId!),
    enabled: conversationId != null,
  });

  const createMutation = useMutation({
    mutationFn: tutorApi.create,
    onSuccess: conversation => {
      setConversationId(conversation.id);
      queryClient.setQueryData(['ai-conversation', conversation.id], { ...conversation, messages: conversation.messages ?? [] });
    },
  });
  const sendMutation = useMutation({
    mutationFn: (data: { content: string; action?: AiMessageAction; idempotency_key: string }) =>
      tutorApi.sendMessage(conversationId!, data),
    onSuccess: result => {
      pendingKey.current = null;
      queryClient.setQueryData(['ai-conversation', conversationId], result.conversation);
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
    },
  });

  const messages = conversationQuery.data?.messages ?? [];
  const startConversation = (mode: AiTutorMode, scenarioId?: string) => {
    setSelectedMode(mode);
    if (mode === 'ROLE_PLAY' && !scenarioId) {
      return;
    }
    createMutation.mutate({
      mode,
      scenario_id: scenarioId,
      lesson_id: params?.lessonId,
      title: params?.lessonTitle,
    });
  };

  useEffect(() => {
    if (didAutoStart.current || conversationId || !params?.mode || params.mode === 'ROLE_PLAY') {
      return;
    }
    didAutoStart.current = true;
    createMutation.mutate({
      mode: params.mode,
      scenario_id: params.scenarioId,
      lesson_id: params.lessonId,
      title: params.lessonTitle,
    });
  }, [conversationId, createMutation, params]);

  const send = (content: string, action?: AiMessageAction) => {
    const text = content.trim();
    if (!text || !conversationId || sendMutation.isPending) {
      return;
    }
    const key = pendingKey.current ?? `${Date.now()}:${action ?? 'reply'}:${text.slice(0, 24)}`;
    pendingKey.current = key;
    sendMutation.mutate({ content: text, action, idempotency_key: key });
    if (!action) {
      setDraft('');
    }
  };

  const errorMessage =
    sendMutation.error instanceof ApiError
      ? sendMutation.error.message
      : createMutation.error instanceof ApiError
        ? createMutation.error.message
        : t('common.connectionRetry');

  if (!conversationId) {
    if (scenariosQuery.isLoading || createMutation.isPending) {
      return <ScreenState type="loading" title={t('aiTutor.loading')} />;
    }
    if (scenariosQuery.isError) {
      return (
        <ScreenState
          type="error"
          title={t('aiTutor.couldNotLoad')}
          message={t('common.connectionRetry')}
          actionLabel={t('common.tryAgain')}
          onAction={() => scenariosQuery.refetch()}
        />
      );
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{t('aiTutor.chooseMode')}</Text>
        <Button
          title={t('aiTutor.history')}
          variant="ghost"
          onPress={() => navigation.navigate('AiTutorHistory')}
          accessibilityLabel={t('aiTutor.history')}
          style={styles.historyButton}
        />
        {MODES.map(mode => (
          <Pressable
            key={mode.id}
            accessibilityRole="button"
            accessibilityLabel={t(mode.labelKey)}
            accessibilityState={{ selected: selectedMode === mode.id }}
            onPress={() => startConversation(mode.id)}
            style={[styles.modeItem, selectedMode === mode.id && styles.modeSelected]}
          >
            <Text style={styles.modeLabel}>{t(mode.labelKey)}</Text>
          </Pressable>
        ))}
        {selectedMode === 'ROLE_PLAY' ? (
          <View style={styles.scenarioList}>
            <Text style={styles.heading}>{t('aiTutor.chooseScenario')}</Text>
            {(scenariosQuery.data ?? []).map((scenario: RolePlayScenario) => (
              <Pressable
                key={scenario.id}
                accessibilityRole="button"
                accessibilityLabel={localizeText(scenario.title_translations, language, scenario.title)}
                onPress={() => startConversation('ROLE_PLAY', scenario.id)}
                style={styles.modeItem}
              >
                <Text style={styles.modeLabel}>{localizeText(scenario.title_translations, language, scenario.title)}</Text>
                {scenario.description ? <Text style={styles.modeHint}>{localizeText(scenario.description_translations, language, scenario.description)}</Text> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
        {createMutation.isError ? (
          <ScreenState
            type="error"
            title={t('aiTutor.couldNotStart')}
            message={errorMessage}
            actionLabel={t('common.tryAgain')}
            onAction={() => selectedMode && startConversation(selectedMode)}
            compact
          />
        ) : null}
      </ScrollView>
    );
  }

  if (conversationQuery.isLoading) {
    return <ScreenState type="loading" title={t('aiTutor.loading')} />;
  }
  if (conversationQuery.isError) {
    return (
      <ScreenState
        type="error"
        title={t('aiTutor.couldNotLoad')}
        message={t('common.connectionRetry')}
        actionLabel={t('common.tryAgain')}
        onAction={() => conversationQuery.refetch()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.chatContent}>
        {messages.length === 0 ? (
          <ScreenState type="empty" title={t('aiTutor.empty')} message={t('aiTutor.emptyMessage')} compact />
        ) : (
          messages.map((message: AiTutorMessage) => (
            <Card key={message.id} style={message.role === 'USER' ? styles.userBubble : styles.assistantBubble}>
              <Text style={styles.role}>{message.role === 'USER' ? t('aiTutor.you') : t('aiTutor.tutor')}</Text>
              <Text style={styles.messageText}>{message.chinese_text || message.content}</Text>
              {showPinyin && message.pinyin ? <Text style={styles.metaText}>{message.pinyin}</Text> : null}
              {showTranslation && message.translation ? <Text style={styles.metaText}>{message.translation}</Text> : null}
              {message.corrections?.length ? (
                <Text style={styles.metaText}>{t('aiTutor.corrections')}</Text>
              ) : null}
            </Card>
          ))
        )}
        {sendMutation.isPending ? <ScreenState type="loading" title={t('aiTutor.thinking')} compact /> : null}
        {sendMutation.isError ? (
          <ScreenState
            type="error"
            title={t('aiTutor.sendFailed')}
            message={errorMessage}
            actionLabel={t('common.tryAgain')}
            onAction={() => draft.trim() && send(draft)}
            compact
          />
        ) : null}
      </ScrollView>
      <View style={styles.actions}>
        {ACTIONS.map(action => (
          <Pressable
            key={action.id}
            accessibilityRole="button"
            accessibilityLabel={t(action.labelKey)}
            onPress={() => {
              if (action.id === 'pinyin') {
                setShowPinyin(true);
              }
              if (action.id === 'translate') {
                setShowTranslation(true);
              }
              send(t(action.labelKey), action.id);
            }}
            style={styles.actionChip}
          >
            <Text style={styles.actionLabel}>{t(action.labelKey)}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t('aiTutor.placeholder')}
          accessibilityLabel={t('aiTutor.placeholder')}
          style={styles.input}
          multiline
        />
        <Button
          title={t('aiTutor.send')}
          onPress={() => send(draft)}
          loading={sendMutation.isPending}
          disabled={!draft.trim() || sendMutation.isPending}
          accessibilityLabel={t('aiTutor.send')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  chatContent: { padding: spacing.marginMobile, paddingBottom: 20 },
  heading: { ...typography.headlineMd, color: colors.onSurface, marginBottom: spacing.stackMd },
  historyButton: { alignSelf: 'flex-start', marginBottom: spacing.stackMd },
  modeItem: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.cardPadding,
    marginBottom: spacing.stackSm,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  modeSelected: { borderColor: colors.primary },
  modeLabel: { ...typography.bodyMd, color: colors.onSurface },
  modeHint: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 4 },
  scenarioList: { marginTop: spacing.stackMd },
  userBubble: { marginBottom: spacing.stackSm, backgroundColor: colors.primaryContainer },
  assistantBubble: { marginBottom: spacing.stackSm },
  role: { ...typography.labelSm, color: colors.onSurfaceVariant, marginBottom: 4 },
  messageText: { ...typography.bodyMd, color: colors.onSurface },
  metaText: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 6 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: spacing.marginMobile },
  actionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
  },
  actionLabel: { ...typography.labelSm, color: colors.primary },
  composer: { padding: spacing.marginMobile, gap: spacing.stackSm },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: colors.surfaceContainerLow,
    ...typography.bodyMd,
    color: colors.onSurface,
  },
});
