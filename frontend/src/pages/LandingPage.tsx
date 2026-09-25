import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/animations/PageTransition";
import { Button } from "../components/ui/Button";
import {
  ArrowRight,
  Activity,
  Cpu,
  Database,
  ShieldCheck,
  TrendingUp,
  Zap,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Background } from "../components/ui/Background";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="relative w-full flex-1 flex flex-col items-center overflow-hidden">
        {/* Colorful dynamic background mesh */}
        <Background />
        {/* Hero Section */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
          {/* Active Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-sky-400/30 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md text-xs font-medium text-slate-200 shadow-lg shadow-sky-500/10 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles size={13} className="text-sky-400 inline" /> Smart Match
              Breakdown
            </span>
          </motion.div>

          {/* Punchy Colorful Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.12]"
          >
            Turn match stats into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
              game-winning
            </span>{" "}
            decisions.
          </motion.h1>

          {/* Human, approachable subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal"
          >
            Stop drowning in raw numbers. StatSprint watches possession changes,
            stamina drops, and passing errors to tell you what needs fixing
            right now.
          </motion.p>

          {/* Action Button Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-xl shadow-sky-500/25 border-0"
            >
              Start Analyzing Matches
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Activity size={18} className="text-emerald-400" />}
              iconPosition="left"
              onClick={() => navigate("/deployments")}
              className="bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600"
            >
              See Sample Games
            </Button>
          </motion.div>

          {/* Live Metric Cards with Gradient Accent Tops */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 w-full max-w-4xl text-left">
            {[
              {
                label: "Instant answers",
                value: "< 1 sec",
                icon: Zap,
                color: "text-amber-400",
                border: "from-amber-400/40",
              },
              {
                label: "Pre-loaded games",
                value: "50+ Matches",
                icon: Cpu,
                color: "text-sky-400",
                border: "from-sky-400/40",
              },
              {
                label: "Stat accuracy",
                value: "99.8%",
                icon: ShieldCheck,
                color: "text-emerald-400",
                border: "from-emerald-400/40",
              },
              {
                label: "Tracked moments",
                value: "18 Per Play",
                icon: TrendingUp,
                color: "text-pink-400",
                border: "from-pink-400/40",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                className="relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md overflow-hidden group hover:border-slate-700 transition-all"
              >
                {/* Top accent highlight */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.border} to-transparent`}
                />

                <stat.icon size={18} className={`${stat.color} mb-3`} />
                <div className="text-2xl font-bold tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-14 border-t border-slate-800/80">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Everything you need when the game is on the line
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Clear, practical advice built for quick decisions during live
              halves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-slate-800 hover:border-sky-500/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                  <Zap size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Fix Problems Fast
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Trailing at half-time? See instantly where your formation is
                  breaking down and get two clear tactical changes to test.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/50">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  iconPosition="right"
                  onClick={() => navigate("/dashboard")}
                >
                  Try an example
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Activity size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Spot Tired Players
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Notice sprint speeds dropping before a costly mistake happens
                  so you can make substitutions at the right minute.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/50">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  iconPosition="right"
                  onClick={() => navigate("/dashboard")}
                >
                  See player charts
                </Button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/30 border border-slate-800 hover:border-purple-500/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Database size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Save Your Match History
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Every tactic, advice slip, and game snapshot is saved straight
                  to Firebase so your team can review past matches anytime.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/50">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowRight size={14} />}
                  iconPosition="right"
                  onClick={() => navigate("/deployments")}
                >
                  View saved games
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tactical Quick-Callout Banner */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 mb-12">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">
                Down a goal in the 70th minute?
              </h3>
              <p className="text-slate-400 text-sm">
                Pick a match scenario and see what adjustment StatSprint
                recommends right now.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="md"
                icon={<Layers size={16} />}
                iconPosition="left"
                onClick={() => navigate("/deployments")}
              >
                Saved Games
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<Play size={16} />}
                iconPosition="left"
                onClick={() => navigate("/dashboard")}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold border-0"
              >
                Test a Scenario
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
