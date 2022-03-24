type Scores = Array<object>;

interface Column {
  display: string;
  key: string;
}

interface ScoreboardOptions {
  hide: Array<string>;
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
      return
    }
    this.table = document.createElement(`table`);
    this.table.classList.add("scoreboard");
  }

  elem() {
    if (this.scores.length === 0) {
      return document.createElement(`div`);
    }
    this.table.replaceChildren("");
    const thr = document.createElement("tr");
    this.options.columns.forEach((c) => {
      const th = document.createElement("th");
      th.textContent = c.display;
      thr.appendChild(th)
    });
    this.table.appendChild(thr);
    this.scores.forEach((e) => {
      const tr = document.createElement("tr");
      this.options.columns.forEach((c) => {
        const td = document.createElement("td");
        if (e[c.key]) {
          td.textContent = e[c.key];
        }
        tr.appendChild(td);
      });
      this.table.appendChild(tr);
    });
    console.log(this.table)
    return this.table;
  }
}
