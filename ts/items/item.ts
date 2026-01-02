import { ItemDescription, ToggleBook } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { GAMEWIDTH, LEFT, RIGHT } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";

export class Item extends GameObject {
  spriteSheetPos: Position;
  name: string;
  description?: string;
  descFontSize = 0.4;

  constructor(
    pos: Position,
    spriteSheetPos: Position,
    name: string,
    description?: string
  ) {
    super({
      pos: pos,
      sprite: sprites.item_sheet,
      hitboxHeight: 18,
      hitboxWidth: 18,
      hitboxPosShift: new Position(-1, -1),
    });
    this.spriteSheetPos = spriteSheetPos;
    this.name = name;
    if (name == "book") {
      this.clickFunction = () => {
        return new ToggleBook();
      };
    }
    if (description) {
      this.description = description;
    }
  }

  clone(): Item {
    return new Item(
      new Position().addPos(this.pos),
      this.spriteSheetPos,
      this.name,
      this.description
    );
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

  hoverFunction = (cursorPos: Position) => {
    if (this.description) {
      let side: typeof LEFT | typeof RIGHT;
      if (cursorPos.x > GAMEWIDTH / 2) {
        side = RIGHT;
      } else {
        side = LEFT;
      }
      return new ItemDescription(this.description, side, this.descFontSize);
    }
  };
}

export const itemDic = {
  gold_bug: new Item(
    new Position(),
    new Position(0, 4),
    "gold_bug",
    "More gold. More worms.\nThe bug's curse is everlasting."
  ),
  silver_bell: new Item(
    new Position(),
    new Position(2, 4),
    "silver_bell",
    "Reveals location of doors"
  ),
  dark_crystal: new Item(
    new Position(),
    new Position(4, 4),
    "dark_crystal",
    "Allows you to break blocks you can't see."
  ),
  detonator: new Item(
    new Position(),
    new Position(6, 4),
    "detonator",
    "Use this to break all unmarked blocks around a block instantly."
  ),
  drill: new Item(
    new Position(),
    new Position(8, 4),
    "drill",
    "When breaking a safe block all connected safe blocks are also broken."
  ),
  health_insurance: new Item(
    new Position(),
    new Position(10, 4),
    "health_insurance",
    "Gain 1 heart when clearing a level."
  ),
  empty: new Item(new Position(), new Position(14, 4), "empty"),
  picaxe: new Item(
    new Position(),
    new Position(0, 7),
    "picaxe",
    "Left click any block that's not hidden to break it."
  ),
  flag: new Item(
    new Position(),
    new Position(2, 7),
    "flag",
    "Right click any block to mark it as a possible threat."
  ),
  book: new Item(
    new Position(),
    new Position(4, 7),
    "book",
    "Click to open the guide book."
  ),
};

/**
 *
 * @param itemName
 * @param screenPos
 * @returns
 */
export function getItem(
  itemName: keyof typeof itemDic,
  screenPos: Position = new Position()
) {
  let item = itemDic[itemName].clone();
  item.pos.update(screenPos);
  return item;
}
