import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, Flame, History, Search, Skull, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Atmosphere } from "@/components/graveyard/Atmosphere";
import { TombstoneCard } from "@/components/graveyard/TombstoneCard";
import { TombstoneSkeleton } from "@/components/graveyard/GraveyardSkeletons";
import { useAnalytics, useMe, useProjects } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Graveyard — Where Unfinished Projects Rest" },
      {
        name: "description",
        content:
          "Archive abandoned projects, understand why they died, and revive forgotten ideas. A futuristic cemetery for developer repositories.",
      },
      { property: "og:title", content: "Project Graveyard — Where Unfinished Projects Rest" },
      {
        property: "og:description",
        content: "A cyberpunk cemetery for the repositories you never finished.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Archive,
    title: "ARCHIVE THE DEAD",
    body: "Give every abandoned repository a permanent plot, an epitaph and a record of everything it almost became.",
  },
  {
    icon: Skull,
    title: "AUTOPSY THE FAILURE",
    body: "Tag a cause of death — scope explosion, technical debt, lost interest — and watch the patterns emerge.",
  },
  {
    icon: Flame,
    title: "REVIVE THE WORTHY",
    body: "Mark graves with an ember beacon. Resurrect the projects that only needed one more weekend.",
  },
  {
    icon: History,
    title: "TRACK YOUR HISTORY",
    body: "Lifespan, revival rate, completion rate. A brutally honest timeline of everything you have built.",
  },
];

function Landing() {
  const me = useMe();
  const signedIn = Boolean(me.data);
  const projectsQuery = useProjects({ status: "all", limit: "8" }, signedIn);
  const analytics = useAnalytics(signedIn);
  const showcase = (projectsQuery.data?.projects ?? []).filter((p) => p.status !== "active").slice(0, 4);
  const enterTo = signedIn ? "/dashboard" : "/login";

  const stats = [
    { k: "BURIED", v: analytics.data ? String(Math.round((analytics.data.mortalityRate / 100) * analytics.data.total)) : "—" },
    { k: "REVIVED", v: analytics.data ? String(analytics.data.revived).padStart(2, "0") : "—" },
    { k: "AVG. LIFESPAN", v: analytics.data ? `${analytics.data.avgLifespanMonths}mo` : "—" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere dense />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm border border-primary/50 bg-primary/10 text-primary">
            <Skull className="size-4" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.22em]">PROJECT GRAVEYARD</span>
        </div>
        <Button asChild variant="ghost" size="sm" className="font-mono text-xs tracking-widest">
          <Link to={enterTo}>ENTER</Link>
        </Button>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-16 text-center sm:pt-24">
        <p className="terminal-label animate-flicker text-primary">
          // where unfinished projects come to rest
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,9vw,6rem)] font-bold leading-[0.95] tracking-[0.04em] text-glow">
          PROJECT
          <br />
          GRAVEYARD
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-mono text-sm text-muted-foreground">
          Where unfinished projects come to rest.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="font-mono text-xs tracking-[0.2em] shadow-[0_0_40px_-12px_var(--primary)]"
          >
            <Link to={enterTo}>
              ENTER THE GRAVEYARD <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-mono text-xs tracking-[0.2em]">
            <Link to={signedIn ? "/graveyard" : "/register"}>
              <Search className="size-4" /> {signedIn ? "VIEW DEMO" : "CLAIM A PLOT"}
            </Link>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4 border-y border-border/60 py-6 font-mono">
          {stats.map((s) => (
            <div key={s.k}>
              <p className="font-display text-2xl font-bold text-primary">{s.v}</p>
              <p className="terminal-label mt-1">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="animate-rise group rounded-md border border-border/70 bg-card/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_-18px_var(--primary)]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <f.icon className="size-5 text-primary" />
              <h2 className="mt-4 font-display text-sm font-bold tracking-[0.16em]">{f.title}</h2>
              <p className="mt-2 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {(showcase.length > 0 || projectsQuery.isLoading) && (
        <section className="relative z-10 mx-auto max-w-7xl px-5 pb-28">
          <div className="mb-6 text-center">
            <p className="terminal-label text-primary/80">// preview_sector</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-[0.14em]">RECENT INTERMENTS</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {projectsQuery.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TombstoneSkeleton key={i} index={i} />
                ))
              : showcase.map((p, i) => (
                  <TombstoneCard key={p.id} project={p} index={i} />
                ))}
          </div>
        </section>
      )}

      <footer className="relative z-10 border-t border-border/60 px-5 py-8 text-center">
        <p className="terminal-label">project_graveyard // no repository is ever truly deleted</p>
      </footer>
    </div>
  );
}
