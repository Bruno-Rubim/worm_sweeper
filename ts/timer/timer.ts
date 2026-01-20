import type { Action } from "../action.js";
import { GAMETIMERSYNC, timerManager } from "./timerManager.js";
import timeTracker from "./timeTracker.js";

export type timerArgs = {
  goalSecs?: number;
  goalFunc?: (() => Action | void | null) | undefined;
  loop?: boolean;
  autoStart?: boolean;
  deleteAtEnd?: boolean;
  classes?: string[];
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

  constructor(args: timerArgs) {
    args.goalSecs ??= Infinity;
    args.loop ??= false;
    args.deleteAtEnd ??= true;
    args.autoStart ??= true;
    args.classes ??= [];
    this.startTic = timeTracker.currentGameTic;
    this.goalSecs = args.goalSecs;
    this.goalFunc = args.goalFunc;
    this.loop = args.loop;
    this.deleteAtEnd = args.deleteAtEnd;
    this.classes = args.classes;
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
      (this.isPaused ? this.lastPausedTic : timeTracker.currentGameTic)
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
    this.startTic = timeTracker.currentGameTic;
    this.totalPauseLapse = 0;
    this.isPaused = false;
    timerManager.addTimer(this);
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

  /**
   * Adds a number of seconds in tics to the extra tic counter
   * @param seconds
   */
  addSecs(seconds: number) {
    this.extraTics += seconds * timeTracker.ticsPerSecond;
  }

  /**
   * Adds the goal seconds into extraTics TO-DO change how this works to actually rewind it
   */
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
