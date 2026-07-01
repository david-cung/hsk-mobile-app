import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { OnboardingGoalId } from '../components/GoalCard';
import { GoalStep } from '../components/GoalStep';
import { LevelGoalStep } from '../components/LevelGoalStep';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { WelcomeStep } from '../components/WelcomeStep';

const TOTAL_STEPS = 3;

const NEXT_LABELS = ['Next', 'Continue', 'Start learning'] as const;

type OnboardingStepIndex = 0 | 1 | 2;

function clampStepIndex(stepIndex: number): OnboardingStepIndex {
  if (stepIndex <= 0) {
    return 0;
  }
  if (stepIndex >= TOTAL_STEPS - 1) {
    return (TOTAL_STEPS - 1) as OnboardingStepIndex;
  }
  return stepIndex as OnboardingStepIndex;
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStepIndex>(0);
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoalId>('hsk_exam');
  const [targetHskLevel, setTargetHskLevel] = useState(2);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);

  const handleNext = useCallback(() => {
    if (currentStep === TOTAL_STEPS - 1) {
      navigate('/', { replace: true });
      return;
    }

    setCurrentStep((previous) => clampStepIndex(previous + 1));
  }, [currentStep, navigate]);

  const handleBack = useCallback(() => {
    setCurrentStep((previous) => clampStepIndex(previous - 1));
  }, []);

  const handleSkip = useCallback(() => {}, []);

  const stepContent =
    currentStep === 0 ? (
      <WelcomeStep />
    ) : currentStep === 1 ? (
      <GoalStep onSelectGoal={setSelectedGoal} selectedGoal={selectedGoal} />
    ) : (
      <LevelGoalStep
        dailyGoalMinutes={dailyGoalMinutes}
        onDailyGoalChange={setDailyGoalMinutes}
        onTargetLevelChange={setTargetHskLevel}
        targetHskLevel={targetHskLevel}
      />
    );

  return (
    <OnboardingLayout
      currentStep={currentStep}
      nextLabel={NEXT_LABELS[currentStep]}
      onBack={handleBack}
      onNext={handleNext}
      onSkip={handleSkip}
      showBack={currentStep > 0}
      totalSteps={TOTAL_STEPS}
    >
      {stepContent}
    </OnboardingLayout>
  );
}
