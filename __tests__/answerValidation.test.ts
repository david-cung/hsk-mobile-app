import {
  isAnswerCorrect,
  normalizeAnswer,
  splitExpectedAnswers,
} from '../src/utils/answerValidation';

describe('answerValidation', () => {
  it('normalizes punctuation, spaces, and casing', () => {
    expect(normalizeAnswer(' 今天 我 学习。 ')).toBe('今天我学习');
    expect(normalizeAnswer('Hello, HSK!')).toBe('hellohsk');
  });

  it('checks exact answers after normalization', () => {
    expect(isAnswerCorrect('我想学习汉语', '我想学习汉语。')).toBe(true);
    expect(isAnswerCorrect('  HELLO ', 'hello')).toBe(true);
    expect(isAnswerCorrect('', 'hello')).toBe(false);
  });

  it('accepts alternative expected answers', () => {
    expect(splitExpectedAnswers('先听老师说 / 整理关键词')).toEqual([
      '先听老师说',
      '整理关键词',
    ]);
    expect(isAnswerCorrect('整理关键词', '先听老师说 / 整理关键词')).toBe(true);
  });
});
