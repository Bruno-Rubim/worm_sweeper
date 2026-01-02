import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { CLICKLEFT, type cursorClick } from "../global.js";
import { BuyShopItem } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import timeTracker from "../timer/timeTracker.js";
import { armorDic } from "./armor.js";
import { consumableDic } from "./consumable.js";
import { getItem, itemDic, type Item } from "./item.js";
import { shieldDic } from "./shield.js";
import { weaponDic } from "./weapon.js";

type itemName =
  | keyof typeof armorDic
  | keyof typeof itemDic
  | keyof typeof consumableDic
  | keyof typeof weaponDic
  | keyof typeof shieldDic;

type itemSpecs = {
  cost: number;
  name: string;
  item: Item;
};

const shopItemSpecs: Record<itemName, itemSpecs> = {
  big_sword: {
    name: "Big Sword",
    cost: 52,
    item: weaponDic.big_sword,
  },
  bomb: {
    name: "Bomb",
    cost: 13,
    item: consumableDic.bomb,
  },
  book: {
    name: "Book",
    cost: 0,
    item: getItem("book"),
  },
  chainmail: {
    name: "Chainmail",
    cost: 50,
    item: armorDic.chainmail,
  },
  dagger: {
    name: "Dagger",
    cost: 37,
    item: weaponDic.dagger,
  },
  dark_crystal: {
    name: "Dark Crystal",
    cost: 25,
    item: getItem("dark_crystal"),
  },
  detonator: {
    name: "Detonator",
    cost: 20,
    item: getItem("detonator"),
  },
  drill: {
    name: "Drill",
    cost: 36,
    item: getItem("drill"),
  },
  empty: {
    name: "Empty",
    cost: 0,
    item: armorDic.empty,
  },
  flag: {
    name: "Flag",
    cost: 0,
    item: getItem("flag"),
  },
  gold_bug: {
    name: "Gold Bug",
    cost: 20,
    item: getItem("gold_bug"),
  },
  health_potion: {
    name: "Health Potion",
    cost: 10,
    item: consumableDic.health_potion,
  },
  health_insurance: {
    name: "Health Insurance",
    cost: 40,
    item: getItem("health_insurance"),
  },
  health_potion_big: {
    name: "Big Health Potion",
    cost: 15,
    item: consumableDic.health_potion_big,
  },
  jade_shield: {
    name: "Jade Shield",
    cost: 30,
    item: shieldDic.jade_shield,
  },
  picaxe: {
    name: "Picaxe",
    cost: 0,
    item: getItem("picaxe"),
  },
  silver_bell: {
    name: "Silver Bell",
    cost: 38,
    item: getItem("silver_bell"),
  },
  steel_shield: {
    name: "Steel Shield",
    cost: 35,
    item: shieldDic.steel_shield,
  },
  swift_vest: {
    name: "Swift Vest",
    cost: 40,
    item: armorDic.swift_vest,
  },
  time_blade: {
    name: "Time Blade",
    cost: 55,
    item: weaponDic.time_blade,
  },
  time_potion: {
    name: "Time Potion",
    cost: 10,
    item: consumableDic.time_potion,
  },
  wood_shield: {
    name: "Wood Shield",
    cost: 0,
    item: shieldDic.wood_shield,
  },
  wood_sword: {
    name: "Wood Sword",
    cost: 0,
    item: weaponDic.wood_sword,
  },
};

export class ShopItem extends GameObject {
  itemName: itemName;
  spriteSheetPos: Position;
  shopName: string;
  cost: number;
  desc: string | undefined;
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
    this.desc = shopItemSpecs[itemName].item.description;
    this.item = shopItemSpecs[itemName].item;
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (button == CLICKLEFT) return new BuyShopItem(this);
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
    canvasManager.renderText(
      "numbers_cost",
      this.pos.add(2, 18),
      this.cost.toString()
    );
    if (this.itemName == "time_potion") {
      canvasManager.renderAnimationFrame(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        12,
        1,
        this.birthTic,
        timeTracker.currentGameTic
      );
      canvasManager.renderAnimationFrame(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        12,
        1,
        this.birthTic,
        timeTracker.currentGameTic,
        1 / 12,
        new Position(0, 1)
      );
    }
    if (this.mouseHovering) {
      canvasManager.renderText(
        "shop_description",
        new Position(27, 95),
        this.shopName + "\n\n" + this.item.description,
        "right",
        120,
        0.8
      );
    }
  }
}
