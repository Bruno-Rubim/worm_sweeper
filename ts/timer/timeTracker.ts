class TimeTracker {
  startStamp: number;
  ticsPerSecond: number;
  lastPausedStamp: number = 0;
  totalPauseLapse: number = 0;
  isPaused: boolean = false;

  constructor(ticsPerSecond: number) {
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
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.lastPausedStamp = this.currentStamp;
    } else {
      this.totalPauseLapse += this.currentStamp - this.lastPausedStamp;
    }
  }
}

const timeTracker = new TimeTracker(12);

export default timeTracker;
