import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Settings, Skull } from "lucide-react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/lib/queries";

const items = [
  { title: "Dashboard", url: "/dashboard", glyph: "🏚" },
  { title: "Graveyard", url: "/graveyard", glyph: "⚰️" },
  { title: "Active Projects", url: "/active", glyph: "🧟" },
  { title: "Revivable", url: "/revivable", glyph: "🔥" },
  { title: "Analytics", url: "/analytics", glyph: "📊" },
  { title: "Collections", url: "/collections", glyph: "🗃" },
  { title: "Profile", url: "/profile", glyph: "👤" },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/70 px-3 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-primary/50 bg-primary/10 text-primary shadow-[0_0_18px_-6px_var(--primary)]">
            <Skull className="size-4" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-bold tracking-[0.16em] text-foreground">
                PROJECT
              </span>
              <span className="block truncate font-display text-sm font-bold tracking-[0.16em] text-primary text-glow">
                GRAVEYARD
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="terminal-label">Crypt Index</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className={
                          active
                            ? "border-l-2 border-primary bg-sidebar-accent font-medium text-primary"
                            : "border-l-2 border-transparent text-sidebar-foreground/80 hover:text-foreground"
                        }
                      >
                        <span className="text-base leading-none">{item.glyph}</span>
                        <span className="font-mono text-xs tracking-wider">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
              <Link to="/settings" className="text-sidebar-foreground/80">
                <Settings className="size-4" />
                <span className="font-mono text-xs tracking-wider">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="text-sidebar-foreground/80"
              onClick={async () => {
                await logout.mutateAsync();
                toast.message("The gates close.");
                await navigate({ to: "/login" });
              }}
            >
              <LogOut className="size-4" />
              <span className="font-mono text-xs tracking-wider">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
