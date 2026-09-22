import { cn } from "@/lib/utils";
import { STATUS_LABEL, type ProjectStatus } from "@/data/projects";

const styles: Record<ProjectStatus, string> = {
  active: "text-toxic border-toxic/40 bg-toxic/10",
  revivable: "text-ember border-ember/40 bg-ember/10",
  abandoned: "text-primary border-primary/40 bg-primary/10",
  buried: "text-muted-foreground border-border bg-muted/40",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase",
        styles[status],
        className,
      )}
    >
      <span className="animate-pulse-glow size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
