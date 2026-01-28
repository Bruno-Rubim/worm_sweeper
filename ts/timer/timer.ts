import type { Action } from "../action.js";
import { timerManager } from "./timerManager.js";
import timeTracker from "./timeTracker.js";

export type timerArgs = {
  goalSecs?: number;
  goalFunc?: (() => Action | void | null) | undefined;
  loop?: boolean;
  autoStart?: boolean;
  deleteAtEnd?: boolean;
  classes?: string[];
  external?: boolean;
};

export class Timer {
  startTic: number;
  lastPausedTic: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = true;
  goalSecs: number;
  extraTics: number = 0;
  //Function called when timer reached its goal
  goalFunc: (() => Action | void | null) | undefined;
  loop: boolean;
  started: boolean = false;
  ended: boolean = false;
  deleteAtEnd: boolean;
  classes: string[];
  external: boolean;

  constructor(args: timerArgs) {
    args.goalSecs ??= Infinity;
    args.loop ??= false;
    args.deleteAtEnd ??= true;
    args.autoStart ??= true;
    args.classes ??= [];
    args.external ??= false;
    this.startTic = args.external
      ? timeTracker.currentTic
      : timeTracker.currentGameTic;
    this.goalSecs = args.goalSecs;
    this.goalFunc = args.goalFunc;
    this.loop = args.loop;
    this.deleteAtEnd = args.deleteAtEnd;
    this.classes = args.classes;
    this.external = args.external;
    if (args.autoStart) {
      this.start();
    }
  }

  get goalTics() {
    return this.goalSecs * timeTracker.ticsPerSecond;
  }

  get ticsRemaining() {
    if (!this.started) {
      return this.goalTics;
    }
    if (this.ended) {
      return 0;
    }
    return (
      this.startTic +
      this.goalTics +
      this.extraTics +
      this.totalPauseLapse -
      (this.isPaused
        ? this.lastPausedTic
        : this.external
          ? timeTracker.currentTic
          : timeTracker.currentGameTic)
    );
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
    this.startTic = this.external
      ? timeTracker.currentTic
      : timeTracker.currentGameTic;
    this.totalPauseLapse = 0;
    this.isPaused = false;
    timerManager.addTimer(this);
  }

  pause() {
    if (!this.isPaused) {
      this.lastPausedTic = this.external
        ? timeTracker.currentTic
        : timeTracker.currentGameTic;
      this.isPaused = !this.isPaused;
    }
  }
  unpause() {
    if (this.isPaused) {
      this.totalPauseLapse += this.external
        ? timeTracker.currentTic
        : timeTracker.currentGameTic - this.lastPausedTic;
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

  /**
   * Adds a number of seconds in tics to the extra tic counter
   * @param seconds
   */
  addSecs(seconds: number) {
    this.extraTics += seconds * timeTracker.ticsPerSecond;
  }

  /**
   * Reduces a number of seconds in tics to the extra tic counter
   * @param seconds
   */
  reduceSecs(seconds: number) {
    this.extraTics -= seconds * timeTracker.ticsPerSecond;
  }

  restart() {
    this.startTic = this.external
      ? timeTracker.currentTic
      : timeTracker.currentGameTic;
    this.started = false;
    this.ended = false;
    this.isPaused = true;
    this.lastPausedTic = this.external
      ? timeTracker.currentTic
      : timeTracker.currentGameTic;
    this.totalPauseLapse = 0;
    this.extraTics = 0;
  }

  reachGoal(): Action | void | null {
    this.extraTics = 0;
    if (this.goalFunc) {
      return this.goalFunc();
    }
  }
}
