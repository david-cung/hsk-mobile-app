export type LevelRoadmapStatus = 'active' | 'completed' | 'locked';

export type LevelRoadmapMetrics = {
  vocabularyLearned: number;
  vocabularyTotal: number;
  grammarLearned: number;
  grammarTotal: number;
};

export type LevelRoadmapItem = {
  id: string;
  levelLabel: string;
  title: string;
  status: LevelRoadmapStatus;
  metrics: LevelRoadmapMetrics;
  completionPercent: number;
};
