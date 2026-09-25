import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Zap,
  Trophy,
  ShieldAlert,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface CricketMatchDetail {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  date: string;
  venue: string;
  status: string;
  tournament: string;
  crr: string;
  overs: string;
  homeBadge: string;
  awayBadge: string;
  fielders: { name: string; x: number; y: number; role: string }[];
  batsmen: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    sr: number;
  }[];
  bowler: { name: string; overs: string; runs: number; wickets: number };
}

const MOCK_CRICKET_MATCHES: Record<string, CricketMatchDetail> = {
  "cricket-1": {
    id: "cricket-1",
    homeTeam: "India",
    awayTeam: "Australia",
    homeScore: "284/6",
    awayScore: "210/4 (38.2 ov)",
    date: "Today, 14:00",
    venue: "Melbourne Cricket Ground",
    status: "LIVE",
    tournament: "ICC ODI World Series",
    crr: "5.48",
    overs: "42.0",
    homeBadge: "https://flagcdn.com/w80/in.png", // India Flag
    awayBadge: "https://flagcdn.com/w80/au.png", // Australia Flag
    fielders: [
      { name: "Wicketkeeper", x: 50, y: 85, role: "WK" },
      { name: "First Slip", x: 58, y: 82, role: "Slip" },
      { name: "Second Slip", x: 63, y: 80, role: "Slip" },
      { name: "Gully", x: 72, y: 75, role: "Fielding" },
      { name: "Point", x: 82, y: 55, role: "Fielding" },
      { name: "Cover", x: 75, y: 35, role: "Fielding" },
      { name: "Mid Off", x: 60, y: 22, role: "Fielding" },
      { name: "Mid On", x: 40, y: 22, role: "Fielding" },
      { name: "Mid Wicket", x: 22, y: 38, role: "Fielding" },
      { name: "Square Leg", x: 18, y: 60, role: "Fielding" },
      { name: "Fine Leg", x: 35, y: 82, role: "Fielding" },
    ],
    batsmen: [
      {
        name: "Virat Kohli",
        runs: 88,
        balls: 94,
        fours: 7,
        sixes: 1,
        sr: 93.61,
      },
      {
        name: "Rohit Sharma",
        runs: 64,
        balls: 58,
        fours: 8,
        sixes: 2,
        sr: 110.34,
      },
    ],
    bowler: { name: "Pat Cummins", overs: "8.2", runs: 42, wickets: 2 },
  },
  "cricket-2": {
    id: "cricket-2",
    homeTeam: "England",
    awayTeam: "Pakistan",
    homeScore: "312/8",
    awayScore: "295/all out",
    date: "Yesterday",
    venue: "Lord's Cricket Ground",
    status: "FT",
    tournament: "International Test Series",
    crr: "4.15",
    overs: "85.0",
    homeBadge: "https://flagcdn.com/w80/gb-eng.png", // England Flag
    awayBadge: "https://flagcdn.com/w80/pk.png", // Pakistan Flag
    fielders: [
      { name: "Wicketkeeper", x: 50, y: 85, role: "WK" },
      { name: "Slip 1", x: 57, y: 82, role: "Slip" },
      { name: "Slip 2", x: 62, y: 79, role: "Slip" },
      { name: "Gully", x: 70, y: 72, role: "Fielding" },
      { name: "Point", x: 80, y: 52, role: "Fielding" },
      { name: "Mid Off", x: 58, y: 20, role: "Fielding" },
      { name: "Mid On", x: 42, y: 20, role: "Fielding" },
      { name: "Square Leg", x: 20, y: 58, role: "Fielding" },
    ],
    batsmen: [
      {
        name: "Joe Root",
        runs: 112,
        balls: 164,
        fours: 12,
        sixes: 0,
        sr: 68.29,
      },
      {
        name: "Ben Stokes",
        runs: 55,
        balls: 48,
        fours: 6,
        sixes: 3,
        sr: 114.58,
      },
    ],
    bowler: { name: "Shaheen Afridi", overs: "18.0", runs: 74, wickets: 4 },
  },
  "cricket-3": {
    id: "cricket-3",
    homeTeam: "South Africa",
    awayTeam: "New Zealand",
    homeScore: "0/0",
    awayScore: "0/0",
    date: "Tomorrow, 10:00",
    venue: "Newlands, Cape Town",
    status: "UPCOMING",
    tournament: "T20 Tri-Series",
    crr: "0.00",
    overs: "0.0",
    homeBadge: "https://flagcdn.com/w80/za.png", // South Africa Flag
    awayBadge: "https://flagcdn.com/w80/nz.png", // New Zealand Flag
    fielders: [
      { name: "Wicketkeeper", x: 50, y: 85, role: "WK" },
      { name: "Point", x: 80, y: 52, role: "Fielding" },
      { name: "Cover", x: 72, y: 32, role: "Fielding" },
      { name: "Mid Off", x: 58, y: 20, role: "Fielding" },
      { name: "Mid On", x: 42, y: 20, role: "Fielding" },
      { name: "Mid Wicket", x: 25, y: 35, role: "Fielding" },
      { name: "Square Leg", x: 20, y: 58, role: "Fielding" },
    ],
    batsmen: [
      { name: "Quinton de Kock", runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0 },
      { name: "Aiden Markram", runs: 0, balls: 0, fours: 0, sixes: 0, sr: 0 },
    ],
    bowler: { name: "Trent Boult", overs: "0.0", runs: 0, wickets: 0 },
  },
};

const CRICKET_NEWS = [
  {
    badge: "PITCH REPORT",
    headline: "Dry surface expected to favour spin in middle overs",
    summary:
      "Ground staff report uneven bounce which could trouble batsmen playing cross-bat shots.",
  },
  {
    badge: "TEAM NEWS",
    headline: "Extra pace bowler added to squad for afternoon spell",
    summary:
      "Captains hint at tactical changes to capitalize on early moisture and swinging conditions.",
  },
  {
    badge: "WEATHER UPDATE",
    headline: "Clear skies forecasted for remainder of the fixture",
    summary:
      "Humidity levels dropping, favoring stroke-play in the death overs.",
  },
];

export default function CricketPage() {
  const { matchId } = useParams<{ matchId?: string }>();
  const navigate = useNavigate();

  const activeId =
    matchId && MOCK_CRICKET_MATCHES[matchId] ? matchId : "cricket-1";
  const matchDetails = MOCK_CRICKET_MATCHES[activeId];

  const [coachPrompt, setCoachPrompt] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [tactics, setTactics] = useState<{
    problem: string;
    action: string;
    confidence: number;
  } | null>(null);

  useEffect(() => {
    setTactics(null);
  }, [activeId]);

  const handleAnalyze = async (): Promise<void> => {
    setAnalyzing(true);
    setTactics(null);

    setTimeout(() => {
      setTactics({
        problem: `Scoring rate slowing down in the middle overs against tight spin attack at ${matchDetails.venue}.`,
        action:
          "Introduce sweeping options and accelerate strike rotation into deep mid-wicket gaps.",
        confidence: 94,
      });
      setAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="w-full flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Navigation header & Back to dashboard */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard Hub
        </button>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          🏏 Cricket Tactical Portal
        </span>
      </div>

      {/* Live Cricket News Feed */}
      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Live Cricket News & Wicket Stream
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CRICKET_NEWS.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md"
            >
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
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

      {/* Match Selector */}
      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Select Cricket Match Fixture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(MOCK_CRICKET_MATCHES).map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/cricket/${m.id}`)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activeId === m.id
                  ? "bg-amber-950/30 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2">
                <span>{m.date}</span>
                <span className="font-mono font-bold uppercase text-amber-400">
                  {m.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-5 rounded overflow-hidden shadow-sm border border-slate-700/50 shrink-0 bg-slate-900 flex items-center justify-center">
                    <img
                      src={m.homeBadge}
                      className="w-full h-full object-cover"
                      alt={m.homeTeam}
                    />
                  </div>
                  <span className="font-bold text-xs truncate max-w-[80px]">
                    {m.homeTeam}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold px-1">
                  vs
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs truncate max-w-[80px] text-right">
                    {m.awayTeam}
                  </span>
                  <div className="w-7 h-5 rounded overflow-hidden shadow-sm border border-slate-700/50 shrink-0 bg-slate-900 flex items-center justify-center">
                    <img
                      src={m.awayBadge}
                      className="w-full h-full object-cover"
                      alt={m.awayTeam}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Match Centre */}
      {matchDetails && (
        <section className="space-y-6">
          {/* Cricket Ribbon Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            {/* Home Team Card */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden shadow-md border-2 border-amber-500/40 bg-slate-900 flex items-center justify-center shrink-0">
                <img
                  src={matchDetails.homeBadge}
                  className="w-full h-full object-cover"
                  alt={matchDetails.homeTeam}
                />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  {matchDetails.homeTeam}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  CRR: {matchDetails.crr}
                </span>
              </div>
            </div>

            {/* Score & Venue Info */}
            <div className="text-center">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-bold">
                OVERS {matchDetails.overs}
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono text-white my-1">
                {matchDetails.homeScore}
              </div>
              <span className="text-[11px] text-slate-400">
                {matchDetails.venue} • {matchDetails.tournament}
              </span>
            </div>

            {/* Away Team Card */}
            <div className="flex items-center gap-4 flex-row-reverse md:flex-row">
              <div className="text-left md:text-right">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {matchDetails.awayTeam}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {matchDetails.awayScore}
                </span>
              </div>
              <div className="w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden shadow-md border-2 border-amber-500/40 bg-slate-900 flex items-center justify-center shrink-0">
                <img
                  src={matchDetails.awayBadge}
                  className="w-full h-full object-cover"
                  alt={matchDetails.awayTeam}
                />
              </div>
            </div>
          </div>

          {/* AI Field Advisor Control Section */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Field Strategy & Coach Advisor
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Powered by Llama 3 Telemetry
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ask coach strategy (e.g., 'How to breakthrough against left-arm spin?')"
                value={coachPrompt}
                onChange={(e) => setCoachPrompt(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Field...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run AI Analysis
                  </>
                )}
              </button>
            </div>

            {tactics && (
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                    Match Vulnerability & Insights
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Confidence: {tactics.confidence}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {tactics.problem}
                </p>
                <div className="pt-2 border-t border-slate-900 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-emerald-400">
                    {tactics.action}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Oval Field Visualizer + Live Batting Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Batting Performance
              </h3>

              <div className="space-y-2">
                {matchDetails.batsmen?.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.runs} ({b.balls}) • 4s:{b.fours} 6s:{b.sixes}
                      </div>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">
                      SR {b.sr}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pt-2">
                Bowler on Strike
              </h3>
              {matchDetails.bowler && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">
                      {matchDetails.bowler.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {matchDetails.bowler.overs} ov •{" "}
                      {matchDetails.bowler.runs} runs
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    {matchDetails.bowler.wickets} Wkts
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
