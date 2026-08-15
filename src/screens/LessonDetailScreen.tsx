import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  contentApi,
  learningApi,
  progressApi,
  vocabularyApi,
} from '../api/endpoints';
import type {
  ChineseEntry,
  DialogueContent,
  LessonContent,
  PracticeExercise,
} from '../api/types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ChineseLine } from '../components/ChineseLine';
import { ScreenState } from '../components/ScreenState';
import { SpeakButton } from '../components/SpeakButton';
import { useI18n } from '../i18n/I18nContext';
import {
  getCommonMistakes,
  getEntryCategory,
  getEntryExampleMeaning,
  getEntryMeaning,
  getGrammarExplanation,
  getGrammarTitle,
  getListeningTask,
  getListeningTranslation,
  getPatternMeaning,
  getReadingTitle,
  getReadingTranslation,
  getLocalizedTask,
  getLessonDescription,
  getLessonTitle,
  localizeDialogueLine,
  localizeText,
} from '../i18n/content';
import { getLessonTypeLabel, getWordTypeLabel } from '../i18n/lessonTypes';
import type { RootStackParamList } from '../navigation/types';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { colors, radius, spacing, typography } from '../theme';
import {
} from '../utils/answerValidation';

type Route = RouteProp<RootStackParamList, 'LessonDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Boolean(items?.length);
}

function isDialogueContent(
  dialogue: DialogueContent | ChineseEntry,
): dialogue is DialogueContent {
  return 'lines' in dialogue && Array.isArray(dialogue.lines);
}

function IntroSection({ content }: { content: LessonContent }) {
  const { language, t } = useI18n();
  const overview = localizeText(content.overview_translations, language, content.overview ?? '');
  const objectives =
    content.learning_objective_translations?.[language] ??
    content.learning_objectives ??
    [];
  const hasObjectives = objectives.length > 0;

  if (!overview && !hasObjectives) {
    return null;
  }

  return (
    <Card style={styles.block}>
      {overview ? <Text style={styles.overview}>{overview}</Text> : null}
      {hasObjectives ? (
        <View
          style={overview ? styles.objectivesWithOverview : undefined}
        >
          <Text style={styles.examplesLabel}>{t('lessonDetail.learningGoals')}</Text>
          {objectives.map(objective => (
            <Text key={objective} style={styles.bulletText}>
              - {objective}
            </Text>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

function VocabularySection({
  items,
  onSave,
}: {
  items: NonNullable<LessonContent['vocabulary']>;
  onSave: (word: NonNullable<LessonContent['vocabulary']>[number]) => void;
}) {
  const { language, t } = useI18n();
  const navigation = useRootNavigation();

  return (
    <>
      <Text style={styles.section}>{t('lessonType.vocabulary')}</Text>
      {items.map((word, index) => (
        <Pressable
          key={`${word.hanzi}-${index}`}
          disabled={!word.id}
          accessibilityRole={word.id ? 'button' : undefined}
          onPress={() =>
            word.id
              ? navigation.navigate('VocabularyDetail', {
                  vocabularyId: word.id,
                  title: word.hanzi,
                })
              : undefined
          }
        >
        <Card style={styles.block}>
          {(() => {
            const metadata = [
              getWordTypeLabel(word.word_type, t),
              getEntryCategory(word, language),
              word.hsk_level ? `HSK ${word.hsk_level}` : undefined,
            ].filter((item): item is string => Boolean(item));

            return metadata.length ? (
              <View style={styles.vocabularyMeta}>
                {metadata.map(item => (
                  <Text key={item} style={styles.metaChip}>
                    {item}
                  </Text>
                ))}
              </View>
            ) : null;
          })()}
          <ChineseLine line={word} large />
          {word.example_cn ? (
            <View style={styles.exampleBox}>
              <Text style={styles.examplesLabel}>{t('lessonDetail.example')}</Text>
              <ChineseLine
                line={{
                  hanzi: word.example_cn,
                  pinyin: word.example_pinyin,
                  meaning: getEntryExampleMeaning(word, language),
                }}
              />
            </View>
          ) : null}
          {word.usage_note ? (
            <Text style={styles.usageNote}>
              {localizeText(word.usage_note_translations, language, word.usage_note)}
            </Text>
          ) : null}
          <Button
            title={t('lessonDetail.saveWord')}
            leftIcon="bookmark-outline"
            variant="ghost"
            onPress={() => onSave(word)}
            style={styles.saveButton}
          />
        </Card>
        </Pressable>
      ))}
    </>
  );
}

function GrammarSection({
  points,
}: {
  points: NonNullable<LessonContent['grammar_points']>;
}) {
  const { language, t } = useI18n();
  const navigation = useRootNavigation();

  return (
    <>
      <Text style={styles.section}>{t('lessonType.grammar')}</Text>
      {points.map(point => (
        <Pressable
          key={point.title}
          disabled={!point.id}
          accessibilityRole={point.id ? 'button' : undefined}
          onPress={() =>
            point.id
              ? navigation.navigate('GrammarDetail', {
                  grammarId: point.id,
                  title: getGrammarTitle(point, language),
                })
              : undefined
          }
        >
        <Card style={styles.block}>
          <Text style={styles.pointTitle}>{getGrammarTitle(point, language)}</Text>
          {point.structure ? (
            <Text style={styles.structure}>{point.structure}</Text>
          ) : null}
          <Text style={styles.pointBody}>{getGrammarExplanation(point, language)}</Text>
          {hasItems(point.examples) ? (
            <>
              <Text style={styles.examplesLabel}>{t('lessonDetail.examples')}</Text>
              {point.examples.map((ex, index) => (
                <View key={`${ex.hanzi}-${index}`} style={styles.example}>
                  <ChineseLine line={ex} />
                </View>
              ))}
            </>
          ) : null}
          {hasItems(getCommonMistakes(point, language)) ? (
            <View style={styles.mistakeBox}>
              <Text style={styles.examplesLabel}>{t('lessonDetail.commonMistakes')}</Text>
              {getCommonMistakes(point, language).map(mistake => (
                <Text key={mistake} style={styles.bulletText}>
                  - {mistake}
                </Text>
              ))}
            </View>
          ) : null}
        </Card>
        </Pressable>
      ))}
    </>
  );
}

function SentencePatternsSection({
  patterns,
}: {
  patterns: NonNullable<LessonContent['sentence_patterns']>;
}) {
  const { language, t } = useI18n();

  return (
    <>
      <Text style={styles.section}>{t('lessonDetail.sentencePatterns')}</Text>
      {patterns.map(pattern => (
        <Card key={pattern.pattern} style={styles.block}>
          <Text style={styles.structure}>{pattern.pattern}</Text>
          {getPatternMeaning(pattern, language) ? (
            <Text style={styles.pointBody}>{getPatternMeaning(pattern, language)}</Text>
          ) : null}
          {pattern.examples?.map(example => (
            <Text key={example} style={styles.bulletText}>
              - {example}
            </Text>
          ))}
        </Card>
      ))}
    </>
  );
}

function DialogueSection({
  dialogue,
}: {
  dialogue: NonNullable<LessonContent['dialogue']>;
}) {
  const { language, t } = useI18n();

  if (!isDialogueContent(dialogue)) {
    return (
      <>
        <Text style={styles.section}>{t('lessonDetail.conversation')}</Text>
        <Card style={styles.block}>
          <ChineseLine line={dialogue} />
        </Card>
      </>
    );
  }

  const fullDialogue = dialogue.lines.map(line => line.chinese).join(' ');

  return (
    <>
      <Text style={styles.section}>{t('lessonDetail.conversation')}</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.pointTitle}>
            {localizeText(dialogue.title_translations, language, dialogue.title ?? t('lessonDetail.dialogue'))}
          </Text>
          {fullDialogue ? <SpeakButton text={fullDialogue} size={24} /> : null}
        </View>
        {dialogue.lines.map((line, index) => (
          <View key={`${line.speaker}-${index}`} style={styles.dialogueLine}>
            <Text style={styles.speaker}>{line.speaker}</Text>
            <ChineseLine line={localizeDialogueLine(line, language)} />
          </View>
        ))}
        {dialogue.cultural_note ? (
          <View style={styles.cultureBox}>
            <Text style={styles.examplesLabel}>{t('lessonDetail.culturalNote')}</Text>
            <Text style={styles.pointBody}>
              {localizeText(dialogue.cultural_note_translations, language, dialogue.cultural_note)}
            </Text>
          </View>
        ) : null}
      </Card>
    </>
  );
}

function RichReadingSection({
  reading,
}: {
  reading: NonNullable<LessonContent['reading']>;
}) {
  const { language, t } = useI18n();
  const title = getReadingTitle(reading, language) || t('lessonDetail.shortReading');
  const translation = getReadingTranslation(reading, language);

  return (
    <>
      <Text style={styles.section}>{t('lessonType.reading')}</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.pointTitle}>{title}</Text>
          <SpeakButton text={reading.chinese} size={24} />
        </View>
        <ChineseLine
          line={{
            hanzi: reading.chinese,
            pinyin: reading.pinyin,
            meaning: translation,
          }}
        />
      </Card>
      {reading.questions?.map((question, index) => {
        const explanation = localizeText(
          question.explanation_translations,
          language,
          question.explanation ?? '',
        );
        return (
          <Card key={`${question.question}-${index}`} style={styles.block}>
            <Text style={styles.examplesLabel}>{t('lessonDetail.checkUnderstanding')}</Text>
            <Text style={styles.pointBody}>
              {localizeText(question.question_translations, language, question.question)}
            </Text>
            <Text style={styles.answerText}>
              {t('common.answer')}: {localizeText(question.answer_translations, language, question.answer)}
            </Text>
            {explanation ? (
              <Text style={styles.usageNote}>
                {explanation}
              </Text>
            ) : null}
          </Card>
        );
      })}
    </>
  );
}

function ListeningPracticeSection({
  listening,
}: {
  listening: NonNullable<LessonContent['listening']>;
}) {
  const { language, t } = useI18n();
  const task = getListeningTask(listening, language) || t('lessonDetail.listenRepeat');
  const translation = getListeningTranslation(listening, language);

  return (
    <>
      <Text style={styles.section}>{t('lessonType.listening')}</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.readAloud}>{task}</Text>
          <SpeakButton text={listening.script} size={24} />
        </View>
        <ChineseLine
          line={{
            hanzi: listening.script,
            pinyin: listening.pinyin,
            meaning: translation,
          }}
        />
        {listening.answer ? (
          <Text style={styles.answerText}>
            {t('common.answer')}: {localizeText(listening.answer_translations, language, listening.answer)}
          </Text>
        ) : null}
      </Card>
    </>
  );
}

function ChineseEntryListSection({
  title,
  items,
}: {
  title: string;
  items?: ChineseEntry[];
}) {
  if (!hasItems(items)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>{title}</Text>
      {items.map((item, index) => (
        <Card key={`${item.hanzi}-${index}`} style={styles.block}>
          <ChineseLine line={item} />
        </Card>
      ))}
    </>
  );
}

function TaskListSection({
  title,
  tasks,
}: {
  title: string;
  tasks?: string[];
}) {
  const { language } = useI18n();

  if (!hasItems(tasks)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <Card style={styles.block}>
        {tasks.map(task => (
          <Text key={task} style={styles.bulletText}>
            - {getLocalizedTask(task, language)}
          </Text>
        ))}
      </Card>
    </>
  );
}

function CulturalNoteSection({
  note,
}: {
  note?: NonNullable<LessonContent['cultural_note']>;
}) {
  const { language, t } = useI18n();

  if (!note || (!note.english && !note.vietnamese)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>{t('lessonDetail.culturalNote')}</Text>
      <Card style={styles.block}>
        {localizeText(note, language) ? (
          <Text style={styles.pointBody}>{localizeText(note, language)}</Text>
        ) : null}
      </Card>
    </>
  );
}

function KeyVocabularySection({
  vocabulary,
  onSaveWord,
}: {
  vocabulary?: LessonContent['vocabulary'];
  onSaveWord: (word: NonNullable<LessonContent['vocabulary']>[number]) => void;
}) {
  return hasItems(vocabulary) ? (
    <VocabularySection items={vocabulary} onSave={onSaveWord} />
  ) : null;
}

function PracticeSections({ content }: { content: LessonContent }) {
  const { language, t } = useI18n();

  return (
    <>
      <TaskListSection
        title={t('lessonDetail.speakingPractice')}
        tasks={content.speaking_task_translations?.[language] ?? content.speaking_tasks}
      />
      <TaskListSection
        title={t('lessonDetail.readingPractice')}
        tasks={content.reading_task_translations?.[language] ?? content.reading_tasks}
      />
      <TaskListSection
        title={t('lessonDetail.writingPractice')}
        tasks={content.writing_task_translations?.[language] ?? content.writing_tasks}
      />
    </>
  );
}

function PracticeExerciseSection({
  title,
  exercises,
}: {
  title: string;
  exercises?: PracticeExercise[];
}) {
  const { t } = useI18n();

  if (!hasItems(exercises)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <ScreenState
        type="empty"
        title={t('lessonDetail.serverPracticeTitle')}
        message={t('lessonDetail.serverPracticeMessage')}
        compact
        style={styles.block}
      />
    </>
  );
}

function ReadingSection({ content }: { content: LessonContent }) {
  const { language, t } = useI18n();
  const fullPassage = content.passage?.map(l => l.hanzi).join('') ?? '';
  const passageTitle = localizeText(
    content.passage_title_translations,
    language,
    content.passage_title ?? '',
  );
  return (
    <>
      <Text style={styles.section}>{t('lessonType.reading')}</Text>
      {passageTitle ? (
        <Text style={styles.passageTitle}>{passageTitle}</Text>
      ) : null}
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.readAloud}>{t('lessonDetail.readAloud')}</Text>
          {fullPassage ? <SpeakButton text={fullPassage} size={24} /> : null}
        </View>
        {content.passage?.map((line, i) => (
          <View key={i} style={styles.passageLine}>
            <ChineseLine line={line} />
          </View>
        ))}
      </Card>
      {content.vocabulary && content.vocabulary.length > 0 ? (
        <>
          <Text style={styles.subSection}>{t('lessonDetail.keyWords')}</Text>
          {content.vocabulary.map(w => (
            <Card key={w.hanzi} style={styles.block}>
              <ChineseLine line={w} />
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
}

function ListeningSection({ content }: { content: LessonContent }) {
  const { language, t } = useI18n();
  const tip = localizeText(content.tip_translations, language, content.tip ?? '');

  return (
    <>
      <Text style={styles.section}>{t('lessonType.listening')}</Text>
      {tip ? <Text style={styles.tip}>{tip}</Text> : null}
      {content.transcript?.map((line, i) => (
        <Card key={i} style={styles.block}>
          <ChineseLine line={line} />
        </Card>
      ))}
    </>
  );
}

function WritingSection({ content }: { content: LessonContent }) {
  const { language, t } = useI18n();
  const tip = localizeText(content.tip_translations, language, content.tip ?? '');

  return (
    <>
      <Text style={styles.section}>{t('lessonType.writing')}</Text>
      {tip ? <Text style={styles.tip}>{tip}</Text> : null}
      {content.characters?.map(ch => (
        <Card key={ch.hanzi} style={styles.block}>
          <View style={styles.writingRow}>
            <Text style={styles.writingHanzi}>{ch.hanzi}</Text>
            <SpeakButton text={ch.hanzi} size={26} />
          </View>
          {ch.pinyin ? <Text style={styles.pinyin}>{ch.pinyin}</Text> : null}
          {getEntryMeaning(ch, language) ? (
            <Text style={styles.meaning}>{getEntryMeaning(ch, language)}</Text>
          ) : null}
          {ch.strokes != null ? (
            <Text style={styles.strokes}>{t('lessonDetail.strokes', { count: ch.strokes })}</Text>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function LessonBody({
  lessonType,
  content,
  onSaveWord,
}: {
  lessonType: string;
  content: LessonContent | null;
  onSaveWord: (word: NonNullable<LessonContent['vocabulary']>[number]) => void;
}) {
  const { language, t } = useI18n();

  if (!content) {
    return (
      <ScreenState
        type="empty"
        title={t('lessonDetail.noContent')}
        message={t('lessonDetail.noContentQuiz')}
        compact
        style={styles.block}
      />
    );
  }

  switch (lessonType) {
    case 'grammar':
      return (
        <>
          <IntroSection content={content} />
          {hasItems(content.grammar_points) ? (
            <GrammarSection points={content.grammar_points} />
          ) : (
            <ScreenState
              type="empty"
              title={t('lessonDetail.noGrammar')}
              compact
              style={styles.block}
            />
          )}
          {hasItems(content.sentence_patterns) ? (
            <SentencePatternsSection patterns={content.sentence_patterns} />
          ) : null}
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'reading':
      return (
        <>
          <IntroSection content={content} />
          {content.reading ? (
            <RichReadingSection reading={content.reading} />
          ) : (
            <ReadingSection content={content} />
          )}
          {content.reading ? (
            <KeyVocabularySection
              vocabulary={content.vocabulary}
              onSaveWord={onSaveWord}
            />
          ) : null}
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'listening':
      return (
        <>
          <IntroSection content={content} />
          {content.listening ? (
            <ListeningPracticeSection listening={content.listening} />
          ) : (
            <ListeningSection content={content} />
          )}
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );

    case 'sentence_pattern':
      return (
        <>
          <IntroSection content={content} />
          {hasItems(content.sentence_patterns) ? (
            <SentencePatternsSection patterns={content.sentence_patterns} />
          ) : null}
          <ChineseEntryListSection title={t('lessonType.patterns')} items={content.patterns} />
          {hasItems(content.grammar_points) ? (
            <GrammarSection points={content.grammar_points} />
          ) : null}
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : null}
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'conversation':
      return (
        <>
          <IntroSection content={content} />
          {content.dialogue ? (
            <DialogueSection dialogue={content.dialogue} />
          ) : null}
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : null}
          {hasItems(content.grammar_points) ? (
            <GrammarSection points={content.grammar_points} />
          ) : null}
          <CulturalNoteSection note={content.cultural_note} />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'review':
      return (
        <>
          <IntroSection content={content} />
          <TaskListSection
            title={t('lessonDetail.reviewTitle')}
            tasks={
              content.review_item_translations?.[language] ??
              content.item_translations?.[language] ??
              content.review_items ??
              content.items
            }
          />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
        </>
      );
    case 'practice':
      return (
        <>
          <IntroSection content={content} />
          <TaskListSection
            title={t('lessonDetail.practiceTitle')}
            tasks={
              content.activity_translations?.[language] ??
              content.item_translations?.[language] ??
              content.activities ??
              content.items
            }
          />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'quiz':
      return (
        <>
          <IntroSection content={content} />
          <TaskListSection
            title={t('lessonDetail.quizFocus')}
            tasks={content.item_translations?.[language] ?? content.items}
          />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
        </>
      );
    case 'writing':
      return (
        <>
          <IntroSection content={content} />
          <WritingSection content={content} />
          <PracticeExerciseSection
            title={t('lessonDetail.writingExercises')}
            exercises={content.writing_exercises}
          />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'vocabulary':
      return (
        <>
          <IntroSection content={content} />
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : (
            <ScreenState
              type="empty"
              title={t('lessonDetail.noVocabulary')}
              compact
              style={styles.block}
            />
          )}
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'mixed':
      return (
        <>
          <IntroSection content={content} />
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : null}
          {hasItems(content.grammar_points) ? (
            <GrammarSection points={content.grammar_points} />
          ) : null}
          {hasItems(content.sentence_patterns) ? (
            <SentencePatternsSection patterns={content.sentence_patterns} />
          ) : null}
          {content.dialogue ? (
            <DialogueSection dialogue={content.dialogue} />
          ) : null}
          {content.reading ? (
            <RichReadingSection reading={content.reading} />
          ) : null}
          {content.listening ? (
            <ListeningPracticeSection listening={content.listening} />
          ) : null}
          <PracticeExerciseSection
            title={t('lessonDetail.writingExercises')}
            exercises={content.writing_exercises}
          />
          <PracticeExerciseSection
            title={t('lessonDetail.interactivePractice')}
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    default:
      return (
        <>
          <IntroSection content={content} />
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : (
            <ScreenState
              type="empty"
              title={t('lessonDetail.noContent')}
              compact
              style={styles.block}
            />
          )}
        </>
      );
  }
}

export function LessonDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const queryClient = useQueryClient();
  const { language, t } = useI18n();
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lesson', params.lessonId],
    queryFn: () => contentApi.lesson(params.lessonId),
  });
  useEffect(() => {
    if (lesson) {
      progressApi.startLesson(params.lessonId).catch(() => undefined);
    }
  }, [lesson, params.lessonId]);
  const saveWordMutation = useMutation({
    mutationFn: async (
      word: NonNullable<LessonContent['vocabulary']>[number],
    ) => {
      if (word.id) {
        await vocabularyApi.favorite(word.id);
      } else {
        await learningApi.addSavedWord({
          hanzi: word.hanzi,
          pinyin: word.pinyin,
          meaning: getEntryMeaning(word, language),
          hsk_level:
            word.hsk_level ??
            lesson?.content?.hsk_level ??
            lesson?.hsk_level_id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
      setSaveError(null);
      setSaveNotice(t('lessonDetail.wordSaved'));
    },
    onError: e => {
      setSaveNotice(null);
      setSaveError(e instanceof Error ? e.message : t('lessonDetail.saveFailed'));
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title={t('lessonDetail.loading')} />
      </View>
    );
  }

  if (isError || !lesson) {
    return (
      <View style={styles.center}>
        <ScreenState
          type={isError ? 'error' : 'empty'}
          title={isError ? t('lessonDetail.couldNotLoad') : t('lessonDetail.notFound')}
          message={
            isError ? t('common.connectionRetry') : undefined
          }
          actionLabel={isError ? t('common.tryAgain') : undefined}
          onAction={
            isError
              ? () => {
                  refetch();
                }
              : undefined
          }
        />
      </View>
    );
  }

  const typeLabel = getLessonTypeLabel(lesson.lesson_type, t);
  const title = getLessonTitle(lesson, language);
  const description = getLessonDescription(lesson, language);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.type}>{typeLabel}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {saveNotice ? (
        <ScreenState
          type="success"
          title={saveNotice}
          compact
          style={styles.inlineState}
        />
      ) : null}
      {saveError ? (
        <ScreenState
          type="error"
          title={t('lessonDetail.couldNotSave')}
          message={saveError}
          compact
          style={styles.inlineState}
        />
      ) : null}

      <LessonBody
        lessonType={lesson.lesson_type}
        content={lesson.content}
        onSaveWord={word => saveWordMutation.mutate(word)}
      />

      <Button
        title={t('lessonDetail.startPractice')}
        onPress={() =>
          navigation.navigate('PracticeSession', {
            lessonId: params.lessonId,
            lessonTitle: title || params.lessonTitle,
            lessonTitleTranslations:
              lesson?.title_translations ?? params.lessonTitleTranslations,
          })
        }
        rightIcon="arrow-forward"
        style={styles.quizButton}
      />
      <Button
        title={t('lessonDetail.startQuiz')}
        variant="secondary"
        onPress={() =>
          navigation.navigate('Quiz', {
            lessonId: params.lessonId,
            lessonTitle: title || params.lessonTitle,
            lessonTitleTranslations: lesson?.title_translations ?? params.lessonTitleTranslations,
          })
        }
        rightIcon="arrow-forward"
        style={styles.quizButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.marginMobile, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.marginMobile,
  },
  type: {
    ...typography.labelSm,
    color: colors.tertiary,
    textTransform: 'uppercase',
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackLg,
  },
  section: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  subSection: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackSm,
  },
  block: { marginBottom: spacing.stackMd },
  inlineState: { marginBottom: spacing.stackMd },

  overview: { ...typography.bodyMd, color: colors.onSurface, lineHeight: 22 },
  objectivesWithOverview: { marginTop: spacing.stackMd },
  bulletText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
    lineHeight: 22,
  },
  vocabularyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.stackSm,
  },
  metaChip: {
    ...typography.labelSm,
    color: colors.tertiary,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pointTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
  },
  pointBody: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
  },
  examplesLabel: {
    ...typography.labelSm,
    color: colors.primary,
    marginBottom: spacing.stackSm,
  },
  secondaryMeaning: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  example: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  exampleBox: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  usageNote: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm,
    lineHeight: 22,
  },
  structure: {
    ...typography.bodyZh,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
  },
  mistakeBox: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.stackSm,
    marginTop: spacing.stackSm,
  },

  passageTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
    textAlign: 'center',
  },
  passageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackMd,
  },
  readAloud: { ...typography.labelMd, color: colors.onSurfaceVariant },
  passageLine: { marginBottom: spacing.stackSm },
  dialogueLine: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  speaker: { ...typography.labelSm, color: colors.tertiary, marginBottom: 4 },
  cultureBox: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.stackSm,
    marginTop: spacing.stackSm,
  },
  answerText: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginTop: spacing.stackSm,
  },
  tip: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
    fontStyle: 'italic',
  },
  writingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  writingHanzi: { fontSize: 56, color: colors.onSurface, fontWeight: '700' },
  pinyin: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  meaning: { ...typography.bodyLg, color: colors.onSurface, marginTop: 4 },
  strokes: {
    ...typography.labelSm,
    color: colors.tertiary,
    marginTop: spacing.stackSm,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.stackSm,
  },
  skillText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  exercisePrompt: {
    ...typography.bodyLg,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
  },
  practiceOption: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    padding: spacing.stackMd,
    marginBottom: spacing.stackSm,
    backgroundColor: colors.surfaceContainerLow,
  },
  practiceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  practiceOptionText: { ...typography.bodyMd, color: colors.onSurface },
  practiceOptionTextSelected: { color: colors.primary, fontWeight: '600' },
  answerInput: {
    ...typography.bodyMd,
    color: colors.onSurface,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    paddingHorizontal: spacing.stackMd,
    paddingVertical: 10,
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing.stackSm,
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.stackMd,
  },
  wordChip: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surfaceContainerLow,
  },
  wordChipText: { ...typography.bodyZh, color: colors.onSurface },
  hintText: {
    ...typography.bodyMd,
    color: colors.tertiary,
    marginTop: spacing.stackSm,
  },
  feedbackBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.stackMd,
    marginTop: spacing.stackMd,
  },
  feedbackCorrect: {
    borderColor: colors.tertiary,
    backgroundColor: colors.onTertiaryContainer,
  },
  feedbackIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.errorContainer,
  },
  feedbackTitle: { ...typography.labelMd, marginBottom: 4 },
  correctText: { color: colors.tertiary },
  incorrectText: { color: colors.error },
  feedbackText: { ...typography.bodyMd, color: colors.onSurface, marginTop: 4 },
  exerciseActions: {
    flexDirection: 'row',
    gap: spacing.stackSm,
    marginTop: spacing.stackMd,
  },
  exerciseButton: { flex: 1 },
  quizButton: { marginTop: spacing.stackLg },
  saveButton: { alignSelf: 'flex-start', marginTop: spacing.stackSm },
});
