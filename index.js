/*
Wordle++ for SSW-215
Richard Kirk, Tyler Reinert, Jeffrey Fitzsimmons, Mateusz Marciniak

test test i am here
Initialization of board:
takes user input for length, # of guesses (difficulty to come)
creates Wordle class instance with user inputted values
generates random index to find word in word list for each size

on user input:
determines if the keypress is a letter and there is space on board

todo:
make thing shake when word is not valid
make confetti when you win
make keyboard to show status of letters
make play again
store streak and guesses in localstorage
*/
// https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6
import words from "./words.js";
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
// state stores the current letters entered and the current row user is typing on

const state = {
  entry: [],
  entryRow: 0,
};

startGameButton.addEventListener("click", (_) => {
  const length = wordLengthSelect.value;
  const guesses = guessesSelect.value;
  console.log(words);
  game = new Wordle(length, guesses); // creates a new game with the user inputted length and guesses
  createGameWrapper.style.display = "none"; // hides the create game portion
  game.createBoard(); //runs method to generate game tiles per length and guesses
});
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Wordle {
  constructor(length, guesses) {
    // creates a wordle game object with the user inputted word length and guesses
    this.wordLength = length;
    this.guesses = guesses;
    const idx = parseInt(
      randInRange(0, words[length].length),
      10
    ); // randomly chosen index
    this.word = words[length][idx];
    console.log(this.word);
    document.addEventListener("keydown", handleKeyPress);
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

  handleGuess() {
    const guess = state.entry.join("");
    if (
      guess.length != this.wordLength ||
      !words[this.wordLength].includes(guess)
    ) {
      //word is not long enough or a valid word
      return;
    }
    for (let i = 0; i < this.wordLength; i++) {
      const box = document.getElementById(
        `r-${state.entryRow}c-${i}`
      );
      box.classList.remove("game-box-default");
      console.log(guess[i], this.word[i]);
      if (guess[i] === this.word[i]) {
        box.classList.add("game-box-green");
      } else if (this.word.includes(guess[i])) {
        box.classList.add("game-box-yellow");
      } else {
        box.classList.add("game-box-grey");
      }
    }
    state.entry = [];
    state.entryRow = Math.min(state.entryRow + 1, game.guesses);
  }
  makeBox(c, r) {
    const element = document.createElement("li");
    element.classList.add("game-box", "game-box-default"); //
    element.id = `r-${r}c-${c}`; // unique id for each box from row and column
    // element.innerText = r + "" + c;
    return element;
  }
}

const handleKeyPress = (e) => {
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
    state.entry.length < game.wordLength && // game has space for word
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
  if (e.key === "Enter") {
    game.handleGuess();
  }
};
