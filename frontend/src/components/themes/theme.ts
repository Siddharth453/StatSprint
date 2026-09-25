export type ThemeName = "violet" | "cyan" | "emerald" | "amber" | "rose";

export const defaultTheme: ThemeName = "violet";

export const themes: Record<
  ThemeName,
  {
    primary: string;
    primaryOutline: string;
    accent: string;
    border: string;
    ring: string;
    badge: string;
    glow: string;
  }
> = {
  violet: {
    primary:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/25",
    primaryOutline:
      "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
    accent: "text-violet-400",
    border: "border-violet-500/20",
    ring: "focus:border-violet-500",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    glow: "shadow-violet-500/10",
  },
  cyan: {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20",
    primaryOutline: "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    ring: "focus:border-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    glow: "shadow-cyan-500/10",
  },
  emerald: {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20",
    primaryOutline:
      "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    ring: "focus:border-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  amber: {
    primary:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20",
    primaryOutline: "border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    ring: "focus:border-amber-500",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glow: "shadow-amber-500/10",
  },
  rose: {
    primary: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20",
    primaryOutline: "border-rose-500/30 text-rose-400 hover:bg-rose-500/10",
    accent: "text-rose-400",
    border: "border-rose-500/20",
    ring: "focus:border-rose-500",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    glow: "shadow-rose-500/10",
  },
};
