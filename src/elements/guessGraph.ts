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
  const canvas = elem("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const width = (canvas.width = 400);
  const height = (canvas.height = dist.length * 50);
  const maxCount = Object.values(dist).reduce(
    (a, b) => Math.max(a, b.count),
    1
  ) as number;

  ctx.font = "22px sans-serif";
  dist.forEach((guess, i) => {
    ctx.fillStyle = "black";
    ctx.fillText(String(guess.guesses) + ":", 0, i * 50 + 25);
    ctx.fillStyle = "#8ff7a7";
    const textWidth = ctx.measureText(String(guess.count)).width;
    const barWidth = (guess.count / maxCount) * width - textWidth - 10;
    console.log(barWidth);
    ctx.fillRect(
      25,
      i * 50,
      clamp(
        barWidth,
        3,
        width - 25 - textWidth
      ),
      30
    );
    ctx.fillStyle = "black";
    ctx.fillText(
      String(guess.count),
      clamp(
        width * (guess.count / maxCount) + textWidth,
        4 + 2 * textWidth,
        width - textWidth
      ),
      i * 50 + 25
    );
  });

  return canvas;
};
