export type PracticeModeId =
  'grammar' | 'listening' | 'mixed-review' | 'reading' | 'vocabulary' | 'writing';

export type PracticeModePath = `/practice/${PracticeModeId}`;

export type PracticeModeVariant = 'default' | 'featured';

export type PracticeModeIconColor = 'on-primary' | 'primary' | 'secondary' | 'tertiary';

export type PracticeMode = {
  id: PracticeModeId;
  label: string;
  description: string;
  href: PracticeModePath;
  variant: PracticeModeVariant;
  iconColor: PracticeModeIconColor;
};
