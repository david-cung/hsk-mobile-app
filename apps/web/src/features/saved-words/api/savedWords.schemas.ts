import { z } from 'zod';

export const SavedWordSchema = z.object({
  id: z.number().int(),
  hanzi: z.string().min(1),
  pinyin: z.string().nullable(),
  meaning: z.string().nullable(),
  hsk_level: z.number().int().min(1).max(6).nullable(),
  saved_at: z.string().datetime({ offset: true }),
});

export const SavedWordListSchema = z.array(SavedWordSchema);

export const SavedWordCreateInputSchema = z.object({
  hanzi: z.string().trim().min(1, 'Hanzi is required'),
  pinyin: z.string().trim(),
  meaning: z.string().trim(),
});

export type SavedWord = z.infer<typeof SavedWordSchema>;
export type SavedWordCreateInput = z.infer<typeof SavedWordCreateInputSchema>;
