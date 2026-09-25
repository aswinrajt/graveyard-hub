import { createFileRoute } from "@tanstack/react-router";
import { Skull, Flame, Trophy, Archive } from "lucide-react";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { StatCard } from "@/components/graveyard/StatCard";
import { StatusBadge } from "@/components/graveyard/StatusBadge";
import { ProfileSkeleton } from "@/components/graveyard/GraveyardSkeletons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/lib/queries";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({
    meta: [
      { title: "Developer Profile — Project Graveyard" },
      { name: "description", content: "Your gravekeeper profile: buried projects, revivals and completion rate." },
      { property: "og:title", content: "Developer Profile — Project Graveyard" },
      { property: "og:description", content: "A developer's history told through abandoned repositories." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div>
        <PageHeader eyebrow="// gravekeeper_record" title="DEVELOPER PROFILE" />
        <ProfileSkeleton />
      </div>
    );
  }

  const profile = data?.profile;
  const stats = data?.stats;
  const timeline = data?.timeline ?? [];
  const initials = (profile?.name ?? "G")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div>
      <PageHeader eyebrow="// gravekeeper_record" title="DEVELOPER PROFILE" />

      <section className="animate-rise relative overflow-hidden rounded-md border border-primary/25 bg-card/60 p-6 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 crypt-bg opacity-60" />
        <div className="relative grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <Avatar className="size-20 border border-primary/50 shadow-[0_0_32px_-8px_var(--primary)]">
            <AvatarFallback className="bg-primary/10 font-display text-2xl text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold tracking-wide text-glow">{profile?.name ?? "Gravekeeper"}</h2>
            <p className="font-mono text-xs text-primary/80">{profile?.handle}</p>
            <p className="mt-3 max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">
              {profile?.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(profile?.favorites ?? []).map((f) => (
                <span
                  key={f}
                  className="rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[0.6rem] text-primary"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={stats?.total ?? 0} icon={Archive} />
        <StatCard label="Buried" value={stats?.buried ?? 0} icon={Skull} tone="muted" />
        <StatCard label="Revived" value={stats?.revived ?? 0} icon={Flame} tone="ember" />
        <StatCard label="Completion Rate" value={`${stats?.completionRate ?? 0}%`} icon={Trophy} tone="toxic" />
      </div>

      <section className="mt-6 rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
        <h2 className="font-display text-sm font-bold tracking-[0.18em]">PROJECT TIMELINE</h2>
        <p className="terminal-label mt-1">chronological record of every repository</p>
        <ol className="mt-5 space-y-5 border-l border-border/70 pl-5">
          {timeline.map((p) => (
            <li key={p.id} className="relative">
              <span className="absolute -left-[1.6rem] top-1.5 size-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{p.name}</p>
                  <p className="font-mono text-[0.65rem] text-muted-foreground">
                    {p.started} → {p.lastActivity} · {p.commits} commits
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
