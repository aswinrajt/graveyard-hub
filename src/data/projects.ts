export type ProjectStatus = "active" | "abandoned" | "buried" | "revivable";

export type CauseOfDeath =
  | "Lost Interest"
  | "Too Ambitious"
  | "Technical Debt"
  | "Lack of Time"
  | "Better Idea"
  | "API Problems"
  | "Scope Explosion"
  | "Abandoned Framework"
  | "—";

export interface TimelineEvent {
  date: string;
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;
  tech: string[];
  started: string;
  lastActivity: string;
  status: ProjectStatus;
  progress: number;
  cause: CauseOfDeath;
  epitaph: string;
  notes: string;
  commits: number;
  timeline: TimelineEvent[];
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "ALIVE",
  abandoned: "ABANDONED",
  buried: "BURIED",
  revivable: "REVIVABLE",
};

export const CAUSES: CauseOfDeath[] = [
  "Lost Interest",
  "Too Ambitious",
  "Technical Debt",
  "Lack of Time",
  "Better Idea",
  "API Problems",
  "Scope Explosion",
  "Abandoned Framework",
];
