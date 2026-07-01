import { useId } from 'react';

import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { Question } from '../../api/quiz.schemas';
import { selectQuizAnswerForQuestion, useQuizSessionStore } from '../../store/quizSession.store';
import { QuizOption } from '../QuizOption';

type MultipleChoiceQuestionProps = {
  question: Question;
  questionNumber: number;
};

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export function MultipleChoiceQuestion({ question, questionNumber }: MultipleChoiceQuestionProps) {
  const promptId = useId();
  const optionsGroupId = useId();
  const selectAnswer = useQuizSessionStore((state) => state.selectAnswer);
  const selectedAnswer = useQuizSessionStore(selectQuizAnswerForQuestion(question.id));
  const options = question.options ?? [];

  return (
    <div className="flex flex-col gap-stack-lg">
      <Card aria-labelledby={promptId} className="bg-surface-container-lowest text-center">
        <Text as="p" className="m-0 mb-2 uppercase tracking-widest text-primary" variant="label">
          Question {questionNumber}
        </Text>
        <h2 className="m-0 text-headline-md text-on-surface" id={promptId}>
          {question.prompt}
        </h2>
      </Card>

      {options.length > 0 ? (
        <div
          aria-labelledby={promptId}
          className="grid grid-cols-1 gap-stack-md"
          id={optionsGroupId}
          role="radiogroup"
        >
          {options.map((option, index) => {
            const label = OPTION_LABELS[index] ?? String(index + 1);

            return (
              <QuizOption
                isSelected={selectedAnswer === option}
                key={`${question.id}-${option}`}
                label={label}
                onSelect={() => {
                  selectAnswer(question.id, option);
                }}
                optionText={option}
              />
            );
          })}
        </div>
      ) : (
        <Card className="bg-surface-container-low">
          <Text as="p" className="m-0 text-on-surface-variant" variant="body">
            This question does not include answer options.
          </Text>
        </Card>
      )}
    </div>
  );
}

export type { MultipleChoiceQuestionProps };
