import type { KeyboardEvent } from 'react';

export function getNextRadioIndex(
  currentIndex: number,
  direction: 'next' | 'previous',
  count: number,
): number {
  if (count === 0) {
    return 0;
  }

  if (direction === 'next') {
    return (currentIndex + 1) % count;
  }

  return (currentIndex - 1 + count) % count;
}

export function handleRadioGroupKeyDown<T extends string | number>(
  event: KeyboardEvent<HTMLElement>,
  options: { value: T }[],
  currentValue: T,
  onChange: (value: T) => void,
): void {
  const currentIndex = options.findIndex((option) => option.value === currentValue);
  if (currentIndex < 0) {
    return;
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    const nextOption = options[getNextRadioIndex(currentIndex, 'next', options.length)];
    if (nextOption) {
      onChange(nextOption.value);
    }
    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    const previousOption = options[getNextRadioIndex(currentIndex, 'previous', options.length)];
    if (previousOption) {
      onChange(previousOption.value);
    }
  }
}
