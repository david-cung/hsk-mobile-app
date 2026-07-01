export type AchievementIconKey =
  | 'emoji_events'
  | 'history_edu'
  | 'local_fire_department'
  | 'menu_book'
  | 'military_tech'
  | 'school'
  | 'workspace_premium';

export type Achievement = {
  id: number;
  code: string;
  title: string;
  description: string | null;
  icon: AchievementIconKey | null;
  earned: boolean;
  earned_at: string | null;
  featured?: boolean;
};

export type AchievementCardVariant = 'default' | 'featured';
