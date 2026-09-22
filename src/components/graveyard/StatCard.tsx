import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "toxic" | "ember" | "muted";
  className?: string;
}) {
  const toneText = {
    primary: "text-primary",
    toxic: "text-toxic",
    ember: "text-ember",
    muted: "text-muted-foreground",
  }[tone];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-border/80 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_var(--primary)]",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="terminal-label">{label}</p>
        <Icon className={cn("size-4 shrink-0 opacity-70", toneText)} />
      </div>
      <p className={cn("mt-3 font-display text-3xl font-bold tabular-nums", toneText)}>{value}</p>
      {hint ? <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
