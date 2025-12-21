import type CanvasManager from "./canvasManager.js";
import sprites, { findSprite } from "./sprites/findSprite.js";
import Position from "./position.js";
import type Sprite from "./sprites/sprite.js";
import Hitbox from "./hitbox.js";
import type { ObjectAction } from "./objectAction.js";
import type { LEFT, RIGHT } from "./global.js";

export default class GameObject {
  sprite: Sprite;
  pos: Position;
  width: number;
  height: number;
  hitbox: Hitbox;
  mouseHovering: boolean = false;
  clickFunction:
    | ((
        cursorPos: Position,
        button: typeof LEFT | typeof RIGHT
      ) => ObjectAction | void)
    | undefined;
  hoverFunction?: ((cursorPos: Position) => ObjectAction | void) | undefined;

  constructor(args: {
    spriteName: keyof typeof sprites;
    pos?: Position;
    width?: number;
    height?: number;
    hitboxWidth?: number;
    hitboxHeight?: number;
    hitboxPosShift?: Position;
    clickFunction?: (
      cursorPos: Position,
      button: typeof LEFT | typeof RIGHT
    ) => ObjectAction | void;
  }) {
    this.sprite = findSprite(args.spriteName);
    this.pos = args.pos ?? new Position();
    this.width = args.width ?? 16;
    this.height = args.height ?? 16;
    this.hitbox = new Hitbox({
      pos: this.pos.addPos(args.hitboxPosShift ?? new Position()),
      width: args.hitboxWidth ?? this.width,
      height: args.hitboxHeight ?? this.height,
    });
    this.clickFunction = args.clickFunction;
  }

  render(canvasManager: CanvasManager) {
    canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
  }
}
