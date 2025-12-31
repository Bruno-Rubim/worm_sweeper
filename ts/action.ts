import type { cursorState } from "./cursor.js";
import type { ShopItem } from "./items/shopItem.js";

export class Action {}

export class ChangeCursorState extends Action {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}

export class ChangeScene extends Action {
  newScene: "cave" | "shop" | "battle";
  constructor(newScene: "cave" | "shop" | "battle") {
    super();
    this.newScene = newScene;
  }
}

export class BuyShopItem extends Action {
  shopItem: ShopItem;
  constructor(shopItem: ShopItem) {
    super();
    this.shopItem = shopItem;
  }
}

export class ConsumeItem extends Action {
  itemName: string;
  constructor(itemName: string) {
    super();
    this.itemName = itemName;
  }
}

export class EnemyAtack extends Action {
  damage: number;
  constructor(damage: number) {
    super();
    this.damage = damage;
  }
}

export class PlayerAtack extends Action {
  constructor() {
    super();
  }
}
