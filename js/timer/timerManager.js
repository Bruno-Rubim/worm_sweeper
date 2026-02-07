import {} from "./timer.js";
export const ACTIVEITEMTIMER = "activeItemTimer";
export class TimerManager {
    queue = [];
    addTimer(timer) {
        if (!this.queue.includes(timer)) {
            this.queue.push(timer);
        }
    }
    deleteTimer(timer) {
        this.queue = this.queue.filter((x) => x != timer);
    }
    clearQueue() {
        this.queue = [];
    }
    pauseTimers(timerClass) {
        this.queue.forEach((x) => {
            if (x.classes.includes(timerClass)) {
                x.pause();
            }
        });
    }
    unpauseTimers(timerClass) {
        this.queue.forEach((x) => {
            if (x.classes.includes(timerClass)) {
                x.unpause();
            }
        });
    }
}
export const timerManager = new TimerManager();
