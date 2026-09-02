import { useEffect, useRef, useState } from 'react';
import { NativeModules, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '../../i18n/I18nContext';
import { colors, radius, spacing, typography } from '../../theme';
import { Button } from '../Button';
import { AudioPlayer } from './AudioPlayer';

type NativeRecorder = {
  requestPermission?: () => Promise<boolean>;
  start?: (options: { mimeType: string }) => Promise<{ uri?: string } | string | void>;
  pause?: () => Promise<void>;
  resume?: () => Promise<void>;
  stop?: () => Promise<{ uri?: string; sizeBytes?: number; durationSeconds?: number } | string>;
  cancel?: () => Promise<void>;
};

const recorderModule = NativeModules.HSKAudioRecorder as NativeRecorder | undefined;

export interface AudioRecordingResult {
  uri: string;
  filename: string;
  mimeType: string;
  sizeBytes?: number | null;
  durationSeconds: number;
}

interface AudioRecorderProps {
  disabled?: boolean;
  preferredMimeType?: string;
  onRecordingReady: (recording: AudioRecordingResult) => void;
  onStateChange?: (state: string) => void;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

async function requestMicrophonePermission() {
  if (recorderModule?.requestPermission) {
    return recorderModule.requestPermission();
  }
  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export function AudioRecorder({
  disabled,
  preferredMimeType = 'audio/mp4',
  onRecordingReady,
  onStateChange,
}: AudioRecorderProps) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'requesting' | 'recording' | 'paused' | 'stopped' | 'denied' | 'error'>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState<AudioRecordingResult | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setRecorderState = (next: typeof state) => {
    setState(next);
    onStateChange?.(next);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (startedAtRef.current) {
        setDuration(Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
      }
    }, 500);
  };

  useEffect(() => stopTimer, []);

  const start = async () => {
    if (disabled || state === 'recording' || state === 'requesting') {
      return;
    }
    setError(null);
    setRecording(null);
    setDuration(0);
    setRecorderState('requesting');
    try {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        setRecorderState('denied');
        setError(t('speaking.permissionDenied'));
        return;
      }
      await recorderModule?.start?.({ mimeType: preferredMimeType });
      startedAtRef.current = Date.now();
      startTimer();
      setRecorderState('recording');
    } catch (exc) {
      setRecorderState('error');
      setError(exc instanceof Error ? exc.message : t('speaking.microphoneError'));
    }
  };

  const pause = async () => {
    if (state !== 'recording') {
      return;
    }
    try {
      await recorderModule?.pause?.();
      stopTimer();
      setRecorderState('paused');
    } catch {
      setError(t('speaking.pauseUnsupported'));
    }
  };

  const resume = async () => {
    if (state !== 'paused') {
      return;
    }
    try {
      await recorderModule?.resume?.();
      startedAtRef.current = Date.now() - duration * 1000;
      startTimer();
      setRecorderState('recording');
    } catch {
      setError(t('speaking.resumeUnsupported'));
    }
  };

  const stop = async () => {
    if (state !== 'recording' && state !== 'paused') {
      return;
    }
    stopTimer();
    try {
      const stopped = await recorderModule?.stop?.();
      const measuredDuration = Math.max(
        1,
        duration,
        startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 1,
      );
      const uri = typeof stopped === 'string' ? stopped : stopped?.uri;
      const nextRecording: AudioRecordingResult = {
        uri: uri || `mock-recording://${Date.now()}`,
        filename: `speaking-${Date.now()}.m4a`,
        mimeType: preferredMimeType,
        sizeBytes: typeof stopped === 'object' ? stopped?.sizeBytes : null,
        durationSeconds: measuredDuration,
      };
      startedAtRef.current = null;
      setDuration(measuredDuration);
      setRecording(nextRecording);
      setRecorderState('stopped');
      onRecordingReady(nextRecording);
    } catch (exc) {
      setRecorderState('error');
      setError(exc instanceof Error ? exc.message : t('speaking.microphoneError'));
    }
  };

  const cancel = async () => {
    stopTimer();
    try {
      await recorderModule?.cancel?.();
    } finally {
      startedAtRef.current = null;
      setDuration(0);
      setRecording(null);
      setError(null);
      setRecorderState('idle');
    }
  };

  const isActive = state === 'recording' || state === 'paused' || state === 'requesting';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.status}>
          {state === 'recording'
            ? t('speaking.recording')
            : state === 'paused'
              ? t('speaking.paused')
              : state === 'stopped'
                ? t('speaking.readyToSubmit')
                : t('speaking.recorderReady')}
        </Text>
        <Text style={styles.timer}>{formatDuration(duration)}</Text>
      </View>
      <View style={styles.actions}>
        {state === 'recording' ? (
          <Button title={t('speaking.pause')} variant="secondary" leftIcon="pause" onPress={pause} style={styles.button} />
        ) : state === 'paused' ? (
          <Button title={t('speaking.resume')} variant="secondary" leftIcon="mic" onPress={resume} style={styles.button} />
        ) : (
          <Button
            title={t('speaking.record')}
            leftIcon="mic"
            disabled={disabled || isActive}
            loading={state === 'requesting'}
            onPress={start}
            style={styles.button}
          />
        )}
        {state === 'recording' || state === 'paused' ? (
          <Button title={t('speaking.stop')} rightIcon="stop-circle-outline" onPress={stop} style={styles.button} />
        ) : null}
        {isActive || recording ? (
          <Button title={t('common.cancel')} variant="ghost" leftIcon="close" onPress={cancel} style={styles.button} />
        ) : null}
      </View>
      {recording ? (
        <AudioPlayer sourceUrl={recording.uri} provider="recording" allowSeek />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    padding: spacing.stackMd,
    backgroundColor: colors.surfaceContainerLowest,
    marginTop: spacing.stackMd,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.stackMd },
  status: { ...typography.labelMd, color: colors.onSurface },
  timer: { ...typography.labelMd, color: colors.primary },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.stackSm, marginBottom: spacing.stackSm },
  button: { flexGrow: 1, minWidth: 120 },
  error: { ...typography.labelSm, color: colors.error, marginTop: spacing.stackSm },
});
