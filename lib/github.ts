// ---------------------------------------------------------------------------
// ProofPay on Rialo – GitHub Activity Integration
// ---------------------------------------------------------------------------

import type { GitHubActivityResult } from "./types";

const GITHUB_API = "https://api.github.com";

/**
 * Fetch public events for a GitHub user and compute a best-effort
 * activity score for the current calendar month.
 */
export async function fetchGitHubActivity(
  username: string,
  token?: string
): Promise<GitHubActivityResult> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ProofPay-Rialo/1.0",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(
    `${GITHUB_API}/users/${username}/events/public?per_page=100`,
    { headers }
  );

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events: any[] = await res.json();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthEvents = events.filter(
    (e) => new Date(e.created_at) >= monthStart
  );

  const pushEvents = monthEvents.filter((e) => e.type === "PushEvent").length;
  const prEvents = monthEvents.filter(
    (e) => e.type === "PullRequestEvent"
  ).length;

  // Weighted composite score: pushes × 1 + PRs × 3
  const activityScore = pushEvents + prEvents * 3;
  const lastEvent = events[0];

  return {
    username,
    totalEvents: monthEvents.length,
    pushEvents,
    prEvents,
    lastEventAt: lastEvent?.created_at ?? null,
    activityScore,
    summary: `${monthEvents.length} events this month (${pushEvents} pushes, ${prEvents} PRs). Score: ${activityScore}.`,
    fetchedAt: Date.now(),
  };
}
