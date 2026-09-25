// src/services/sportsDbService.ts

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

export interface CleanH2HMatch {
  date: string;
  score: string;
  winner: string;
  competition: string;
}

export interface SportsDbTeamInfo {
  name: string;
  badge: string | null;
  stadium: string;
  formedYear: string;
}

/**
 * Searches past encounters / head-to-head directly from TheSportsDB
 */
export async function fetchLiveH2H(
  teamA: string,
  teamB: string,
): Promise<CleanH2HMatch[]> {
  try {
    const query = `${encodeURIComponent(teamA)}_vs_${encodeURIComponent(teamB)}`;
    const response = await fetch(`${BASE_URL}/searchevents.php?e=${query}`);

    if (!response.ok) return [];

    const data = await response.json();
    const events: any[] = data?.event || [];

    if (!events.length) return [];

    return events.slice(0, 4).map((evt) => {
      const homeScore = parseInt(evt.intHomeScore ?? "0", 10);
      const awayScore = parseInt(evt.intAwayScore ?? "0", 10);

      let winner = "Draw";
      if (homeScore > awayScore) winner = evt.strHomeTeam;
      if (awayScore > homeScore) winner = evt.strAwayTeam;

      return {
        date: evt.dateEvent || "Recent",
        score: `${evt.intHomeScore ?? 0} - ${evt.intAwayScore ?? 0}`,
        winner,
        competition: evt.strLeague || "Competitive Match",
      };
    });
  } catch (error) {
    console.warn("TheSportsDB H2H fetch error:", error);
    return [];
  }
}

/**
 * Fetches official team crests/badges
 */
export async function fetchTeamBadge(teamName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.teams?.[0]?.strBadge || null;
  } catch {
    return null;
  }
}
