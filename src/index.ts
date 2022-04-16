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
import { Wordle } from "./classes/wordle";
import { genBackBtnContent } from "./elements/genBackBtnContent";
import {
  DifficultyEnum,
  generateGuessGraph,
} from "./elements/guessGraph";
import { genHelpContent } from "./elements/helpContent";
import generateWinContent, {
  generateModalButtons,
  WinModalContentOptions,
} from "./elements/winModalContent";
import { addScore, getTopScores } from "./firebase/api";
import elem from "./util/element";
import { getStats, setStats } from "./util/localStats";
import msToReadable from "./util/msToReadable";
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
const DIFFICULTY_LEVELS = 7; // total number of difficulty levels
let game;
const sbColumns = [
  {
    display: "Name",
    key: "name",
    displayFn(value: string) {
      return String(value).slice(0, 12);
    },
  },
  {
    display: "Word",
    key: "word",
  },
  {
    display: "Time",
    key: "time",
    displayFn(value: number) {
      const { milli, minutes, seconds } = msToReadable(value);
      return `${
        minutes > 0 ? `${minutes}m ` : ""
      }${seconds}.${String(milli).substring(0, 2)} s`;
    },
  },
  {
    display: "Difficulty",
    key: "difficulty",
    displayFn(value: number) {
      return DifficultyEnum[value];
    },
  },
];
let modal;

const showModal = (
  win: boolean,
  stats: WinModalContentOptions,
  length: number,
  difficulty: number,
  word: string,
  time: number
) => {
  const graph = generateGuessGraph(
    stats.distribution,
    length,
    difficulty
  );
  const content = generateWinContent(stats);
  content.append(
    !win
      ? elem(
          "p",
          { class: "modal-correct-word" },
          `The word was ${word}.`
        )
      : ([] as any),
    win && time > 0
      ? elem(
          "form",
          null,
          elem("input", {
            type: "text",
            class: "modal-name-input",
            id: "modal-name-input",
            placeholder: "Enter your name",
            maxlength: "12",
          }),
          elem(
            "button",
            {
              class: "modal-submit-btn",
              type: "submit",
              id: "modal-submit-btn",
              click: function (e: HTMLElementEventMap["click"]) {
                e.preventDefault();
                e.stopPropagation();
                const inputBox = (e.target as HTMLButtonElement)
                  .previousSibling as HTMLInputElement;
                const name = inputBox.value;
                addScore({
                  name,
                  time,
                  length,
                  difficulty,
                  word,
                });
                inputBox.parentElement.after(
                  elem(
                    "p",
                    { class: "modal-added" },
                    "Added to leaderboard!"
                  )
                );
                inputBox.parentElement.remove();
              },
            },
            "Submit"
          )
        )
      : ([] as any),
    graph,
    generateModalButtons()
  );
  modal = new Modal({
    title: win ? "Victory" : "You Lost",
    content,
  });
  modal.show();
};

const handleNewGame = () => {
  const wordLength = (refs.wordLengthSelect as HTMLInputElement)
    .value;
  const guesses = (refs.guessesSelect as HTMLInputElement).value;
  const difficulty =
    Number((refs.difficultySelect as HTMLInputElement).value) -
    1;
  const timed = (refs.timedSelect as HTMLInputElement).checked;
  if (game) {
    document.removeEventListener("keydown", game.handleKeyPress);
  }
  game = new Wordle(
    {
      wordLength: parseInt(wordLength, 10),
      guesses: parseInt(guesses, 10),
      difficulty,
      timed,
      difficultyLevels: DIFFICULTY_LEVELS,
      showModal,
      handleGameEnd,
    },
    refs
  ); // creates a new game with the user inputted length and guesses
  refs.createGameWrapper.classList.add("hidden"); // hides the create game portion
  refs.credits.classList.add("hidden");
  refs.backBtn.classList.remove("hidden");
  game.createBoard(); //runs method to generate game tiles per length and guesses
  game.makeKeyboard(); // creates keyboard
};

const createScoreboard = async ({
  length,
  difficulty,
}: {
  length: number;
  difficulty: number;
}) => {
  const data = await getTopScores({
    count: 100,
    length,
  });
  const scores = [];
  data.forEach((d) => {
    const s = d.data();
    if (s.time > 0 && scores.length < 10) {
      if (difficulty == -1) {
        scores.push(s);
      } else if (Number(difficulty) == Number(s.difficulty)) {
        scores.push(s);
      }
    }
  });
  if (scores.length > 0) {
    const sb = new Scoreboard(scores, {
      // creates scoreboard
      columns: sbColumns,
    }).elem();
    refs.sbWrapper.append(sb);
  } else {
    refs.sbWrapper.append(
      elem(
        "p",
        null,
        "There are no scores yet for this word length!"
      )
    );
  }
};
const createAndAppendScoreboard = async () => {
  refs.sbWrapper.replaceChildren([] as any);
  const length = Number(refs.sbOptsLength.value);
  const difficulty = Number(refs.sbOptsDiff.value);
  await createScoreboard({ length, difficulty });
};
(async () => await createAndAppendScoreboard())();
const handleGameEnd = async (options) => {
  const { win, time, length, word, difficulty, guesses } =
    options;
  const stats = await getStats(length, difficulty); // get stats from localstorage
  stats.currentStreak = win ? stats.currentStreak + 1 : 0; // if win, add to streak
  stats.wins += win ? 1 : 0; // if win, add to wins
  stats.maxStreak = Math.max(
    stats.maxStreak,
    stats.currentStreak
  ); // update max streak

  stats.played++; // add to played
  if (win) {
    stats.distribution[guesses]++;
  }
  showModal(win, stats, length, difficulty, word, time);
  setStats(length, difficulty, stats); // set stats in localstorage
};

const handleResetGame = () => {
  // resets the game
  if (modal) {
    modal.hide(); // hides the modal
  }
  deleteBoard();
  createAndAppendScoreboard();
  refs.createGameWrapper.classList.remove("hidden"); // shows the create game portion
  refs.timerWrapper.classList.add("hidden"); // hides the timer
  refs.credits.classList.remove("hidden");
  refs.backBtn.classList.add("hidden");
};
document.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).id === "modal-again") {
    handlePlayAgain();
  } else if ((e.target as HTMLElement).id === "modal-new") {
    handleResetGame();
  }
});

refs.startGameButton.addEventListener("click", handleNewGame);
refs.sbOptsLength.addEventListener(
  "change",
  createAndAppendScoreboard
);
refs.sbOptsDiff.addEventListener("change", () => {
  createAndAppendScoreboard();
});
refs.helpBtn.addEventListener("click", () => {
  const helpModal = new Modal({
    title: "How to Play",
    content: genHelpContent(),
    clickToClose: true,
  });
  helpModal.show();
});

refs.backBtn.addEventListener("click", () => {
  const backModal = new Modal({
    title: "Are you sure?",
    content: genBackBtnContent(),
    clickToClose: true,
  });
  backModal.show();
  backModal.elem().addEventListener("click", (e) => {
    if ((e.target as HTMLElement).id === "confirm-back-btn") {
      handleResetGame();
      backModal.hide();
      game.stopTiming();
    }
    else if((e.target as HTMLElement).id === "cancel-back-btn"){
      backModal.hide();
    }
  });
});

const applyGradient = () => {
  if (document.documentElement.classList.contains("gradient-wrapper")) {
    localStorage.setItem("gradient", "false");
  } else {
    localStorage.setItem("gradient", "true");
  }
  document.documentElement.classList.toggle("gradient-wrapper");
};
(() => {
  if (localStorage.getItem("gradient") === "true") {
    document.documentElement.classList.add("gradient-wrapper");
    (refs.gradientSelect as HTMLInputElement).checked = true;
  } else {
    document.documentElement.classList.remove("gradient-wrapper");
  }
})();
refs.gradientSelect.addEventListener("change", applyGradient);
const handlePlayAgain = () => {
  modal.hide();
  deleteBoard();
  handleNewGame();
};
const deleteBoard = () => {
  // deletes the board and resets the game
  refs.gameWrapper.replaceChildren([] as any);
  refs.keyboardWrapper.replaceChildren([] as any);
};
