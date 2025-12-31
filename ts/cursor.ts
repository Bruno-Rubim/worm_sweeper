import type CanvasManager from "./canvasManager.js";
import Position from "./position.js";
import { sprites } from "./sprite.js";

export const CURSORDEFAULT = "cursor_default";
export const CURSORPICAXE = "cursor_picaxe";
export const CURSORFLAG = "cursor_flag";
export const CURSORDETONATOR = "cursor_detonator";
export const CURSORSWORD = "cursor_sword";
export const CURSORSHIELD = "cursor_shield";
export const CURSORNONE = "cursor_none";

const cursorSheetPos = {
  [CURSORDEFAULT]: new Position(0, 0),
  [CURSORDETONATOR]: new Position(2, 0),
  [CURSORFLAG]: new Position(4, 0),
  [CURSORPICAXE]: new Position(0, 1),
  [CURSORSHIELD]: new Position(4, 1),
  [CURSORSWORD]: new Position(6, 1),
  [CURSORNONE]: new Position(6, 3),
};

export type cursorState = keyof typeof cursorSheetPos;

class Cursor {
  pos = new Position();
  sprite = sprites.cursor_sheet;
  state: cursorState = CURSORDEFAULT;
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
