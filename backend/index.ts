import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// TypeScript interfaces for request and response contracts
export interface MatchTelemetryStats {
  possession?: [number, number];
  expectedGoals?: [number, number];
  totalShots?: [number, number];
  shotsOnTarget?: [number, number];
  passAccuracy?: [number, number];
  fouls?: [number, number];
  corners?: [number, number];
}

export interface AnalyzeTacticsRequestBody {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  stats?: MatchTelemetryStats;
  coachPrompt: string;
}

export interface TacticalAnalysisResult {
  problem: string;
  action: string;
  substitutions: string[];
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  analysis?: T;
  latency?: number | null;
  error?: string;
  details?: string;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "healthy", service: "StatSprint Engine (TypeScript)" });
});

/**
 * Tactical Analysis Endpoint
 */
app.post(
  "/api/analyze-tactics",
  async (
    req: Request<{}, {}, AnalyzeTacticsRequestBody>,
    res: Response<ApiResponse<TacticalAnalysisResult>>,
  ) => {
    try {
      const {
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        minute,
        stats,
        coachPrompt,
      } = req.body;

      if (!homeTeam || !awayTeam || !coachPrompt) {
        return res.status(400).json({
          success: false,
          error: "Missing required match telemetry fields or coach prompt.",
        });
      }

      const systemPrompt = `
You are the Lead Tactical Analyst and In-Game Assistant Coach for a top-flight football (soccer) club.
Analyze the live match state and return ONLY a valid JSON object matching the schema below.
Do not wrap your output in markdown code blocks (\`\`\`json). Return raw JSON only.

Schema:
{
  "problem": "One or two sentences pinpointing the exact breakdown in pressing, spacing, or turnover hotspots.",
  "action": "Concrete, actionable formation adjustment or passing corridor instruction.",
  "substitutions": ["Specific role/player tweak 1", "Specific role/player tweak 2"],
  "confidence": <integer between 75 and 96>
}
`;

      const userContent = `
Current Match Situation:
- Fixture: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}
- Match Minute: ${minute}'
- Telemetry:
  * Possession: ${homeTeam} ${stats?.possession?.[0] ?? 50}% - ${stats?.possession?.[1] ?? 50}% ${awayTeam}
  * xG: ${homeTeam} ${stats?.expectedGoals?.[0] ?? 1.0} - ${stats?.expectedGoals?.[1] ?? 1.0} ${awayTeam}
  * Shots on Target: ${homeTeam} ${stats?.shotsOnTarget?.[0] ?? 0} - ${stats?.shotsOnTarget?.[1] ?? 0} ${awayTeam}
  * Pass Accuracy: ${homeTeam} ${stats?.passAccuracy?.[0] ?? 80}% - ${stats?.passAccuracy?.[1] ?? 80}% ${awayTeam}

Coach's On-Field Question/Intent:
"${coachPrompt}"

Generate the tactical fix now based on these metrics.
`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const rawResponse = chatCompletion.choices[0]?.message?.content || "{}";
      const parsedData: TacticalAnalysisResult = JSON.parse(rawResponse);

      return res.status(200).json({
        success: true,
        analysis: parsedData,
        latency: chatCompletion.usage?.total_time || null,
      });
    } catch (error: any) {
      console.error("Groq Analysis Error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to generate tactical analysis",
        details: error?.message || "Unknown error",
      });
    }
  },
);

// Local runner
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[StatSprint Engine TS] Running on http://localhost:${PORT}`);
  });
}

export default app;
