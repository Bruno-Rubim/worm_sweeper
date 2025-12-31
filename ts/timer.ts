import timeTracker from "./timeTracker.js";

export class Timer {
  startTic: number;
  lastPausedTic: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = true;
  goalTics: number;
  extraTics: number = 0;

  constructor(goalSecs: number = Infinity) {
    this.startTic = timeTracker.currentGameTic;
    this.goalTics = goalSecs * timeTracker.ticsPerSecond;
  }

  get ticsRemaining() {
    return (
      this.startTic +
      this.goalTics +
      this.extraTics +
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

  addSecs(seconds: number) {
    this.extraTics += seconds * timeTracker.ticsPerSecond;
  }
}
