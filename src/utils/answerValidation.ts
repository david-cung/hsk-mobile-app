import type { PracticeExercise } from '../api/types';

const PUNCTUATION_PATTERN =
  /[\s.,!?;:'"()[\]{}，。！？；：“”‘’、（）《》〈〉【】]/g;
const ALTERNATIVE_PATTERN = /\s*(?:\/|\||;|；)\s*/;

export function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(PUNCTUATION_PATTERN, '');
}

export function splitExpectedAnswers(value: string) {
  return value
    .split(ALTERNATIVE_PATTERN)
    .map(answer => answer.trim())
    .filter(Boolean);
}

export function resolveExpectedAnswer(exercise: PracticeExercise) {
  return exercise.expected_answer ?? exercise.correct_answer;
}

export function isAnswerCorrect(userAnswer: string, expectedAnswer: string) {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  if (!normalizedUserAnswer) {
    return false;
  }

  return splitExpectedAnswers(expectedAnswer).some(
    candidate => normalizeAnswer(candidate) === normalizedUserAnswer,
  );
}
