import type CanvasManager from "./canvasManager.js";
import { findSprite } from "./sprites/findSprite.js";
import Position from "./position.js";
import type Sprite from "./sprites/sprite.js";
import Hitbox from "./hitbox.js";

export default class GameObject {
  sprite: Sprite;
  pos: Position;
  width: number;
  height: number;
  hitbox: Hitbox;
  clickFunction?: Function;

  constructor(args: {
    spriteName: string;
    pos?: Position;
    width?: number;
    height?: number;
  }) {
    this.sprite = findSprite(args.spriteName);
    this.pos = args.pos ?? new Position();
    this.width = args.width ?? 16;
    this.height = args.height ?? 16;
    this.hitbox = new Hitbox({
      pos: this.pos,
      width: this.width,
      height: this.height,
    });
  }

  render(canvasManager: CanvasManager) {
    canvasManager.renderSprite(this.sprite, this.pos, this.width, this.height);
  }
}
