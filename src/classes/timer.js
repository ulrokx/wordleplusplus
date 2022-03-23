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

  updateElements() {
    if (
      !this.minutesRef.textContent ||
      !this.secondsRef.textContent ||
      !this.milliRef.textContent
    ) {
      console.error("elements not provided");
    }
    const time = this.getTime();

    this.minutesRef.textContent = String(
      Math.floor(time / (60 * 1000))
    ).padStart(2, "0");

    this.secondsRef.textContent = String(
      Math.floor(time / 1000) % 60
    ).padStart(2, "0");

    this.milliRef.textContent = String(time % 1000).padStart(
      3,
      "0"
    );
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
