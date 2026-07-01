export const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export const DAILY_GOAL_MINUTES = [15, 30, 45, 60] as const;

export type HskLevel = (typeof HSK_LEVELS)[number];

export type DailyGoalMinutes = (typeof DAILY_GOAL_MINUTES)[number];

export function toHskLevelOptions(levels: readonly number[] = HSK_LEVELS) {
  return levels.map((level) => ({
    value: level,
    label: `HSK ${level}`,
  }));
}

export function toDailyGoalOptions(minutes: readonly number[] = DAILY_GOAL_MINUTES) {
  return minutes.map((value) => ({
    value,
    label: `${value} min`,
  }));
}
