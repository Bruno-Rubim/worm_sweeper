import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { BuyShopItem } from "../objectAction.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import type { armorDic } from "./armor.js";
import type { consumableDic } from "./consumable.js";
import type { itemPosDic } from "./item.js";
import type { shieldDic } from "./shield.js";
import type { weaponDic } from "./weapon.js";

type itemName =
  | keyof typeof armorDic
  | keyof typeof itemPosDic
  | keyof typeof consumableDic
  | keyof typeof weaponDic
  | keyof typeof shieldDic;

type itemSpecs = {
  cost: number;
  desc: string;
  name: string;
};

const shopItemSpecs: Record<itemName, itemSpecs> = {
  big_sword: {
    name: "Big Sword",
    cost: 0,
    desc: "0",
  },
  bomb: {
    name: "Bomb",
    cost: 0,
    desc: "0",
  },
  book: {
    name: "Book",
    cost: 0,
    desc: "0",
  },
  chainmail: {
    name: "Chainmail",
    cost: 0,
    desc: "0",
  },
  dagger: {
    name: "Dagger",
    cost: 0,
    desc: "0",
  },
  dark_crystal: {
    name: "Dark Crystal",
    cost: 0,
    desc: "0",
  },
  detonator: {
    name: "Detonator",
    cost: 0,
    desc: "0",
  },
  drill: {
    name: "Drill",
    cost: 0,
    desc: "0",
  },
  empty: {
    name: "Empty",
    cost: 0,
    desc: "0",
  },
  flag: {
    name: "Flag",
    cost: 0,
    desc: "0",
  },
  gold_bug: {
    name: "Gold Bug",
    cost: 0,
    desc: "0",
  },
  health_potion: {
    name: "Health Potion",
    cost: 0,
    desc: "0",
  },
  health_potion_big: {
    name: "Big Health Potion",
    cost: 0,
    desc: "0",
  },
  jade_shield: {
    name: "Jade Shield",
    cost: 0,
    desc: "0",
  },
  picaxe: {
    name: "Picaxe",
    cost: 0,
    desc: "0",
  },
  silver_bell: {
    name: "Silver Bell",
    cost: 0,
    desc: "0",
  },
  steel_shield: {
    name: "Steel Shield",
    cost: 0,
    desc: "0",
  },
  swift_vest: {
    name: "Swift Vest",
    cost: 0,
    desc: "0",
  },
  time_blade: {
    name: "Time Blade",
    cost: 0,
    desc: "0",
  },
  time_potion: {
    name: "Time Potion",
    cost: 0,
    desc: "0",
  },
  wood_shield: {
    name: "Wood Shield",
    cost: 0,
    desc: "0",
  },
  wood_sword: {
    name: "Wood Sword",
    cost: 0,
    desc: "0",
  },
};

export class ShopItem extends GameObject {
  itemName: string;
  spriteSheetPos: Position;
  name: string;
  cost: number;
  desc: string;
  constructor(name: itemName, spriteSheetPos: Position) {
    super({ pos: new Position(), sprite: sprites.item_sheet });
    this.itemName = name;
    this.spriteSheetPos = spriteSheetPos;
    this.name = shopItemSpecs[name].name;
    this.cost = shopItemSpecs[name].cost;
    this.desc = shopItemSpecs[name].desc;
    this.clickFunction = () => {
      return new BuyShopItem(this);
    };
  }
  render(canvasManager: CanvasManager): void {
    canvasManager.renderSpriteFromSheet(
      sprites.item_sheet,
      this.pos,
      16,
      16,
      this.spriteSheetPos.add(this.mouseHovering ? 1 : 0, 0)
    );
    if (this.mouseHovering) {
      canvasManager.renderText(
        sprites.letters_shop_description,
        "shop_description",
        new Position(27, 95),
        this.name + "\n" + this.desc
      );
    }
  }
}
