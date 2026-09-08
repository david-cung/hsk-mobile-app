import { useQuery } from '@tanstack/react-query';

import { contentApi, examMetadataApi } from '../api/endpoints';

export function useExamMetadata() {
  const revisions = useQuery({
    queryKey: ['exam-revisions'],
    queryFn: () => examMetadataApi.revisions(),
  });
  const revision = revisions.data?.find((item) => item.is_default) ?? revisions.data?.[0];
  const levels = useQuery({
    queryKey: ['exam-levels', revision?.id],
    queryFn: () => examMetadataApi.levels(revision!.id),
    enabled: Boolean(revision?.id),
  });
  const legacyLevels = useQuery({
    queryKey: ['legacy-hsk-levels'],
    queryFn: contentApi.levels,
    enabled: revisions.isError || (!revisions.isLoading && !revisions.data?.length),
  });
  const metadataLevels = levels.data ?? legacyLevels.data?.map((level) => ({
    id: level.id,
    revision_id: 0,
    revision_code: 'LEGACY_COMPATIBILITY',
    code: `LEGACY_HSK_${level.level_number}`,
    level_number: level.level_number,
    display_name: level.title,
    description: level.description,
    sort_order: level.display_order ?? level.level_number,
    status: level.status ?? 'published',
  })) ?? [];
  return {
    revisions: revisions.data ?? [],
    levels: metadataLevels,
    revision,
    isLoading: revisions.isLoading || levels.isLoading || legacyLevels.isLoading,
    isError: revisions.isError && legacyLevels.isError,
    hasCanonicalMetadata: Boolean(revision?.id),
  };
}
