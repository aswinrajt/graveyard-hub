import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BuryProjectDialog } from "./BuryProjectDialog";
import { useNotifications, useSearch } from "@/lib/queries";

export function TopBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const search = useSearch(q);
  const notifications = useNotifications();

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-6">
      <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-primary" />

      <div className="relative min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void navigate({ to: "/graveyard", search: { q } as { q: string } });
            }
          }}
          placeholder="Search the graveyard..."
          className="h-9 w-full border-border/70 bg-muted/30 pl-9 font-mono text-xs placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-primary/30"
        />
        {q.length > 1 && search.data && search.data.length > 0 && (
          <ul className="absolute z-40 mt-1 w-full rounded-md border border-border/70 bg-popover/95 py-1 shadow-lg">
            {search.data.slice(0, 6).map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="block w-full truncate px-3 py-1.5 text-left font-mono text-[0.68rem] hover:bg-muted/60"
                  onClick={() => {
                    setQ("");
                    void navigate({ to: "/project/$projectId", params: { projectId: p.id } });
                  }}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden text-muted-foreground sm:inline-flex">
              <Bell className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 border-border/70 p-0">
            <p className="terminal-label border-b border-border/60 px-3 py-2">notifications</p>
            <ul className="max-h-72 overflow-y-auto">
              {(notifications.data ?? []).length === 0 ? (
                <li className="px-3 py-4 font-mono text-[0.68rem] text-muted-foreground">The crypt is quiet.</li>
              ) : (
                (notifications.data ?? []).map((n) => (
                  <li key={n.id} className="border-b border-border/50 px-3 py-2 last:border-0">
                    <p className="font-mono text-[0.7rem]">{n.title}</p>
                    <p className="font-mono text-[0.62rem] text-muted-foreground">{n.body}</p>
                  </li>
                ))
              )}
            </ul>
          </PopoverContent>
        </Popover>
        <BuryProjectDialog />
      </div>
    </header>
  );
}
