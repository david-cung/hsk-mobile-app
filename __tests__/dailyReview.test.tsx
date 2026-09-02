import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { reviewApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { DailyReviewScreen } from '../src/screens/DailyReviewScreen';

jest.mock('../src/components/audio/AudioPlayer', () => ({
  AudioPlayer: () => null,
}));

test('daily review renders a card, accepts a rating, and shows summary', async () => {
  jest.spyOn(reviewApi, 'due').mockResolvedValue({
    due_count: 1,
    overdue_count: 0,
    new_count: 1,
    review_limit: 50,
    new_limit: 10,
    next_review_at: '2026-08-16T09:00:00Z',
    items: [
      {
        id: 1,
        card_type: 'VOCABULARY',
        state: 'NEW',
        due_at: '2026-08-15T09:00:00Z',
        overdue_seconds: 0,
        content: { hanzi: '你好', pinyin: 'ni hao', meaning: 'hello' },
        rating_previews: [
          { rating: 'AGAIN', due_at: '2026-08-15T09:10:00Z', interval_days: 0, interval_label: '10 min' },
          { rating: 'HARD', due_at: '2026-08-16T09:00:00Z', interval_days: 1, interval_label: '1 d' },
          { rating: 'GOOD', due_at: '2026-08-18T09:00:00Z', interval_days: 3, interval_label: '3 d' },
          { rating: 'EASY', due_at: '2026-08-25T09:00:00Z', interval_days: 10, interval_label: '10 d' },
        ],
      },
    ],
  });
  jest.spyOn(reviewApi, 'submit').mockResolvedValue({
    reviewed_today: 1,
    next_review_at: '2026-08-16T09:00:00Z',
    card: {
      id: 1,
      card_type: 'VOCABULARY',
      state: 'REVIEW',
      due_at: '2026-08-18T09:00:00Z',
      overdue_seconds: 0,
      content: { hanzi: '你好', pinyin: 'ni hao', meaning: 'hello' },
      rating_previews: [],
    },
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <DailyReviewScreen />
        </I18nProvider>
      </QueryClientProvider>,
    );
  });

  expect(JSON.stringify(tree!.toJSON())).toContain('你好');
  const buttons = tree!.root.findAllByProps({ accessibilityRole: 'button' });
  await ReactTestRenderer.act(async () => {
    buttons.find(button => button.props.accessibilityLabel === 'Show Answer')!.props.onPress();
  });
  expect(JSON.stringify(tree!.toJSON())).toContain('hello');
  const ratingButton = tree!.root
    .findAllByProps({ accessibilityRole: 'button' })
    .find(button => String(button.props.accessibilityLabel).includes('Good'));
  await ReactTestRenderer.act(async () => {
    ratingButton!.props.onPress();
  });

  expect(JSON.stringify(tree!.toJSON())).toContain('1 cards reviewed');
  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
  queryClient.clear();
});
