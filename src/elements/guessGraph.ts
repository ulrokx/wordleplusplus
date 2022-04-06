import elem from "../util/element";
import { GuessDistributions } from "../util/localStats";

const clamp = (
  num: number,
  min: number,
  max: number
): number => {
  return Math.min(Math.max(num, min), max);
};

export const DifficultyEnum = {
  0: "very easy",
  1: "easy",
  2: "less easy",
  3: "moderate",
  4: "more difficult",
  5: "most difficult",
  6: "impossible",
};

export const generateGuessGraph = (
  dist: GuessDistributions,
  length: number,
  difficulty: number,
): HTMLElement => {
  const canvas = elem("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const width = (canvas.width = 400);
  const height = (canvas.height = Object.keys(dist).length * 50);
  const maxCount = Object.values(dist).reduce(
    (a, b) => Math.max(a, b),
    1
  ) as number;

  ctx.font = "22px sans-serif";
  Object.keys(dist).forEach((guess, i) => {
    ctx.fillStyle = "black";
    ctx.fillText(String(guess) + ":", 0, i * 50 + 25);
    ctx.fillStyle = "#8ff7a7";
    const textWidth = ctx.measureText(String(dist[guess])).width;
    const barWidth =
      (dist[guess] / maxCount) * width - textWidth - 10;
    const guessNum = parseInt(guess) - 1;
    ctx.fillRect(
      25,
      guessNum * 50,
      clamp(barWidth, 3, width - 25 - textWidth),
      30
    );
    ctx.fillStyle = "black";
    ctx.fillText(
      String(dist[guess]),
      clamp(
        width * (dist[guess] / maxCount) + textWidth,
        4 + 2 * textWidth,
        width - textWidth
      ),
      guessNum * 50 + 25
    );
  });
  `Guess Distribution \n${DifficultyEnum[difficulty]} ${length}-letter words`;
  const div = elem("div", {class: "graph-wrapper"}, [
    elem("h2",{class: "dist-title"}, "Guess Distribution"),
    elem(
      "p",
      {class: 'dist-type'}, `${DifficultyEnum[difficulty]} ${length}-letter words`
    ),
    canvas,
  ]);
  return div;
};
