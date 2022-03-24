import elem from "../util/element";

interface WinModalContentOptions {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
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
    const statBox = document.createElement("div");
    const statLabel = document.createElement("div");
    const statValue = document.createElement("div");
    statBox.classList.add("stats-box");
    statLabel.textContent = `${tile.display}:`;
    statValue.textContent = `${options[tile.value]}`;
    statLabel.classList.add("stats-label");
    statValue.classList.add("stats-value");
    statBox.appendChild(statLabel);
    statBox.appendChild(statValue);
    statsRow.appendChild(statBox);
  });
  winContent.append(statsRow);
  return winContent;
}

export function generateModalButtons(
  newGame: () => void,
  again: () => void
): HTMLElement {
  document.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "modal-again") {
      again();
    } else if ((e.target as HTMLElement).id === "modal-new") {
      newGame();
    }
  });
  return elem("div", { class: "modal-buttons" }, [
    elem("button", { id: "modal-again" }, ["Play Again"]),
    elem("button", { id: "modal-new" }, ["New Game"]),
  ]);
}
