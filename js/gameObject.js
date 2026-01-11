import Position from "./position.js";
import Hitbox from "./hitbox.js";
import { Sprite } from "./sprites.js";
import timeTracker from "./timer/timeTracker.js";
export default class GameObject {
    sprite;
    hidden = false;
    pos;
    width;
    height;
    hitbox;
    hitboxPosShift;
    mouseHovering = false;
    mouseHeldLeft = false;
    mouseHeldRight = false;
    firstAnimationTic;
    clickFunction;
    heldFunction;
    hoverFunction;
    notHoverFunction;
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
        this.heldFunction = args.heldFunction;
        this.hoverFunction = args.hoverFunction;
        this.notHoverFunction = args.notHoverFunction;
        this.firstAnimationTic = timeTracker.currentGameTic;
    }
    updatePosition(newPos) {
        this.pos = newPos;
        this.hitbox.objPos = this.pos.add(this.hitboxPosShift ?? new Position());
    }
    render(canvasManager) {
        if (this.hidden) {
            return;
        }
        canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
    }
    resetAnimation() {
        this.firstAnimationTic = timeTracker.currentGameTic;
    }
    endAnimation() {
        this.firstAnimationTic = -Infinity;
    }
}
