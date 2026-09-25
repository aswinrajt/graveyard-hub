import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/40 border border-primary/10",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-bone-shimmer",
        "before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
