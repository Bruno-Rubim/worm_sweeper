import { GAMETIMERSYNC, timerManager } from "./timerManager.js";
import timeTracker from "./timeTracker.js";
export class Timer {
    startTic;
    lastPausedTic = 0;
    totalPauseLapse = 0;
    isPaused = true;
    goalSecs;
    extraTics = 0;
    goalFunc;
    loop;
    started = false;
    ended = false;
    deleteAtEnd;
    classes;
    constructor(args) {
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
        return (this.startTic +
            this.goalTics +
            this.extraTics +
            this.totalPauseLapse -
            (this.isPaused ? this.lastPausedTic : timeTracker.currentGameTic));
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
        }
        else {
            this.pause();
        }
    }
    addSecs(seconds) {
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
