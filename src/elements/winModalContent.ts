interface WinModalContentOptions {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  content: HTMLElement
}

const statsTiles = [
  { display: "Played", value: "played" },
  { display: "Wins", value: "wins" },
  { display: "Current Streak", value: "currentStreak" },
  { display: "Max Streak", value: "maxStreak" },
];

export default function generateWinContent(
  options: WinModalContentOptions
): HTMLElement {
  const winContent = document.createElement("div");
  const statsRow = document.createElement("div");
  statsRow.classList.add("stats-row");
  statsTiles.forEach((tile) => {
    const stat = document.createElement("div");
    stat.classList.add("stat");
    stat.textContent = `${tile.display}: ${options[tile.value]}`;
    statsRow.append(stat);
  });
  winContent.append(statsRow);
  return winContent;
}
