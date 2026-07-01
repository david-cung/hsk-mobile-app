import Tts from 'react-native-tts';

let ready = false;

async function ensureTts(): Promise<void> {
  if (ready) return;
  try {
    await Tts.setDefaultLanguage('zh-CN');
  } catch {
    /* device may fall back to default voice */
  }
  ready = true;
}

/** Speak Chinese text (word or full sentence). */
export async function speakChinese(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;
  await ensureTts();
  Tts.stop();
  Tts.speak(trimmed);
}

export function stopSpeaking(): void {
  Tts.stop();
}
