import { Skull, Ghost, FolderArchive, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Animated glowing skull / bone loader for inline loading, buttons, and badges
 */
export function GraveSpinner({
  size = "md",
  className,
  text,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}) {
  const iconSizes = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-6",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 font-mono", className)}>
      <div className="relative flex items-center justify-center">
        <Skull className={cn(iconSizes[size], "animate-skull-float text-primary")} />
        <span className="absolute -inset-1 animate-ping rounded-full bg-toxic/20 opacity-75" />
      </div>
      {text && <span className="text-xs tracking-wider text-muted-foreground">{text}</span>}
    </div>
  );
}

/**
 * High-fidelity Skeleton loader for a Tombstone card, matching TombstoneCard.tsx
 */
export function TombstoneSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="relative flex flex-col overflow-hidden border border-border/70 bg-card/50 tomb px-5 pb-5 pt-9 backdrop-blur-sm"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Arch apex skull placeholder */}
      <div className="flex items-center justify-center">
        <div className="relative flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <Skull className="size-4 animate-skull-float text-primary/40" />
        </div>
      </div>

      {/* Project name & dates */}
      <Skeleton className="mx-auto mt-4 h-5 w-3/4 max-w-[160px]" />
      <Skeleton className="mx-auto mt-2 h-3 w-1/3 max-w-[90px]" />

      {/* Status badge pill */}
      <div className="mt-3 flex justify-center">
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      {/* Tech tag pills */}
      <div className="mt-4 flex justify-center gap-1.5">
        <Skeleton className="h-4 w-12 rounded-sm" />
        <Skeleton className="h-4 w-14 rounded-sm" />
        <Skeleton className="h-4 w-10 rounded-sm" />
      </div>

      {/* Spec details table */}
      <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Epitaph line */}
      <Skeleton className="mx-auto mt-4 h-3 w-4/5 italic" />

      {/* Card action buttons */}
      <div className="mt-5 flex gap-2 border-t border-border/60 pt-4">
        <Skeleton className="h-8 flex-1 rounded" />
        <Skeleton className="h-8 flex-1 rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton for StatCard
 */
export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-md border border-border/70 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-8 rounded-sm" />
      </div>
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2 h-2.5 w-32" />
    </div>
  );
}

/**
 * Full Command Center Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* 6 Stat Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Activity Chart Skeleton */}
        <div className="rounded-md border border-border/70 bg-card/60 p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-1 h-3 w-52" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
          {/* Simulated chart bars/area */}
          <div className="mt-6 flex h-[240px] items-end justify-between gap-2 border-b border-border/50 pb-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex h-full w-full flex-col justify-end gap-1">
                <Skeleton
                  className="w-full rounded-t-sm"
                  style={{ height: `${20 + ((i * 17) % 70)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-2.5 w-8" />
            ))}
          </div>
        </div>

        {/* Status Breakdown Skeleton */}
        <div className="rounded-md border border-border/70 bg-card/60 p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-1 h-3 w-28" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Forgotten Project Banner Skeleton */}
      <div className="relative overflow-hidden rounded-md border border-primary/20 bg-card/60 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-6 w-64" />
            <Skeleton className="mt-2 h-3.5 w-96 max-w-full" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Recently Buried Tombstones */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-1 h-3 w-48" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <TombstoneSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Analytics Page Skeleton
 */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border border-border/70 bg-card/60 p-5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="mt-1 h-3 w-28" />
            <div className="mt-6 flex h-[260px] items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Skull className="size-8 animate-skull-float text-primary/30" />
                <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground/60">
                  CALCULATING MORTALITY DATA...
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Collections Page Skeleton
 */
export function CollectionsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <FolderArchive className="size-5 text-primary/40" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="mt-2 h-3 w-48" />
          <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Profile Page Skeleton
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero profile banner */}
      <div className="relative overflow-hidden rounded-md border border-primary/20 bg-card/60 p-6">
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-96 max-w-full" />
            <div className="mt-3 flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-sm" />
              <Skeleton className="h-5 w-20 rounded-sm" />
              <Skeleton className="h-5 w-14 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Timeline skeleton */}
      <div className="rounded-md border border-border/70 bg-card/60 p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-32" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-48" />
              </div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Page Skeleton
 */
export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-md border border-border/70 bg-card/60 p-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-1 h-3 w-48" />
        <div className="mt-4 space-y-4">
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1.5 h-9 w-full" />
          </div>
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-1.5 h-9 w-full" />
          </div>
          <div>
            <Skeleton className="h-3 w-12" />
            <Skeleton className="mt-1.5 h-20 w-full" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="rounded-md border border-border/70 bg-card/60 p-5">
        <Skeleton className="h-4 w-40" />
        <div className="mt-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-2.5 w-60" />
              </div>
              <Skeleton className="h-5 w-9 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Project Detail Skeleton
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-3.5 w-28" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-8 w-64 sm:w-80" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-3.5 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Epitaph quote box */}
      <div className="rounded-md border border-primary/20 bg-card/60 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-4 w-3/4 italic" />
      </div>

      {/* Grid of specs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md border border-border/60 bg-card/40 p-4">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="mt-2 h-5 w-28" />
          </div>
        ))}
      </div>

      {/* Artifacts slot skeleton */}
      <div className="rounded-md border border-border/70 bg-card/60 p-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-1 h-3 w-64" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded border border-border/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
