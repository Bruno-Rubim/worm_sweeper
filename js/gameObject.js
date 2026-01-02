import Position from "./position.js";
import Hitbox from "./hitbox.js";
import { Sprite } from "./sprite.js";
import timeTracker from "./timer/timeTracker.js";
export default class GameObject {
    sprite;
    pos;
    width;
    height;
    hitbox;
    hitboxPosShift;
    mouseHovering = false;
    mouseHeldLeft = false;
    mouseHeldRight = false;
    hidden = false;
    birthTic;
    clickFunction;
    heldFunction;
    hoverFunction;
    constructor(args) {
        this.sprite = args.sprite;
        this.pos = args.pos ?? new Position();
        this.width = args.width ?? 16;
        this.height = args.height ?? 16;
        this.hitboxPosShift = args.hitboxPosShift;
        this.hitbox = new Hitbox({
            objPos: this.pos,
            width: args.hitboxWidth ?? this.width,
            height: args.hitboxHeight ?? this.height,
            shiftPos: args.hitboxPosShift,
        });
        this.clickFunction = args.clickFunction;
        this.birthTic = timeTracker.currentGameTic;
    }
    updatePosition(newPos) {
        this.pos = newPos;
        this.hitbox.objPos = this.pos.addPos(this.hitboxPosShift ?? new Position());
    }
    render(canvasManager) {
        if (this.hidden) {
            return;
        }
        canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
    }
    resetAnimation() {
        this.birthTic = timeTracker.currentGameTic;
    }
    endAnimation() {
        this.birthTic = -Infinity;
    }
}
