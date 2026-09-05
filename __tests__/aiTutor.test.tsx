import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { tutorApi } from '../src/api/endpoints';
import { I18nProvider } from '../src/i18n/I18nContext';
import { AITutorHistoryScreen } from '../src/screens/AITutorHistoryScreen';
import { AITutorScreen } from '../src/screens/AITutorScreen';

const mockNavigate = jest.fn();
const mockRoute = { params: undefined as Record<string, unknown> | undefined };

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: mockRoute.params }),
  useNavigation: () => ({ navigate: mockNavigate, getParent: () => ({ navigate: mockNavigate }) }),
}));

jest.mock('../src/navigation/useRootNavigation', () => ({
  useRootNavigation: () => ({ navigate: mockNavigate }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  let tree: ReactTestRenderer.ReactTestRenderer;
  return {
    queryClient,
    render: async () => {
      await ReactTestRenderer.act(async () => {
        tree = ReactTestRenderer.create(
          <QueryClientProvider client={queryClient}>
            <I18nProvider>{ui}</I18nProvider>
          </QueryClientProvider>,
        );
      });
      return tree!;
    },
  };
}

test('AI tutor mode selection starts free chat, sends a message, and shows the reply', async () => {
  mockRoute.params = undefined;
  jest.spyOn(tutorApi, 'scenarios').mockResolvedValue([
    { id: 'restaurant', title: 'Restaurant', description: 'Order food' },
  ]);
  jest.spyOn(tutorApi, 'create').mockResolvedValue({
    id: 9,
    mode: 'FREE_CHAT',
    hsk_level: 1,
    title: 'Free chat',
    explanation_language: 'zh',
    created_at: '2026-09-02T00:00:00Z',
    updated_at: '2026-09-02T00:00:00Z',
    messages: [],
  });
  jest.spyOn(tutorApi, 'detail').mockResolvedValue({
    id: 9,
    mode: 'FREE_CHAT',
    hsk_level: 1,
    title: 'Free chat',
    explanation_language: 'zh',
    created_at: '2026-09-02T00:00:00Z',
    updated_at: '2026-09-02T00:00:00Z',
    messages: [],
  });
  jest.spyOn(tutorApi, 'sendMessage').mockResolvedValue({
    conversation: {
      id: 9,
      mode: 'FREE_CHAT',
      hsk_level: 1,
      title: '你好',
      explanation_language: 'zh',
      created_at: '2026-09-02T00:00:00Z',
      updated_at: '2026-09-02T00:00:00Z',
      messages: [
        { id: 1, role: 'USER', content: '你好', corrections: [], vocabulary_notes: [], grammar_notes: [], created_at: '2026-09-02T00:00:00Z' },
        {
          id: 2,
          role: 'ASSISTANT',
          content: '很好。我们继续练习。',
          chinese_text: '很好。我们继续练习。',
          pinyin: 'Hen hao',
          corrections: [],
          vocabulary_notes: [],
          grammar_notes: [],
          created_at: '2026-09-02T00:00:01Z',
        },
      ],
    },
    user_message: { id: 1, role: 'USER', content: '你好', corrections: [], vocabulary_notes: [], grammar_notes: [], created_at: '2026-09-02T00:00:00Z' },
    assistant_message: {
      id: 2,
      role: 'ASSISTANT',
      content: '很好。我们继续练习。',
      chinese_text: '很好。我们继续练习。',
      corrections: [],
      vocabulary_notes: [],
      grammar_notes: [],
      created_at: '2026-09-02T00:00:01Z',
    },
  });
  const { queryClient, render } = renderWithProviders(<AITutorScreen />);
  let tree = await render();
  expect(JSON.stringify(tree.toJSON())).toContain('Free Chat');
  expect(JSON.stringify(tree.toJSON())).toContain('Role Play');
  expect(JSON.stringify(tree.toJSON())).toContain('Grammar Practice');
  expect(JSON.stringify(tree.toJSON())).toContain('Vocabulary Practice');
  const freeChat = tree.root.findByProps({ accessibilityLabel: 'Free Chat' });
  await ReactTestRenderer.act(async () => {
    freeChat.props.onPress();
  });
  expect(tutorApi.create).toHaveBeenCalledWith(
    expect.objectContaining({ mode: 'FREE_CHAT' }),
    expect.anything(),
  );
  expect(JSON.stringify(tree.toJSON())).toContain('Say hello in Chinese');
  const input = tree.root.findByProps({ accessibilityLabel: 'Type in Chinese or your question' });
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText('你好');
  });
  const send = tree.root.findByProps({ accessibilityLabel: 'Send' });
  await ReactTestRenderer.act(async () => {
    send.props.onPress();
  });
  await ReactTestRenderer.act(async () => {
    await Promise.resolve();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('很好。我们继续练习。');
  await ReactTestRenderer.act(async () => {
    tree.unmount();
  });
  queryClient.clear();
});

test('AI tutor shows loading, error, and retry for an existing conversation', async () => {
  mockRoute.params = { conversationId: 3 };
  const detail = jest.spyOn(tutorApi, 'detail');
  detail.mockRejectedValueOnce(new Error('offline'));
  const { queryClient, render } = renderWithProviders(<AITutorScreen />);
  let tree = await render();
  expect(JSON.stringify(tree.toJSON())).toContain('Could not load the tutor');
  detail.mockResolvedValue({
    id: 3,
    mode: 'FREE_CHAT',
    hsk_level: 1,
    title: 'Hello',
    explanation_language: 'zh',
    created_at: '2026-09-02T00:00:00Z',
    updated_at: '2026-09-02T00:00:00Z',
    messages: [],
  });
  const retry = tree.root.findByProps({ accessibilityLabel: 'Try Again' });
  await ReactTestRenderer.act(async () => {
    retry.props.onPress();
    await new Promise(resolve => setTimeout(resolve, 30));
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Say hello in Chinese');
  await ReactTestRenderer.act(async () => {
    tree.unmount();
  });
  queryClient.clear();
});

test('role play shows backend scenarios', async () => {
  mockRoute.params = undefined;
  jest.spyOn(tutorApi, 'scenarios').mockResolvedValue([
    { id: 'restaurant', title: 'Restaurant', title_translations: { en: 'Restaurant' }, description: 'Order food' },
  ]);
  const { queryClient, render } = renderWithProviders(<AITutorScreen />);
  const tree = await render();
  await ReactTestRenderer.act(async () => {
    tree.root.findByProps({ accessibilityLabel: 'Role Play' }).props.onPress();
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Restaurant');
  await ReactTestRenderer.act(async () => {
    tree.unmount();
  });
  queryClient.clear();
});

test('conversation history loads, paginates, and opens a conversation', async () => {
  jest.spyOn(tutorApi, 'list').mockResolvedValue({
    items: [
      {
        id: 4,
        mode: 'FREE_CHAT',
        hsk_level: 1,
        title: 'Airport chat',
        explanation_language: 'zh',
        created_at: '2026-09-02T00:00:00Z',
        updated_at: '2026-09-02T00:00:00Z',
        messages: [],
      },
    ],
    total: 21,
    limit: 20,
    offset: 0,
  });
  const { queryClient, render } = renderWithProviders(<AITutorHistoryScreen />);
  const tree = await render();
  expect(JSON.stringify(tree.toJSON())).toContain('Airport chat');
  const open = tree.root.findByProps({ accessibilityLabel: 'Airport chat' });
  await ReactTestRenderer.act(async () => {
    open.props.onPress();
  });
  expect(mockNavigate).toHaveBeenCalledWith('AiTutor', { conversationId: 4 });
  expect(JSON.stringify(tree.toJSON())).toContain('Load more');
  await ReactTestRenderer.act(async () => {
    tree.unmount();
  });
  queryClient.clear();
});
