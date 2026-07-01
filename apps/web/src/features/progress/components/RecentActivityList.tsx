import { Card } from '@/components/ui/Card';
import { cn } from '@/utils';

export type RecentActivityStatusTone = 'default' | 'pass' | 'practice';

export type RecentActivityItem = {
  date: string;
  id: string;
  score: string;
  status: string;
  statusTone?: RecentActivityStatusTone;
  title: string;
};

type RecentActivityListProps = {
  items: RecentActivityItem[];
};

const statusToneStyles: Record<RecentActivityStatusTone, string> = {
  default: 'text-on-surface-variant',
  pass: 'font-semibold text-tertiary-container',
  practice: 'font-semibold text-outline-variant',
};

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 text-outline"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.4 18 15.4 12 9.4 6 8 7.4l5.6 5.6-5.6 5.6L9.4 18Z" fill="currentColor" />
    </svg>
  );
}

type RecentActivityRowProps = {
  item: RecentActivityItem;
};

function RecentActivityRow({ item }: RecentActivityRowProps) {
  const statusTone = item.statusTone ?? 'default';

  return (
    <li>
      <Card className="flex items-center justify-between gap-stack-md border-surface-container-highest">
        <div className="min-w-0">
          <p className="m-0 truncate text-body-md font-semibold text-on-surface">{item.title}</p>
          <p className="m-0 mt-1 text-label-sm text-on-surface-variant">{item.date}</p>
        </div>
        <div className="flex shrink-0 items-center gap-stack-md">
          <div className="text-right">
            <p className="m-0 text-headline-md text-primary">{item.score}</p>
            <p className={cn('m-0 text-label-sm', statusToneStyles[statusTone])}>{item.status}</p>
          </div>
          <ChevronRightIcon />
        </div>
      </Card>
    </li>
  );
}

export function RecentActivityList({ items }: RecentActivityListProps) {
  return (
    <section aria-labelledby="recent-activity-heading">
      <h2 className="m-0 mb-stack-md text-headline-md text-on-surface" id="recent-activity-heading">
        Recent activity
      </h2>
      <ul className="m-0 flex list-none flex-col gap-stack-sm p-0">
        {items.map((item) => (
          <RecentActivityRow item={item} key={item.id} />
        ))}
      </ul>
    </section>
  );
}

export type { RecentActivityListProps };
