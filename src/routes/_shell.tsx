import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

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
  component: ShellLayout,
});

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
