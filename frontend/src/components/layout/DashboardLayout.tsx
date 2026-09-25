import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Terminal,
  LayoutDashboard,
  Database,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { themes, defaultTheme, type ThemeName } from "../themes/theme";
import { Background } from "../ui/Background";
import { Button } from "../ui/Button";

export interface NavItemConfig {
  label: string;
  path: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

interface DashboardLayoutProps {
  themeColor?: ThemeName;
  title?: string;
  navItems?: NavItemConfig[];
  onLogout?: () => void;
}

const DEFAULT_NAV_ITEMS: NavItemConfig[] = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Deployments", path: "/deployments", icon: Database },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function DashboardLayout({
  themeColor = defaultTheme,
  title = "APP NAME",
  navItems = DEFAULT_NAV_ITEMS,
  onLogout,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const activeTokens = themes[themeColor];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  return (
    <Background>
      <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-slate-800 selection:text-slate-200 relative">
        {/* Top Navbar */}
        <header
          className={`border-b ${activeTokens.border} px-6 py-3.5 flex justify-between items-center bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 ${activeTokens.glow}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl bg-slate-900 border ${activeTokens.border} ${activeTokens.accent}`}
            >
              <Terminal size={18} />
            </div>
            <div>
              <span className="font-bold tracking-wider text-sm uppercase text-slate-100">
                {title}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <Button
            variant="outline"
            themeColor="rose"
            icon={<LogOut size={14} />}
            size="md"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 pb-32 md:pb-36">
          <Outlet />
        </main>

        {/* Floating Bottom Navigation Bar: Translucent Frosted Glass with Small Theme Border */}
        <div className="fixed bottom-7 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <nav
            className={`pointer-events-auto flex items-center gap-1.5 p-2 rounded-2xl border ${activeTokens.border}`}
            style={{
              // Faint transparent surface so the browser renders optical diffusion
              backgroundColor: "rgba(255, 255, 255, 0.0001)",

              // Pure optical frost blur
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",

              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",

              // Multi-layer light shadow for floating elevation
              boxShadow:
                "0 0 25px 4px rgba(0, 0, 0, 0.18), 0 0 50px 10px rgba(0, 0, 0, 0.14), 0 0 90px 20px rgba(0, 0, 0, 0.10)",
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? `${activeTokens.accent} bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.06)] scale-[1.02]`
                        : `text-slate-400 hover:${activeTokens.accent} hover:bg-white/5`
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${activeTokens.badge}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </Background>
  );
}
