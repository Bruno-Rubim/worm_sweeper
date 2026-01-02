class TimeTracker {
    startStamp;
    ticsPerSecond;
    lastPausedStamp = 0;
    totalPauseLapse = 0;
    isPaused = false;
    constructor(ticsPerSecond) {
        this.ticsPerSecond = ticsPerSecond;
        this.startStamp = Date.now();
    }
    get currentStamp() {
        return Date.now() - this.startStamp;
    }
    get currentTic() {
        return Math.ceil((this.currentStamp / 1000) * this.ticsPerSecond);
    }
    get currentGameStamp() {
        if (this.isPaused) {
            return this.lastPausedStamp - this.totalPauseLapse;
        }
        return this.currentStamp - this.totalPauseLapse;
    }
    get currentGameTic() {
        return Math.ceil((this.currentGameStamp / 1000) * this.ticsPerSecond);
    }
    pause() {
        if (!this.isPaused) {
            this.lastPausedStamp = this.currentStamp;
            this.isPaused = !this.isPaused;
        }
    }
    unpause() {
        if (this.isPaused) {
            this.totalPauseLapse += this.currentStamp - this.lastPausedStamp;
            this.isPaused = !this.isPaused;
        }
    }
    togglePause() {
        if (this.isPaused) {
            this.unpause();
        }
        else {
            this.pause();
        }
    }
}
const timeTracker = new TimeTracker(12);
export default timeTracker;
