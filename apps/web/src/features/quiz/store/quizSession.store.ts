import { create } from 'zustand';

import type { QuizAnswers } from '../api/quiz.schemas';

export type QuizSessionState = {
  currentIndex: number;
  answers: QuizAnswers;
  startedAt: number | null;
};

export type QuizSessionActions = {
  selectAnswer: (questionId: number, answer: string) => void;
  next: () => void;
  reset: () => void;
};

export type QuizSessionStore = QuizSessionState & QuizSessionActions;

function createInitialState(): QuizSessionState {
  return {
    currentIndex: 0,
    answers: {},
    startedAt: null,
  };
}

export const selectQuizCurrentIndex = (state: QuizSessionStore): number => state.currentIndex;

export const selectQuizAnswers = (state: QuizSessionStore): QuizAnswers => state.answers;

export const selectQuizStartedAt = (state: QuizSessionStore): number | null => state.startedAt;

export const selectQuizAnswerForQuestion =
  (questionId: number) =>
  (state: QuizSessionStore): string | undefined =>
    state.answers[String(questionId)];

/**
 * In-quiz UI state for the active lesson session.
 * Server data and scoring live in query cache / API layers — not here.
 */
export const useQuizSessionStore = create<QuizSessionStore>((set) => ({
  ...createInitialState(),
  selectAnswer: (questionId, answer) => {
    set((state) => ({
      startedAt: state.startedAt ?? Date.now(),
      answers: {
        ...state.answers,
        [String(questionId)]: answer,
      },
    }));
  },
  next: () => {
    set((state) => ({
      currentIndex: state.currentIndex + 1,
    }));
  },
  reset: () => {
    set(createInitialState());
  },
}));
