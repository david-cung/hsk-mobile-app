import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { AudioRecorder } from '../src/components/audio/AudioRecorder';
import { I18nProvider } from '../src/i18n/I18nContext';

test('audio recorder starts and stops with a recording result', async () => {
  const onRecordingReady = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <I18nProvider>
        <AudioRecorder onRecordingReady={onRecordingReady} />
      </I18nProvider>,
    );
  });

  const record = tree!.root.findByProps({ accessibilityLabel: 'Record' });
  await ReactTestRenderer.act(async () => {
    await record.props.onPress();
  });

  const stop = tree!.root.findByProps({ accessibilityLabel: 'Stop' });
  await ReactTestRenderer.act(async () => {
    await stop.props.onPress();
  });

  expect(onRecordingReady).toHaveBeenCalledWith(
    expect.objectContaining({
      uri: expect.stringContaining('mock-recording://'),
      mimeType: 'audio/mp4',
      durationSeconds: expect.any(Number),
    }),
  );
});
