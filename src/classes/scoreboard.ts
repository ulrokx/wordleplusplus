import elem from "../util/element";

type Scores = Array<object>;

interface Column {
  display: string;
  key: string;
}

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
    this.table = document.createElement(`table`);
    this.table.classList.add("scoreboard");
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
        this.options.columns.map((col) => {
          // map columns to th elements
          return elem("th", { class: "scoreboard-header" }, [
            col.display, // column display name
          ]);
        }),
        this.scores.map((score) => {
          // map scores to tr elements
          return elem(
            "tr",
            { class: "scoreboard-row" },
            this.options.columns.map((col) => {
              return elem("td", { class: "scoreboard-cell" }, 
                col.key in score ? score[col.key] : "", // column value
              );
            })
          );
        })
      )
    );

    return this.table;
  }
}
