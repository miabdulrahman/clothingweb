import { cn } from '@/lib/utils';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-brand-charcoal/5 dark:bg-dark-card animate-pulse rounded-none',
        className
      )}
    />
  );
}
