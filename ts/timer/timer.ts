import type { Action } from "../action.js";
import timeTracker from "./timeTracker.js";

export class Timer {
  startTic: number;
  lastPausedTic: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = true;
  goalSecs: number;
  extraTics: number = 0;
  goalFunc: (() => Action | void | null) | undefined;
  loop: boolean;
  started: boolean = false;
  ended: boolean = false;
  deleteAtEnd: boolean;

  constructor(
    goalSecs: number = Infinity,
    goalFunc?: (() => Action | void | null) | undefined,
    loop: boolean = false,
    deleteAtEnd: boolean = true
  ) {
    this.startTic = timeTracker.currentGameTic;
    this.goalSecs = goalSecs;
    this.goalFunc = goalFunc;
    this.loop = loop;
    this.deleteAtEnd = deleteAtEnd;
  }

  get goalTics() {
    return this.goalSecs * timeTracker.ticsPerSecond;
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
    return Math.max(0, (this.ticsRemaining / this.goalTics) * 100);
  }

  get inMotion() {
    return this.started && !this.ended;
  }

  start() {
    this.started = true;
    this.ended = false;
    this.startTic = timeTracker.currentGameTic;
    this.totalPauseLapse = 0;
    this.isPaused = false;
  }

  pause() {
    if (!this.isPaused) {
      this.lastPausedTic = timeTracker.currentGameTic;
      this.isPaused = !this.isPaused;
    }
  }
  unpause() {
    if (this.isPaused) {
      this.totalPauseLapse += timeTracker.currentGameTic - this.lastPausedTic;
      this.isPaused = !this.isPaused;
    }
  }

  togglePause() {
    if (this.isPaused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  addSecs(seconds: number) {
    this.extraTics += seconds * timeTracker.ticsPerSecond;
  }

  rewind() {
    this.addSecs(this.goalSecs);
  }

  restart() {
    this.startTic = timeTracker.currentGameTic;
    this.started = false;
    this.ended = false;
    this.isPaused = true;
    this.lastPausedTic = timeTracker.currentGameTic;
    this.totalPauseLapse = 0;
    this.extraTics = 0;
  }
}
