import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Flame, Github, ImageIcon, Pencil, Shovel, Skull } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/graveyard/StatusBadge";
import { BuryProjectDialog } from "@/components/graveyard/BuryProjectDialog";
import { GraveSpinner, ProjectDetailSkeleton } from "@/components/graveyard/GraveyardSkeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api, ApiError } from "@/lib/api";
import {
  useArtifacts,
  useBuryProject,
  useProject,
  useReviveProject,
  useUploadArtifact,
} from "@/lib/queries";
import type { Project } from "@/data/projects";

export const Route = createFileRoute("/_shell/project/$projectId")({
  loader: async ({ params }) => {
    try {
      const { project } = await api<{ project: Project }>(`/api/projects/${params.projectId}`);
      return { project };
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Grave not found — Project Graveyard" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.name} — Project Graveyard` },
        { name: "description", content: project.description.slice(0, 155) },
        { property: "og:title", content: `${project.name} — Project Graveyard` },
        { property: "og:description", content: project.epitaph },
      ],
    };
  },
  component: ProjectDetail,
  pendingComponent: ProjectDetailSkeleton,
  notFoundComponent: GraveNotFound,
});

function GraveNotFound() {
  return (
    <div className="py-24 text-center">
      <Skull className="animate-flicker mx-auto size-10 text-primary" />
      <h1 className="mt-4 font-display text-2xl tracking-wide">This grave is empty</h1>
      <p className="mt-2 font-mono text-xs text-muted-foreground">No remains found at this coordinate.</p>
      <Button asChild variant="outline" className="mt-6 font-mono text-xs">
        <Link to="/graveyard">RETURN TO THE GRAVEYARD</Link>
      </Button>
    </div>
  );
}

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const initial = Route.useLoaderData();
  const query = useProject(projectId);
  const project = query.data ?? initial.project;
  const revive = useReviveProject();
  const bury = useBuryProject();
  const artifacts = useArtifacts(projectId);
  const upload = useUploadArtifact(projectId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const slots = artifacts.data ?? [];

  return (
    <div className="animate-rise">
      <Link
        to="/graveyard"
        className="inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" /> BACK TO PLOTS
      </Link>

      <header className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="min-w-0">
          <StatusBadge status={project.status} />
          <h1 className="mt-3 font-display text-3xl font-bold tracking-[0.06em] text-glow sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          {project.repo ? (
            <a
              href={project.repo.startsWith("http") ? project.repo : `https://${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-mono text-[0.68rem] text-primary hover:underline"
            >
              <Github className="size-3.5" /> {project.repo}
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="border border-toxic/40 bg-toxic/10 font-mono text-xs tracking-widest text-toxic hover:bg-toxic/20"
            disabled={revive.isPending}
            onClick={async () => {
              try {
                await revive.mutateAsync(project.id);
                toast.success(`${project.name} is stirring…`, { description: "Revival ritual initiated." });
              } catch (err) {
                toast.error(err instanceof ApiError ? err.message : "Revive failed");
              }
            }}
          >
            {revive.isPending ? (
              <GraveSpinner size="sm" text="REVIVING..." />
            ) : (
              <>
                <Flame className="size-4" /> REVIVE PROJECT
              </>
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="font-mono text-xs tracking-widest" disabled={bury.isPending}>
                {bury.isPending ? (
                  <GraveSpinner size="sm" text="SEALING..." />
                ) : (
                  <>
                    <Shovel className="size-4" /> BURY PROJECT
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-primary/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display tracking-wide">
                  Bury {project.name}?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-mono text-xs">
                  The repository will be sealed and moved to the buried sector. This is a ceremonial
                  action and can be reversed by a revival.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-mono text-xs">CANCEL</AlertDialogCancel>
                <AlertDialogAction
                  className="font-mono text-xs"
                  onClick={async () => {
                    try {
                      await bury.mutateAsync(project.id);
                      toast(`${project.name} has been buried.`, { description: "Rest well." });
                    } catch (err) {
                      toast.error(err instanceof ApiError ? err.message : "Burial failed");
                    }
                  }}
                >
                  {bury.isPending ? <GraveSpinner size="sm" text="SEALING..." /> : "CONFIRM BURIAL"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="ghost"
            className="font-mono text-xs tracking-widest"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" /> EDIT
          </Button>
          <BuryProjectDialog project={project} open={editOpen} onOpenChange={setEditOpen} trigger={null} />
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Meta label="Started" value={project.started} />
        <Meta label="Last Activity" value={project.lastActivity} />
        <Meta label="Commits" value={String(project.commits)} />
        <Meta label="Technologies" value={project.tech.join(" · ")} />
      </section>

      <section className="mt-6 rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between font-mono text-[0.68rem]">
          <span className="terminal-label">progress at time of death</span>
          <span className="text-primary">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="mt-3 h-2" />
      </section>

      <section className="scanlines relative mt-6 overflow-hidden rounded-md border border-destructive/40 bg-destructive/5 p-6">
        <div className="relative z-10">
          <p className="terminal-label text-destructive">// autopsy_report</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-[0.14em] text-destructive">
            CAUSE OF DEATH
          </h2>
          <p className="mt-4 font-display text-3xl font-bold tracking-wide text-foreground">
            {project.cause === "—" ? "STILL ALIVE" : project.cause}
          </p>
          <p className="mt-3 max-w-2xl font-mono text-xs italic text-muted-foreground">
            &ldquo;{project.epitaph}&rdquo;
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <section className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm xl:col-span-2">
          <h2 className="font-display text-sm font-bold tracking-[0.18em]">ACTIVITY TIMELINE</h2>
          <ol className="mt-5 space-y-5 border-l border-border/70 pl-5">
            {project.timeline.map((t) => (
              <li key={`${t.date}-${t.label}`} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 size-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                <p className="font-mono text-[0.65rem] tracking-widest text-primary">{t.date}</p>
                <p className="mt-0.5 font-display text-sm font-semibold">{t.label}</p>
                <p className="font-mono text-[0.68rem] text-muted-foreground">{t.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="space-y-5">
          <section className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
            <h2 className="font-display text-sm font-bold tracking-[0.18em]">ARTIFACTS</h2>
            <p className="terminal-label mt-1">screenshots & files</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                void upload.mutateAsync(file).then(
                  () => toast.success("Artifact sealed in the vault"),
                  (err) => toast.error(err instanceof ApiError ? err.message : "Upload failed"),
                );
                e.target.value = "";
              }}
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              {artifacts.isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-sm" />
                ))
              ) : upload.isPending ? (
                <>
                  <div className="grid aspect-video place-items-center rounded-sm border border-primary/40 bg-primary/10">
                    <GraveSpinner size="sm" text="ENTOMBING..." />
                  </div>
                  {slots.slice(0, 3).map((art, i) => (
                    <div key={art.id ?? i} className="aspect-video overflow-hidden rounded-sm border border-border">
                      <img src={art.publicUrl} alt="" className="size-full object-cover" />
                    </div>
                  ))}
                </>
              ) : (
                Array.from({ length: 4 }).map((_, i) => {
                  const art = slots[i];
                  return (
                    <button
                      key={art?.id ?? i}
                      type="button"
                      className="grid aspect-video place-items-center overflow-hidden rounded-sm border border-dashed border-border bg-muted/20 text-muted-foreground/60 transition-colors hover:border-primary/50 hover:bg-muted/30"
                      onClick={() => fileRef.current?.click()}
                    >
                      {art ? (
                        <img src={art.publicUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <ImageIcon className="size-5" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
            <h2 className="font-display text-sm font-bold tracking-[0.18em]">NOTES</h2>
            <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
              {project.notes}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-card/50 p-4 backdrop-blur-sm">
      <p className="terminal-label">{label}</p>
      <p className="mt-1.5 truncate font-mono text-xs text-foreground">{value}</p>
    </div>
  );
}
