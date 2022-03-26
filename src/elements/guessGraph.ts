import elem from "../util/element";
import { GuessDistributions } from "../util/localStats";


const clamp = (
  num: number,
  min: number,
  max: number
): number => {
  return Math.min(Math.max(num, min), max);
};

export const generateGuessGraph = (
  dist: GuessDistributions
): HTMLCanvasElement => {
  console.log(dist)
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
    const barWidth = (dist[guess] / maxCount) * width - textWidth - 10;
    const guessNum = parseInt(guess) - 1
    console.log(guess, dist[guess], maxCount, barWidth);
    ctx.fillRect(
      25,
      guessNum * 50,
      clamp(
        barWidth,
        3,
        width - 25 - textWidth
      ),
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

  return canvas;
};
