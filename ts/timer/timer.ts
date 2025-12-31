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

  start() {
    this.started = true;
    this.ended = false;
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
