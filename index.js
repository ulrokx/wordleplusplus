/*
Wordle++ for SSW-215
Richard Kirk, Tyler Reinert, Jeffrey Fitzsimmons, Mateusz Marciniak

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
const refs = {
  startGameButton: document.getElementById("start-game-btn"),
  createGameWrapper: document.getElementById(
    "create-game-wrapper"
  ),
  wordLengthSelect: document.getElementById(
    "word-length-select"
  ),
  guessesSelect: document.getElementById("guesses-select"),
  gameWrapper: document.getElementById("game-wrapper"),
  modalContent: document.getElementById("modal-content"),
  modalWrapper: document.getElementById("modal-wrapper"),
  modalHeader: document.getElementById("modal-title"),
  modalAgain: document.getElementById("modal-again"),
  modalNew: document.getElementById("modal-new"),
  keyboardWrapper: document.getElementById("kb-wrapper"),
};
const keyboard = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "back"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"],
  ["z", "x", "c", "v", "b", "n", "m"],
];
let game;
// state stores the current letters entered and the current row user is typing on
const initialState = {
  entry: [],
  entryRow: 0,
  active: false,
  modalActive: false,
};

let state = {
  entry: [],
  entryRow: 0,
  active: false,
  modalActive: false,
};

const handleNewGame = (_) => {
  const length = refs.wordLengthSelect.value;
  const guesses = refs.guessesSelect.value;
  game = new Wordle(length, guesses); // creates a new game with the user inputted length and guesses
  refs.createGameWrapper.classList.add("hidden"); // hides the create game portion
  game.createBoard(); //runs method to generate game tiles per length and guesses
  game.makeKeyboard();
};

const resetGame = (_) => {
  resetState();
  refs.modalWrapper.classList.add("hidden");
  deleteBoard();
  refs.createGameWrapper.classList.remove("hidden");
};
refs.startGameButton.addEventListener("click", handleNewGame);
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

    this.letterFreq = this.generateFreq(this.word);
    //populate letterFreq with counts of each letter
    state.active = true;
    this.letterStatus = {};
    document.addEventListener("keydown", handleKeyPress); // to prevent errors before game
  }
  generateFreq(word) {
    const res = {};
    for (let i = 0; i < word.length; i++) {
      if (word[i] in res) {
        res[word[i]] += 1;
      } else {
        res[word[i]] = 1;
      }
      //populate letterFreq with counts of each letter
    }
    return res;
  }
  createBoard() {
    for (let r = 0; r < this.guesses; r++) {
      const ul = document.createElement("ul");
      for (let c = 0; c < this.wordLength; c++) {
        const box = this.makeBox(c, r);
        ul.appendChild(box);
      }
      refs.gameWrapper.appendChild(ul);
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
    const seenLetters = {}; // {letter: frequency}
    let correctLetters = 0;
    for (let i = 0; i < this.wordLength; i++) {
      const box = document.getElementById(
        `r-${state.entryRow}c-${i}`
      );
      box.classList.remove("game-box-default");
      if (guess[i] === this.word[i]) {
        box.classList.add("game-box-green");
        this.updateKeyboard(guess[i], "green")
        if (guess[i] in seenLetters) {
          seenLetters[guess[i]] += 1;
        } else {
          seenLetters[guess[i]] = 1;
        }
        correctLetters++;
      } else if (this.word.includes(guess[i])) {
        if (
          guess[i] in seenLetters &&
          guess[i] in this.letterFreq &&
          seenLetters[guess[i]] < this.letterFreq[guess[i]]
        ) {
          box.classList.add("game-box-yellow");
          this.updateKeyboard(guess[i], "yellow")
          seenLetters[guess[i]] += 1;
        } else if (guess[i] in seenLetters) {
          box.classList.add("game-box-grey");
        } else {
          seenLetters[guess[i]] = 1;
          box.classList.add("game-box-yellow");
          this.updateKeyboard(guess[i], "yellow")
        }
      } else {
        this.updateKeyboard(guess[i], "grey")
        box.classList.add("game-box-grey");
      }
    }
    state.entry = [];
    if (correctLetters == this.wordLength) {
      showModal(true);
    } else if (state.entryRow + 1 == game.guesses) {
      showModal(false);
    } else {
      state.entryRow = Math.min(
        state.entryRow + 1,
        game.guesses
      );
    }
  }

  makeBox(c, r) {
    const element = document.createElement("li");
    element.classList.add("game-box", "game-box-default"); //
    element.id = `r-${r}c-${c}`; // unique id for each box from row and column
    // element.innerText = r + "" + c;
    return element;
  }

  makeKeyboard() {
    for (let i = 0; i < keyboard.length; ++i) {
      const ul = document.createElement("ul");
      ul.classList.add(`kb-row-${i}`);
      for (let v of keyboard[i]) {
        const li = document.createElement("li");
        li.appendChild(this.makeKey(v));
        ul.appendChild(li);
      }
      refs.keyboardWrapper.appendChild(ul);
    }
  }

  updateKeyboard(letter, color) {
    if(letter in this.letterStatus && this.letterStatus[letter] == "green") return
    this.letterStatus[letter] = color
    const key = document.getElementById(`kb-${letter}`);
    key.classList.remove(
      "game-box-yellow",
      "game-box-grey",
      "game-box-default",
      "game-box-green"
    );
    console.log(letter, color)
    key.classList.add(`game-box-${color}`);
    console.log(key.classList)
  }

  makeKey(key) {
    const element = document.createElement("button");
    element.id = `kb-${key}`;
    element.classList.add("kb-key");
    element.textContent = key.toUpperCase();
    return element;
  }
}
const handleKeyPress = (e) => {
  if (!state.active) return;
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

const showModal = (win) => {
  state.active = false;
  state.modalActive = true;
  refs.modalWrapper.classList.remove("hidden");
  // refs.resultModalWrapper.children[0].textContent = "yoyoyo"
  refs.modalHeader.textContent = win ? "Victory" : "You Lost";
};

refs.modalNew.addEventListener("click", resetGame);
refs.modalAgain.addEventListener("click", () => {
  refs.modalWrapper.classList.add("hidden");
  deleteBoard();
  resetState();
  handleNewGame();
});

const resetState = () => {
  //forgive me but it works
  state = JSON.parse(JSON.stringify(initialState));
};

const deleteBoard = () => {
  refs.gameWrapper.replaceChildren([]);
  refs.keyboardWrapper.replaceChildren([]);
};
