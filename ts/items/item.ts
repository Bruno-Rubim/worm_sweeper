import { ItemDescription, ToggleBook } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { GAMEWIDTH, LEFT, RIGHT } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";

export class Item extends GameObject {
  spriteSheetPos: Position;
  name: string;
  shopName: string;
  description: string;
  descFontSize = 0.4;
  cost: number;

  constructor(args: {
    pos?: Position;
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    description: string;
  }) {
    super({
      pos: args.pos ?? new Position(),
      sprite: sprites.item_sheet,
      hitboxHeight: 18,
      hitboxWidth: 18,
      hitboxPosShift: new Position(-1, -1),
    });
    this.spriteSheetPos = args.spriteSheetPos;
    this.name = args.name;
    this.shopName = args.shopName;
    this.cost = args.cost;
    if (args.name == "book") {
      this.clickFunction = () => {
        return new ToggleBook();
      };
    }
    this.description = args.description;
  }

  clone(): Item {
    return new Item({
      pos: new Position().addPos(this.pos),
      spriteSheetPos: this.spriteSheetPos,
      name: this.name,
      shopName: this.shopName,
      cost: this.cost,
      description: this.description,
    });
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
  gold_bug: new Item({
    spriteSheetPos: new Position(0, 4),
    name: "gold_bug",
    shopName: "Gold Bug",
    cost: 20,
    description: "More gold. More worms.\nThe bug's curse is everlasting.",
  }),
  silver_bell: new Item({
    spriteSheetPos: new Position(2, 4),
    name: "silver_bell",
    shopName: "Silver Bell",
    cost: 38,
    description: "Reveals location of doors",
  }),
  dark_crystal: new Item({
    spriteSheetPos: new Position(4, 4),
    name: "dark_crystal",
    shopName: "Dark Crystal",
    cost: 25,
    description: "Allows you to break blocks you can't see.",
  }),
  detonator: new Item({
    spriteSheetPos: new Position(6, 4),
    name: "detonator",
    shopName: "Detonator",
    cost: 23,
    description:
      "Use this to break all unmarked blocks around a block instantly.",
  }),
  drill: new Item({
    spriteSheetPos: new Position(8, 4),
    name: "drill",
    shopName: "Drill",
    cost: 36,
    description:
      "When breaking a safe block all connected safe blocks are also broken.",
  }),
  health_insurance: new Item({
    spriteSheetPos: new Position(10, 4),
    name: "health_insurance",
    shopName: "Health Insurance",
    cost: 40,
    description: "Gain 1 heart when clearing a level.",
  }),
  empty: new Item({
    spriteSheetPos: new Position(14, 4),
    name: "empty",
    shopName: "",
    cost: 0,
    description: "",
  }),
  picaxe: new Item({
    spriteSheetPos: new Position(0, 7),
    name: "picaxe",
    shopName: "",
    cost: 0,
    description: "Left click any block that's not hidden to break it.",
  }),
  flag: new Item({
    spriteSheetPos: new Position(2, 7),
    name: "flag",
    shopName: "",
    cost: 0,
    description: "Right click any block to mark it as a possible threat.",
  }),
  book: new Item({
    spriteSheetPos: new Position(4, 7),
    name: "book",
    shopName: "",
    cost: 0,
    description: "Click to open the guide book.",
  }),
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
