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

export const ITEMGOLDBUG = "gold_bug";
export const ITEMSILVERBELL = "silver_bell";
export const ITEMDARKCRYSTAL = "dark_crystal";
export const ITEMDETONATOR = "detonator";
export const ITEMDRILL = "drill";
export const ITEMEMPTY = "empty";
export const ITEMPICAXE = "picaxe";
export const ITEMFLAG = "flag";
export const ITEMBOOK = "book";

const itemPosList = {
  [ITEMGOLDBUG]: new Position(0, 4),
  [ITEMSILVERBELL]: new Position(2, 4),
  [ITEMDARKCRYSTAL]: new Position(4, 4),
  [ITEMDETONATOR]: new Position(6, 4),
  [ITEMDRILL]: new Position(8, 4),
  [ITEMEMPTY]: new Position(14, 4),
  [ITEMPICAXE]: new Position(0, 7),
  [ITEMFLAG]: new Position(2, 7),
  [ITEMBOOK]: new Position(4, 7),
};

/**
 *
 * @param itemName
 * @param screenPos
 * @returns
 */
export function getItem(
  itemName: keyof typeof itemPosList,
  screenPos: Position = new Position()
) {
  return new Item(screenPos, itemPosList[itemName]);
}
