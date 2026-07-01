import { StyleSheet, Text, View } from 'react-native';

import { SpeakButton } from './SpeakButton';
import { colors, typography } from '../theme';

export interface ChineseLineData {
  hanzi: string;
  pinyin?: string;
  meaning?: string;
}

interface ChineseLineProps {
  line: ChineseLineData;
  large?: boolean;
  showMeaning?: boolean;
}

/** One line of Chinese with optional pinyin/meaning and speaker for the hanzi sentence. */
export function ChineseLine({ line, large, showMeaning = true }: ChineseLineProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <View style={styles.hanziRow}>
          <Text style={[styles.hanzi, large && styles.hanziLarge]}>{line.hanzi}</Text>
          <SpeakButton text={line.hanzi} />
        </View>
        {line.pinyin ? <Text style={styles.pinyin}>{line.pinyin}</Text> : null}
        {showMeaning && line.meaning ? <Text style={styles.meaning}>{line.meaning}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 12 },
  textBlock: { flex: 1 },
  hanziRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  hanzi: { ...typography.bodyZh, color: colors.onSurface },
  hanziLarge: { fontSize: 28, lineHeight: 36 },
  pinyin: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  meaning: { ...typography.bodyMd, color: colors.onSurface, marginTop: 4 },
});
