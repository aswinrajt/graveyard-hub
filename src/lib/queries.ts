import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "./api";
import type { Project, ProjectStatus } from "@/data/projects";

export const keys = {
  me: ["me"] as const,
  projects: (params?: Record<string, string>) => ["projects", params] as const,
  project: (id: string) => ["project", id] as const,
  forgotten: ["forgotten"] as const,
  artifacts: (id: string) => ["artifacts", id] as const,
  dashboard: ["dashboard"] as const,
  analytics: ["analytics"] as const,
  collections: ["collections"] as const,
  profile: ["profile"] as const,
  settings: ["settings"] as const,
  search: (q: string) => ["search", q] as const,
  notifications: ["notifications"] as const,
};

export interface MeResponse {
  user: { id: string; email: string | null };
  profile: {
    id: string;
    name: string;
    handle: string;
    bio: string;
    avatarUrl: string | null;
    favorites: string[];
    revivedCount: number;
    location: string | null;
    joined: string | null;
  } | null;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  techs: string[];
  causes: string[];
}

export interface DashboardResponse {
  totals: { total: number; active: number; abandoned: number; revivable: number; buried: number };
  topCause: { cause: string; count: number };
  activity: { month: string; commits: number; burials: number }[];
  statusDistribution: { status: ProjectStatus; label: string; count: number }[];
  recentlyBuried: Project[];
}

export interface AnalyticsResponse {
  avgLifespanMonths: number;
  revivalRate: number;
  completionRate: number;
  mortalityRate: number;
  revived: number;
  total: number;
  createdVsAbandoned: { year: string; created: number; abandoned: number }[];
  techUsage: { tech: string; count: number }[];
  causes: { cause: string; count: number }[];
  patterns: { label: string; value: number }[];
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  projects: Project[];
}

export interface ProfileResponse {
  profile: MeResponse["profile"];
  stats: { total: number; buried: number; revived: number; completionRate: number };
  timeline: Project[];
}

export interface SettingsPayload {
  autoBury: boolean;
  hauntingReminders: boolean;
  ambientFog: boolean;
  terminalSfx: boolean;
}

export interface Artifact {
  id: string;
  projectId: string;
  publicUrl: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export function useMe(enabled = true) {
  return useQuery({
    queryKey: keys.me,
    queryFn: () => api<MeResponse>("/api/auth/me"),
    retry: false,
    enabled,
  });
}

export function useProjects(params: Record<string, string> = {}, enabled = true) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString();
  return useQuery({
    queryKey: keys.projects(params),
    queryFn: () => api<ProjectsResponse>(`/api/projects${qs ? `?${qs}` : ""}`),
    enabled,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: keys.project(id),
    queryFn: () => api<{ project: Project }>(`/api/projects/${id}`).then((r) => r.project),
    enabled: Boolean(id),
  });
}

export function useForgotten() {
  return useQuery({
    queryKey: keys.forgotten,
    queryFn: () => api<{ project: Project | null }>("/api/projects/forgotten"),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: keys.dashboard,
    queryFn: () => api<DashboardResponse>("/api/dashboard"),
  });
}

export function useAnalytics(enabled = true) {
  return useQuery({
    queryKey: keys.analytics,
    queryFn: () => api<AnalyticsResponse>("/api/analytics"),
    enabled,
    retry: false,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: keys.collections,
    queryFn: () => api<{ collections: CollectionItem[] }>("/api/collections").then((r) => r.collections),
  });
}

export function useProfile() {
  return useQuery({
    queryKey: keys.profile,
    queryFn: () => api<ProfileResponse>("/api/profile"),
  });
}

export function useSettings() {
  return useQuery({
    queryKey: keys.settings,
    queryFn: () => api<{ settings: SettingsPayload }>("/api/settings").then((r) => r.settings),
  });
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: keys.search(q),
    queryFn: () => api<{ projects: Project[] }>(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.projects),
    enabled: q.length > 1,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: keys.notifications,
    queryFn: () =>
      api<{ notifications: NotificationItem[] }>("/api/notifications").then((r) => r.notifications),
  });
}

export function useArtifacts(projectId: string) {
  return useQuery({
    queryKey: keys.artifacts(projectId),
    queryFn: () =>
      api<{ artifacts: Artifact[] }>(`/api/projects/${projectId}/artifacts`).then((r) => r.artifacts),
    enabled: Boolean(projectId),
  });
}

function invalidateGraveyard(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ["projects"] });
  void qc.invalidateQueries({ queryKey: ["project"] });
  void qc.invalidateQueries({ queryKey: ["dashboard"] });
  void qc.invalidateQueries({ queryKey: ["analytics"] });
  void qc.invalidateQueries({ queryKey: ["forgotten"] });
  void qc.invalidateQueries({ queryKey: ["profile"] });
  void qc.invalidateQueries({ queryKey: ["notifications"] });
  void qc.invalidateQueries({ queryKey: ["collections"] });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.me });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string; name: string }) =>
      api<{ needsConfirmation?: boolean; user?: { id: string; email: string | null } }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.me });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.clear();
    },
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api<{ project: Project }>("/api/projects", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => invalidateGraveyard(qc),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      api<{ project: Project }>(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => invalidateGraveyard(qc),
  });
}

export function useReviveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/projects/${id}/revive`, { method: "POST" }),
    onSuccess: () => invalidateGraveyard(qc),
  });
}

export function useBuryProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/api/projects/${id}/bury`, { method: "POST" }),
    onSuccess: () => invalidateGraveyard(qc),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api("/api/profile", { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.profile });
      void qc.invalidateQueries({ queryKey: keys.me });
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SettingsPayload) =>
      api("/api/settings", { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.settings });
    },
  });
}

export function useUploadArtifact(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api(`/api/projects/${projectId}/artifacts`, { method: "POST", body: form });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.artifacts(projectId) });
    },
  });
}
