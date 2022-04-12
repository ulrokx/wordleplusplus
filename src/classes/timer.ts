import msToReadable from "../util/msToReadable";

export default class Timer {
  isRunning: boolean;
  overallTime: number;
  startTime: number;
  minutesRef: any;
  secondsRef: any;
  milliRef: any;
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
    console.log(this);
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
    if (!this.isRunning) {
      return;
    }
    const time = this.getTime();
    const { milli, seconds, minutes } = msToReadable(time);
    this.minutesRef.textContent = String(minutes).padStart(
      2,
      "0"
    );

    this.secondsRef.textContent = String(seconds).padStart(
      2,
      "0"
    );

    this.milliRef.textContent = String(milli).padStart(3, "0");
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
