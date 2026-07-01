import { cn } from '@/utils';

type ScoreRingProps = {
  score: number;
  className?: string;
};

const RING_SIZE = 192;
const STROKE_WIDTH = 12;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clampScore(score: number): number {
  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, score));
}

export function ScoreRing({ score, className }: ScoreRingProps) {
  const normalizedScore = clampScore(score);
  const progressOffset = CIRCUMFERENCE - (normalizedScore / 100) * CIRCUMFERENCE;
  const scoreLabel = `Score ${normalizedScore} out of 100`;

  return (
    <div
      aria-label={scoreLabel}
      className={cn('relative inline-flex h-48 w-48 items-center justify-center', className)}
      role="img"
    >
      <svg
        aria-hidden="true"
        className="-rotate-90"
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        width={RING_SIZE}
      >
        <circle
          className="text-surface-container-highest"
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill="none"
          r={RADIUS}
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
        />
        <circle
          className="text-primary transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          fill="none"
          r={RADIUS}
          stroke="currentColor"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          strokeWidth={STROKE_WIDTH}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-display-zh text-primary">{normalizedScore}</span>
        <span className="text-label-md text-on-surface-variant">/ 100</span>
      </div>
    </div>
  );
}

export type { ScoreRingProps };
