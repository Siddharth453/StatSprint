import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import router hook
import { PageTransition } from "../components/animations/PageTransition";
import {
  Flame,
  Radio,
  Search,
  Bell,
  ArrowUpRight,
  MapPin,
  Trophy,
} from "lucide-react";

interface MatchPreview {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string;
  awayScore?: string;
  date: string;
  venue: string;
  sport: "football" | "cricket";
  status: "LIVE" | "UPCOMING" | "FT";
  tournament: string;
}

interface NewsItem {
  id: number;
  badge: string;
  headline: string;
  summary: string;
  time: string;
}

const ALL_MATCHES: MatchPreview[] = [
  // Football
  {
    id: "match-1",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    homeScore: "2",
    awayScore: "1",
    date: "Today, 20:00",
    venue: "Emirates Stadium",
    sport: "football",
    status: "LIVE",
    tournament: "Premier League",
  },
  {
    id: "match-2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeScore: "1",
    awayScore: "1",
    date: "Yesterday",
    venue: "Santiago Bernabéu",
    sport: "football",
    status: "FT",
    tournament: "El Clásico / La Liga",
  },
  {
    id: "match-3",
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    date: "Tomorrow, 18:30",
    venue: "Allianz Arena",
    sport: "football",
    status: "UPCOMING",
    tournament: "DFB-Pokal Final",
  },
  // Cricket
  {
    id: "cricket-1",
    homeTeam: "India",
    awayTeam: "Australia",
    homeScore: "284/6",
    awayScore: "210/4 (38.2 ov)",
    date: "Today, 14:00",
    venue: "Melbourne Cricket Ground",
    sport: "cricket",
    status: "LIVE",
    tournament: "ICC ODI World Series",
  },
  {
    id: "cricket-2",
    homeTeam: "England",
    awayTeam: "Pakistan",
    homeScore: "312/8",
    awayScore: "295/all out",
    date: "Yesterday",
    venue: "Lord's Cricket Ground",
    sport: "cricket",
    status: "FT",
    tournament: "International Test Series",
  },
  {
    id: "cricket-3",
    homeTeam: "South Africa",
    awayTeam: "New Zealand",
    date: "Tomorrow, 10:00",
    venue: "Newlands, Cape Town",
    sport: "cricket",
    status: "UPCOMING",
    tournament: "T20 Tri-Series",
  },
];

const NEWS_FEED: NewsItem[] = [
  {
    id: 1,
    badge: "TACTICS",
    headline: "High press effectiveness up 14% across top leagues",
    summary:
      "Teams utilizing man-oriented pressing in the middle third are turning over possession faster.",
    time: "4m ago",
  },
  {
    id: 2,
    badge: "PITCH REPORT",
    headline: "Dry surface expected to favour spin in middle overs",
    summary:
      "Ground staff report uneven bounce which could trouble batsmen playing cross-bat shots.",
    time: "12m ago",
  },
  {
    id: 3,
    badge: "AI INSIGHT",
    headline: "Low block penetration metrics analyzed via tracking data",
    summary:
      "Recent simulations show increased scoring success rates when utilizing overlapping fullbacks.",
    time: "1h ago",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [activeCategory, setActiveCategory] = useState<
    "all" | "football" | "cricket"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredMatches = ALL_MATCHES.filter((m) => {
    const matchesSport = activeCategory === "all" || m.sport === activeCategory;
    const matchesSearch =
      m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const handleMatchClick = (match: MatchPreview) => {
    if (match.sport === "cricket") {
      navigate(`/cricket/${match.id}`);
    } else {
      navigate(`/football/${match.id}`);
    }
  };

  return (
    <PageTransition>
      <div className="w-full flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 pb-16">
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Radio className="text-slate-950 w-5 h-5 animate-pulse" />
              </div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                StatSprint
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HUB
                </span>
              </span>
            </div>

            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "all"
                    ? "bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Sports
              </button>
              <button
                onClick={() => setActiveCategory("football")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "football"
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ⚽ Football
              </button>
              <button
                onClick={() => setActiveCategory("cricket")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === "cricket"
                    ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🏏 Cricket
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fixtures..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                Live Sports Wire & Tactical Reports
              </h2>
              <span className="text-xs text-amber-400 font-mono">
                Real-Time Telemetry Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {NEWS_FEED.map((news) => (
                <div
                  key={news.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40 text-amber-400 bg-amber-500/10">
                      {news.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {news.time}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">
                    {news.headline}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {news.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-sky-400" />
                Featured Fixtures & Match Portals
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Showing {filteredMatches.length} events
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => {
                const isLive = match.status === "LIVE";
                const isFootball = match.sport === "football";

                return (
                  <div
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className="group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-600 transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-500/5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                          {isFootball ? "⚽" : "🏏"} {match.tournament}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            isLive
                              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
                              : match.status === "UPCOMING"
                                ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                                : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>

                      <div className="py-2 space-y-2">
                        <div className="flex items-center justify-between font-bold text-sm text-white">
                          <span className="truncate group-hover:text-amber-400 transition-colors">
                            {match.homeTeam}
                          </span>
                          <span className="font-mono text-xs text-slate-300">
                            {match.homeScore ?? "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-sm text-white">
                          <span className="truncate group-hover:text-amber-400 transition-colors">
                            {match.awayTeam}
                          </span>
                          <span className="font-mono text-xs text-slate-300">
                            {match.awayScore ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-3 truncate">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                          <span className="truncate">{match.venue}</span>
                        </span>
                      </div>
                      <span className="flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0">
                        Open Portal <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
}
