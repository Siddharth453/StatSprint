import React from "react";
import { Search, Bell, Radio } from "lucide-react";

interface TopAppBarProps {
  activeSport: "all" | "football" | "cricket";
  setActiveSport: (sport: "all" | "football" | "cricket") => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeSport,
  setActiveSport,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Live Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Radio className="text-slate-950 w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              StatSprint
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO
              </span>
            </span>
          </div>
        </div>

        {/* Global Sport Category Toggles */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveSport("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSport === "all"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setActiveSport("football")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSport === "football"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚽ Football
          </button>
          <button
            onClick={() => setActiveSport("cricket")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSport === "cricket"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🏏 Cricket
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search matches, players..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950" />
          </button>

          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 p-0.5 cursor-pointer">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs font-black text-amber-400">
              CK
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
