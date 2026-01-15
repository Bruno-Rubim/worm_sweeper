import { type Timer } from "./timer.js";

// Timer class for timers that aren't deleted at clearQueue
export const SKIPCLEAR = "skip_clear";
// Timer class for timers that pause and unpause along with game timer
export const GAMETIMERSYNC = "gameTimerSync";

export class TimerMnager {
  queue: Timer[] = [];

  addTimer(timer: Timer) {
    this.queue.push(timer);
  }

  deleteTimer(timer: Timer) {
    this.queue = this.queue.filter((x) => x != timer);
  }

  clearQueue() {
    this.queue = this.queue.filter((x) => x.classes.includes(SKIPCLEAR));
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
