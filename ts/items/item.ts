import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";

export class Item extends GameObject {
  spriteSheetPos: Position;

  constructor(pos: Position, spriteSheetPos: Position) {
    super({
      pos: pos,
      spriteName: "item_sheet",
      hitboxHeight: 18,
      hitboxWidth: 18,
      hitboxPosShift: new Position(-1, -1),
    });
    this.spriteSheetPos = spriteSheetPos;
  }

  render(canvasManager: CanvasManager): void {
    let sheetPos = this.spriteSheetPos;
    if (this.mouseHovering) {
      sheetPos = sheetPos.add(1, 0);
    }
    canvasManager.renderSpriteFromSheet(
      this.sprite,
      this.pos,
      this.width,
      this.height,
      sheetPos
    );
  }
}

export const itemSheetPos = {
  picaxe: new Position(0, 7),
  flag: new Position(2, 7),
  book: new Position(4, 7),
  empty: new Position(14, 4),
};
