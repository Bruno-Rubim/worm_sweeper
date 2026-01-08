import type CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import { CENTER, CLICKLEFT, type cursorClick } from "../global.js";
import { BuyShopItem } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import timeTracker from "../timer/timeTracker.js";
import { armorDic } from "./armor/armor.js";
import { consumableDic } from "./consumable/consumable.js";
import { timerQueue } from "../timer/timerQueue.js";
import { SilverBell } from "./passives/silverBell.js";
import { itemDic } from "./passives/dict.js";
import type { Item } from "./item.js";
import { weaponDic } from "./weapon/weapon.js";
import { shieldDic } from "./shield/shield.js";

type itemName =
  | keyof typeof armorDic
  | keyof typeof itemDic
  | keyof typeof consumableDic
  | keyof typeof weaponDic
  | keyof typeof shieldDic;

const items: Record<itemName, Item> = {
  ...weaponDic,
  ...armorDic,
  ...consumableDic,
  ...shieldDic,
  ...itemDic,
};

export class ShopItem extends GameObject {
  item: Item;

  constructor(itemName: itemName) {
    super({
      pos: new Position(),
      sprite: sprites.item_sheet,
      hitboxWidth: 20,
      hitboxPosShift: new Position(-2, 0),
    });
    this.item = items[itemName];
    this.clickFunction = (cursorPos: Position, button: cursorClick) => {
      if (this.item instanceof SilverBell) {
        timerQueue.push(this.item.ringTimer);
      }
      if (button == CLICKLEFT) return new BuyShopItem(this);
    };
  }

  render(canvasManager: CanvasManager): void {
    canvasManager.renderSpriteFromSheet(
      sprites.item_sheet,
      this.pos,
      16,
      16,
      this.item.spriteSheetPos
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        sprites.item_sheet,
        this.pos,
        16,
        16,
        this.item.spriteSheetPos.add(1, 0)
      );
    }
    canvasManager.renderText(
      "numbers_cost",
      this.pos.add(9, 18),
      this.item.cost.toString(),
      CENTER
    );
    if (this.item.name == "time_potion") {
      canvasManager.renderAnimationFrame(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        12,
        1,
        this.firstAnimationTic,
        timeTracker.currentGameTic
      );
      canvasManager.renderAnimationFrame(
        sprites.time_potion_pointer_sheet,
        this.pos,
        16,
        16,
        12,
        1,
        this.firstAnimationTic,
        timeTracker.currentGameTic,
        1 / 12,
        new Position(0, 1)
      );
    }
    if (this.mouseHovering) {
      canvasManager.renderText(
        "shop_description",
        new Position(27, 95),
        this.item.shopName + "\n\n" + this.item.description,
        "right",
        120,
        0.8
      );
    }
  }
}
