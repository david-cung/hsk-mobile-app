import { cn } from '@/utils';

export type PathConnectorVariant = 'completed' | 'default';

type PathConnectorProps = {
  variant?: PathConnectorVariant;
};

export function PathConnector({ variant = 'default' }: PathConnectorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'mx-auto h-10 w-1 shrink-0',
        variant === 'completed' ? 'bg-primary' : 'bg-surface-container-highest',
      )}
    />
  );
}
