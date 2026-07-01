const ROOT_QUERY_KEY = 'hsk' as const;

function scopedKey<T extends readonly unknown[]>(
  scope: string,
  ...segments: T
): readonly [typeof ROOT_QUERY_KEY, string, ...T] {
  return [ROOT_QUERY_KEY, scope, ...segments];
}

export const queryKeys = {
  root: [ROOT_QUERY_KEY] as const,
  auth: {
    all: () => scopedKey('auth'),
    me: () => scopedKey('auth', 'me'),
    profile: () => scopedKey('auth', 'profile'),
  },
  content: {
    all: () => scopedKey('content'),
    levels: () => scopedKey('content', 'levels'),
    levelLessons: (levelId: number) => scopedKey('content', 'levels', levelId, 'lessons'),
    lesson: (lessonId: number) => scopedKey('content', 'lessons', lessonId),
    lessonQuestions: (lessonId: number) => scopedKey('content', 'lessons', lessonId, 'questions'),
  },
  progress: {
    all: () => scopedKey('progress'),
    dashboard: () => scopedKey('progress', 'dashboard'),
  },
  learning: {
    all: () => scopedKey('learning'),
    savedWords: () => scopedKey('learning', 'saved-words'),
    achievements: () => scopedKey('learning', 'achievements'),
    mockTests: () => scopedKey('learning', 'mock-tests'),
  },
  lessons: {
    all: () => scopedKey('lessons'),
    levels: () => scopedKey('lessons', 'levels'),
    levelLessons: (levelId: number, lessonType?: string) =>
      lessonType === undefined
        ? scopedKey('lessons', 'levels', levelId, 'lessons')
        : scopedKey('lessons', 'levels', levelId, 'lessons', lessonType),
    lesson: (lessonId: number) => scopedKey('lessons', 'lesson', lessonId),
  },
} as const;
