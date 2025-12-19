import type CanvasManager from "./canvasManager.js";
import { findSprite } from "./sprites/findSprite.js";
import Position from "./position.js";

export const DEFAULT = "default";
export const PICAXE = "picaxe";
export const FLAG = "flag";
export const DETONATOR = "detonator";
export const SWORD = "sword";
export const SHIELD = "shield";

const cursorSprites = {
  [DEFAULT]: findSprite("cursor_default"),
  [PICAXE]: findSprite("cursor_picaxe"),
  [FLAG]: findSprite("cursor_flag"),
  [DETONATOR]: findSprite("cursor_detonator"),
  [SWORD]: findSprite("cursor_sword"),
  [SHIELD]: findSprite("cursor_shield"),
};

export type cursorState =
  | typeof DEFAULT
  | typeof PICAXE
  | typeof FLAG
  | typeof DETONATOR
  | typeof SWORD
  | typeof SHIELD;

class Cursor {
  pos = new Position();
  state: cursorState = DEFAULT;
  render(canvasManager: CanvasManager) {
    canvasManager.renderSprite(cursorSprites[this.state], this.pos, 16, 16);
  }
}

export const cursor = new Cursor();
