import elem from "../util/element";

export const genHelpContent = (): HTMLElement => {
  return elem("div", null, [
    elem(
      "p",
      null,
      `Wordle is a game originally created by Welsh software engineer John Wardle.
             It started off as a standalone website, but was recently acquired by the New York Times.`
    ),
    elem(
      "p",
      null,
      `
             The game is similar to Mastermind, but instead of trying to find the code, you try
             and guess the word. The words are from the scrabble dictionary. To play, you click the 'Start 
             New Game' button after selecting your desired word length and difficulty. You then try to guess the
             secret word by inputting same-length words and clicking enter. If the letter box lights up green,
             it means that the letter is in the right place in the world. If the letter box lights up yellow, it
             means that the letter is in the word, but in the wrong place. If the letter box lights up gray, it means that
             the letter is not in the word. `
    ),
    elem('button', {id: "close-help-btn"}, "Close"),
  ]);
};
