import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/graveyard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { useProfile, useSettings, useUpdateProfile, useUpdateSettings } from "@/lib/queries";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Project Graveyard" },
      { name: "description", content: "Configure burial rules, decay thresholds and haunting notifications." },
      { property: "og:title", content: "Settings — Project Graveyard" },
      { property: "og:description", content: "Control how your graveyard behaves." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const profileQuery = useProfile();
  const settingsQuery = useSettings();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateSettings();

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [autoBury, setAutoBury] = useState(true);
  const [hauntingReminders, setHauntingReminders] = useState(true);
  const [ambientFog, setAmbientFog] = useState(true);
  const [terminalSfx, setTerminalSfx] = useState(false);

  useEffect(() => {
    const p = profileQuery.data?.profile;
    if (p) {
      setName(p.name);
      setHandle(p.handle);
      setBio(p.bio);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    const s = settingsQuery.data;
    if (s) {
      setAutoBury(s.autoBury);
      setHauntingReminders(s.hauntingReminders);
      setAmbientFog(s.ambientFog);
      setTerminalSfx(s.terminalSfx);
    }
  }, [settingsQuery.data]);

  const toggles = [
    { label: "AUTO-BURY AFTER 180 DAYS", desc: "Projects with no pulse are interred automatically.", value: autoBury, set: setAutoBury },
    { label: "HAUNTING REMINDERS", desc: "Weekly notification from a randomly selected grave.", value: hauntingReminders, set: setHauntingReminders },
    { label: "AMBIENT FOG", desc: "Atmospheric particles and mist across the interface.", value: ambientFog, set: setAmbientFog },
    { label: "TERMINAL SOUND FX", desc: "Subtle audio feedback on burial and revival.", value: terminalSfx, set: setTerminalSfx },
  ];

  async function save() {
    try {
      await Promise.all([
        updateProfile.mutateAsync({ name, handle, bio }),
        updateSettings.mutateAsync({ autoBury, hauntingReminders, ambientFog, terminalSfx }),
      ]);
      toast.success("Configuration sealed in the crypt");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="// system_config" title="SETTINGS" description="Rules of the crypt." />

      <section className="rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
        <h2 className="font-display text-sm font-bold tracking-[0.18em]">GRAVEKEEPER IDENTITY</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="terminal-label mb-2 block">Display name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="terminal-label mb-2 block">Handle</Label>
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="terminal-label mb-2 block">Bio</Label>
            <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-md border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
        <h2 className="font-display text-sm font-bold tracking-[0.18em]">BURIAL PROTOCOL</h2>
        <ul className="mt-4 divide-y divide-border/60">
          {toggles.map((t) => (
            <li key={t.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
              <div className="min-w-0">
                <p className="font-mono text-xs tracking-wider">{t.label}</p>
                <p className="font-mono text-[0.65rem] text-muted-foreground">{t.desc}</p>
              </div>
              <Switch checked={t.value} onCheckedChange={t.set} />
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5 flex justify-end">
        <Button
          className="font-mono text-xs tracking-widest"
          onClick={() => void save()}
          disabled={updateProfile.isPending || updateSettings.isPending}
        >
          SAVE CHANGES
        </Button>
      </div>
    </div>
  );
}
