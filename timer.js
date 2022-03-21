export default class Timer {
  constructor(options) {
    Object.assign(this, options);
    this.isRunning = false;
    this.overallTime = 0;
    this.startTime = 0;
  }

  start() {
    if (this.isRunning) {
      console.error("timer is already running");
      return;
    }

    this.isRunning = true;

    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      console.error("timer is already stopped");
    }
    this.isRunning = false;
    this.overallTime += this.#getElapsedTime();
  }

  #getElapsedTime() {
    const now = Date.now();

    return now - this.startTime;
  }

  getTime() {
    if (!this.isRunning && !this.overallTime) {
      return 0;
    }

    if (!this.startTime) {
      console.error("no start time");
    }

    return this.#getElapsedTime();
  }

  reset() {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }
}