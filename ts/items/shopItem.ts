import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { BuyShopItem } from "../objectAction.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import { armorDic } from "./armor.js";
import { consumableDic } from "./consumable.js";
import { getItem, type Item, type itemPosDic } from "./item.js";
import { shieldDic } from "./shield.js";
import { weaponDic } from "./weapon.js";

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
  item: Item;
};

const shopItemSpecs: Record<itemName, itemSpecs> = {
  big_sword: {
    name: "Big Sword",
    cost: 52,
    desc: "Not implemented",
    item: weaponDic.big_sword,
  },
  bomb: {
    name: "Bomb",
    cost: 13,
    desc: "Not implemented",
    item: consumableDic.bomb,
  },
  book: {
    name: "Book",
    cost: 0,
    desc: "Not implemented",
    item: getItem("book"),
  },
  chainmail: {
    name: "Chainmail",
    cost: 50,
    desc: "Not implemented",
    item: armorDic.chainmail,
  },
  dagger: {
    name: "Dagger",
    cost: 37,
    desc: "Not implemented",
    item: weaponDic.dagger,
  },
  dark_crystal: {
    name: "Dark Crystal",
    cost: 25,
    desc: "Allows you to break blocks you can't see.",
    item: getItem("dark_crystal"),
  },
  detonator: {
    name: "Detonator",
    cost: 20,
    desc: "Use this to break all unmarked blocks around a block instantly.",
    item: getItem("detonator"),
  },
  drill: {
    name: "Drill",
    cost: 36,
    desc: "When breaking a safe block all connected safe blocks are also broken.",
    item: getItem("drill"),
  },
  empty: {
    name: "Empty",
    cost: 0,
    desc: "Not implemented",
    item: armorDic.empty,
  },
  flag: {
    name: "Flag",
    cost: 0,
    desc: "Not implemented",
    item: getItem("flag"),
  },
  gold_bug: {
    name: "Gold Bug",
    cost: 20,
    desc: "More gold. More worms.",
    item: getItem("gold_bug"),
  },
  health_potion: {
    name: "Health Potion",
    cost: 10,
    desc: "Gain 1 heart.",
    item: consumableDic.health_potion,
  },
  health_potion_big: {
    name: "Big Health Potion",
    cost: 15,
    desc: "Gain 2 hearts",
    item: consumableDic.health_potion_big,
  },
  jade_shield: {
    name: "Jade Shield",
    cost: 30,
    desc: "Not implemented",
    item: shieldDic.jade_shield,
  },
  picaxe: {
    name: "Picaxe",
    cost: 0,
    desc: "Not implemented",
    item: getItem("picaxe"),
  },
  silver_bell: {
    name: "Silver Bell",
    cost: 38,
    desc: "Reveals location of doors",
    item: getItem("silver_bell"),
  },
  steel_shield: {
    name: "Steel Shield",
    cost: 35,
    desc: "Not implemented",
    item: shieldDic.steel_shield,
  },
  swift_vest: {
    name: "Swift Vest",
    cost: 40,
    desc: "Not implemented",
    item: armorDic.swift_vest,
  },
  time_blade: {
    name: "Time Blade",
    cost: 55,
    desc: "Not implemented",
    item: weaponDic.time_blade,
  },
  time_potion: {
    name: "Time Potion",
    cost: 10,
    desc: "Recover 10 seconds",
    item: consumableDic.time_potion,
  },
  wood_shield: {
    name: "Wood Shield",
    cost: 0,
    desc: "Not implemented",
    item: shieldDic.wood_shield,
  },
  wood_sword: {
    name: "Wood Sword",
    cost: 0,
    desc: "Not implemented",
    item: weaponDic.wood_sword,
  },
};

export class ShopItem extends GameObject {
  itemName: itemName;
  spriteSheetPos: Position;
  shopName: string;
  cost: number;
  desc: string;
  item: Item;

  constructor(itemName: itemName, spriteSheetPos: Position) {
    super({
      pos: new Position(),
      sprite: sprites.item_sheet,
      hitboxWidth: 20,
      hitboxPosShift: new Position(-2, 0),
    });
    this.itemName = itemName;
    this.spriteSheetPos = spriteSheetPos;
    this.shopName = shopItemSpecs[itemName].name;
    this.cost = shopItemSpecs[itemName].cost;
    this.desc = shopItemSpecs[itemName].desc;
    this.item = shopItemSpecs[itemName].item;
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
    if (this.itemName == "time_potion") {
      canvasManager.renderSpriteFromSheet(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        new Position(11, 0)
      );
      canvasManager.renderSpriteFromSheet(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        new Position(2, 1)
      );
    }
    if (this.mouseHovering) {
      canvasManager.renderText(
        "shop_description",
        new Position(27, 95),
        this.shopName + "\n\n" + this.desc,
        "right",
        120
      );
      canvasManager.renderText(
        "shop_description",
        new Position(112, 95),
        "Buy: "
      );
      canvasManager.renderText(
        "numbers_gold",
        new Position(136, 95),
        this.cost.toString()
      );
    }
  }
}
