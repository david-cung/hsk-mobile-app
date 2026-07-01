import {
  type HskLevel,
  HskLevelSchema,
  type LessonListItem,
  LessonListItemSchema,
} from '@/features/lessons/api/lessons.schemas';

export function createHskLevel(overrides: Partial<HskLevel> = {}): HskLevel {
  return HskLevelSchema.parse({
    id: 1,
    level_number: 1,
    title: 'HSK 1',
    description: 'Beginner — 150 words',
    total_characters: 150,
    ...overrides,
  });
}

export function createHskLevelList(): HskLevel[] {
  return [
    createHskLevel({
      id: 1,
      level_number: 1,
      title: 'HSK 1',
      description: 'Beginner — 150 words',
      total_characters: 150,
    }),
    createHskLevel({
      id: 2,
      level_number: 2,
      title: 'HSK 2',
      description: 'Elementary — 300 words',
      total_characters: 300,
    }),
    createHskLevel({
      id: 3,
      level_number: 3,
      title: 'HSK 3',
      description: 'Intermediate — 600 words',
      total_characters: 600,
    }),
  ];
}

export function createLessonListItem(overrides: Partial<LessonListItem> = {}): LessonListItem {
  return LessonListItemSchema.parse({
    id: 1,
    title: 'Greetings & Basics',
    description: 'Learn hello, thank you, and basic phrases.',
    lesson_type: 'vocabulary',
    sort_order: 1,
    duration_minutes: 10,
    status: 'not_started',
    score_percent: null,
    ...overrides,
  });
}
