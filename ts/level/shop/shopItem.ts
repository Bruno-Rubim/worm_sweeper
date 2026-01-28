import { CENTER, CLICKLEFT, type cursorClick } from "../../global.js";
import { sprites } from "../../sprites.js";
import timeTracker from "../../timer/timeTracker.js";
import type { Item } from "../../items/item.js";
import GameObject from "../../gameElements/gameObject.js";
import Position from "../../gameElements/position.js";
import { BuyShopItem, ShopItemDescription } from "../../action.js";
import { canvasManager } from "../../canvasManager.js";
import { armorDict } from "../../items/armor/armor.js";
import { weaponDict } from "../../items/weapon/dict.js";
import passivesDict from "../../items/passiveDict.js";
import activeDict from "../../items/active/dict.js";
import consumableDict from "../../items/consumableDict.js";
import { shieldDict } from "../../items/shield/dict.js";

type itemName =
  | keyof typeof passivesDict
  | keyof typeof armorDict
  | keyof typeof consumableDict
  | keyof typeof weaponDict
  | keyof typeof shieldDict;

const items: Record<itemName, Item> = {
  ...passivesDict,
  ...activeDict,
  ...weaponDict,
  ...armorDict,
  ...consumableDict,
  ...shieldDict,
};

export class ShopItem extends GameObject {
  item: Item;

  constructor(itemName: itemName) {
    super({
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
      this.item.shopName + "\n\n" + this.item.description,
    );
  };

  render(): void {
    canvasManager.renderSpriteFromSheet(
      sprites.item_sheet,
      this.pos,
      16,
      16,
      this.item.spriteSheetPos,
    );
    if (this.mouseHovering) {
      canvasManager.renderSpriteFromSheet(
        sprites.item_sheet,
        this.pos,
        16,
        16,
        this.item.spriteSheetPos.add(1, 0),
      );
    }
    canvasManager.renderText(
      "numbers_cost",
      this.pos.add(9, 18),
      this.item.finalCost.toString(),
      CENTER,
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
        timeTracker.currentGameTic,
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
        new Position(0, 1),
      );
    }
  }
}
