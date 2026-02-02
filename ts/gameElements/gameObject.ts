import Position from "./position.js";
import type { Action } from "../action.js";
import type { cursorClick } from "../global.js";
import { Sprite } from "../sprites.js";
import Hitbox from "./hitbox.js";
import timeTracker from "../timer/timeTracker.js";
import { canvasManager } from "../canvasManager.js";

// Represents a given object in game, can have interaction functions that return Actions
export default class GameObject {
  sprite: Sprite;
  hidden: Boolean = false;

  pos: Position;
  width: number;
  height: number;
  hitbox: Hitbox;
  hitboxPosShift: Position | undefined; // Shifts the object's hitbox, used when a hitbox is of a different size than the object

  mouseHovering: boolean = false;
  mouseHeldLeft: boolean = false;
  mouseHeldRight: boolean = false;

  animationTicStart: number;

  /**
   * Function for when the cursor clicks it
   */
  clickFunction:
    | ((cursorPos: Position, button: cursorClick) => Action | void | null)
    | undefined;

  /**
   * Function for when the cursor is holding a button over it
   */
  heldFunction:
    | ((cursorPos: Position, button: cursorClick) => Action | void | null)
    | undefined;

  /**
   * Function for when the cursor is over it
   */
  hoverFunction: ((cursorPos: Position) => Action | void | null) | undefined;

  /**
   * Function for when the cursor is over it
   */
  notHoverFunction: (() => Action | void | null) | undefined;

  constructor(args: {
    sprite: Sprite;
    pos?: Position;
    width?: number;
    height?: number;
    hitboxWidth?: number;
    hitboxHeight?: number;
    hitboxPosShift?: Position;
    hidden?: Boolean;
    clickFunction?: (cursorPos: Position, button: cursorClick) => Action | void;
    heldFunction?: (cursorPos: Position, button: cursorClick) => Action | void;
    hoverFunction?: (cursorPos: Position) => Action | void;
    notHoverFunction?: () => Action | void;
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
    this.heldFunction = args.heldFunction;
    this.hoverFunction = args.hoverFunction;
    this.notHoverFunction = args.notHoverFunction;
    this.animationTicStart = timeTracker.currentGameTic;
    this.hidden = args.hidden ?? false;
  }

  /**
   * Updates its position to a new Position object and adds its current value to the hitbox objPos with the shift
   * @param newPos
   */
  updatePosition(newPos: Position) {
    this.pos = newPos;
    this.hitbox.objPos = this.pos.add(this.hitboxPosShift ?? new Position());
  }

  /**
   * Render the object's sprite with its stats using the canvasManager
   * @returns
   */
  render() {
    if (this.hidden) {
      return;
    }
    canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
  }

  /**
   * Updates its animationTicStart
   */
  resetAnimation() {
    this.animationTicStart = timeTracker.currentGameTic;
  }

  /**
   * Sets the animationTicStart to -Infinity (ultimately making it so it's impossible for the animation to not be finished)
   */
  endAnimation() {
    this.animationTicStart = -Infinity;
  }
}
