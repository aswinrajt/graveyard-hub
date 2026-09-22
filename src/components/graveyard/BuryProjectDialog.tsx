import { useEffect, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAUSES, STATUS_LABEL, type Project, type ProjectStatus } from "@/data/projects";
import { ApiError } from "@/lib/api";
import { useCreateProject, useUpdateProject } from "@/lib/queries";

const statuses = Object.keys(STATUS_LABEL) as ProjectStatus[];

export function BuryProjectDialog({
  trigger,
  project,
  open: openProp,
  onOpenChange,
}: {
  trigger?: ReactNode;
  project?: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isEdit = Boolean(project);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repo, setRepo] = useState("");
  const [tech, setTech] = useState("");
  const [started, setStarted] = useState("");
  const [lastActivity, setLastActivity] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("abandoned");
  const [cause, setCause] = useState("Lost Interest");
  const [progress, setProgress] = useState([40]);
  const [revivable, setRevivable] = useState(true);
  const [notes, setNotes] = useState("");
  const [epitaph, setEpitaph] = useState("");

  const create = useCreateProject();
  const update = useUpdateProject();

  useEffect(() => {
    if (!open) return;
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setRepo(project.repo);
      setTech(project.tech.join(", "));
      setStarted(project.started.slice(0, 10));
      setLastActivity(project.lastActivity.slice(0, 10));
      setStatus(project.status);
      setCause(project.cause === "—" ? "Lost Interest" : project.cause);
      setProgress([project.progress]);
      setRevivable(project.status === "revivable");
      setNotes(project.notes);
      setEpitaph(project.epitaph);
    } else {
      setName("");
      setDescription("");
      setRepo("");
      setTech("");
      setStarted("");
      setLastActivity("");
      setStatus("abandoned");
      setCause("Lost Interest");
      setProgress([40]);
      setRevivable(true);
      setNotes("");
      setEpitaph("");
    }
  }, [open, project]);

  async function submit() {
    const body = {
      name,
      description,
      repo,
      tech,
      started,
      lastActivity,
      status,
      cause,
      progress: progress[0],
      revivable,
      notes,
      epitaph,
    };
    try {
      if (isEdit && project) {
        await update.mutateAsync({ id: project.id, body });
        toast.success("Tombstone recarved");
      } else {
        await create.mutateAsync(body);
        toast.success("Project interred", {
          description: `${name || "Untitled repository"} has been laid to rest in the graveyard.`,
        });
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save project");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button className="font-mono text-xs tracking-widest shadow-[0_0_24px_-8px_var(--primary)]">
              <Plus className="size-4" /> BURY NEW PROJECT
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[88vh] overflow-y-auto border-primary/30 bg-popover/95 backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader>
          <p className="terminal-label">{isEdit ? "recarve_form.exe" : "interment_form.exe"}</p>
          <DialogTitle className="font-display text-2xl tracking-wide">
            {isEdit ? "Edit Project" : "Bury a New Project"}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Record the remains. Every field is engraved on the tombstone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project name" className="sm:col-span-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Twitter Clone" />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was it supposed to be?"
            />
          </Field>
          <Field label="GitHub URL">
            <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="github.com/you/repo" />
          </Field>
          <Field label="Technologies">
            <Input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
            />
          </Field>
          <Field label="Start date">
            <Input type="date" value={started} onChange={(e) => setStarted(e.target.value)} />
          </Field>
          <Field label="Last activity">
            <Input type="date" value={lastActivity} onChange={(e) => setLastActivity(e.target.value)} />
          </Field>
          <Field label="Current status">
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s} className="font-mono text-xs">
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Cause of death">
            <Select value={cause} onValueChange={setCause}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAUSES.map((c) => (
                  <SelectItem key={c} value={c} className="font-mono text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={`Progress — ${progress[0]}%`} className="sm:col-span-2">
            <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="py-2" />
          </Field>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-4 py-3 sm:col-span-2">
            <div>
              <p className="font-mono text-xs tracking-wider text-foreground">COULD IT BE REVIVED?</p>
              <p className="font-mono text-[0.65rem] text-muted-foreground">
                Marks the grave with an ember beacon.
              </p>
            </div>
            <Switch checked={revivable} onCheckedChange={setRevivable} />
          </div>
          <Field label="Epitaph" className="sm:col-span-2">
            <Input value={epitaph} onChange={(e) => setEpitaph(e.target.value)} placeholder="Last words." />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Last words, known bugs, unfinished branches…"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="font-mono text-xs" onClick={() => setOpen(false)}>
            CANCEL
          </Button>
          <Button
            className="font-mono text-xs tracking-widest"
            onClick={() => void submit()}
            disabled={create.isPending || update.isPending}
          >
            {isEdit ? "SAVE CHANGES" : "COMMIT TO THE GROUND"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="terminal-label mb-2 block">{label}</Label>
      {children}
    </div>
  );
}
