import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { AudioPlayer } from '../src/components/audio/AudioPlayer';
import { I18nProvider } from '../src/i18n/I18nContext';

test('audio player starts TTS playback and reports metadata', async () => {
  const onPlaybackChange = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <I18nProvider>
        <AudioPlayer
          sourceUrl="tts://zh-CN/%E4%BD%A0%E5%A5%BD"
          provider="tts"
          onPlaybackChange={onPlaybackChange}
        />
      </I18nProvider>,
    );
  });

  const playButton = tree!.root.find(
    node => node.props.accessibilityRole === 'button' && typeof node.props.onPress === 'function',
  );
  await ReactTestRenderer.act(async () => {
    await playButton.props.onPress();
  });

  expect(onPlaybackChange).toHaveBeenCalledWith(
    expect.objectContaining({ playCount: 1, replayCount: 0 }),
  );
  ReactTestRenderer.act(() => {
    tree!.unmount();
  });
});
