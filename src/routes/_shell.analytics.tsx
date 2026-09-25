import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Flame, Skull, Trophy } from "lucide-react";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { StatCard } from "@/components/graveyard/StatCard";
import { AnalyticsSkeleton } from "@/components/graveyard/GraveyardSkeletons";
import { Progress } from "@/components/ui/progress";
import { useAnalytics } from "@/lib/queries";

export const Route = createFileRoute("/_shell/analytics")({
  head: () => ({
    meta: [
      { title: "Mortality Analytics — Project Graveyard" },
      {
        name: "description",
        content: "Glowing charts on project lifespan, revival rate, causes of death and abandonment patterns.",
      },
      { property: "og:title", content: "Mortality Analytics — Project Graveyard" },
      { property: "og:description", content: "Understand why your projects die and which ones can return." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div>
        <PageHeader
          eyebrow="// mortality_report"
          title="MORTALITY ANALYTICS"
          description="Post-mortem statistics compiled from every repository in the crypt."
        />
        <AnalyticsSkeleton />
      </div>
    );
  }

  const causes = data?.causes ?? [];
  const max = Math.max(...causes.map((c) => c.count), 1);
  const createdVsAbandoned = data?.createdVsAbandoned ?? [];
  const techUsage = data?.techUsage ?? [];
  const patterns = data?.patterns ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="// mortality_report"
        title="MORTALITY ANALYTICS"
        description="Post-mortem statistics compiled from every repository in the crypt."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Lifespan" value={`${data?.avgLifespanMonths ?? 0} mo`} icon={Clock} tone="primary" hint="birth → last commit" />
        <StatCard label="Revival Rate" value={`${data?.revivalRate ?? 0}%`} icon={Flame} tone="ember" hint={`${data?.revived ?? 0} of ${data?.total ?? 0} exhumed`} />
        <StatCard label="Completion Rate" value={`${data?.completionRate ?? 0}%`} icon={Trophy} tone="toxic" hint="shipped to production" />
        <StatCard label="Mortality Rate" value={`${data?.mortalityRate ?? 0}%`} icon={Skull} tone="muted" hint="never reached v1" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Panel title="CREATED VS. ABANDONED" subtitle="by year">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={createdVsAbandoned} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line
                type="monotone"
                dataKey="created"
                stroke="var(--toxic)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--toxic)" }}
              />
              <Line
                type="monotone"
                dataKey="abandoned"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="TECHNOLOGY EXPOSURE" subtitle="stacks buried most often">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={techUsage} outerRadius="72%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="tech" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <Radar
                dataKey="count"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.35}
                strokeWidth={2}
              />
              <Tooltip content={<ChartTip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="CAUSES OF DEATH" subtitle="ranked autopsy results">
          <ul className="space-y-3">
            {causes.map((c) => (
              <li key={c.cause}>
                <div className="flex items-center justify-between font-mono text-[0.68rem]">
                  <span className="text-foreground/90">{c.cause}</span>
                  <span className="text-primary">{c.count}</span>
                </div>
                <Progress value={(c.count / max) * 100} className="mt-1.5 h-1.5" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="ABANDONMENT PATTERNS" subtitle="when projects tend to die">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={patterns} layout="vertical" margin={{ top: 6, right: 12, left: 40, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={9}
                width={120}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTip />} cursor={{ fill: "var(--muted)", opacity: 0.25 }} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {patterns.map((p, i) => (
                  <Cell key={p.label} fill={i === 1 ? "var(--destructive)" : "var(--primary)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
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
        <p key={p.dataKey} style={{ color: p.color ?? p.stroke ?? p.fill }}>
          {String(p.dataKey).toUpperCase()}: {p.value}
        </p>
      ))}
    </div>
  );
}
