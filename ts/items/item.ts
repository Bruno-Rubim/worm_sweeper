import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";

export class Item extends GameObject {
  spriteSheetPos: Position;
  name: string;

  constructor(pos: Position, spriteSheetPos: Position, name: string) {
    super({
      pos: pos,
      sprite: sprites.item_sheet,
      hitboxHeight: 18,
      hitboxWidth: 18,
      hitboxPosShift: new Position(-1, -1),
    });
    this.spriteSheetPos = spriteSheetPos;
    this.name = name;
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

export const itemPosDic = {
  gold_bug: new Position(0, 4),
  silver_bell: new Position(2, 4),
  dark_crystal: new Position(4, 4),
  detonator: new Position(6, 4),
  drill: new Position(8, 4),
  empty: new Position(14, 4),
  picaxe: new Position(0, 7),
  flag: new Position(2, 7),
  book: new Position(4, 7),
};

/**
 *
 * @param itemName
 * @param screenPos
 * @returns
 */
export function getItem(
  itemName: keyof typeof itemPosDic,
  screenPos: Position = new Position()
) {
  return new Item(screenPos, itemPosDic[itemName], itemName);
}
