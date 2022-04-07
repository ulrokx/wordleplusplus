import Timer from "./timer";
import words from "../../assets/words";
import { randInRange } from "../util/random";
import elem from "../util/element";
const keyboard = [
  // keyboard buttons
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "back"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

interface HandleGameEndOptions {
  win: boolean;
  time: number;
  word: string;
  difficulty: number;
  length: number;
  guesses: number;
}
export class Wordle {
  refs: any;
  timer: Timer;
  intervalRef: NodeJS.Timer;
  wordLength: any;
  difficulty: any;
  difficultyLevels: any;
  word: any;
  letterFreq: {};
  letterStatus: {};
  entry: any[];
  entryRow: number;
  active: boolean;
  guesses: number;
  handleGameEnd: (options: HandleGameEndOptions) => void;
  constructor(options, refs) {
    // creates a wordle game object with the user inputted word length and guesses
    // this.wordLength = length;
    // this.guesses = guesses;
    // this.difficulty = difficulty;
    Object.assign(this, options);
    console.log(options);
    this.refs = refs;;
    if (options.timed) {
      this.timer = new Timer({
        minutesRef: this.refs.timerMinutes,
        secondsRef: this.refs.timerSeconds,
        milliRef: this.refs.timerMilli,
      });
      this.timer.start();
      this.intervalRef = setInterval(() => this.timer.updateElements(), 1);
      this.refs.timerWrapper.classList.remove("hidden");
    }
    const idx = parseInt(
      randInRange(
        // in range of | | | | |*| |, finds left and right walls
        words[this.wordLength].length *
          (this.difficulty / this.difficultyLevels),
        words[this.wordLength].length *
          (this.difficulty / this.difficultyLevels) +
          words[this.wordLength].length / this.difficultyLevels
      ),
      10
    ); // randomly chosen index
    this.word =
      words[this.wordLength][Math.min(idx, words[this.wordLength].length - 1)];
    console.log(this.word);
    document.body.append(elem("div", this.word));

    this.letterFreq = this.generateFreq(this.word);
    //populate letterFreq with counts of each letter
    this.letterStatus = {};
    this.entry = [];
    this.entryRow = 0;
    this.active = true;
    document.addEventListener("keydown", this.handleKeyPress); // to prevent errors before game
  }

  stopTiming() {
    if (this.timer && this.intervalRef) {
      this.timer.stop();
      clearInterval(this.intervalRef);
    }
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
      const ul = elem("ul", { class: "game-row" });
      for (let c = 0; c < this.wordLength; c++) {
        const box = this.makeBox(c, r);
        ul.appendChild(box);
      }
      this.refs.gameWrapper.appendChild(ul);
    }
  }
  handleKeyPress = (e) => {
    if (!this.active) return; // if game is not in progress do nothing
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
  applyShaker() {
    for (let i = 0; i < this.entry.length; i++) {
      const box = document.getElementById(`r-${this.entryRow}c-${i}`);
      box.classList.add("shake-effect");
      setTimeout(() => box.classList.remove("shake-effect"), 1000);
    }
  }

<<<<<<< Updated upstream:src/classes/wordle.ts
  async handleGuess() {
=======

 applyShaker() {
   for (let i = 0; i < this.entry.length; i++) {
      const box = document.getElementById(
        `r-${this.entryRow}c-${i}`)
      box.classList.add("yourElement");
      setTimeout(()=> box.classList.remove("yourElement"), 1000)
  }
};

  handleGuess() {
>>>>>>> Stashed changes:src/classes/wordle.js
    // handles any time user clicks enter
    const guess = this.entry.join("").toLowerCase();
    if (
      guess.length != this.wordLength ||
<<<<<<< Updated upstream:src/classes/wordle.ts
      !words[this.wordLength].includes(guess)
    ) {
      if (guess.length == this.wordLength) {
        this.applyShaker();
      }
=======
      !words[this.wordLength].includes(guess)) {
      this.applyShaker()
>>>>>>> Stashed changes:src/classes/wordle.js
      //word is not long enough or a valid word
      return;
    };
    const seenLetters = {}; // {letter: frequency}
    let correctLetters = 0;
    for (let i = 0; i < this.wordLength; i++) {
      const box = document.getElementById(`r-${this.entryRow}c-${i}`); // gets the each box on the row
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
      this.handleGameEnd({
        win: true,
        time: this.timer ? this.timer.getTime() : 0,
        length: this.wordLength,
        word: this.word,
        difficulty: this.difficulty,
        guesses: this.entryRow + 1,
      });
      this.active = false;
      this.stopTiming();
    } else if (this.entryRow + 1 == this.guesses) {
      this.handleGameEnd({
        win: false,
        time: this.timer ? this.timer.getTime() : 0,
        length: this.wordLength,
        word: this.word,
        difficulty: this.difficulty,
        guesses: this.entryRow,
      });
      this.active = false;
      this.stopTiming();
    } else {
      // go to the next row without going over, might be unnecessary
      this.entryRow = Math.min(this.entryRow + 1, this.guesses);
    }
  }

  makeBox(c: number, r: number) {
    // factory for making a game box with a specific id
    return elem("li", {
      class: "game-box game-box-default",
      id: `r-${r}c-${c}`,
    });
  }

  updateKeyboard(letter, color) {
    // updates the keyboard, handles if the key is already green
    if (letter in this.letterStatus && this.letterStatus[letter] == "green")
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
        // for each letter in the row of the keyboard
        const li = document.createElement("li"); // create a li element
        li.appendChild(this.makeKey(v)); // add the letter to the li
        ul.appendChild(li);
      } // add the li to the ul
      this.refs.keyboardWrapper.appendChild(ul);
    }
  }

  makeKey(key) {
    // factory for each key
    const element = document.createElement("button");
    element.id = `kb-${key}`;
    element.classList.add("kb-key");
    element.textContent = key.toUpperCase(); // below is kinda bad but it works
    element.addEventListener("click", (e) =>
      this.handleKeyPress({
        key: (e.target as HTMLButtonElement).textContent,
      })
    );
    return element;
  }
}
