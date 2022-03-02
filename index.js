const startGameButton =
  document.getElementById("start-game-btn");
const wordLengthSelect = document.getElementById(
  "word-length-select"
);
const guessesSelect = document.getElementById("guesses-select");
const gameWrapper = document.getElementById("game-wrapper")
let game;

startGameButton.addEventListener("click", (e) => {
  const length = wordLengthSelect.value;
  const guesses = guessesSelect.value;
  game = new Wordle(length, guesses)
  startGameButton.style.display = "none"
  
});


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Wordle {
  constructor(length, guesses) {
    this.wordLength = length;
    this.guesses = guesses;
    console.log(this.wordLength, this.guesses)
  }

  createBoard() {
    const box = document.createElement('div')
    box.innerText = "hello"
    gameWrapper.appendChild(box)
    
  }

  guess() {
      //guess
  }
}
