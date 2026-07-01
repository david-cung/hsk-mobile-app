import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils';

export function FormCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('mb-stack-lg bg-surface-container-low', className)}>
      <Skeleton className="mb-3 h-6 w-32" />
      <Skeleton className="mb-stack-md h-4 w-full max-w-md" />
      <div className="flex flex-col gap-stack-md">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-28" />
      </div>
    </Card>
  );
}

export function WordCardSkeleton() {
  return (
    <Card>
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="mb-2 h-10 w-24" />
      <Skeleton className="mb-3 h-4 w-20" />
      <Skeleton className="h-4 w-full" />
    </Card>
  );
}

export function ReviewCardSkeleton() {
  return (
    <Card>
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="h-11 w-24 rounded-lg" />
    </Card>
  );
}

export function MockTestCardSkeleton() {
  return (
    <Card>
      <Skeleton className="mb-3 h-6 w-16 rounded-full" />
      <Skeleton className="mb-2 h-6 w-2/3" />
      <div className="mb-4 flex gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-28" />
    </Card>
  );
}

export function AchievementCardSkeleton() {
  return (
    <Card className="flex flex-col items-center text-center">
      <Skeleton circle className="mb-stack-sm h-16 w-16" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </Card>
  );
}

export function AchievementsHeroSkeleton() {
  return (
    <div className="mb-stack-lg flex flex-col items-center text-center">
      <Skeleton circle className="mb-stack-md h-24 w-24" />
      <Skeleton className="mb-2 h-7 w-40" />
      <Skeleton className="h-4 w-56" />
    </div>
  );
}
