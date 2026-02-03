import { type Timer } from "./timer.js";

// Timer class for timers that aren synced to the gameTimer
export const ACTIVEITEMTIMER = "activeItemTimer";

export class TimerManager {
  queue: Timer[] = [];

  addTimer(timer: Timer) {
    if (!this.queue.includes(timer)) {
      this.queue.push(timer);
    }
  }

  deleteTimer(timer: Timer) {
    this.queue = this.queue.filter((x) => x != timer);
  }

  clearQueue() {
    this.queue = [];
  }

  pauseTimers(timerClass: string) {
    this.queue.forEach((x) => {
      if (x.classes.includes(timerClass)) {
        x.pause();
      }
    });
  }

  unpauseTimers(timerClass: string) {
    this.queue.forEach((x) => {
      if (x.classes.includes(timerClass)) {
        x.unpause();
      }
    });
  }
}

export const timerManager = new TimerManager();
