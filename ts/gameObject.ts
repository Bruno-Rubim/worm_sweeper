import type CanvasManager from "./canvasManager.js";
import Position from "./position.js";
import Hitbox from "./hitbox.js";
import type { Action } from "./action.js";
import type { cursorClick } from "./global.js";
import { Sprite } from "./sprite.js";
import timeTracker from "./timer/timeTracker.js";

export default class GameObject {
  sprite: Sprite;
  pos: Position;
  width: number;
  height: number;
  hitbox: Hitbox;
  hitboxPosShift: Position | undefined;
  mouseHovering: boolean = false;
  mouseHeldLeft: boolean = false;
  mouseHeldRight: boolean = false;
  hidden: boolean = false;
  birthTic: number;
  clickFunction:
    | ((cursorPos: Position, button: cursorClick) => Action | void | null)
    | undefined;
  heldFunction:
    | ((cursorPos: Position, button: cursorClick) => Action | void | null)
    | undefined;
  hoverFunction: ((cursorPos: Position) => Action | void | null) | undefined;

  constructor(args: {
    sprite: Sprite;
    pos?: Position;
    width?: number;
    height?: number;
    hitboxWidth?: number;
    hitboxHeight?: number;
    hitboxPosShift?: Position;
    clickFunction?: (cursorPos: Position, button: cursorClick) => Action | void;
  }) {
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

  updatePosition(newPos: Position) {
    this.pos = newPos;
    this.hitbox.objPos = this.pos.addPos(this.hitboxPosShift ?? new Position());
  }

  render(canvasManager: CanvasManager) {
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
