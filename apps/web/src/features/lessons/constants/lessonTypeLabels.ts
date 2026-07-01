import type { LessonType } from '../api/lessons.schemas';

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  mixed: 'Mixed',
};

export function getLessonTypeLabel(lessonType: LessonType): string {
  return LESSON_TYPE_LABELS[lessonType];
}
