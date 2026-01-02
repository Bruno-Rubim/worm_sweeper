import type { cursorState } from "./cursor.js";
import type { LEFT, RIGHT } from "./global.js";
import type { ShopItem } from "./items/shopItem.js";
import type Position from "./position.js";

export class Action {}

export class ChangeCursorState extends Action {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}

export class Transition extends Action {
  transFunc?: Function;
  transDelay?: number;
  constructor(transFunc?: Function, transDelay?: number) {
    super();
    if (transFunc) {
      this.transFunc = transFunc;
    }
    if (transDelay) {
      this.transDelay = transDelay;
    }
  }
}

export class NextLevel extends Action {
  starterGridPos: Position;
  constructor(starterGridPos: Position) {
    super();
    this.starterGridPos = starterGridPos;
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

export class OpenBook extends Action {
  constructor() {
    super();
  }
}

export class ItemDescription extends Action {
  description: string;
  side: typeof LEFT | typeof RIGHT;
  descFontSize: number;
  constructor(
    description: string,
    side: typeof LEFT | typeof RIGHT,
    descFontSize: number
  ) {
    super();
    this.description = description;
    this.side = side;
    this.descFontSize = descFontSize;
  }
}
