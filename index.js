const startGameButton =
  document.getElementById("start-game-btn");
const wordLengthSelect = document.getElementById(
  "word-length-select"
);
const guessesSelect = document.getElementById("guesses-select");
const gameWrapper = document.getElementById("game-wrapper");
let game;

startGameButton.addEventListener("click", (e) => {
  const length = wordLengthSelect.value;
  const guesses = guessesSelect.value;
  game = new Wordle(length, guesses);
  startGameButton.style.display = "none";
  game.createBoard();
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Wordle {
  constructor(length, guesses) {
    // creates a wordle game object with the user inputted word length and guesses
    this.wordLength = length;
    this.guesses = guesses;
    console.log(this.wordLength, this.guesses);
  }

  createBoard() {
    for(let r = 0; r < this.guesses; r++) {
      const ul = document.createElement('ul')
        for(let c = 0; c < this.wordLength; c++) {
            const box = this.makeBox(c, r);
            ul.appendChild(box)
            
        }
      gameWrapper.appendChild(ul)
    }
  }

  guess() {
    //guess
  }

  makeBox(c, r) {
    const element = document.createElement("li");
    element.style.fontSize = "3rem";
    element.style.display = "inline-block";
    element.id = `r-${r}c-${c}`;
    element.innerText = r + " " + c
    return element;
  }
}
