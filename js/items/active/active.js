import Position from "../../gameElements/position.js";
import { Timer } from "../../timer/timer.js";
import { GAMETIMERSYNC } from "../../timer/timerManager.js";
import { Item } from "../item.js";
export class ActiveItem extends Item {
    constructor(args) {
        super({ ...args });
    }
    get finalCost() {
        return this.cost;
    }
}
export class TimedActiveItem extends ActiveItem {
    useTimer;
    altSpriteSheet;
    constructor(args) {
        super(args);
        this.useTimer = new Timer({
            goalSecs: args.cooldown,
            goalFunc: args.goalFunc,
            autoStart: false,
            classes: [GAMETIMERSYNC],
        });
        this.altSpriteSheet = args.altSpriteSheet;
    }
}
