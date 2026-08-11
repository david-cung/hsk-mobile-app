import type {
  ChineseEntry,
  DialogueLine,
  GrammarPoint,
  HskLevel,
  ListeningPracticeContent,
  LessonDetail,
  LessonListItem,
  MockTest,
  MockTestQuestion,
  PracticeExercise,
  Question,
  QuestionResult,
  RichReadingContent,
  SentencePattern,
} from '../api/types';
import type { LanguageCode } from './languages';

type LocalizedPair = Partial<Record<LanguageCode, string>> & {
  english?: string;
  vietnamese?: string;
};

type LocalizedString = string | LocalizedPair | null | undefined;

function fromPair(value: LocalizedPair, language: LanguageCode) {
  if (language === 'vi') {
    return value.vi ?? value.vietnamese ?? value.en ?? value.english;
  }

  return value.en ?? value.english ?? value.vi ?? value.vietnamese;
}

export function localizeText(
  value: LocalizedString,
  language: LanguageCode,
  fallback = '',
) {
  if (!value) {
    return fallback;
  }

  if (typeof value === 'string') {
    return value;
  }

  return fromPair(value, language) ?? fallback;
}

export function getLocalizedTitle(
  item: {
    title?: string | null;
    title_translations?: LocalizedPair;
  },
  language: LanguageCode,
) {
  return localizeText(item.title_translations, language, item.title ?? '');
}

export function getLocalizedDescription(
  item: {
    description?: string | null;
    description_translations?: LocalizedPair;
  },
  language: LanguageCode,
) {
  return localizeText(item.description_translations, language, item.description ?? '');
}

export function getLevelTitle(level: HskLevel, language: LanguageCode) {
  return getLocalizedTitle(level, language);
}

export function getLevelDescription(level: HskLevel, language: LanguageCode) {
  return getLocalizedDescription(level, language);
}

export function getLessonTitle(
  lesson:
    | LessonListItem
    | LessonDetail
    | MockTestQuestion
    | { lesson_title?: string | null; lesson_title_translations?: LocalizedPair },
  language: LanguageCode,
) {
  if ('lesson_title' in lesson) {
    return localizeText(
      lesson.lesson_title_translations,
      language,
      lesson.lesson_title ?? '',
    );
  }
  return getLocalizedTitle(
    lesson as LessonListItem | LessonDetail,
    language,
  );
}

export function getLessonDescription(
  lesson: LessonListItem | LessonDetail,
  language: LanguageCode,
) {
  return getLocalizedDescription(lesson, language);
}

export function getMockTestTitle(test: MockTest, language: LanguageCode) {
  return getLocalizedTitle(test, language);
}

export function getQuestionPrompt(
  question: Question | QuestionResult | { prompt?: string | null; prompt_translations?: LocalizedPair },
  language: LanguageCode,
) {
  return localizeText(question.prompt_translations, language, question.prompt ?? '');
}

export function getQuestionExplanation(
  question: QuestionResult | { explanation?: string | null; explanation_translations?: LocalizedPair },
  language: LanguageCode,
) {
  return localizeText(
    question.explanation_translations,
    language,
    question.explanation ?? '',
  );
}

export function getQuestionOptionLabel(
  question: Question,
  option: string,
  optionIndex: number,
  language: LanguageCode,
) {
  return question.options_translations?.[language]?.[optionIndex] ?? option;
}

export function getPracticeOptionLabel(
  exercise: PracticeExercise,
  option: string,
  optionIndex: number,
  language: LanguageCode,
) {
  return exercise.options_translations?.[language]?.[optionIndex] ?? option;
}

export function getEntryMeaning(entry: ChineseEntry, language: LanguageCode) {
  const translated = localizeText(entry.translations, language);
  if (translated) {
    return translated;
  }

  if (language === 'vi') {
    return entry.meaning_vi ?? entry.meaning ?? entry.meaning_en ?? '';
  }

  return entry.meaning_en ?? entry.meaning ?? entry.meaning_vi ?? '';
}

export function getEntryExampleMeaning(entry: ChineseEntry, language: LanguageCode) {
  const translated = localizeText(entry.example_translations, language);
  if (translated) {
    return translated;
  }

  return language === 'vi'
    ? entry.example_vi ?? entry.example_en ?? ''
    : entry.example_en ?? entry.example_vi ?? '';
}

export function getEntryCategory(entry: ChineseEntry, language: LanguageCode) {
  return localizeText(entry.category_translations, language, entry.category ?? '');
}

export function localizeEntry(entry: ChineseEntry, language: LanguageCode): ChineseEntry {
  return {
    ...entry,
    meaning: getEntryMeaning(entry, language),
  };
}

export function localizeDialogueLine(line: DialogueLine, language: LanguageCode) {
  return {
    hanzi: line.chinese,
    pinyin: line.pinyin,
    meaning: localizeText(
      line.translations,
      language,
      language === 'vi'
        ? line.vietnamese ?? line.english ?? ''
        : line.english ?? line.vietnamese ?? '',
    ),
  };
}

export function getGrammarTitle(point: GrammarPoint, language: LanguageCode) {
  return localizeText(point.title_translations, language, point.title);
}

export function getGrammarExplanation(point: GrammarPoint, language: LanguageCode) {
  return localizeText(point.explanation_translations, language, point.explanation);
}

export function getCommonMistakes(point: GrammarPoint, language: LanguageCode) {
  return point.common_mistakes_translations?.[language] ?? point.common_mistakes ?? [];
}

export function getPatternMeaning(pattern: SentencePattern, language: LanguageCode) {
  return localizeText(
    pattern.translations,
    language,
    language === 'vi'
      ? pattern.meaning_vi ?? pattern.meaning_en ?? ''
      : pattern.meaning_en ?? pattern.meaning_vi ?? '',
  );
}

export function getReadingTranslation(reading: RichReadingContent, language: LanguageCode) {
  return localizeText(
    reading.translations,
    language,
    language === 'vi' ? reading.vietnamese ?? reading.english ?? '' : reading.english ?? reading.vietnamese ?? '',
  );
}

export function getReadingTitle(reading: RichReadingContent, language: LanguageCode) {
  return localizeText(reading.title_translations, language, reading.title ?? '');
}

export function getListeningTask(listening: ListeningPracticeContent, language: LanguageCode) {
  return localizeText(listening.task_translations, language, listening.task ?? '');
}

export function getListeningTranslation(
  listening: ListeningPracticeContent,
  language: LanguageCode,
) {
  return localizeText(
    listening.translations,
    language,
    language === 'vi'
      ? listening.vietnamese ?? listening.english ?? ''
      : listening.english ?? listening.vietnamese ?? '',
  );
}

export function getPracticeTitle(exercise: PracticeExercise, language: LanguageCode) {
  return localizeText(exercise.title_translations, language, exercise.title ?? '');
}

export function getPracticePrompt(exercise: PracticeExercise, language: LanguageCode) {
  return localizeText(exercise.prompt_translations, language, exercise.prompt);
}

export function getPracticeHint(exercise: PracticeExercise, language: LanguageCode) {
  return localizeText(exercise.hint_translations, language, exercise.hint ?? '');
}

export function getPracticeExplanation(
  exercise: PracticeExercise,
  language: LanguageCode,
) {
  return localizeText(
    exercise.explanation_translations,
    language,
    exercise.explanation ?? '',
  );
}

export function getLocalizedTask(task: LocalizedString, language: LanguageCode) {
  return localizeText(task, language);
}
