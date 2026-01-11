import type CanvasManager from "./canvasManager.js";
import { measureTextBoxHeight } from "./fontMaps.js";
import GameObject from "./gameObject.js";
import { RIGHT, type LEFT } from "./global.js";
import { inputState } from "./inputState.js";
import Position from "./position.js";
import { sprites } from "./sprites.js";

export const CURSORDEFAULT = "cursor_default";
export const CURSORPICAXE = "cursor_picaxe";
export const CURSORDETONATOR = "cursor_detonator";
export const CURSORARROW = "cursor_arrow";
export const CURSORBATTLE = "cursor_battle";
export const CURSORBOMB = "cursor_bomb";
export const CURSORGOLDWATER = "cursor_gold_water";
export const CURSORCHISEL = "cursor_chisel";
export const CURSORNONE = "cursor_none";

// Different cursor states and their position on the cursor spriteSheet
const cursorSheetPos = {
  [CURSORDEFAULT]: new Position(0, 0),
  [CURSORPICAXE]: new Position(1, 0),
  [CURSORDETONATOR]: new Position(2, 0),
  [CURSORARROW]: new Position(3, 0),
  [CURSORBATTLE]: new Position(4, 0),
  [CURSORBOMB]: new Position(5, 0),
  [CURSORGOLDWATER]: new Position(6, 0),
  [CURSORCHISEL]: new Position(7, 0),
  [CURSORNONE]: new Position(6, 3),
};

export type cursorState = keyof typeof cursorSheetPos;

// Object of item descriptions when hovering on border
class Description extends GameObject {
  side: typeof RIGHT | typeof LEFT = RIGHT;
  text: string = "";
  renderScale: number = 0.4;
  fontSize: number = 0.4;

  constructor(cursorPos: Position) {
    super({
      sprite: sprites.description_box,
      pos: cursorPos,
      width: 56,
      height: 14,
    });
  }

  render(canvasManager: CanvasManager): void {
    if (this.hidden) {
      return;
    }
    const padding = 4 * this.renderScale;
    canvasManager.renderBox(
      sprites.description_box_sheet,
      this.pos.add(this.side == RIGHT ? -59 : 15, 0),
      3,
      3,
      this.width,
      measureTextBoxHeight(
        "description",
        this.text,
        this.width,
        this.fontSize
      ) +
        3 * this.renderScale,
      this.renderScale
    );
    canvasManager.renderText(
      "description",
      this.pos.add((this.side == RIGHT ? -59 : 15) + padding, padding),
      this.text,
      RIGHT,
      this.width,
      this.fontSize
    );
  }
}

class Cursor {
  pos = new Position();
  state: cursorState = CURSORDEFAULT;
  description = new Description(this.pos);

  /**
   * Renders the cursor based on its current state and mouse inputState
   * @param canvasManager
   */
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
    this.description.render(canvasManager);
  }
}

// Object that represents the cursor in game
export const cursor = new Cursor();
