const startGameButton =
  document.getElementById("start-game-btn");
const wordLengthSelect = document.getElementById(
  "word-length-select"
);
const createGameWrapper = document.getElementById(
  "create-game-wrapper"
);
const guessesSelect = document.getElementById("guesses-select");
const gameWrapper = document.getElementById("game-wrapper");
let game;
let words;
const state = {
  entry: [],
  entryRow: 0,
};

startGameButton.addEventListener("click", async (e) => {
  const length = wordLengthSelect.value;
  const guesses = guessesSelect.value;
  const {default: lists} = await import("./words.js")
  words = lists
  console.log(words)
  game = new Wordle(length, guesses);
  createGameWrapper.style.display = "none";
  game.createBoard();
});
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInRange = (min, max) => {
  return Math.random() * (max - min) + min
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Wordle {
  constructor(length, guesses) {
    // creates a wordle game object with the user inputted word length and guesses
    this.wordLength = length;
    this.guesses = guesses;
    const idx = parseInt(randInRange(0, words[length].length), 10)
    this.word = words[length][idx]
  }

  createBoard() {
    for (let r = 0; r < this.guesses; r++) {
      const ul = document.createElement("ul");
      for (let c = 0; c < this.wordLength; c++) {
        const box = this.makeBox(c, r);
        ul.appendChild(box);
      }
      gameWrapper.appendChild(ul);
    }
  }

  handleKey(e) {}

  makeBox(c, r) {
    const element = document.createElement("li");
    element.className += " game-box";
    element.id = `r-${r}c-${c}`;
    element.innerText = r + "" + c;
    return element;
  }
}

const handleKeyPress = (e) => {
  console.log(e.key)
  if (e.repeat) return;
  if (e.key == "Backspace") {
    const toChange = document.getElementById(
      `r-${state.entryRow}c-${
        state.entry.length > 0 ? state.entry.length - 1 : 0
      }`
    );
    toChange.innerText = "";
    state.entry.pop();
    return;
  }
  if (
    state.entry.length < game.wordLength &&
    e.key.length == 1 &&
    e.key.toUpperCase().charCodeAt(0) >= 65 &&
    e.key.toUpperCase().charCodeAt(0) <= 90
  ) {
    const toChange = document.getElementById(
      `r-${state.entryRow}c-${state.entry.length}`
    );
    toChange.innerText = e.key.toUpperCase();
    state.entry.push(e.key);
  }
  if(e.key === "Enter") {
    state.entry = []
    state.entryRow = Math.min(state.entryRow + 1, game.guesses)
  }
};

document.addEventListener("keydown", handleKeyPress);
