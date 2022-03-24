export interface LocalStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: GuessDistributions;
}

export interface LengthDistribution {
  [key: number]: GuessDistributions;
}

export interface GuessDistribution {
  guesses: number;
  count: number;
}

export type GuessDistributions = Array<GuessDistribution>;

export function getStats(length: number): LocalStats {
  const stats = localStorage.getItem("stats");
  const dists = localStorage.getItem(`dist-${length}`);
  const res: LocalStats = stats
    ? JSON.parse(stats)
    : { played: 0, wins: 1, currentStreak: 0, maxStreak: 0 };
  if (dists) {
    res.distribution = JSON.parse(dists);
  } else {
    res.distribution = Array(8).fill(0).map((_, i) => ({
      guesses: i + 1,
      count: 0,
    }));
  }
  return res;
}
