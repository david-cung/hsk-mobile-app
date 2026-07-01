import { useApiMutation } from '@/hooks/useApiMutation';
import { useInvalidate } from '@/hooks/useInvalidate';
import type { ApiError } from '@/services';
import { queryKeys } from '@/services/query/keys';

import { submitQuiz } from '../api/quiz.api';
import type { QuizAnswers, QuizSubmitResult } from '../api/quiz.schemas';

type SubmitQuizVariables = {
  lessonId: number;
  answers: QuizAnswers;
};

type UseSubmitQuizOptions = Omit<
  Parameters<typeof useApiMutation<QuizSubmitResult, ApiError, SubmitQuizVariables>>[0],
  'mutationFn' | 'onSuccess'
> & {
  onSuccess?: (
    data: QuizSubmitResult,
    variables: SubmitQuizVariables,
    context: unknown,
  ) => void | Promise<void>;
};

export function useSubmitQuiz(options?: UseSubmitQuizOptions) {
  const invalidate = useInvalidate();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useApiMutation({
    mutationFn: ({ lessonId, answers }) => submitQuiz(lessonId, answers),
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      await invalidate(queryKeys.progress.all(), queryKeys.lessons.all());
      await onSuccess?.(data, variables, context);
    },
  });
}

export type { SubmitQuizVariables, UseSubmitQuizOptions };
