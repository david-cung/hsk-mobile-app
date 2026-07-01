import { Text } from '@/components/typography';
import { Card } from '@/components/ui/Card';

import type { Question, QuestionType } from '../api/quiz.schemas';
import { MultipleChoiceQuestion } from './options/MultipleChoiceQuestion';

type QuestionRendererProps = {
  question: Question;
  questionNumber: number;
};

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Multiple choice',
  fill_blank: 'Fill in the blank',
  match_words: 'Match words',
  listening: 'Listening',
};

function UnsupportedQuestionType({ question, questionNumber }: QuestionRendererProps) {
  const typeLabel = questionTypeLabels[question.question_type] ?? question.question_type;

  return (
    <div className="flex flex-col gap-stack-lg">
      <Card className="bg-surface-container-lowest text-center">
        <Text as="p" className="m-0 mb-2 uppercase tracking-widest text-primary" variant="label">
          Question {questionNumber}
        </Text>
        <h2 className="m-0 text-headline-md text-on-surface">{question.prompt}</h2>
      </Card>
      <Card className="border-l-4 border-l-secondary bg-surface-container-low">
        <Text as="p" className="m-0 font-semibold text-on-surface" variant="label">
          {typeLabel} questions are not available in this version
        </Text>
        <Text as="p" className="m-0 mt-2 text-on-surface-variant" variant="body">
          This question type will be supported in a future update. Skip this lesson quiz for now or
          try another lesson.
        </Text>
      </Card>
    </div>
  );
}

export function QuestionRenderer({ question, questionNumber }: QuestionRendererProps) {
  switch (question.question_type) {
    case 'multiple_choice':
      return <MultipleChoiceQuestion question={question} questionNumber={questionNumber} />;
    case 'fill_blank':
    case 'match_words':
    case 'listening':
      return <UnsupportedQuestionType question={question} questionNumber={questionNumber} />;
    default: {
      const _exhaustive: never = question.question_type;
      return _exhaustive;
    }
  }
}

export type { QuestionRendererProps };
