import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function Background({ children, className = "" }: BackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full bg-slate-950 ${className}`}>
      {/* Background Ambience & Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient Gradient Blobs (Dual Corner Light Bleed) */}
        <div
          className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(56, 189, 248, 0.2) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 75%)",
          }}
        />

        {/* Micro-Dot Matrix Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Multi-layered Vector Ribbon & Organic Curves */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <defs>
            {/* Primary violet-to-cyan gradient curve */}
            <linearGradient id="curveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </linearGradient>

            {/* Secondary warm accent curve */}
            <linearGradient id="curveGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.0" />
            </linearGradient>

            {/* Soft wave fill underbelly */}
            <linearGradient id="fillGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill behind the primary wave */}
          <path
            d="M -100 220 C 350 420, 680 80, 1150 380 C 1320 480, 1480 320, 1550 280 L 1550 0 L -100 0 Z"
            fill="url(#fillGrad)"
          />

          {/* Ribbon Wave 1 - Main Highlight */}
          <path
            d="M -100 220 C 350 420, 680 80, 1150 380 C 1320 480, 1480 320, 1550 280"
            stroke="url(#curveGrad1)"
            strokeWidth="2"
            fill="none"
          />

          {/* Ribbon Wave 1 - Parallel echo harmonic line */}
          <path
            d="M -100 250 C 360 450, 690 110, 1160 410 C 1330 510, 1490 350, 1550 310"
            stroke="url(#curveGrad1)"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            className="opacity-40"
            fill="none"
          />

          {/* Cross Ribbon Curve 2 */}
          <path
            d="M -50 680 C 320 840, 620 460, 1050 660 C 1260 760, 1420 590, 1550 560"
            stroke="url(#curveGrad2)"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Fine structural contour lines */}
          <path
            d="M -80 480 C 260 360, 580 640, 980 420 C 1200 300, 1440 440, 1550 400"
            stroke="#334155"
            strokeWidth="1"
            className="opacity-25"
            fill="none"
          />

          <path
            d="M 100 -50 C 280 350, 480 600, 850 890"
            stroke="#475569"
            strokeWidth="0.8"
            strokeDasharray="6 6"
            className="opacity-20"
            fill="none"
          />

          <path
            d="M 1350 -50 C 1200 300, 1020 550, 780 920"
            stroke="#475569"
            strokeWidth="0.8"
            strokeDasharray="4 10"
            className="opacity-15"
            fill="none"
          />

          {/* Minimalist Intersection Node Rings & Orbit Dots */}
          <g className="opacity-60">
            {/* Top intersection cluster */}
            <circle cx="680" cy="80" r="3" fill="#38bdf8" />
            <circle
              cx="680"
              cy="80"
              r="8"
              stroke="#38bdf8"
              strokeWidth="0.8"
              fill="none"
              className="opacity-40"
            />

            {/* Middle crest node */}
            <circle cx="1150" cy="380" r="2.5" fill="#a78bfa" />
            <circle
              cx="1150"
              cy="380"
              r="7"
              stroke="#a78bfa"
              strokeWidth="0.8"
              strokeDasharray="2 3"
              fill="none"
              className="opacity-50"
            />

            {/* Bottom swoop node */}
            <circle cx="620" cy="460" r="2.5" fill="#38bdf8" />

            {/* Loose satellite dots */}
            <circle
              cx="350"
              cy="420"
              r="1.5"
              fill="#94a3b8"
              className="opacity-40"
            />
            <circle
              cx="1050"
              cy="660"
              r="2"
              fill="#c084fc"
              className="opacity-50"
            />
            <circle
              cx="1320"
              cy="480"
              r="1.5"
              fill="#94a3b8"
              className="opacity-30"
            />
          </g>
        </svg>

        {/* Perimeter Vignette to anchor center viewports */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/70" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
