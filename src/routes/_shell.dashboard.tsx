import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skull, Activity, Flame, Ghost, Archive, HeartPulse } from "lucide-react";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { StatCard } from "@/components/graveyard/StatCard";
import { StatusBadge } from "@/components/graveyard/StatusBadge";
import { TombstoneCard } from "@/components/graveyard/TombstoneCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDashboard, useForgotten } from "@/lib/queries";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center — Project Graveyard" },
      {
        name: "description",
        content:
          "A futuristic command center for your archived, abandoned and revivable developer projects.",
      },
      { property: "og:title", content: "Command Center — Project Graveyard" },
      {
        property: "og:description",
        content: "Track buried projects, causes of death and revival candidates.",
      },
    ],
  }),
  component: DashboardPage,
});

const statusColor: Record<string, string> = {
  active: "var(--toxic)",
  revivable: "var(--ember)",
  abandoned: "var(--primary)",
  buried: "var(--muted-foreground)",
};

function DashboardPage() {
  const { data } = useDashboard();
  const forgotten = useForgotten();
  const total = data?.totals.total ?? 0;
  const active = data?.totals.active ?? 0;
  const abandoned = data?.totals.abandoned ?? 0;
  const revivable = data?.totals.revivable ?? 0;
  const buried = data?.totals.buried ?? 0;
  const topCause = data?.topCause ?? { cause: "Unknown", count: 0 };
  const featured = forgotten.data?.project;
  const recent = data?.recentlyBuried ?? [];
  const activityData = data?.activity ?? [];
  const statusBreakdown = data?.statusDistribution ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="// command_center"
        title="THE COMMAND CENTER"
        description="Vital signs from every repository you ever loved, neglected, or entombed."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Total Projects" value={total} icon={Archive} tone="primary" hint="all records" />
        <StatCard label="Active" value={active} icon={HeartPulse} tone="toxic" hint="still breathing" />
        <StatCard label="Abandoned" value={abandoned} icon={Ghost} tone="primary" hint="no recent pulse" />
        <StatCard label="Revivable" value={revivable} icon={Flame} tone="ember" hint="resurrection possible" />
        <StatCard label="Buried" value={buried} icon={Skull} tone="muted" hint="six feet under" />
        <StatCard
          label="Top Cause of Death"
          value={topCause.count}
          icon={Activity}
          tone="primary"
          hint={topCause.cause}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <Panel title="PROJECT ACTIVITY" subtitle="commits vs. burials, last 12 months" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={activityData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBurials" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--toxic)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--toxic)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#gCommits)"
              />
              <Area
                type="monotone"
                dataKey="burials"
                stroke="var(--toxic)"
                strokeWidth={2}
                fill="url(#gBurials)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="STATUS DISTRIBUTION" subtitle="where the bodies are">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusBreakdown} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} cursor={{ fill: "var(--muted)", opacity: 0.25 }} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {statusBreakdown.map((s) => (
                  <Cell key={s.status} fill={statusColor[s.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <Panel title="FORGOTTEN PROJECT OF THE DAY" subtitle="randomly exhumed" className="xl:col-span-1">
          {featured ? (
          <div className="rounded-md border border-primary/30 bg-primary/5 p-5">
            <StatusBadge status={featured.status} />
            <h3 className="mt-3 font-display text-xl font-bold text-glow">{featured.name}</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
              {featured.description}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between font-mono text-[0.65rem] text-muted-foreground">
                <span>PROGRESS AT DEATH</span>
                <span className="text-primary">{featured.progress}%</span>
              </div>
              <Progress value={featured.progress} className="mt-2 h-1.5" />
            </div>
            <Button asChild className="mt-5 w-full font-mono text-xs tracking-widest">
              <Link to="/project/$projectId" params={{ projectId: featured.id }}>
                OPEN THE CASKET
              </Link>
            </Button>
          </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">No forgotten graves today.</p>
          )}
        </Panel>

        <Panel title="RECENTLY BURIED" subtitle="latest interments" className="xl:col-span-2">
          <ul className="divide-y divide-border/60">
            {recent.slice(0, 6).map((p) => (
              <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    to="/project/$projectId"
                    params={{ projectId: p.id }}
                    className="block truncate font-display text-sm font-semibold transition-colors hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <p className="truncate font-mono text-[0.65rem] text-muted-foreground">
                    {p.cause} · last pulse {p.lastActivity}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <p className="terminal-label text-primary/80">// sector_01</p>
            <h2 className="font-display text-2xl font-bold tracking-[0.14em] text-glow">THE GRAVEYARD</h2>
          </div>
          <Button asChild variant="outline" className="font-mono text-xs">
            <Link to="/graveyard">VIEW ALL PLOTS</Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {recent.slice(0, 8).map((p, i) => (
            <TombstoneCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm ${className ?? ""}`}
    >
      <div className="mb-4">
        <h2 className="font-display text-sm font-bold tracking-[0.18em]">{title}</h2>
        {subtitle ? <p className="terminal-label mt-1">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-primary/40 bg-popover/95 px-3 py-2 font-mono text-[0.65rem] shadow-[0_0_24px_-8px_var(--primary)]">
      <p className="mb-1 tracking-widest text-muted-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color ?? p.fill }}>
          {String(p.dataKey).toUpperCase()}: {p.value}
        </p>
      ))}
    </div>
  );
}
