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
import Modal from "./classes/modal";
import Scoreboard from "./classes/scoreboard";
import { Wordle } from "./classes/wordle.js";
import { generateGuessGraph } from "./elements/guessGraph";
import generateWinContent, { generateModalButtons } from "./elements/winModalContent";
import { addScore, getScores } from "./firebase/api";
import { getStats } from "./util/localStats";
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
const sbColumns = [
  {
    display: "word",
    key: "word",
  },
  {
    display: "speed",
    key: "time",
  },
];
let modal;

const showModal = (win) => {
  const stats = getStats(game.wordLength);
  console.log(stats.distribution)
  const graph = generateGuessGraph(stats.distribution);
  const content = generateWinContent(stats);
  content.append(graph, generateModalButtons(handleResetGame, handlePlayAgain));
  modal = new Modal("Victory", content, {});
  document.body.append(modal.elem());
  modal.show();
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

const createScoreboard = async () => {
  const data = await getScores(5);
  const scores = [];
  data.forEach((d) => scores.push(d.data()));
  console.log(scores);
  const sb = new Scoreboard(scores, {
    columns: sbColumns,
  }).elem();
  document.body.append(sb);
};

createScoreboard();

const handleGameEnd = async (options) => {
  const { win, time, length, word, difficulty } = options;
  showModal(win);
  await addScore({ time, length, word, difficulty });
};

const handleResetGame = (_) => {
  modal.hide();
  deleteBoard();
  refs.createGameWrapper.classList.remove("hidden");
  refs.timerWrapper.classList.add("hidden");
};
refs.startGameButton.addEventListener("click", handleNewGame);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

// refs.modalNew.addEventListener("click", resetGame);
// refs.modalAgain.addEventListener("click", () => {
//   refs.modalWrapper.classList.add("hidden");
//   deleteBoard();
//   handleNewGame();
// }); // just add the listeners now even tho it isn't visible
const handlePlayAgain = () => {
  modal.hide();
  deleteBoard();
  handleNewGame();
};
const deleteBoard = () => {
  refs.gameWrapper.replaceChildren([]);
  refs.keyboardWrapper.replaceChildren([]);
};
