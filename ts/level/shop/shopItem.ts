import type CanvasManager from "../../canvasManager.js";
import GameObject from "../../gameObject.js";
import { CENTER, CLICKLEFT, type cursorClick } from "../../global.js";
import { Action, BuyShopItem, ShopItemDescription } from "../../action.js";
import Position from "../../position.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import { armorDic } from "../../items/armor/armor.js";
import { timerQueue } from "../../timer/timerQueue.js";
import { SilverBell } from "../../items/passives/silverBell.js";
import { itemDic } from "../../items/passives/dict.js";
import type { Item } from "../../items/item.js";
import { weaponDic } from "../../items/weapon/dict.js";
import { shieldDic } from "../../items/shield/shield.js";
import consumableDic from "../../items/consumable/dict.js";

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
      if (button == CLICKLEFT) return new BuyShopItem(this);
    };
  }

  hoverFunction = (cursorPos: Position) => {
    return new ShopItemDescription(
      this.item.shopName + "\n\n" + this.item.description
    );
  };

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
  }
}
