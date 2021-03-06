import elem from "../util/element";

type Scores = Array<object>;

interface Column {
  display: string;
  key: string;
  displayFn?: (value: any) => string
}
// [{name, time, difficulty, word}, {name, time, difficulty, word}, {name, time, difficulty, word}]

interface ScoreboardOptions {
  hide?: Array<string>;
  columns: Array<Column>;
}
export default class Scoreboard {
  table: HTMLTableElement;
  scores: Scores;
  options: ScoreboardOptions;
  constructor(scores: Scores, options: ScoreboardOptions) {
    // scores is an array of objects with parallel column names
    this.scores = scores;
    this.options = options;
    if (scores.length === 0) {
      console.error("scores array is empty!");
      return;
    }
    this.table = elem("table", { class: "scoreboard" }) as HTMLTableElement
  }

  elem() {
    if (this.scores.length === 0) {
      return elem(`div`);
    }
    this.table.replaceChildren("");
    this.table.append(
      elem(
        // create table header row with column names
        "tr",
        null,
        this.options.columns.map((col) => {
          // map columns to th elements
          return elem("th", { class: "scoreboard-header" }, [
            col.display, // column display name
          ]);
        })
      ),
      ...this.scores.map((score) => {
        // map scores to tr elements
        return elem(
          "tr",
          { class: "scoreboard-row" },
          this.options.columns.map((col) => {
            return elem(
              "td",
              { class: "scoreboard-cell" },
              col.key in score ? (col.displayFn ? col.displayFn(score[col.key]) : score[col.key]) : "" // column value
            );
          })
        );
      })
    );

    return this.table;
  }
}
