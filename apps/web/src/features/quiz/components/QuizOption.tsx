import { Text } from '@/components/typography';
import { cn } from '@/utils';

type QuizOptionProps = {
  label: string;
  optionText: string;
  isSelected: boolean;
  onSelect: () => void;
};

function CheckCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-primary"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.2-4.2-4.2 1.4-1.4 2.8 2.8 6-6 1.4 1.4-7.4 7.4Z" />
    </svg>
  );
}

function RadioUncheckedIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 shrink-0 text-outline"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  );
}

export function QuizOption({ label, optionText, isSelected, onSelect }: QuizOptionProps) {
  return (
    <button
      aria-checked={isSelected}
      className={cn(
        'flex w-full items-center justify-between gap-stack-md rounded-xl p-card-padding text-left',
        'ring-focus transition-[border-color,background-color,box-shadow,transform]',
        'focus-visible:outline-none focus-visible:ring-[3px]',
        'motion-safe:active:scale-[0.98]',
        isSelected
          ? 'border-2 border-primary bg-surface-container-lowest shadow-button'
          : 'border border-outline-variant/40 bg-surface-container-lowest shadow-card hover:border-primary/50',
      )}
      onClick={onSelect}
      role="radio"
      type="button"
    >
      <span className="flex min-w-0 items-center gap-stack-md">
        <span
          className={cn(
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-label-md font-bold',
            isSelected
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant',
          )}
        >
          {label}
        </span>
        <Text
          as="span"
          className={cn(
            'min-w-0 break-words',
            isSelected ? 'font-semibold text-primary' : 'text-on-surface',
          )}
          variant="body"
        >
          {optionText}
        </Text>
      </span>
      {isSelected ? <CheckCircleIcon /> : <RadioUncheckedIcon />}
    </button>
  );
}

export type { QuizOptionProps };
