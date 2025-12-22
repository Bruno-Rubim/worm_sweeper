import type CanvasManager from "./canvasManager.js";
import Position from "./position.js";
import { sprites } from "./sprite.js";

export const DEFAULT = "default";
export const PICAXE = "picaxe";
export const FLAG = "flag";
export const DETONATOR = "detonator";
export const SWORD = "sword";
export const SHIELD = "shield";

const cursorSheetPos = {
  [DEFAULT]: new Position(0, 0),
  [DETONATOR]: new Position(2, 0),
  [FLAG]: new Position(4, 0),
  [PICAXE]: new Position(0, 1),
  [SHIELD]: new Position(4, 1),
  [SWORD]: new Position(6, 1),
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
  sprite = sprites.cursor_sheet;
  state: cursorState = DEFAULT;
  render(canvasManager: CanvasManager) {
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      16,
      16,
      cursorSheetPos[this.state]
    );
  }
}

export const cursor = new Cursor();
