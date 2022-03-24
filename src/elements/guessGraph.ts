interface GuessDistribution {
  guesses: number;
  count: number;
}

type GuessDistributions = Array<GuessDistribution>;

export const generateGuessGraph = (
  dist: GuessDistributions
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = (canvas.width = 400);
  const height = (canvas.height = dist.length * 50);
  const maxCount = Object.values(dist).reduce(
    (a, b) => Math.max(a, b.count),
    0
  );

  ctx.font = "22px sans-serif";
  dist.forEach((guess, i) => {
    console.log(guess);
    ctx.fillStyle = "black";
    ctx.fillText(String(guess.guesses) + ":", 0, i * 50 + 25);
    ctx.fillStyle = "green";
    ctx.fillRect(
      25,
      i * 50,
      (width * guess.count) / maxCount,
      30
    );
    ctx.fillStyle = "black";
    ctx.fillText(
      String(guess.count),
      Math.min(width * (guess.count / maxCount), width) -
        0.2 *
          guess.count *
          ctx.measureText(String(guess.count)).width,
      i * 50 + 25
    );
  });

  return canvas;
};
