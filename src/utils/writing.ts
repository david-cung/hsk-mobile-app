const chineseCharacterPattern = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;

export function countChineseCharacters(value: string) {
  return value.match(chineseCharacterPattern)?.length ?? 0;
}

export function isWritingQuestionType(questionType: string, config?: Record<string, unknown>) {
  return (
    questionType === 'WORD_ORDER' ||
    questionType === 'SENTENCE_REORDER' ||
    questionType === 'TRANSLATION_TO_CHINESE' ||
    questionType === 'GUIDED_WRITING' ||
    (questionType === 'FILL_BLANK' && Boolean(config?.writing))
  );
}
