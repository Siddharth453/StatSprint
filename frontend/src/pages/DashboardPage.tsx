import { useState } from "react";
import { PageTransition } from "../components/animations/PageTransition";
import { Button } from "../components/ui/Button";
import {
  Activity,
  Zap,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronDown,
  BookmarkCheck,
  Send,
  Users,
  Swords,
  History,
  Star,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

interface Player {
  number: number;
  name: string;
  pos: string;
  rating: number;
  status?: "normal" | "tired" | "star";
}

interface H2HMatch {
  date: string;
  score: string;
  winner: string;
  competition: string;
}

interface MatchFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  scorers: string[];
  stats: {
    possession: [number, number]; // [home, away]
    expectedGoals: [number, number];
    totalShots: [number, number];
    shotsOnTarget: [number, number];
    passAccuracy: [number, number];
    fouls: [number, number];
    corners: [number, number];
  };
  lineups: {
    home: Player[];
    away: Player[];
  };
  h2h: H2HMatch[];
  aiPreset: {
    problem: string;
    action: string;
    substitutions: string[];
    confidence: number;
  };
}

const FIXTURES: MatchFixture[] = [
  {
    id: "mci-ars",
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    homeScore: 1,
    awayScore: 2,
    minute: 72,
    scorers: ["Haaland 28'", "Saka 44'", "Havertz 61'"],
    stats: {
      possession: [62, 38],
      expectedGoals: [1.45, 1.82],
      totalShots: [14, 8],
      shotsOnTarget: [5, 4],
      passAccuracy: [89, 79],
      fouls: [7, 12],
      corners: [6, 2],
    },
    lineups: {
      home: [
        { number: 31, name: "Ederson", pos: "GK", rating: 6.7 },
        { number: 2, name: "Walker", pos: "RB", rating: 6.4, status: "tired" },
        { number: 3, name: "Rúben Dias", pos: "CB", rating: 7.1 },
        { number: 25, name: "Akanji", pos: "CB", rating: 6.8 },
        { number: 24, name: "Gvardiol", pos: "LB", rating: 7.3 },
        { number: 16, name: "Rodri", pos: "DM", rating: 7.8 },
        { number: 17, name: "De Bruyne", pos: "AM", rating: 8.0 },
        { number: 20, name: "Bernardo Silva", pos: "RW", rating: 7.2 },
        { number: 47, name: "Foden", pos: "LW", rating: 6.9 },
        { number: 9, name: "Haaland", pos: "ST", rating: 7.6, status: "star" },
      ],
      away: [
        { number: 22, name: "Raya", pos: "GK", rating: 7.4 },
        { number: 4, name: "White", pos: "RB", rating: 7.2 },
        { number: 2, name: "Saliba", pos: "CB", rating: 8.2, status: "star" },
        { number: 6, name: "Gabriel", pos: "CB", rating: 7.9 },
        { number: 12, name: "Timber", pos: "LB", rating: 7.0, status: "tired" },
        { number: 5, name: "Partey", pos: "DM", rating: 7.3 },
        { number: 41, name: "Rice", pos: "CM", rating: 8.1 },
        { number: 8, name: "Ødegaard", pos: "AM", rating: 7.7 },
        { number: 7, name: "Saka", pos: "RW", rating: 8.5, status: "star" },
        { number: 29, name: "Havertz", pos: "ST", rating: 7.8 },
      ],
    },
    h2h: [
      {
        date: "Oct 2025",
        score: "0 - 1",
        winner: "Arsenal",
        competition: "Premier League",
      },
      {
        date: "Mar 2025",
        score: "0 - 0",
        winner: "Draw",
        competition: "Premier League",
      },
      {
        date: "Oct 2024",
        score: "1 - 0",
        winner: "Arsenal",
        competition: "Premier League",
      },
      {
        date: "Apr 2024",
        score: "4 - 1",
        winner: "Man City",
        competition: "Premier League",
      },
    ],
    aiPreset: {
      problem:
        "Arsenal's 5-4-1 mid-block is cutting off half-spaces to De Bruyne. Man City's inverted fullback is leaving transition space on the counter.",
      action:
        "Shift to a 3-1-4-2. Instruct Gvardiol to overlap high to drag Saka back into a 6-man defense, releasing central cutback angles.",
      substitutions: [
        "Sub Walker (Fatigue: 79%) → Fresh pace on recovery",
        "Doku on for wider 1v1 wing threats",
      ],
      confidence: 91,
    },
  },
  {
    id: "rma-bar",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: 2,
    awayScore: 1,
    minute: 66,
    scorers: ["Vinícius 19'", "Lewandowski 37'", "Bellingham 54'"],
    stats: {
      possession: [46, 54],
      expectedGoals: [2.1, 1.35],
      totalShots: [11, 9],
      shotsOnTarget: [6, 3],
      passAccuracy: [84, 88],
      fouls: [11, 9],
      corners: [4, 5],
    },
    lineups: {
      home: [
        { number: 1, name: "Courtois", pos: "GK", rating: 7.5 },
        { number: 2, name: "Carvajal", pos: "RB", rating: 7.2 },
        { number: 3, name: "Militão", pos: "CB", rating: 7.0 },
        { number: 22, name: "Rüdiger", pos: "CB", rating: 7.8 },
        { number: 23, name: "Mendy", pos: "LB", rating: 6.9 },
        { number: 14, name: "Tchouaméni", pos: "DM", rating: 7.3 },
        {
          number: 15,
          name: "Valverde",
          pos: "CM",
          rating: 8.3,
          status: "star",
        },
        {
          number: 5,
          name: "Bellingham",
          pos: "AM",
          rating: 8.6,
          status: "star",
        },
        { number: 11, name: "Rodrygo", pos: "RW", rating: 7.1 },
        {
          number: 7,
          name: "Vinícius Jr",
          pos: "LW",
          rating: 8.4,
          status: "star",
        },
      ],
      away: [
        { number: 1, name: "Ter Stegen", pos: "GK", rating: 6.8 },
        { number: 23, name: "Koundé", pos: "RB", rating: 6.5, status: "tired" },
        { number: 2, name: "Cubarsí", pos: "CB", rating: 6.9 },
        { number: 5, name: "Iñigo Martínez", pos: "CB", rating: 6.7 },
        { number: 3, name: "Balde", pos: "LB", rating: 7.2 },
        { number: 8, name: "Pedri", pos: "CM", rating: 7.9 },
        { number: 6, name: "Gavi", pos: "CM", rating: 7.4 },
        {
          number: 19,
          name: "Lamine Yamal",
          pos: "RW",
          rating: 7.9,
          status: "star",
        },
        { number: 11, name: "Raphinha", pos: "LW", rating: 7.6 },
        { number: 9, name: "Lewandowski", pos: "ST", rating: 7.3 },
      ],
    },
    h2h: [
      {
        date: "Jan 2026",
        score: "4 - 1",
        winner: "Real Madrid",
        competition: "Supercopa",
      },
      {
        date: "Oct 2025",
        score: "1 - 2",
        winner: "Real Madrid",
        competition: "La Liga",
      },
      {
        date: "Apr 2025",
        score: "3 - 2",
        winner: "Real Madrid",
        competition: "La Liga",
      },
      {
        date: "Oct 2024",
        score: "0 - 4",
        winner: "Barcelona",
        competition: "La Liga",
      },
    ],
    aiPreset: {
      problem:
        "Barcelona high defensive line is vulnerable, but Madrid is tiring in midfield press (Valverde stamina load > 82%).",
      action:
        "Direct balls behind Balde on transition. Drop defensive engagement line 10m deeper to preserve energy and counter into space.",
      substitutions: [
        "Camavinga for central recovery work",
        "Brahim Díaz for late counter-attack pace",
      ],
      confidence: 88,
    },
  },
];

export default function DashboardPage() {
  const [selectedFixture, setSelectedFixture] = useState<MatchFixture>(
    FIXTURES[0],
  );
  const [activeTab, setActiveTab] = useState<"tactics" | "lineups" | "h2h">(
    "tactics",
  );
  const [coachPrompt, setCoachPrompt] = useState(
    "Analyze our second-half deficit. How do we open up scoring channels while preventing their counter-attacks?",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tacticsOutput, setTacticsOutput] = useState(FIXTURES[0].aiPreset);

  const handleFixtureChange = (fixtureId: string) => {
    const f = FIXTURES.find((x) => x.id === fixtureId);
    if (f) {
      setSelectedFixture(f);
      setTacticsOutput(f.aiPreset);
      setSaved(false);
    }
  };

  const handleRunAi = () => {
    setIsGenerating(true);
    setSaved(false);
    setTimeout(() => {
      setTacticsOutput({
        problem: `High-frequency transitional turnovers in middle third. ${selectedFixture.awayTeam} is double-teaming central ball carriers.`,
        action: `Bypass the midfield pivot with vertical passes to half-spaces. Instruct fullbacks to invert and provide defensive rest-defense shape.`,
        substitutions: [
          "Swap fatigued fullback to neutralize winger 1v1 threat",
          "Introduce fresh ball-carrying midfielder to draw fouls",
        ],
        confidence: 93,
      });
      setIsGenerating(false);
    }, 750);
  };

  return (
    <PageTransition>
      <div className="w-full flex-1 p-5 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Fixture Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Live Match Telemetry
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono">
                  LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Official in-game telemetry stream & real-time tactical advisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              Select Match:
            </span>
            <div className="relative">
              <select
                value={selectedFixture.id}
                onChange={(e) => handleFixtureChange(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-200 hover:border-slate-600 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {FIXTURES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.homeTeam} vs {f.awayTeam} ({f.homeScore} - {f.awayScore})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Real-World Scoreboard Header */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 p-6 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center">
            {/* Home Team */}
            <div className="flex items-center justify-center md:justify-end gap-4">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {selectedFixture.homeTeam}
                </h2>
                <div className="text-xs text-slate-400">
                  Home • Form: W-W-D-W
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 text-lg">
                {selectedFixture.homeTeam.slice(0, 3).toUpperCase()}
              </div>
            </div>

            {/* Score & Live Clock */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold mb-2">
                <Clock size={13} className="animate-spin" />
                {selectedFixture.minute}&apos; IN-PLAY
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {selectedFixture.homeScore} : {selectedFixture.awayScore}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-[11px] text-slate-400">
                {selectedFixture.scorers.map((s, i) => (
                  <span
                    key={i}
                    className="bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50"
                  >
                    ⚽ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg order-2 md:order-1">
                {selectedFixture.awayTeam.slice(0, 3).toUpperCase()}
              </div>
              <div className="order-1 md:order-2 text-center md:text-left">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {selectedFixture.awayTeam}
                </h2>
                <div className="text-xs text-slate-400">
                  Away • Form: W-W-W-L
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Match Stats Card (Standard Broadcast Stats) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {selectedFixture.homeTeam}
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Activity size={14} className="text-sky-400" />
              Live Match Statistics
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {selectedFixture.awayTeam}
            </span>
          </div>

          <div className="space-y-3.5 max-w-3xl mx-auto">
            {[
              {
                name: "Possession",
                home: `${selectedFixture.stats.possession[0]}%`,
                away: `${selectedFixture.stats.possession[1]}%`,
                homePct: selectedFixture.stats.possession[0],
                awayPct: selectedFixture.stats.possession[1],
              },
              {
                name: "Expected Goals (xG)",
                home: selectedFixture.stats.expectedGoals[0].toFixed(2),
                away: selectedFixture.stats.expectedGoals[1].toFixed(2),
                homePct: (selectedFixture.stats.expectedGoals[0] / 3) * 100,
                awayPct: (selectedFixture.stats.expectedGoals[1] / 3) * 100,
              },
              {
                name: "Total Shots",
                home: selectedFixture.stats.totalShots[0],
                away: selectedFixture.stats.totalShots[1],
                homePct: (selectedFixture.stats.totalShots[0] / 20) * 100,
                awayPct: (selectedFixture.stats.totalShots[1] / 20) * 100,
              },
              {
                name: "Shots on Target",
                home: selectedFixture.stats.shotsOnTarget[0],
                away: selectedFixture.stats.shotsOnTarget[1],
                homePct: (selectedFixture.stats.shotsOnTarget[0] / 10) * 100,
                awayPct: (selectedFixture.stats.shotsOnTarget[1] / 10) * 100,
              },
              {
                name: "Passing Accuracy",
                home: `${selectedFixture.stats.passAccuracy[0]}%`,
                away: `${selectedFixture.stats.passAccuracy[1]}%`,
                homePct: selectedFixture.stats.passAccuracy[0],
                awayPct: selectedFixture.stats.passAccuracy[1],
              },
              {
                name: "Fouls Committed",
                home: selectedFixture.stats.fouls[0],
                away: selectedFixture.stats.fouls[1],
                homePct: (selectedFixture.stats.fouls[0] / 20) * 100,
                awayPct: (selectedFixture.stats.fouls[1] / 20) * 100,
              },
            ].map((stat) => (
              <div key={stat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white font-mono">{stat.home}</span>
                  <span className="text-slate-400 font-medium">
                    {stat.name}
                  </span>
                  <span className="text-white font-mono">{stat.away}</span>
                </div>
                {/* Dual Progress Bar */}
                <div className="flex h-2 bg-slate-950 rounded-full overflow-hidden gap-1 p-0.5 border border-slate-800">
                  <div
                    className="bg-sky-500 rounded-l-full transition-all duration-500"
                    style={{ width: `${stat.homePct}%` }}
                  />
                  <div
                    className="bg-emerald-500 rounded-r-full ml-auto transition-all duration-500"
                    style={{ width: `${stat.awayPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation: AI Tactics | Lineups & Ratings | H2H */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("tactics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "tactics"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Sparkles size={15} />
            AI Tactical Advisor
          </button>

          <button
            onClick={() => setActiveTab("lineups")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "lineups"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <Users size={15} />
            Lineups & Ratings
          </button>

          <button
            onClick={() => setActiveTab("h2h")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "h2h"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            <History size={15} />
            Head-to-Head (H2H)
          </button>
        </div>

        {/* Tab 1: AI Tactical Advisor & Countermeasures */}
        {activeTab === "tactics" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Prompt Input Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Zap size={16} className="text-sky-400" />
                Coach In-Game Command
              </div>
              <p className="text-xs text-slate-400">
                Ask how to break their formation, adjust rest defense, or handle
                tired players:
              </p>
              <textarea
                value={coachPrompt}
                onChange={(e) => setCoachPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all resize-none leading-relaxed"
              />
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={isGenerating}
                icon={<Send size={15} />}
                iconPosition="right"
                onClick={handleRunAi}
              >
                Synthesize Tactical Fix
              </Button>
            </div>

            {/* Right AI Assessment Card */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Tactical Countermeasure Report
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Evaluated on 72&apos; Match Corridor Data
                    </span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  {tacticsOutput.confidence}% Confidence
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShieldAlert size={14} />
                    Current Structural Flaw
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tacticsOutput.problem}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                    <Activity size={14} />
                    Recommended Coaching Adjustment
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {tacticsOutput.action}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300">
                    Suggested Match Substitutions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tacticsOutput.substitutions.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-[11px] text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <Button
                    variant={saved ? "secondary" : "outline"}
                    size="sm"
                    icon={
                      <BookmarkCheck
                        size={14}
                        className={saved ? "text-emerald-400" : ""}
                      />
                    }
                    iconPosition="left"
                    onClick={() => setSaved(true)}
                    disabled={saved}
                  >
                    {saved ? "Saved to Playbook" : "Save to Playbook"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Player Lineups & Live Ratings */}
        {activeTab === "lineups" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Home Lineup */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  {selectedFixture.homeTeam} Lineup (4-3-3)
                </h3>
                <span className="text-xs text-slate-400">Team Avg: 7.2</span>
              </div>
              <div className="space-y-2">
                {selectedFixture.lineups.home.map((p) => (
                  <div
                    key={p.number}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 w-5 text-center">
                        #{p.number}
                      </span>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        {p.pos}
                      </span>
                      {p.status === "tired" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                          <Flame size={10} /> Tired (78% load)
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        p.rating >= 8.0
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : p.rating >= 7.0
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {p.rating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Lineup */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {selectedFixture.awayTeam} Lineup (4-2-3-1)
                </h3>
                <span className="text-xs text-slate-400">Team Avg: 7.7</span>
              </div>
              <div className="space-y-2">
                {selectedFixture.lineups.away.map((p) => (
                  <div
                    key={p.number}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 w-5 text-center">
                        #{p.number}
                      </span>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        {p.pos}
                      </span>
                      {p.status === "star" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Star size={10} /> Key Threat
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        p.rating >= 8.0
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : p.rating >= 7.0
                            ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                            : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {p.rating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Head to Head (H2H) History */}
        {activeTab === "h2h" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Swords size={16} className="text-amber-400" />
                Previous Head-to-Head Encounters
              </h3>
              <span className="text-xs text-slate-400">
                Past 4 Competitive Meetings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedFixture.h2h.map((match, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{match.date}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                      {match.competition}
                    </span>
                  </div>
                  <div className="text-center py-2">
                    <div className="text-2xl font-black font-mono text-white tracking-wide">
                      {match.score}
                    </div>
                  </div>
                  <div className="text-center text-xs font-semibold text-emerald-400 border-t border-slate-800/60 pt-2">
                    Winner: {match.winner}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
