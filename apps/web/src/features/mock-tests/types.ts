export type MockTest = {
  id: number;
  title: string;
  hsk_level: number;
  duration_minutes: number;
  question_count: number;
};

export const MOCK_TEST_CATALOG: MockTest[] = [
  {
    id: 1,
    title: 'HSK 1 Mock Test',
    hsk_level: 1,
    duration_minutes: 60,
    question_count: 30,
  },
  {
    id: 2,
    title: 'HSK 2 Mock Test',
    hsk_level: 2,
    duration_minutes: 60,
    question_count: 30,
  },
  {
    id: 3,
    title: 'HSK 3 Mock Test',
    hsk_level: 3,
    duration_minutes: 60,
    question_count: 30,
  },
  {
    id: 4,
    title: 'HSK 4 Mock Test',
    hsk_level: 4,
    duration_minutes: 90,
    question_count: 45,
  },
];

export function getMockTestById(testId: number): MockTest | undefined {
  return MOCK_TEST_CATALOG.find((test) => test.id === testId);
}

export function getMockTestSessionPath(testId: number): string {
  return `/profile/mock-tests/${testId}`;
}
