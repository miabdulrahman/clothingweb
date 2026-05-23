import { cn } from '@/lib/utils';

export default function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse bg-brand-charcoal/10 rounded-none', className)}
      {...props}
    />
  );
}
