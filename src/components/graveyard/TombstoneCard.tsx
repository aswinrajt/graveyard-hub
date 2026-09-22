import { Link } from "@tanstack/react-router";
import { Flame, Search, Calendar, Activity, Skull } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api";
import { useReviveProject } from "@/lib/queries";

export function TombstoneCard({ project, index = 0 }: { project: Project; index?: number }) {
  const revive = useReviveProject();

  return (
    <article
      className="animate-rise group relative flex flex-col overflow-hidden border border-border/80 bg-card/60 tomb px-5 pb-5 pt-9 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:bg-card/85 hover:shadow-[0_18px_60px_-24px_var(--primary)]"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(60%_60%_at_50%_100%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-10 bg-[radial-gradient(50%_100%_at_50%_100%,color-mix(in_oklab,var(--toxic)_18%,transparent),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center justify-center">
        <Skull className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
      </div>

      <h3 className="mt-3 text-center font-display text-lg font-bold tracking-wide text-foreground transition-all group-hover:text-glow">
        {project.name}
      </h3>
      <p className="mt-1 text-center font-mono text-[0.65rem] text-muted-foreground">
        {project.started.slice(0, 4)} — {project.lastActivity.slice(0, 4)}
      </p>

      <div className="mt-3 flex justify-center">
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {project.tech.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-sm border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-border/70 pt-4 font-mono text-[0.68rem]">
        <Row icon={Calendar} label="STARTED" value={project.started} />
        <Row icon={Activity} label="LAST PULSE" value={project.lastActivity} />
        <Row
          icon={Skull}
          label="CAUSE"
          value={project.cause}
          valueClass={project.cause === "—" ? "text-toxic" : "text-primary"}
        />
      </dl>

      <p className="mt-3 text-center font-mono text-[0.68rem] italic text-muted-foreground/80">
        &ldquo;{project.epitaph}&rdquo;
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-toxic/40 font-mono text-[0.65rem] tracking-widest text-toxic hover:bg-toxic/10 hover:text-toxic"
          disabled={revive.isPending || project.status === "active"}
          onClick={async () => {
            try {
              await revive.mutateAsync(project.id);
              toast.success(`Resurrection ritual queued for ${project.name}`);
            } catch (err) {
              toast.error(err instanceof ApiError ? err.message : "Revive failed");
            }
          }}
        >
          <Flame className="size-3.5" /> REVIVE
        </Button>
        <Button asChild size="sm" variant="secondary" className="font-mono text-[0.65rem] tracking-widest">
          <Link to="/project/$projectId" params={{ projectId: project.id }}>
            <Search className="size-3.5" /> INSPECT
          </Link>
        </Button>
      </div>
    </article>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd className={cn("truncate text-foreground/90", valueClass)}>{value}</dd>
    </div>
  );
}
