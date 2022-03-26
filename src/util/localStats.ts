export interface LocalStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: GuessDistributions;
}

export interface GuessDistributions {
  [key: number]: number;
}
export async function getStats(
  length: number,
  difficulty: number
): Promise<LocalStats> {
  const stats = localStorage.getItem("stats");
  const dists = localStorage.getItem(
    `dist-${length}-${difficulty}`
  );
  const res: LocalStats = stats
    ? await JSON.parse(stats)
    : { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };
  if (dists) {
    console.log("dist", dists);
    res.distribution = await JSON.parse(dists);
  } else {
    res.distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0};
  }
  return res;
}

export async function setStats(
  length: number,
  difficulty: number,
  stats: LocalStats
) {
  const dist = stats.distribution;
  delete stats.distribution;
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem(
    `dist-${length}-${difficulty}`,
    JSON.stringify(dist)
  );
}
