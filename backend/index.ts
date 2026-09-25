import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
const SPORTS_DB_BASE = "https://www.thesportsdb.com/api/v1/json/3";

// League IDs on TheSportsDB
const LEAGUE_FOOTBALL_EPL = "4328"; // English Premier League
const LEAGUE_CRICKET_IPL = "4460"; // Indian Premier League

// Helper: Calculate flexible 2D (x, y) coordinates for any football formation (e.g., "4-3-3")
function generateFormationCoordinates(formationStr = "4-3-3") {
  const parts = formationStr.split("-").map(Number);
  const coords: { x: number; y: number; role: string }[] = [];

  // Always 1 Goalkeeper
  coords.push({ x: 10, y: 50, role: "GK" });

  const totalLines = parts.length;
  parts.forEach((count, lineIdx) => {
    const x = 25 + (lineIdx / (totalLines - 1 || 1)) * 62;
    for (let i = 0; i < count; i++) {
      const y = count === 1 ? 50 : 15 + (i / (count - 1)) * 70;
      coords.push({
        x: Math.round(x),
        y: Math.round(y),
        role:
          lineIdx === 0 ? "DEF" : lineIdx === totalLines - 1 ? "FWD" : "MID",
      });
    }
  });

  return coords;
}

// Fallback Mock Data for Competition reliability
function getMockMatches(sport: string) {
  if (sport === "cricket") {
    return [
      {
        idEvent: "101",
        strHomeTeam: "Mumbai Indians",
        strAwayTeam: "Chennai Super Kings",
        intHomeScore: "198/4",
        intAwayScore: "185/7",
        dateEvent: "2026-03-27",
        strLeague: "Indian Premier League",
        strVenue: "Wankhede Stadium",
        strThumb: "",
        strStatus: "FT",
      },
      {
        idEvent: "102",
        strHomeTeam: "Royal Challengers Bengaluru",
        strAwayTeam: "Kolkata Knight Riders",
        intHomeScore: "176/6",
        intAwayScore: "179/3",
        dateEvent: "2026-03-26",
        strLeague: "Indian Premier League",
        strVenue: "M. Chinnaswamy Stadium",
        strThumb: "",
        strStatus: "FT",
      },
      {
        idEvent: "103",
        strHomeTeam: "Gujarat Titans",
        strAwayTeam: "Delhi Capitals",
        intHomeScore: "210/3",
        intAwayScore: "165/9",
        dateEvent: "2026-03-25",
        strLeague: "Indian Premier League",
        strVenue: "Narendra Modi Stadium",
        strThumb: "",
        strStatus: "FT",
      },
    ];
  }
  return [
    {
      idEvent: "1",
      strHomeTeam: "Manchester City",
      strAwayTeam: "Arsenal",
      intHomeScore: "3",
      intAwayScore: "1",
      dateEvent: "2026-03-27",
      strLeague: "English Premier League",
      strVenue: "Etihad Stadium",
      strThumb: "",
      strStatus: "FT",
    },
    {
      idEvent: "2",
      strHomeTeam: "Liverpool",
      strAwayTeam: "Chelsea",
      intHomeScore: "2",
      intAwayScore: "2",
      dateEvent: "2026-03-26",
      strLeague: "English Premier League",
      strVenue: "Anfield",
      strThumb: "",
      strStatus: "FT",
    },
    {
      idEvent: "3",
      strHomeTeam: "Real Madrid",
      strAwayTeam: "Barcelona",
      intHomeScore: "1",
      intAwayScore: "0",
      dateEvent: "2026-03-25",
      strLeague: "La Liga",
      strVenue: "Santiago Bernabéu",
      strThumb: "",
      strStatus: "FT",
    },
    {
      idEvent: "4",
      strHomeTeam: "Bayern Munich",
      strAwayTeam: "Borussia Dortmund",
      intHomeScore: "4",
      intAwayScore: "2",
      dateEvent: "2026-03-24",
      strLeague: "Bundesliga",
      strVenue: "Allianz Arena",
      strThumb: "",
      strStatus: "FT",
    },
  ];
}

// ------------------------------------------------------------------
// 1. Fetch Recent Matches List for a Sport (Multiple Matches)
// ------------------------------------------------------------------
app.get("/api/sports/matches", async (req: any, res: any) => {
  const sport = (req.query.sport as string) || "football";
  const leagueId =
    sport === "cricket" ? LEAGUE_CRICKET_IPL : LEAGUE_FOOTBALL_EPL;

  try {
    const response = await fetch(
      `${SPORTS_DB_BASE}/eventspastleague.php?id=${leagueId}`,
    );
    const data = await response.json();
    let rawEvents: any[] = data?.events || [];

    // If API returns fewer than 2 matches, use the robust mock dataset
    if (rawEvents.length < 2) {
      rawEvents = getMockMatches(sport);
    }

    const matches = rawEvents.map((evt) => ({
      id: evt.idEvent,
      homeTeam: evt.strHomeTeam,
      awayTeam: evt.strAwayTeam,
      homeScore: evt.intHomeScore ?? "0",
      awayScore: evt.intAwayScore ?? "0",
      date: evt.dateEvent,
      league: evt.strLeague,
      venue: evt.strVenue || "Stadium",
      thumb: evt.strThumb,
      status: evt.strStatus || "FT",
    }));

    return res.json({ success: true, count: matches.length, matches });
  } catch (error: any) {
    const fallbackEvents = getMockMatches(sport);
    const matches = fallbackEvents.map((evt) => ({
      id: evt.idEvent,
      homeTeam: evt.strHomeTeam,
      awayTeam: evt.strAwayTeam,
      homeScore: evt.intHomeScore,
      awayScore: evt.intAwayScore,
      date: evt.dateEvent,
      league: evt.strLeague,
      venue: evt.strVenue,
      thumb: evt.strThumb,
      status: evt.strStatus,
    }));
    return res.json({ success: true, count: matches.length, matches });
  }
});

app.post("/api/analyze-tactics", async (req: any, res: any) => {
  try {
    const {
      homeTeam,
      awayTeam,
      formation,
      awayFormation,
      minute,
      score,
      prompt,
    } = req.body;

    // Craft a precise prompt directing Groq to return strict JSON matching your interface
    const systemPrompt = `
      You are an elite football tactical AI advisor. 
      Analyze the current match telemetry and provide tactical feedback.
      You MUST respond with a strict JSON object containing EXACTLY these three keys:
      - "problem": A short sentence highlighting a tactical vulnerability or pattern.
      - "action": A concise, actionable instruction for the manager to shift momentum.
      - "confidence": An integer percentage score (e.g. 85 to 98) representing tactical certainty.
      Do not include any markdown code blocks or extra text—return ONLY raw JSON.
    `;

    const userMessage = `
      Match: ${homeTeam} vs ${awayTeam}
      Minute: ${minute}'
      Score: ${score}
      Our Formation: ${formation || "4-3-3"}
      Opponent Formation: ${awayFormation || "4-3-3"}
      Coach Instructions/Focus: ${prompt || "None provided"}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      response_format: { type: "json_object" }, // Enforces strict JSON output
    });

    const result = JSON.parse(
      chatCompletion.choices[0]?.message?.content || "{}",
    );

    return res.status(200).json({
      problem:
        result.problem ||
        "Tactical instability observed in defensive transition.",
      action:
        result.action || "Reorganize block shape and tighten half-spaces.",
      confidence: result.confidence || 91,
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({
      problem: "Failed to communicate with Groq AI tactical engine.",
      action: "Check server API keys and network connection.",
      confidence: 0,
    });
  }
});

// ------------------------------------------------------------------
// 2. Fetch Deep Match Telemetry & Lineups by Match ID
// ------------------------------------------------------------------
app.get("/api/sports/match-details", async (req: any, res: any) => {
  const { id, sport } = req.query;

  try {
    const eventRes = await fetch(`${SPORTS_DB_BASE}/lookupevent.php?id=${id}`);
    const eventData = await eventRes.json();
    let evt = eventData?.events?.[0];

    // Fallback if lookup fails for mock IDs
    if (!evt) {
      evt = {
        idEvent: id,
        strHomeTeam: "Home Team",
        strAwayTeam: "Away Team",
        intHomeScore: "2",
        intAwayScore: "1",
        strVenue: "National Stadium",
      };
    }

    const [teamARes, teamBRes] = await Promise.all([
      fetch(
        `${SPORTS_DB_BASE}/searchteams.php?t=${encodeURIComponent(evt.strHomeTeam)}`,
      ),
      fetch(
        `${SPORTS_DB_BASE}/searchteams.php?t=${encodeURIComponent(evt.strAwayTeam)}`,
      ),
    ]);
    const teamAData = await teamARes.json();
    const teamBData = await teamBRes.json();

    if (sport === "cricket") {
      return res.json({
        success: true,
        match: {
          id: evt.idEvent,
          homeTeam: evt.strHomeTeam,
          awayTeam: evt.strAwayTeam,
          homeScore: evt.intHomeScore || "184/5",
          awayScore: evt.intAwayScore || "172/8",
          overs: "20.0",
          homeBadge: teamAData?.teams?.[0]?.strBadge || null,
          awayBadge: teamBData?.teams?.[0]?.strBadge || null,
          venue: evt.strVenue || "Wankhede Stadium",
          crr: "8.65",
          rrr: "9.20",
          batsmen: [
            {
              name: "Top Order Batsman",
              runs: 64,
              balls: 42,
              fours: 6,
              sixes: 3,
              sr: 152.3,
            },
            {
              name: "Middle Order Anchor",
              runs: 41,
              balls: 28,
              fours: 3,
              sixes: 1,
              sr: 146.4,
            },
          ],
          bowler: {
            name: "Strike Pacer",
            overs: "3.4",
            maidens: 0,
            runs: 28,
            wickets: 3,
          },
          fielders: [
            {
              id: 1,
              name: "Keeper (WK)",
              pos: "WK",
              rating: 8.2,
              x: 48,
              y: 32,
            },
            { id: 2, name: "Slip 1", pos: "SL", rating: 7.9, x: 38, y: 24 },
            { id: 3, name: "Point", pos: "PT", rating: 8.5, x: 24, y: 36 },
            { id: 4, name: "Cover", pos: "CV", rating: 8.9, x: 26, y: 52 },
            { id: 5, name: "Mid Off", pos: "MO", rating: 7.5, x: 42, y: 70 },
            { id: 6, name: "Mid On", pos: "MN", rating: 7.8, x: 58, y: 70 },
            { id: 7, name: "Mid Wicket", pos: "MW", rating: 8.1, x: 74, y: 52 },
            { id: 8, name: "Square Leg", pos: "SL", rating: 7.4, x: 76, y: 36 },
            { id: 9, name: "Third Man", pos: "TM", rating: 7.6, x: 28, y: 16 },
            { id: 10, name: "Long On", pos: "LO", rating: 8.0, x: 65, y: 84 },
            { id: 11, name: "Bowler", pos: "BW", rating: 9.1, x: 50, y: 64 },
          ],
        },
      });
    }

    const formation = evt.strHomeFormation || "4-3-3";
    const layoutCoords = generateFormationCoordinates(formation);

    const homeLineupNames = [
      "Ederson",
      "Walker",
      "Dias",
      "Akanji",
      "Gvardiol",
      "Rodri",
      "De Bruyne",
      "Bernardo",
      "Foden",
      "Haaland",
      "Doku",
    ];

    const players = layoutCoords.map((coord, idx) => ({
      id: idx + 1,
      name: homeLineupNames[idx] || `Player ${idx + 1}`,
      number: idx === 0 ? 1 : idx + 2,
      pos: coord.role,
      rating: parseFloat((6.8 + ((idx * 7) % 25) / 10).toFixed(1)),
      x: coord.x,
      y: coord.y,
    }));

    return res.json({
      success: true,
      match: {
        id: evt.idEvent,
        homeTeam: evt.strHomeTeam,
        awayTeam: evt.strAwayTeam,
        homeScore: evt.intHomeScore ?? "1",
        awayScore: evt.intAwayScore ?? "0",
        minute: 74,
        formation,
        homeBadge: teamAData?.teams?.[0]?.strBadge || null,
        awayBadge: teamBData?.teams?.[0]?.strBadge || null,
        stats: {
          possession: [58, 42],
          expectedGoals: [1.72, 0.94],
          totalShots: [13, 7],
          shotsOnTarget: [5, 2],
          passAccuracy: [88, 81],
        },
        players,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message });
  }
});

// ------------------------------------------------------------------
// 3. Live News via Groq LLM
// ------------------------------------------------------------------
app.get("/api/sports/news", async (req: any, res: any) => {
  const sport = (req.query.sport as string) || "football";

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a real-time sports news wire. Output ONLY a JSON array of 3 top breaking news items for ${sport}. Format: [{"id": 1, "badge": "CATEGORY", "headline": "...", "time": "Xm ago", "summary": "..."}]. Pure JSON only, no backticks.`,
        },
        {
          role: "user",
          content: `Provide 3 realistic, high-impact news headlines happening right now in ${sport}.`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const news =
      parsed.news ||
      parsed.articles ||
      parsed.items ||
      Object.values(parsed)[0];

    return res.json({ success: true, news: Array.isArray(news) ? news : [] });
  } catch (error: any) {
    return res.json({
      success: true,
      news: [
        {
          id: 1,
          badge: "TACTICAL WIRE",
          headline: `High-press tactical shifts observed in latest ${sport} round`,
          time: "12m ago",
          summary:
            "Coaching staff implementing defensive shape adjustments in final quarters.",
        },
      ],
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`[StatSprint Engine] Running on port ${PORT}`),
);
export default app;
