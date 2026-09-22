import { useState } from "react";
import { Search, Ghost, SlidersHorizontal } from "lucide-react";
import { useSearch } from "@tanstack/react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TombstoneCard } from "./TombstoneCard";
import { CAUSES, type ProjectStatus } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useProjects } from "@/lib/queries";

const tabs: { key: "all" | ProjectStatus; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "active", label: "ACTIVE" },
  { key: "abandoned", label: "ABANDONED" },
  { key: "buried", label: "BURIED" },
  { key: "revivable", label: "REVIVABLE" },
];

export function ProjectArchive({ lockStatus }: { lockStatus?: ProjectStatus }) {
  const urlSearch = useSearch({ strict: false }) as { q?: string };
  const [status, setStatus] = useState<"all" | ProjectStatus>(lockStatus ?? "all");
  const [query, setQuery] = useState(urlSearch.q ?? "");
  const [tech, setTech] = useState("any");
  const [cause, setCause] = useState("any");
  const [sort, setSort] = useState("recent");

  const { data, isPending } = useProjects({
    status: lockStatus ?? status,
    q: query,
    tech,
    cause,
    sort,
  });

  const results = data?.projects ?? [];
  const techs = data?.techs ?? [];
  const causes = data?.causes?.length ? data.causes : CAUSES;

  return (
    <section>
      <div className="mb-5 rounded-md border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the graveyard..."
              className="h-10 bg-muted/30 pl-9 font-mono text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={tech} onValueChange={setTech}>
              <SelectTrigger className="h-10 w-[9.5rem] font-mono text-xs">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any" className="font-mono text-xs">
                  ANY TECH
                </SelectItem>
                {techs.map((t) => (
                  <SelectItem key={t} value={t} className="font-mono text-xs">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cause} onValueChange={setCause}>
              <SelectTrigger className="h-10 w-[11rem] font-mono text-xs">
                <SelectValue placeholder="Cause" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any" className="font-mono text-xs">
                  ANY CAUSE
                </SelectItem>
                {causes.map((c) => (
                  <SelectItem key={c} value={c} className="font-mono text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-[10rem] font-mono text-xs">
                <SlidersHorizontal className="size-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent" className="font-mono text-xs">
                  NEWEST PULSE
                </SelectItem>
                <SelectItem value="oldest" className="font-mono text-xs">
                  OLDEST GRAVE
                </SelectItem>
                <SelectItem value="name" className="font-mono text-xs">
                  NAME A–Z
                </SelectItem>
                <SelectItem value="progress" className="font-mono text-xs">
                  PROGRESS
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!lockStatus && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatus(t.key)}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] transition-all",
                  status === t.key
                    ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_18px_-8px_var(--primary)]"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="terminal-label mb-4">
        {isPending ? "exhuming records…" : `${results.length} remains found`}
      </p>

      {isPending ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[22rem] tomb bg-card/60" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border/80 bg-card/30 py-20 text-center">
          <Ghost className="animate-flicker size-10 text-primary/70" />
          <h3 className="mt-4 font-display text-lg tracking-wide">This plot is empty</h3>
          <p className="mt-1 max-w-sm font-mono text-xs text-muted-foreground">
            No remains match your query. The dead are keeping their secrets.
          </p>
          <Button
            variant="outline"
            className="mt-5 font-mono text-xs"
            onClick={() => {
              setQuery("");
              setTech("any");
              setCause("any");
              if (!lockStatus) setStatus("all");
            }}
          >
            CLEAR FILTERS
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {results.map((p, i) => (
            <TombstoneCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
