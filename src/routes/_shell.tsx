import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { Skull } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/graveyard/AppSidebar";
import { TopBar } from "@/components/graveyard/TopBar";
import { Atmosphere } from "@/components/graveyard/Atmosphere";
import { api, ApiError } from "@/lib/api";
import type { MeResponse } from "@/lib/queries";

export const Route = createFileRoute("/_shell")({
  beforeLoad: async () => {
    try {
      const me = await api<MeResponse>("/api/auth/me");
      return { me };
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        throw redirect({ to: "/login" });
      }
      throw err;
    }
  },
  pendingComponent: ShellPending,
  component: ShellLayout,
});

function ShellPending() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background overflow-hidden">
      <Atmosphere />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_30px_-5px_var(--primary)]">
          <Skull className="size-7 animate-skull-float text-primary" />
        </div>
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground animate-pulse">
          OPENING SECTOR VAULT...
        </span>
      </div>
    </div>
  );
}

function ShellLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Atmosphere />
          <TopBar />
          <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
