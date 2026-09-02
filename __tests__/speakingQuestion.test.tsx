import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { speakingApi } from '../src/api/endpoints';
import type { PracticeQuestion } from '../src/api/types';
import { QuestionRenderer } from '../src/components/practice/QuestionRenderer';
import { I18nProvider } from '../src/i18n/I18nContext';

const question: PracticeQuestion = {
  id: 7,
  exercise_id: 2,
  question_type: 'PRONUNCIATION',
  prompt: 'Read aloud',
  difficulty: 1,
  points: 1,
  order: 1,
  config: {
    expected_text: '你好',
    pinyin: 'nǐ hǎo',
    translation: 'Hello',
    pronunciation_mode: 'READ_ALOUD',
    recording: { preferred_mime_type: 'audio/mp4' },
  },
};

test('speaking question records and prepares upload answer', async () => {
  jest.spyOn(speakingApi, 'requestUpload').mockResolvedValue({
    recording_id: 55,
    storage_key: 'users/1/speaking/55.m4a',
    upload_url: 'mock-upload://users/1/speaking/55.m4a',
    headers: { 'Content-Type': 'audio/mp4' },
    expires_at: new Date().toISOString(),
    max_size_bytes: 1000,
    status: 'UPLOAD_AUTHORIZED',
  });
  jest.spyOn(speakingApi, 'completeUpload').mockResolvedValue({
    id: 55,
    storage_key: 'users/1/speaking/55.m4a',
    mime_type: 'audio/mp4',
    duration_seconds: 1,
    language: 'zh-CN',
    status: 'UPLOADED',
    upload_expires_at: new Date().toISOString(),
    uploaded_at: new Date().toISOString(),
    expires_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const onChange = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <QuestionRenderer question={question} answer={{}} onChange={onChange} />
        </I18nProvider>
      </QueryClientProvider>,
    );
  });

  await ReactTestRenderer.act(async () => {
    await tree!.root.findByProps({ accessibilityLabel: 'Record' }).props.onPress();
  });
  await ReactTestRenderer.act(async () => {
    await tree!.root.findByProps({ accessibilityLabel: 'Stop' }).props.onPress();
  });

  expect(speakingApi.requestUpload).toHaveBeenCalledWith(
    expect.objectContaining({ mime_type: 'audio/mp4', language: 'zh-CN' }),
  );
  expect(speakingApi.completeUpload).toHaveBeenCalledWith(55, expect.objectContaining({ duration_seconds: 1 }));
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ recording_id: 55 }));
});
