import { IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <IndianRupee className="h-5 w-5" />
      </div>
      <span className="font-headline text-lg font-bold">RupeeRoute</span>
    </div>
  )
}
