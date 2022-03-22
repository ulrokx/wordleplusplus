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
import { Wordle } from "./classes/wordle";
import { addScore, getScores } from "./firebase/api";
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
let game;

const showModal = (win) => {
  refs.modalWrapper.classList.remove("hidden");
  // should be able to reuse most of this with some small modifications
  refs.modalHeader.textContent = win ? "Victory" : "You Lost";
};

const handleNewGame = (_) => {
  const wordLength = refs.wordLengthSelect.value;
  const guesses = refs.guessesSelect.value;
  const difficulty = refs.difficultySelect.value - 1;
  const timed = refs.timedSelect.checked;
  if (game) {
    document.removeEventListener("keydown", game.handleKeyPress);
  }
  game = new Wordle(
    {
      wordLength,
      guesses,
      difficulty,
      timed,
      difficultyLevels: DIFFICULTY_LEVELS,
      showModal,
      handleGameEnd,
    },
    refs
  ); // creates a new game with the user inputted length and guesses
  refs.createGameWrapper.classList.add("hidden"); // hides the create game portion
  game.createBoard(); //runs method to generate game tiles per length and guesses
  game.makeKeyboard();
};
(async () => {
  const scores = await getScores(5);
  scores.forEach(doc => console.log(doc.data()));
})();
const handleGameEnd = async (options) => {
  const { win, time, length, word, difficulty } = options;
  showModal(win);
  await addScore({ time, length, word, difficulty });
};

const resetGame = (_) => {
  refs.modalWrapper.classList.add("hidden");
  deleteBoard();
  refs.createGameWrapper.classList.remove("hidden");
  refs.timerWrapper.classList.add("hidden");
};
refs.startGameButton.addEventListener("click", handleNewGame);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

refs.modalNew.addEventListener("click", resetGame);
refs.modalAgain.addEventListener("click", () => {
  refs.modalWrapper.classList.add("hidden");
  deleteBoard();
  handleNewGame();
}); // just add the listeners now even tho it isn't visible

const deleteBoard = () => {
  refs.gameWrapper.replaceChildren([]);
  refs.keyboardWrapper.replaceChildren([]);
};
