import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { contentApi, learningApi } from '../api/endpoints';
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
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';
import {
  isAnswerCorrect,
  resolveExpectedAnswer,
} from '../utils/answerValidation';

type Route = RouteProp<RootStackParamList, 'LessonDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const TYPE_LABELS: Record<string, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  listening: 'Listening',
  sentence_pattern: 'Sentence Pattern',
  conversation: 'Conversation',
  review: 'Review',
  practice: 'Practice',
  quiz: 'Quiz',
  writing: 'Writing',
  mixed: 'Mixed Lesson',
};

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Boolean(items?.length);
}

function isDialogueContent(
  dialogue: DialogueContent | ChineseEntry,
): dialogue is DialogueContent {
  return 'lines' in dialogue && Array.isArray(dialogue.lines);
}

function IntroSection({ content }: { content: LessonContent }) {
  const objectives = content.learning_objectives ?? [];
  const hasObjectives = objectives.length > 0;

  if (!content.overview && !hasObjectives) {
    return null;
  }

  return (
    <Card style={styles.block}>
      {content.overview ? (
        <Text style={styles.overview}>{content.overview}</Text>
      ) : null}
      {hasObjectives ? (
        <View
          style={content.overview ? styles.objectivesWithOverview : undefined}
        >
          <Text style={styles.examplesLabel}>Learning goals</Text>
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
  return (
    <>
      <Text style={styles.section}>Vocabulary</Text>
      {items.map((word, index) => (
        <Card key={`${word.hanzi}-${index}`} style={styles.block}>
          {(() => {
            const metadata = [
              word.word_type,
              word.category,
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
          {word.meaning_en ? (
            <Text style={styles.secondaryMeaning}>{word.meaning_en}</Text>
          ) : null}
          {word.example_cn ? (
            <View style={styles.exampleBox}>
              <Text style={styles.examplesLabel}>Example</Text>
              <ChineseLine
                line={{
                  hanzi: word.example_cn,
                  pinyin: word.example_pinyin,
                  meaning: word.example_vi,
                }}
              />
              {word.example_en ? (
                <Text style={styles.secondaryMeaning}>{word.example_en}</Text>
              ) : null}
            </View>
          ) : null}
          {word.usage_note ? (
            <Text style={styles.usageNote}>{word.usage_note}</Text>
          ) : null}
          <Button
            title="Save Word"
            leftIcon="bookmark-outline"
            variant="ghost"
            onPress={() => onSave(word)}
            style={styles.saveButton}
          />
        </Card>
      ))}
    </>
  );
}

function GrammarSection({
  points,
}: {
  points: NonNullable<LessonContent['grammar_points']>;
}) {
  return (
    <>
      <Text style={styles.section}>Grammar</Text>
      {points.map(point => (
        <Card key={point.title} style={styles.block}>
          <Text style={styles.pointTitle}>{point.title}</Text>
          {point.structure ? (
            <Text style={styles.structure}>{point.structure}</Text>
          ) : null}
          <Text style={styles.pointBody}>{point.explanation}</Text>
          {hasItems(point.examples) ? (
            <>
              <Text style={styles.examplesLabel}>Examples</Text>
              {point.examples.map((ex, index) => (
                <View key={`${ex.hanzi}-${index}`} style={styles.example}>
                  <ChineseLine line={ex} />
                </View>
              ))}
            </>
          ) : null}
          {hasItems(point.common_mistakes) ? (
            <View style={styles.mistakeBox}>
              <Text style={styles.examplesLabel}>Common mistakes</Text>
              {point.common_mistakes.map(mistake => (
                <Text key={mistake} style={styles.bulletText}>
                  - {mistake}
                </Text>
              ))}
            </View>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function SentencePatternsSection({
  patterns,
}: {
  patterns: NonNullable<LessonContent['sentence_patterns']>;
}) {
  return (
    <>
      <Text style={styles.section}>Sentence patterns</Text>
      {patterns.map(pattern => (
        <Card key={pattern.pattern} style={styles.block}>
          <Text style={styles.structure}>{pattern.pattern}</Text>
          {pattern.meaning_vi ? (
            <Text style={styles.pointBody}>{pattern.meaning_vi}</Text>
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
  if (!isDialogueContent(dialogue)) {
    return (
      <>
        <Text style={styles.section}>Conversation</Text>
        <Card style={styles.block}>
          <ChineseLine line={dialogue} />
        </Card>
      </>
    );
  }

  const fullDialogue = dialogue.lines.map(line => line.chinese).join(' ');

  return (
    <>
      <Text style={styles.section}>Conversation</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.pointTitle}>{dialogue.title ?? 'Dialogue'}</Text>
          {fullDialogue ? <SpeakButton text={fullDialogue} size={24} /> : null}
        </View>
        {dialogue.lines.map((line, index) => (
          <View key={`${line.speaker}-${index}`} style={styles.dialogueLine}>
            <Text style={styles.speaker}>{line.speaker}</Text>
            <ChineseLine
              line={{
                hanzi: line.chinese,
                pinyin: line.pinyin,
                meaning: line.vietnamese,
              }}
            />
          </View>
        ))}
        {dialogue.cultural_note ? (
          <View style={styles.cultureBox}>
            <Text style={styles.examplesLabel}>Cultural note</Text>
            <Text style={styles.pointBody}>{dialogue.cultural_note}</Text>
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
  return (
    <>
      <Text style={styles.section}>Reading</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.pointTitle}>
            {reading.title ?? 'Short reading'}
          </Text>
          <SpeakButton text={reading.chinese} size={24} />
        </View>
        <ChineseLine
          line={{
            hanzi: reading.chinese,
            pinyin: reading.pinyin,
            meaning: reading.vietnamese,
          }}
        />
        {reading.english ? (
          <Text style={styles.secondaryMeaning}>{reading.english}</Text>
        ) : null}
      </Card>
      {reading.questions?.map((question, index) => (
        <Card key={`${question.question}-${index}`} style={styles.block}>
          <Text style={styles.examplesLabel}>Check understanding</Text>
          <Text style={styles.pointBody}>{question.question}</Text>
          <Text style={styles.answerText}>Answer: {question.answer}</Text>
          {question.explanation ? (
            <Text style={styles.usageNote}>{question.explanation}</Text>
          ) : null}
        </Card>
      ))}
    </>
  );
}

function ListeningPracticeSection({
  listening,
}: {
  listening: NonNullable<LessonContent['listening']>;
}) {
  return (
    <>
      <Text style={styles.section}>Listening</Text>
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.readAloud}>
            {listening.task ?? 'Listen and repeat'}
          </Text>
          <SpeakButton text={listening.script} size={24} />
        </View>
        <ChineseLine
          line={{
            hanzi: listening.script,
            pinyin: listening.pinyin,
            meaning: listening.vietnamese,
          }}
        />
        {listening.answer ? (
          <Text style={styles.answerText}>Answer: {listening.answer}</Text>
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
  if (!hasItems(tasks)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>{title}</Text>
      <Card style={styles.block}>
        {tasks.map(task => (
          <Text key={task} style={styles.bulletText}>
            - {task}
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
  if (!note || (!note.english && !note.vietnamese)) {
    return null;
  }

  return (
    <>
      <Text style={styles.section}>Cultural note</Text>
      <Card style={styles.block}>
        {note.english ? (
          <Text style={styles.pointBody}>{note.english}</Text>
        ) : null}
        {note.vietnamese ? (
          <Text style={styles.pointBody}>{note.vietnamese}</Text>
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
  return (
    <>
      <TaskListSection
        title="Speaking practice"
        tasks={content.speaking_tasks}
      />
      <TaskListSection title="Reading practice" tasks={content.reading_tasks} />
      <TaskListSection title="Writing practice" tasks={content.writing_tasks} />
    </>
  );
}

type ExerciseResponse = {
  answer: string;
  submitted: boolean;
  showHint: boolean;
};

function PracticeExerciseSection({
  title,
  exercises,
}: {
  title: string;
  exercises?: PracticeExercise[];
}) {
  const [responses, setResponses] = useState<Record<string, ExerciseResponse>>(
    {},
  );

  if (!hasItems(exercises)) {
    return null;
  }

  const updateResponse = (
    exerciseId: string,
    response: Partial<ExerciseResponse>,
  ) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        answer: prev[exerciseId]?.answer ?? '',
        submitted: prev[exerciseId]?.submitted ?? false,
        showHint: prev[exerciseId]?.showHint ?? false,
        ...response,
      },
    }));
  };

  return (
    <>
      <Text style={styles.section}>{title}</Text>
      {exercises.map((exercise, index) => {
        const exerciseId = exercise.id || `${exercise.prompt}-${index}`;
        const response = responses[exerciseId] ?? {
          answer: '',
          submitted: false,
          showHint: false,
        };
        const expectedAnswer = resolveExpectedAnswer(exercise);
        const isMultipleChoice = hasItems(exercise.options);
        const correct =
          response.submitted &&
          isAnswerCorrect(response.answer, expectedAnswer);

        return (
          <Card key={exerciseId} style={styles.block}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.examplesLabel}>
                {exercise.title ?? `Exercise ${index + 1}`}
              </Text>
              {exercise.skill ? (
                <Text style={styles.skillText}>{exercise.skill}</Text>
              ) : null}
            </View>
            <Text style={styles.exercisePrompt}>{exercise.prompt}</Text>
            {hasItems(exercise.word_bank) ? (
              <View style={styles.wordBank}>
                {exercise.word_bank.map(word => (
                  <View key={word} style={styles.wordChip}>
                    <Text style={styles.wordChipText}>{word}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {isMultipleChoice ? (
              exercise.options?.map(option => (
                <Pressable
                  key={option}
                  style={[
                    styles.practiceOption,
                    response.answer === option && styles.practiceOptionSelected,
                  ]}
                  onPress={() =>
                    updateResponse(exerciseId, {
                      answer: option,
                      submitted: false,
                    })
                  }
                  accessibilityRole="radio"
                  accessibilityState={{ selected: response.answer === option }}
                  accessibilityLabel={option}
                >
                  <Text
                    style={[
                      styles.practiceOptionText,
                      response.answer === option &&
                        styles.practiceOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))
            ) : (
              <TextInput
                value={response.answer}
                onChangeText={answer =>
                  updateResponse(exerciseId, { answer, submitted: false })
                }
                placeholder="Nhập câu trả lời"
                placeholderTextColor={colors.outline}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.answerInput}
              />
            )}
            {response.showHint && exercise.hint ? (
              <Text style={styles.hintText}>Hint: {exercise.hint}</Text>
            ) : null}
            {response.submitted ? (
              <View
                style={[
                  styles.feedbackBox,
                  correct ? styles.feedbackCorrect : styles.feedbackIncorrect,
                ]}
              >
                <Text
                  style={[
                    styles.feedbackTitle,
                    correct ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {correct ? 'Correct' : 'Needs review'}
                </Text>
                {!correct ? (
                  <Text style={styles.answerText}>
                    Answer: {expectedAnswer}
                  </Text>
                ) : null}
                {exercise.explanation ? (
                  <Text style={styles.feedbackText}>
                    {exercise.explanation}
                  </Text>
                ) : null}
              </View>
            ) : null}
            <View style={styles.exerciseActions}>
              {exercise.hint ? (
                <Button
                  title={response.showHint ? 'Hide Hint' : 'Show Hint'}
                  variant="ghost"
                  leftIcon="bulb-outline"
                  onPress={() =>
                    updateResponse(exerciseId, { showHint: !response.showHint })
                  }
                  style={styles.exerciseButton}
                />
              ) : null}
              <Button
                title="Check"
                rightIcon="checkmark-circle-outline"
                onPress={() => updateResponse(exerciseId, { submitted: true })}
                disabled={!response.answer.trim()}
                style={styles.exerciseButton}
              />
            </View>
          </Card>
        );
      })}
    </>
  );
}

function ReadingSection({ content }: { content: LessonContent }) {
  const fullPassage = content.passage?.map(l => l.hanzi).join('') ?? '';
  return (
    <>
      <Text style={styles.section}>Reading</Text>
      {content.passage_title ? (
        <Text style={styles.passageTitle}>{content.passage_title}</Text>
      ) : null}
      <Card style={styles.block}>
        <View style={styles.passageHeader}>
          <Text style={styles.readAloud}>Read aloud</Text>
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
          <Text style={styles.subSection}>Key words</Text>
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
  return (
    <>
      <Text style={styles.section}>Listening</Text>
      {content.tip ? <Text style={styles.tip}>{content.tip}</Text> : null}
      {content.transcript?.map((line, i) => (
        <Card key={i} style={styles.block}>
          <ChineseLine line={line} />
        </Card>
      ))}
    </>
  );
}

function WritingSection({ content }: { content: LessonContent }) {
  return (
    <>
      <Text style={styles.section}>Writing</Text>
      {content.tip ? <Text style={styles.tip}>{content.tip}</Text> : null}
      {content.characters?.map(ch => (
        <Card key={ch.hanzi} style={styles.block}>
          <View style={styles.writingRow}>
            <Text style={styles.writingHanzi}>{ch.hanzi}</Text>
            <SpeakButton text={ch.hanzi} size={26} />
          </View>
          {ch.pinyin ? <Text style={styles.pinyin}>{ch.pinyin}</Text> : null}
          {ch.meaning ? <Text style={styles.meaning}>{ch.meaning}</Text> : null}
          {ch.strokes != null ? (
            <Text style={styles.strokes}>{ch.strokes} strokes</Text>
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
  if (!content) {
    return (
      <ScreenState
        type="empty"
        title="Lesson content unavailable"
        message="You can still start the quiz if questions are ready."
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
              title="No grammar points yet"
              compact
              style={styles.block}
            />
          )}
          {hasItems(content.sentence_patterns) ? (
            <SentencePatternsSection patterns={content.sentence_patterns} />
          ) : null}
          <PracticeExerciseSection
            title="Interactive practice"
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
            title="Interactive practice"
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
            title="Interactive practice"
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
          <ChineseEntryListSection title="Patterns" items={content.patterns} />
          {hasItems(content.grammar_points) ? (
            <GrammarSection points={content.grammar_points} />
          ) : null}
          {hasItems(content.vocabulary) ? (
            <VocabularySection items={content.vocabulary} onSave={onSaveWord} />
          ) : null}
          <PracticeExerciseSection
            title="Interactive practice"
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
            title="Interactive practice"
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
            title="Review"
            tasks={content.review_items ?? content.items}
          />
          <PracticeExerciseSection
            title="Interactive practice"
            exercises={content.practice_exercises}
          />
        </>
      );
    case 'practice':
      return (
        <>
          <IntroSection content={content} />
          <TaskListSection
            title="Practice"
            tasks={content.activities ?? content.items}
          />
          <PracticeExerciseSection
            title="Interactive practice"
            exercises={content.practice_exercises}
          />
          <PracticeSections content={content} />
        </>
      );
    case 'quiz':
      return (
        <>
          <IntroSection content={content} />
          <TaskListSection title="Quiz Focus" tasks={content.items} />
          <PracticeExerciseSection
            title="Interactive practice"
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
            title="Writing exercises"
            exercises={content.writing_exercises}
          />
          <PracticeExerciseSection
            title="Interactive practice"
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
              title="No vocabulary yet"
              compact
              style={styles.block}
            />
          )}
          <PracticeExerciseSection
            title="Interactive practice"
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
            title="Writing exercises"
            exercises={content.writing_exercises}
          />
          <PracticeExerciseSection
            title="Interactive practice"
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
              title="Lesson content unavailable"
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
  const saveWordMutation = useMutation({
    mutationFn: (word: NonNullable<LessonContent['vocabulary']>[number]) =>
      learningApi.addSavedWord({
        hanzi: word.hanzi,
        pinyin: word.pinyin,
        meaning: word.meaning ?? word.meaning_en,
        hsk_level:
          word.hsk_level ?? lesson?.content?.hsk_level ?? lesson?.hsk_level_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWords'] });
      setSaveError(null);
      setSaveNotice('Word saved to your list.');
    },
    onError: e => {
      setSaveNotice(null);
      setSaveError(e instanceof Error ? e.message : 'Failed to save word');
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ScreenState type="loading" title="Loading lesson" />
      </View>
    );
  }

  if (isError || !lesson) {
    return (
      <View style={styles.center}>
        <ScreenState
          type={isError ? 'error' : 'empty'}
          title={isError ? 'Could not load lesson' : 'Lesson not found'}
          message={
            isError ? 'Please check your connection and try again.' : undefined
          }
          actionLabel={isError ? 'Try Again' : undefined}
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

  const typeLabel = TYPE_LABELS[lesson.lesson_type] ?? lesson.lesson_type;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.type}>{typeLabel}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      {lesson.description ? (
        <Text style={styles.description}>{lesson.description}</Text>
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
          title="Could not save word"
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
        title="Start Quiz"
        onPress={() =>
          navigation.navigate('Quiz', {
            lessonId: params.lessonId,
            lessonTitle: params.lessonTitle,
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
