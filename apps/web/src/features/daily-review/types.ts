import type { LessonType } from '@/features/lessons/api/lessons.schemas';

export type ReviewItem = {
  id: number;
  title: string;
  lesson_type: LessonType;
  score_percent: number | null;
  duration_minutes: number;
};
