import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { QuestionRenderer } from '../src/components/practice/QuestionRenderer';
import type { PracticeQuestion } from '../src/api/types';

const multipleChoiceQuestion: PracticeQuestion = {
  id: 1,
  exercise_id: 1,
  question_type: 'MULTIPLE_CHOICE',
  prompt: '你好 means:',
  difficulty: 1,
  points: 1,
  order: 1,
  config: {
    options: [
      { id: 'a', text: 'Hello' },
      { id: 'b', text: 'Goodbye' },
    ],
  },
};

test('renders multiple choice options and selects an option', () => {
  const onChange = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <QuestionRenderer question={multipleChoiceQuestion} answer="" onChange={onChange} />,
    );
  });

  const options = tree!.root.findAll(
    node => node.props.accessibilityRole === 'radio' && typeof node.props.onPress === 'function',
  );
  expect(options).toHaveLength(2);
  options[0].props.onPress();
  expect(onChange).toHaveBeenCalledWith('a');
});

test('renders text input questions', () => {
  const onChange = jest.fn();
  const question = { ...multipleChoiceQuestion, question_type: 'TEXT_INPUT', config: {} };
  let tree: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <QuestionRenderer question={question} answer="" onChange={onChange} />,
    );
  });

  const input = tree!.root.findByType(TextInput);
  input.props.onChangeText('你好');
  expect(onChange).toHaveBeenCalledWith('你好');
});
