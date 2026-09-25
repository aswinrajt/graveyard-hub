import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Skull } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Atmosphere } from "@/components/graveyard/Atmosphere";
import { GraveSpinner } from "@/components/graveyard/GraveyardSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useRegister } from "@/lib/queries";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Claim a plot — Register" },
      { name: "description", content: "Create a Project Graveyard account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const result = await register.mutateAsync({ email, password, name });
      if (result && typeof result === "object" && "needsConfirmation" in result) {
        toast.message("Confirm your email in Supabase, or disable Confirm email for local demo.");
        return;
      }
      toast.success("Twelve remains have been interred in your name.");
      await navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Register failed");
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Atmosphere dense />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm border border-primary/50 bg-primary/10 text-primary">
            <Skull className="size-4" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.22em]">PROJECT GRAVEYARD</span>
        </Link>
        <form
          onSubmit={submit}
          className="rounded-md border border-border/70 bg-card/70 p-6 backdrop-blur-sm"
        >
          <p className="terminal-label text-primary">// new_gravekeeper</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-wide">CLAIM A PLOT</h1>
          <div className="mt-6 space-y-4">
            <div>
              <Label className="terminal-label mb-2 block">Display name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} className="font-mono text-xs" />
            </div>
            <div>
              <Label className="terminal-label mb-2 block">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <Label className="terminal-label mb-2 block">Password</Label>
              <Input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="mt-6 w-full font-mono text-xs tracking-widest"
            disabled={register.isPending}
          >
            {register.isPending ? <GraveSpinner size="sm" text="ENGRAVING YOUR PLOT..." /> : "OPEN THE GATES"}
          </Button>
          <p className="mt-4 text-center font-mono text-[0.68rem] text-muted-foreground">
            Already interred?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
