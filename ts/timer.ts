import timeTracker from "./timeTracker.js";

export class Timer {
  startTic: number;
  lastPausedTic: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = true;
  goalSecs: number;
  goalTics: number;
  extraTics: number = 0;
  goalFunc: Function | undefined;
  loop: boolean;
  ended: boolean = false;

  constructor(
    goalSecs: number = Infinity,
    goalFunc?: Function,
    loop: boolean = false
  ) {
    this.startTic = timeTracker.currentGameTic;
    this.goalSecs = goalSecs;
    this.goalTics = goalSecs * timeTracker.ticsPerSecond;
    this.goalFunc = goalFunc;
    this.loop = loop;
  }

  get ticsRemaining() {
    return this.ended
      ? 0
      : this.startTic +
          this.goalTics +
          this.extraTics +
          this.totalPauseLapse -
          (this.isPaused ? this.lastPausedTic : timeTracker.currentGameTic);
  }

  get secondsRemaining() {
    return this.ticsRemaining / timeTracker.ticsPerSecond;
  }

  get percentage() {
    return (this.ticsRemaining / this.goalTics) * 100;
  }

  start() {
    this.startTic = timeTracker.currentGameTic;
    this.isPaused = false;
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

  reset() {
    this.addSecs(this.goalSecs);
  }
}
