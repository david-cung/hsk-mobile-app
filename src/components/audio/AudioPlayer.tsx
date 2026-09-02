import { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useI18n } from '../../i18n/I18nContext';
import { colors, radius, spacing, typography } from '../../theme';

export interface AudioPlaybackState {
  playCount: number;
  replayCount: number;
  completedAudio: boolean;
  listenedSeconds: number;
}

interface AudioPlayerProps {
  sourceUrl?: string | null;
  provider?: string | null;
  transcript?: string | null;
  autoPlay?: boolean;
  allowSeek?: boolean;
  replayLimit?: number | null;
  onPlaybackChange?: (state: AudioPlaybackState) => void;
}

function textFromSource(sourceUrl?: string | null, transcript?: string | null) {
  if (transcript?.trim()) {
    return transcript.trim();
  }
  if (!sourceUrl?.startsWith('tts://')) {
    return '';
  }
  const encoded = sourceUrl.split('/').slice(3).join('/');
  return decodeURIComponent(encoded);
}

export function AudioPlayer({
  sourceUrl,
  provider,
  transcript,
  autoPlay = false,
  allowSeek = false,
  replayLimit = null,
  onPlaybackChange,
}: AudioPlayerProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [playback, setPlayback] = useState<AudioPlaybackState>({
    playCount: 0,
    replayCount: 0,
    completedAudio: false,
    listenedSeconds: 0,
  });
  const startedAtRef = useRef<number | null>(null);
  const completedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoPlayedRef = useRef(false);
  const isTts = provider === 'tts' || sourceUrl?.startsWith('tts://');
  const isMockRecording = provider === 'recording' && sourceUrl?.startsWith('mock-recording://');

  const updatePlayback = (next: AudioPlaybackState) => {
    setPlayback(next);
    onPlaybackChange?.(next);
  };

  const stopTimer = () => {
    if (completedTimerRef.current) {
      clearTimeout(completedTimerRef.current);
      completedTimerRef.current = null;
    }
  };

  const markStopped = (nextStatus: 'paused' | 'completed') => {
    stopTimer();
    const listenedSeconds = startedAtRef.current
      ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
      : 0;
    startedAtRef.current = null;
    updatePlayback({
      ...playback,
      completedAudio: nextStatus === 'completed' ? true : playback.completedAudio,
      listenedSeconds: playback.listenedSeconds + listenedSeconds,
    });
    setStatus(nextStatus);
  };

  const play = async () => {
    setError(null);
    if (!sourceUrl) {
      setError(t('audio.missing'));
      setStatus('failed');
      return;
    }
    if (isMockRecording) {
      setStatus('playing');
      const nextPlayback = {
        ...playback,
        playCount: playback.playCount + 1,
        replayCount: playback.playCount > 0 ? playback.replayCount + 1 : playback.replayCount,
      };
      updatePlayback(nextPlayback);
      completedTimerRef.current = setTimeout(() => {
        updatePlayback({ ...nextPlayback, completedAudio: true, listenedSeconds: nextPlayback.listenedSeconds + 1 });
        setStatus('completed');
      }, 600);
      return;
    }
    if (!isTts) {
      const canOpen = await Linking.canOpenURL(sourceUrl);
      if (canOpen) {
        await Linking.openURL(sourceUrl);
      }
      setError(t('audio.unsupported'));
      setStatus('failed');
      return;
    }
    if (replayLimit != null && playback.replayCount >= replayLimit && playback.playCount > 0) {
      setError(t('audio.replayLimit'));
      setStatus('failed');
      return;
    }
    const text = textFromSource(sourceUrl, transcript);
    if (!text) {
      setError(t('audio.missing'));
      setStatus('failed');
      return;
    }
    setStatus('loading');
    await Tts.getInitStatus();
    try {
      await Tts.setDefaultLanguage('zh-CN');
    } catch {
      /* device may fall back to default voice */
    }
    stopTimer();
    Tts.stop();
    Tts.speak(text, { rate: 0.45 } as Parameters<typeof Tts.speak>[1]);
    const nextPlayback = {
      ...playback,
      playCount: playback.playCount + 1,
      replayCount: playback.playCount > 0 ? playback.replayCount + 1 : playback.replayCount,
    };
    updatePlayback(nextPlayback);
    startedAtRef.current = Date.now();
    setStatus('playing');
    const estimatedMs = Math.max(1800, Math.min(15000, text.length * 180));
    completedTimerRef.current = setTimeout(() => {
      updatePlayback({
        ...nextPlayback,
        completedAudio: true,
        listenedSeconds: nextPlayback.listenedSeconds + Math.round(estimatedMs / 1000),
      });
      startedAtRef.current = null;
      setStatus('completed');
    }, estimatedMs);
  };

  const pause = () => {
    Tts.stop();
    markStopped('paused');
  };

  useEffect(() => {
    if (autoPlay && !autoPlayedRef.current && sourceUrl) {
      autoPlayedRef.current = true;
      play().catch(() => {
        setError(t('audio.couldNotPlay'));
        setStatus('failed');
      });
    }
    return () => {
      stopTimer();
      Tts.stop();
    };
    // auto-play should happen once per mounted audio source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, sourceUrl]);

  const isPlaying = status === 'playing' || status === 'loading';

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? t('audio.pause') : t('audio.play')}
        onPress={() => {
          if (isPlaying) {
            pause();
          } else {
            play().catch(() => {
              setError(t('audio.couldNotPlay'));
              setStatus('failed');
            });
          }
        }}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : status === 'completed' ? 'refresh' : 'play'}
          size={22}
          color={colors.onPrimary}
        />
      </Pressable>
      <View style={styles.meta}>
        <Text style={styles.status}>
          {status === 'loading'
            ? t('audio.loading')
            : status === 'playing'
              ? t('audio.playing')
              : status === 'paused'
                ? t('audio.paused')
                : status === 'completed'
                  ? t('audio.completed')
                  : t('audio.ready')}
        </Text>
        <Text style={styles.detail}>
          {t('audio.plays', { count: playback.playCount })}
          {allowSeek ? '' : ` · ${t('audio.seekLocked')}`}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    padding: spacing.stackMd,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing.stackMd,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  pressed: { opacity: 0.75 },
  meta: { flex: 1 },
  status: { ...typography.labelMd, color: colors.onSurface },
  detail: { ...typography.labelSm, color: colors.onSurfaceVariant, marginTop: 2 },
  error: { ...typography.labelSm, color: colors.error, marginTop: spacing.stackSm },
});
