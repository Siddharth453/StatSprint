import React from "react";

export interface FieldPlayer {
  id?: string; // Made optional so objects without IDs are accepted
  name: string;
  number?: number;
  pos?: string;
  role?: string;
  rating?: number;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
}

interface DynamicFieldProps {
  sport: "football" | "cricket";
  formationName?: string;
  players: FieldPlayer[];
  teamName: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  sport,
  formationName,
  players,
  teamName,
}) => {
  if (sport === "football") {
    return (
      <div className="relative w-full aspect-[16/10] max-h-[500px] bg-gradient-to-b from-emerald-950/70 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          className="absolute inset-0 w-full h-full stroke-emerald-500/25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4%"
            y="5%"
            width="92%"
            height="90%"
            fill="none"
            strokeWidth="2"
            rx="12"
          />
          <line x1="50%" y1="5%" x2="50%" y2="95%" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="13%" fill="none" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="0.8%" fill="currentColor" />
          <rect
            x="4%"
            y="24%"
            width="14%"
            height="52%"
            fill="none"
            strokeWidth="2"
          />
          <rect
            x="82%"
            y="24%"
            width="14%"
            height="52%"
            fill="none"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {formationName || "Dynamic Formation"}
          </span>
          <span className="text-xs font-bold text-slate-300">{teamName}</span>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {players.map((p, idx) => {
            const playerId = p.id || `player-${idx}`;
            const playerRating = p.rating ?? 7.5;
            const ratingColor =
              playerRating >= 8.0
                ? "bg-emerald-400 text-slate-950 font-black"
                : playerRating >= 7.0
                  ? "bg-sky-400 text-slate-950 font-black"
                  : "bg-amber-400 text-slate-950 font-bold";

            return (
              <div
                key={playerId}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-10 pointer-events-auto"
              >
                <div className="relative w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:border-white">
                  <span className="text-[11px] font-mono font-bold text-white">
                    {p.number || p.role || playerId.slice(0, 2)}
                  </span>
                  <span
                    className={`absolute -top-2 -right-2 px-1 rounded text-[9px] font-mono shadow ${ratingColor}`}
                  >
                    {playerRating.toFixed(1)}
                  </span>
                </div>
                <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-semibold text-slate-200 whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Cricket Field (Oval + Pitch Deck)
  return (
    <div className="relative w-full aspect-[16/10] max-h-[500px] bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-4 overflow-hidden shadow-2xl">
      <svg
        className="absolute inset-0 w-full h-full stroke-amber-500/20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="44%"
          ry="42%"
          fill="none"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <ellipse
          cx="50%"
          cy="50%"
          rx="26%"
          ry="24%"
          fill="none"
          strokeWidth="2"
        />
        <rect
          x="47%"
          y="40%"
          width="6%"
          height="20%"
          rx="3"
          fill="#382914"
          stroke="#d97706"
          strokeWidth="1.5"
        />
      </svg>

      <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          FIELD SETTING
        </span>
        <span className="text-xs font-bold text-slate-300">{teamName}</span>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {players.map((p, idx) => {
          const playerId = p.id || `fielder-${idx}`;
          const playerRating = p.rating ?? 7.5;
          return (
            <div
              key={playerId}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-transform hover:scale-110 z-10 pointer-events-auto"
            >
              <div className="relative w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <span className="text-[10px] font-bold text-amber-300">
                  {p.pos || p.role || "PL"}
                </span>
                <span className="absolute -bottom-1 -right-1 px-1 rounded bg-amber-400 text-slate-950 text-[8px] font-mono font-bold">
                  {playerRating.toFixed(1)}
                </span>
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[9px] text-slate-300 font-medium whitespace-nowrap">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
