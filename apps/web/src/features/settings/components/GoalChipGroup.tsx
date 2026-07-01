import { cn } from '@/utils';

type ChipOption<T extends string | number> = {
  label: string;
  value: T;
};

type GoalChipGroupProps<T extends string | number> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  columns?: 2 | 3;
};

export function GoalChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  ariaLabelledBy,
  columns = 2,
}: GoalChipGroupProps<T>) {
  const gridClassName = columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2';

  return (
    <div
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn('grid gap-stack-md', gridClassName)}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            aria-checked={isSelected}
            className={cn(
              'min-h-11 rounded-xl border-2 px-4 py-3 text-label-md font-medium transition-[border-color,background-color,color,box-shadow]',
              'ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
              'motion-safe:active:scale-[0.98]',
              isSelected
                ? 'border-primary bg-primary/5 font-semibold text-primary shadow-card'
                : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-primary/50',
            )}
            key={String(option.value)}
            onClick={() => {
              onChange(option.value);
            }}
            role="radio"
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export type { ChipOption, GoalChipGroupProps };
