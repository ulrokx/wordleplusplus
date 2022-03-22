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
import Timer from "./timer.js";
const refs = {
  // this is better than a bunch of global variables with long names + intellisense
  startGameButton: document.getElementById("start-game-btn"),
  createGameWrapper: document.getElementById(
    "create-game-wrapper"
  ),
  wordLengthSelect: document.getElementById(
    "word-length-select"
  ),
  guessesSelect: document.getElementById("guesses-select"),
  difficultySelect: document.getElementById("difficulty-select"),
  timedSelect: document.getElementById("timed-select"),
  gameWrapper: document.getElementById("game-wrapper"),
  modalContent: document.getElementById("modal-content"),
  modalWrapper: document.getElementById("modal-wrapper"),
  modalHeader: document.getElementById("modal-title"),
  modalAgain: document.getElementById("modal-again"),
  modalNew: document.getElementById("modal-new"),
  keyboardWrapper: document.getElementById("kb-wrapper"),
  timerWrapper: document.getElementById("timer"),
  timerMinutes: document.getElementById("t-minute"),
  timerSeconds: document.getElementById("t-second"),
  timerMilli: document.getElementById("t-milli"),
};
const DIFFICULTY_LEVELS = 7; // total number of difficulty levels
const keyboard = [
  // keyboard buttons
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
  const wordLength = refs.wordLengthSelect.value;
  const guesses = refs.guessesSelect.value;
  const difficulty = refs.difficultySelect.value - 1;
  const timed = refs.timedSelect.checked
  console.log(timed)
  if (game) {
    document.removeEventListener("keydown", game.handleKeyPress);
  }
  game = new Wordle({
    wordLength,
    guesses,
    difficulty,
    timed,
  }); // creates a new game with the user inputted length and guesses
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
  console.log(min, max);
  return Math.random() * (max - min) + min;
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Wordle {
  constructor(options) {
    // creates a wordle game object with the user inputted word length and guesses
    // this.wordLength = length;
    // this.guesses = guesses;
    // this.difficulty = difficulty;
    Object.assign(this, options);
    if (options.timed) {
      this.timer = new Timer({
        minutesRef: refs.timerMinutes,
        secondsRef: refs.timerSeconds,
        milliRef: refs.timerMilli,
      });
      this.timer.start();
      this.intervalRef = setInterval(
        () => this.timer.updateElements(),
        1
      );
  refs.timerWrapper.classList.remove("hidden")
    }
    const idx = parseInt(
      randInRange(
        // in range of | | | | |*| |, finds left and right walls
        words[this.wordLength].length *
          (this.difficulty / DIFFICULTY_LEVELS),
        words[this.wordLength].length *
          (this.difficulty / DIFFICULTY_LEVELS) +
          words[this.wordLength].length / DIFFICULTY_LEVELS
      ),
      10
    ); // randomly chosen index
    this.word =
      words[this.wordLength][
        Math.min(idx, words[this.wordLength].length - 1)
      ];
    console.log(this.word);

    this.letterFreq = this.generateFreq(this.word);
    //populate letterFreq with counts of each letter
    state.active = true;
    this.letterStatus = {};
    this.entry = [];
    this.entryRow = 0;
    document.addEventListener("keydown", this.handleKeyPress); // to prevent errors before game
  }

  stopTiming() {
    this.timer.stop();
    clearInterval(this.intervalRef);
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
  handleKeyPress = (e) => {
    console.log(e);
    if (!state.active) return; // if game is not in progress do nothing
    if (e.repeat) return; // if the letter is being held down do nothing
    if (e.key === "Backspace" || e.key === "BACK") {
      // if it is a backspace
      const toChange = document.getElementById(
        `r-${this.entryRow}c-${
          this.entry.length > 0 ? this.entry.length - 1 : 0
        }` // handles if backspace is pushed on first box ^
      );
      toChange.innerText = "";
      this.entry.pop();
      return;
    }
    if (
      this.entry.length < this.wordLength && // game has space for word
      e.key.length == 1 && // key is a letter
      e.key.toUpperCase().charCodeAt(0) >= 65 && // more validation
      e.key.toUpperCase().charCodeAt(0) <= 90
    ) {
      const toChange = document.getElementById(
        `r-${this.entryRow}c-${this.entry.length}`
      );
      toChange.innerText = e.key.toUpperCase();
      this.entry.push(e.key);
    }
    if (e.key === "Enter" || e.key === "ENTER") {
      this.handleGuess();
    }
  };

  handleGuess() {
    // handles any time user clicks enter
    const guess = this.entry.join("");
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
        `r-${this.entryRow}c-${i}`
      ); // gets the each box on the row
      box.classList.remove("game-box-default");
      if (guess[i] === this.word[i]) {
        // case when the letter is correct
        box.classList.add("game-box-green");
        this.updateKeyboard(guess[i], "green");
        if (guess[i] in seenLetters) {
          seenLetters[guess[i]] += 1;
        } else {
          seenLetters[guess[i]] = 1;
        }
        correctLetters++;
      } else if (this.word.includes(guess[i])) {
        // case when letter is in word
        if (
          // if the letter is both in the correct word and it has been seen less than
          //      the number of times it appears in the correct word
          guess[i] in seenLetters &&
          guess[i] in this.letterFreq &&
          seenLetters[guess[i]] < this.letterFreq[guess[i]]
        ) {
          box.classList.add("game-box-yellow");
          this.updateKeyboard(guess[i], "yellow");
          seenLetters[guess[i]] += 1; // add one to the seen count for that letter
        } else if (guess[i] in seenLetters) {
          // if it has been seen enough
          box.classList.add("game-box-grey");
        } else {
          seenLetters[guess[i]] = 1;
          box.classList.add("game-box-yellow");
          this.updateKeyboard(guess[i], "yellow");
        }
      } else {
        // wrong letter
        this.updateKeyboard(guess[i], "grey");
        box.classList.add("game-box-grey");
      }
    }
    this.entry = []; // resets the entry array for the state
    if (correctLetters == this.wordLength) {
      // if the user got all of the letters correct
      showModal(true);
      state.active = false;
      this.stopTiming();
      console.log(this.timer.getTime());
    } else if (this.entryRow + 1 == game.guesses) {
      showModal(false);
    } else {
      // go to the next row without going over, might be unnecessary
      this.entryRow = Math.min(this.entryRow + 1, this.guesses);
    }
  }

  makeBox(c, r) {
    // factory for making a game box with a specific id
    const element = document.createElement("li");
    element.classList.add("game-box", "game-box-default"); //
    element.id = `r-${r}c-${c}`; // unique id for each box from row and column
    // element.innerText = r + "" + c;
    return element;
  }

  updateKeyboard(letter, color) {
    // updates the keyboard, handles if the key is already green
    if (
      letter in this.letterStatus &&
      this.letterStatus[letter] == "green"
    )
      return;
    this.letterStatus[letter] = color;
    const key = document.getElementById(`kb-${letter}`);
    key.classList.remove(
      // better safe than sorry, easiest way to do this i think
      "game-box-yellow",
      "game-box-grey",
      "game-box-default",
      "game-box-green"
    );
    key.classList.add(`game-box-${color}`);
  }

  makeKeyboard() {
    // constructs the keyboard each game as 3 lists of buttons
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

  makeKey(key) {
    // factory for each key
    const element = document.createElement("button");
    element.id = `kb-${key}`;
    element.classList.add("kb-key");
    element.textContent = key.toUpperCase(); // below is kinda bad but it works
    element.addEventListener("click", (e) =>
      handleKeyPress({ key: e.target.textContent })
    );
    return element;
  }
}

const showModal = (win) => {
  state.active = false;
  state.modalActive = true;
  refs.modalWrapper.classList.remove("hidden");
  // should be able to reuse most of this with some small modifications
  refs.modalHeader.textContent = win ? "Victory" : "You Lost";
};

refs.modalNew.addEventListener("click", resetGame);
refs.modalAgain.addEventListener("click", () => {
  refs.modalWrapper.classList.add("hidden");
  deleteBoard();
  resetState();
  handleNewGame();
}); // just add the listeners now even tho it isn't visible

const resetState = () => {
  // forgive me but it works
  // maybe someone could write an object cloning function or find something better
  // this is really slow but doesn't really matter that much
  state = JSON.parse(JSON.stringify(initialState));
  refs.timerWrapper.classList.add("hidden")
};

const deleteBoard = () => {
  refs.gameWrapper.replaceChildren([]);
  refs.keyboardWrapper.replaceChildren([]);
};
