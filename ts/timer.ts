import timeTracker from "./timeTracker.js";

export class Timer {
  startTic: number;
  lastPausedTic: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = true;
  goalTics: number;

  constructor(goalSecs: number = Infinity) {
    this.startTic = timeTracker.currentGameTic;
    this.goalTics = goalSecs * timeTracker.ticsPerSecond;
  }

  get ticsRemaining() {
    return (
      this.startTic +
      this.goalTics +
      this.totalPauseLapse -
      (this.isPaused ? this.lastPausedTic : timeTracker.currentGameTic)
    );
  }

  get secondsRemaining() {
    return this.ticsRemaining / timeTracker.ticsPerSecond;
  }

  pause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.lastPausedTic = timeTracker.currentGameTic;
    } else {
      this.totalPauseLapse += timeTracker.currentGameTic - this.lastPausedTic;
    }
  }
}
