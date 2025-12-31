import type CanvasManager from "./canvasManager.js";
import { inputState } from "./inputState.js";
import Position from "./position.js";
import { sprites } from "./sprite.js";
import timeTracker from "./timeTracker.js";

export const CURSORDEFAULT = "cursor_default";
export const CURSORPICAXE = "cursor_picaxe";
export const CURSORFLAG = "cursor_flag";
export const CURSORARROW = "cursor_arrow";
export const CURSORDETONATOR = "cursor_detonator";
export const CURSORBATTLE = "cursor_battle";
export const CURSORSHIELD = "cursor_shield";
export const CURSORNONE = "cursor_none";

const cursorSheetPos = {
  [CURSORDEFAULT]: new Position(0, 0),
  [CURSORPICAXE]: new Position(1, 0),
  [CURSORDETONATOR]: new Position(2, 0),
  [CURSORARROW]: new Position(3, 0),
  [CURSORBATTLE]: new Position(4, 0),
  [CURSORNONE]: new Position(6, 3),
};

export type cursorState = keyof typeof cursorSheetPos;

class Cursor {
  pos = new Position();
  state: cursorState = CURSORDEFAULT;
  loadStart = 0;
  render(canvasManager: CanvasManager) {
    canvasManager.renderSpriteFromSheet(
      sprites.cursor_sheet,
      this.pos,
      16,
      16,
      cursorSheetPos[this.state].add(
        0,
        inputState.mouse.heldLeft ? 1 : inputState.mouse.heldRight ? 2 : 0
      )
    );
  }
}

export const cursor = new Cursor();
