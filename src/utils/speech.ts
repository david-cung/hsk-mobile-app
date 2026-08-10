import { Platform } from 'react-native';
import Tts from 'react-native-tts';

let ready = false;
let iosVoiceId: string | undefined;

async function ensureTts(): Promise<void> {
  if (ready) return;
  await Tts.getInitStatus();

  if (Platform.OS === 'ios') {
    await Tts.setIgnoreSilentSwitch('ignore');
  }

  try {
    await Tts.setDefaultLanguage('zh-CN');
  } catch {
    /* device may fall back to default voice */
  }

  try {
    const voices = await Tts.voices();
    const chineseVoice = voices.find(
      voice =>
        voice.language.toLowerCase().startsWith('zh') && !voice.notInstalled,
    );
    if (chineseVoice) {
      iosVoiceId = chineseVoice.id;
      await Tts.setDefaultVoice(chineseVoice.id);
    }
  } catch {
    /* voice lookup is best-effort because simulator images vary */
  }

  await Tts.setDefaultPitch(1);
  ready = true;
}

/** Speak Chinese text (word or full sentence). */
export async function speakChinese(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  await ensureTts();
  if (Platform.OS === 'ios') {
    const options = iosVoiceId ? { iosVoiceId, rate: 0.45 } : { rate: 0.45 };
    Tts.speak(trimmed, options as Parameters<typeof Tts.speak>[1]);
    return;
  }

  await Tts.stop();
  Tts.speak(trimmed);
}

export function stopSpeaking(): void {
  if (Platform.OS !== 'ios') {
    Tts.stop();
  }
}
