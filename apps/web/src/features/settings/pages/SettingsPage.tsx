import { useId, useState } from 'react';

import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/app/config/constants';
import { toDailyGoalOptions, toHskLevelOptions } from '@/app/config/studyGoals';
import { GoalChipGroup } from '@/components/forms/GoalChipGroup';
import { FeaturePageShell } from '@/components/layout/FeaturePageShell';
import { Card } from '@/components/ui/Card';

import { SettingsSection } from '../components/SettingsSection';

const APP_VERSION = '0.1.0';
const dailyGoalOptions = toDailyGoalOptions();
const hskLevelOptions = toHskLevelOptions();

export function SettingsPage() {
  const currentLevelLabelId = useId();
  const targetLevelLabelId = useId();
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [currentHskLevel, setCurrentHskLevel] = useState<number>(1);
  const [targetHskLevel, setTargetHskLevel] = useState<number>(2);

  return (
    <FeaturePageShell backTo="/profile" title="Settings">
      <SettingsSection
        description="Choose how much time you want to study each day. Changes apply to this device until saved to your account in a future update."
        title="Study goals"
      >
        <GoalChipGroup
          ariaLabel="Daily study goal"
          onChange={setDailyGoalMinutes}
          options={dailyGoalOptions}
          value={dailyGoalMinutes}
        />
      </SettingsSection>

      <SettingsSection
        description="Set your current proficiency and the HSK level you are working toward."
        title="HSK levels"
      >
        <div className="flex flex-col gap-stack-lg">
          <div>
            <p
              className="m-0 mb-stack-sm text-label-md font-semibold text-on-surface"
              id={currentLevelLabelId}
            >
              Current level
            </p>
            <GoalChipGroup
              ariaLabelledBy={currentLevelLabelId}
              columns={3}
              onChange={setCurrentHskLevel}
              options={hskLevelOptions}
              value={currentHskLevel}
            />
          </div>
          <div>
            <p
              className="m-0 mb-stack-sm text-label-md font-semibold text-on-surface"
              id={targetLevelLabelId}
            >
              Target level
            </p>
            <GoalChipGroup
              ariaLabelledBy={targetLevelLabelId}
              columns={3}
              onChange={setTargetHskLevel}
              options={hskLevelOptions}
              value={targetHskLevel}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="About">
        <Card className="bg-surface-container-low">
          <p className="m-0 text-headline-md text-on-surface">{APP_NAME}</p>
          <p className="m-0 mt-1 text-body-md text-on-surface-variant">{APP_TAGLINE}</p>
          <p className="m-0 mt-stack-sm text-body-md text-on-surface-variant">{APP_DESCRIPTION}</p>
          <p className="m-0 mt-stack-md text-label-sm text-outline">Version {APP_VERSION}</p>
        </Card>
      </SettingsSection>
    </FeaturePageShell>
  );
}
