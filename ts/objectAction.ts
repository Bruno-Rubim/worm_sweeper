import type { cursorState } from "./cursor.js";
import type { ShopItem } from "./items/shopItem.js";

export class ObjectAction {}

export class ChangeCursorState extends ObjectAction {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}

export class ChangeScene extends ObjectAction {
  newScene: "cave" | "shop" | "battle";
  constructor(newScene: "cave" | "shop" | "battle") {
    super();
    this.newScene = newScene;
  }
}

export class BuyShopItem extends ObjectAction {
  shopItem: ShopItem;
  constructor(shopItem: ShopItem) {
    super();
    this.shopItem = shopItem;
  }
}
