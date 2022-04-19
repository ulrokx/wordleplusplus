
export const refs = {
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
  gradientSelect: document.getElementById("gradient-select"),
  helpBtn: document.getElementById(
    "open-help-btn"
  ) as HTMLInputElement,
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
  sbOpts: document.getElementById("scoreboard-options-wrapper"),
  sbOptsLength: document.getElementById(
    "scoreboard-length-select"
  ) as HTMLInputElement,
  sbOptsDiff: document.getElementById(
    "scoreboard-difficulty-select"
  ) as HTMLInputElement,
  sbWrapper: document.getElementById("scoreboard-wrapper"),
  credits: document.getElementById("credits"),
  backBtn: document.getElementById("back-btn"),
};