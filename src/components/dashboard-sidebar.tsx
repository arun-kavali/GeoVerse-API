import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Database,
  KeyRound,
  ScrollText,
  Settings,
  Search,
  BookOpen,
  LogOut,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/explorer", label: "Search Playground", icon: Search },
  { to: "/dashboard/users", label: "Users", icon: Users },
  { to: "/dashboard/datasets", label: "Datasets", icon: Database },
  { to: "/dashboard/upload", label: "Upload", icon: Upload },
  { to: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/dashboard/api-logs", label: "API Logs", icon: ScrollText },
  { to: "/dashboard/docs", label: "API Docs", icon: BookOpen },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">AI</div>
        <span className="text-sm font-semibold tracking-tight">All India</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((n) => {
          const active = location.pathname === n.to || (n.to !== "/dashboard" && location.pathname.startsWith(n.to));
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={signOut}
        className="m-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}
