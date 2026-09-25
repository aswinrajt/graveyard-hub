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
import { useLogin } from "@/lib/queries";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Enter the Graveyard — Login" },
      { name: "description", content: "Sign in to your Project Graveyard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      toast.success("The gates open.");
      await navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Login failed");
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
          <p className="terminal-label text-primary">// access_protocol</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-wide">ENTER THE CRYPT</h1>
          <div className="mt-6 space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full font-mono text-xs tracking-widest" disabled={login.isPending}>
            {login.isPending ? <GraveSpinner size="sm" text="OPENING CRYPT GATES..." /> : "ENTER THE GRAVEYARD"}
          </Button>
          <p className="mt-4 text-center font-mono text-[0.68rem] text-muted-foreground">
            No plot yet?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
