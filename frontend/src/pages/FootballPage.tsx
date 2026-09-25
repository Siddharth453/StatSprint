import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DynamicField } from "../components/ui/DynamicField";
import { Button } from "../components/ui/Button";
import {
  Zap,
  Sparkles,
  Send,
  AlertCircle,
  BarChart3,
  ListOrdered,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

export interface FieldPlayer {
  id: string;
  name: string;
  number?: number;
  pos: string;
  rating: number;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
}

export interface MatchCard {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  date: string;
  venue: string;
}

export interface NewsItem {
  badge?: string;
  headline: string;
  summary: string;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow-card" | "red-card" | "substitution";
  team: "home" | "away";
  player: string;
}

export interface MatchStats {
  possession?: [number, number];
  shots?: [number, number];
  shotsOnTarget?: [number, number];
  fouls?: [number, number];
  corners?: [number, number];
}

export interface MatchDetails {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  formation?: string;
  awayFormation?: string;
  minute?: number;
  venue?: string;
  referee?: string;
  status?: string;
  stats?: MatchStats;
  events?: MatchEvent[];
  players?: FieldPlayer[];
}

export interface Tactics {
  problem: string;
  action: string;
  confidence: number;
}

// Comprehensive Mock Database aligned with Dashboard IDs
const MOCK_MATCHES: MatchCard[] = [
  {
    id: "match-1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeScore: "2",
    awayScore: "1",
    date: "Today, 20:00",
    venue: "Emirates Stadium",
  },
  {
    id: "match-2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: "1",
    awayScore: "1",
    date: "Yesterday",
    venue: "Santiago Bernabéu",
  },
  {
    id: "match-3",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    homeScore: "0",
    awayScore: "0",
    date: "Tomorrow, 18:30",
    venue: "Allianz Arena",
  },
];

const MOCK_NEWS: NewsItem[] = [
  {
    badge: "TACTICAL BRIEF",
    headline: "High-intensity pressing dominating match metrics",
    summary:
      "Midfield blocks are forcing turnovers higher up the pitch across recent fixtures.",
  },
  {
    badge: "TEAM NEWS",
    headline: "Rotation key as fixture congestion peaks",
    summary: "Managers look to bench depth to maintain second-half stamina.",
  },
  {
    badge: "VAR UPDATE",
    headline: "New automated offside tech calibration underway",
    summary:
      "Referees report improved decision speeds in recent derby matches.",
  },
];

const MOCK_DETAILED_DATA: Record<string, MatchDetails> = {
  "match-1": {
    id: "match-1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeScore: "2",
    awayScore: "1",
    formation: "4-3-3",
    awayFormation: "4-2-3-1",
    minute: 68,
    status: "LIVE",
    venue: "Emirates Stadium",
    referee: "Anthony Taylor",
    stats: {
      possession: [54, 46],
      shots: [14, 10],
      shotsOnTarget: [6, 4],
      corners: [5, 3],
      fouls: [8, 12],
    },
    events: [
      { minute: 14, type: "goal", team: "home", player: "B. Saka" },
      { minute: 32, type: "goal", team: "away", player: "C. Palmer" },
      { minute: 45, type: "yellow-card", team: "home", player: "Declan Rice" },
      { minute: 56, type: "goal", team: "home", player: "L. Trossard" },
    ],
    players: [
      // ... players array ...
    ],
  },
  "match-2": {
    id: "match-2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: "1",
    awayScore: "1",
    formation: "4-3-3",
    awayFormation: "4-3-3",
    minute: 90,
    status: "FT",
    venue: "Santiago Bernabéu",
    referee: "Jesús Gil Manzano",
    stats: {
      possession: [50, 50],
      shots: [16, 15],
      shotsOnTarget: [7, 6],
      corners: [6, 5],
      fouls: [11, 14],
    },
    events: [
      { minute: 28, type: "goal", team: "home", player: "J. Bellingham" },
      { minute: 64, type: "goal", team: "away", player: "R. Lewandowski" },
    ],
    players: [
      // ... players array ...
    ],
  },
  "match-3": {
    id: "match-3",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    homeScore: "0",
    awayScore: "0",
    formation: "4-2-3-1",
    awayFormation: "4-3-3",
    minute: 0,
    status: "UPCOMING",
    venue: "Allianz Arena",
    referee: "Felix Zwayer",
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      corners: [0, 0],
      fouls: [0, 0],
    },
    events: [],
    players: [
      // ... players array ...
    ],
  },
};

export default function FootballPage() {
  const { id } = useParams<{ id: string }>();
  const [matches] = useState<MatchCard[]>(MOCK_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    id || "match-1",
  );
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [news] = useState<NewsItem[]>(MOCK_NEWS);
  const [loading, setLoading] = useState<boolean>(false);
  const [coachPrompt, setCoachPrompt] = useState<string>(
    "Down by a goal in the second half. How do we break their midfield press without exposing our fullbacks?",
  );
  const [tactics, setTactics] = useState<Tactics | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setSelectedMatchId(id);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const foundMatch = matches.find((m) => m.id === selectedMatchId);
      const selected = MOCK_DETAILED_DATA[selectedMatchId] || {
        id: selectedMatchId,
        homeTeam: foundMatch?.homeTeam || "Home Team",
        awayTeam: foundMatch?.awayTeam || "Away Team",
        homeScore: foundMatch?.homeScore || "0",
        awayScore: foundMatch?.awayScore || "0",
        formation: "4-3-3",
        awayFormation: "4-3-3",
        minute: 45,
        status: "LIVE",
        venue: foundMatch?.venue || "Stadium",
        stats: { possession: [50, 50], shots: [10, 10] },
        players: [],
        events: [],
      };
      setMatchDetails(selected);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedMatchId, matches]);

  const handleAnalyze = async (): Promise<void> => {
    if (!matchDetails) return;
    setAnalyzing(true);
    setTactics(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-tactics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matchId: matchDetails.id,
            homeTeam: matchDetails.homeTeam,
            awayTeam: matchDetails.awayTeam,
            formation: matchDetails.formation,
            awayFormation: matchDetails.awayFormation,
            minute: matchDetails.minute,
            score: `${matchDetails.homeScore}-${matchDetails.awayScore}`,
            prompt: coachPrompt,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tactical analysis from server.");
      }

      const data = await response.json();
      setTactics({
        problem: data.problem || "Tactical vulnerability detected.",
        action: data.action || "Adjust defensive block shape.",
        confidence: data.confidence || 90,
      });
    } catch (error) {
      console.error("AI Analysis error:", error);
      // Fallback response if backend is offline/unreachable
      setTactics({
        problem: `Backend connection error analyzing ${matchDetails.awayTeam}.`,
        action: "Please verify backend server status and try again.",
        confidence: 0,
      });
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <div className="w-full flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
      <div className="flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub Dashboard
        </a>
        <span className="text-[10px] font-mono text-cyan-400">
          MATCH TELEMETRY ACTIVE
        </span>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Live Football Breaking Wire
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item: NewsItem, i: number) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md transition-all hover:border-slate-700"
            >
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {item.badge}
              </span>
              <h3 className="text-xs font-bold text-white mt-2 leading-snug">
                {item.headline}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Featured Fixtures (Select to view telemetry)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {matches.map((m: MatchCard) => (
            <div
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedMatchId === m.id
                  ? "bg-emerald-950/30 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>{m.date}</span>
                <span className="truncate max-w-[120px]">{m.venue}</span>
              </div>
              <div className="font-bold text-xs truncate mt-1.5 flex justify-between items-center">
                <span>{m.homeTeam}</span>
                <span className="text-emerald-400 font-mono text-sm px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {m.homeScore ?? "-"} - {m.awayScore ?? "-"}
                </span>
                <span>{m.awayTeam}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="h-64 flex items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex flex-col items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            Loading match telemetry...
          </div>
        </div>
      ) : matchDetails ? (
        <section className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/20 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  {matchDetails.homeTeam}
                </h2>
                <span className="text-xs text-slate-400">
                  Formation: {matchDetails.formation || "4-3-3"}
                </span>
              </div>

              <div className="text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold flex items-center gap-1.5 mx-auto w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {matchDetails.minute || 0}&apos;{" "}
                  {matchDetails.status || "LIVE"}
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white my-1">
                  {matchDetails.homeScore ?? "0"} :{" "}
                  {matchDetails.awayScore ?? "0"}
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-lg sm:text-2xl font-black text-white">
                  {matchDetails.awayTeam}
                </h2>
                <span className="text-xs text-slate-400">
                  Formation: {matchDetails.awayFormation || "4-3-3"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap justify-between text-[11px] text-slate-400">
              <span>🏟️ Venue: {matchDetails.venue || "Stadium"}</span>
              <span>Referee: {matchDetails.referee || "Match Official"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <DynamicField
                sport="football"
                formationName={matchDetails.formation || "4-3-3"}
                teamName={matchDetails.homeTeam}
                players={matchDetails.players || []}
              />

              {matchDetails.stats && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Match Telemetry & Statistics
                  </h3>

                  <div className="space-y-3 text-xs">
                    {matchDetails.stats.possession && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-400 font-mono">
                          <span>{matchDetails.stats.possession[0]}%</span>
                          <span className="text-slate-200 font-semibold uppercase text-[10px]">
                            Possession
                          </span>
                          <span>{matchDetails.stats.possession[1]}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
                          <div
                            className="bg-emerald-500 transition-all duration-500 h-full"
                            style={{
                              width: `${matchDetails.stats.possession[0]}%`,
                            }}
                          />
                          <div
                            className="bg-blue-500 transition-all duration-500 h-full"
                            style={{
                              width: `${matchDetails.stats.possession[1]}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {matchDetails.stats.shots && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.shots[0]}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Total Shots
                        </span>
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.shots[1]}
                        </span>
                      </div>
                    )}

                    {matchDetails.stats.shotsOnTarget && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.shotsOnTarget[0]}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Shots on Target
                        </span>
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.shotsOnTarget[1]}
                        </span>
                      </div>
                    )}

                    {matchDetails.stats.corners && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.corners[0]}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Corners
                        </span>
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.corners[1]}
                        </span>
                      </div>
                    )}

                    {matchDetails.stats.fouls && (
                      <div className="flex justify-between items-center py-1.5">
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.fouls[0]}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Fouls Committed
                        </span>
                        <span className="font-mono font-bold text-white">
                          {matchDetails.stats.fouls[1]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  In-Game Tactical Advisor
                </h3>
                <textarea
                  value={coachPrompt}
                  onChange={(e) => setCoachPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-inner"
                />
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  loading={analyzing}
                  icon={<Send size={14} />}
                  onClick={handleAnalyze}
                >
                  AI Analysis
                </Button>

                {tactics && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 animate-fadeIn">
                    <div className="text-amber-400 font-bold flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{tactics.problem}</span>
                    </div>
                    <div className="text-emerald-300 font-semibold flex items-start gap-1.5">
                      <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{tactics.action}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-900 flex justify-between">
                      <span>AI Confidence Score</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {tactics.confidence}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {matchDetails.events && matchDetails.events.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-emerald-400" />
                    Live Match Timeline
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {matchDetails.events.map((ev: MatchEvent, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 w-6">
                            {ev.minute}&apos;
                          </span>
                          <span>
                            {ev.type === "goal" && "⚽ "}
                            {ev.type === "yellow-card" && "🟨 "}
                            {ev.type === "red-card" && "🟥 "}
                            {ev.type === "substitution" && "🔄 "}
                            <span className="font-semibold text-white">
                              {ev.player}
                            </span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">
                          {ev.team}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
