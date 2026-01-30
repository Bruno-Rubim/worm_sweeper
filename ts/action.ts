import type { cursorState } from "./cursor.js";
import type { CENTER, LEFT, RIGHT } from "./global.js";
import type { Item } from "./items/item.js";
import type Position from "./gameElements/position.js";
import type { ShopItem } from "./level/shop/shopItem.js";
import type { Enemy } from "./level/battle/enemy.js";
import type { ActiveSlot, Slot } from "./inventory/slot.js";

// Represents a consequence of something happening in game
export class Action {}

export class ChangeCursorState extends Action {
  newState: cursorState;
  constructor(newState: cursorState) {
    super();
    this.newState = newState;
  }
}

// Calls for the transition object in levelManager. Can carry a function and delay.
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

// Calls for the next level, holds the position which that level's cave will start.
export class NextLevel extends Action {
  starterGridPos: Position;
  constructor(starterGridPos: Position) {
    super();
    this.starterGridPos = starterGridPos;
  }
}

// Calls to change the current scene
export class ChangeScene extends Action {
  newScene: "cave" | "shop" | "battle";
  constructor(newScene: "cave" | "shop" | "battle") {
    super();
    this.newScene = newScene;
  }
}

// Calls to show a description on the shop
export class ShopItemDescription extends Action {
  description: string;
  constructor(description: string) {
    super();
    this.description = description;
  }
}

// Calls to buy a shop item
export class BuyShopItem extends Action {
  shopItem: ShopItem;
  constructor(shopItem: ShopItem) {
    super();
    this.shopItem = shopItem;
  }
}

// Calls to add an item to inventory
export class ObtainItem extends Action {
  item: Item;
  constructor(item: Item) {
    super();
    this.item = item;
  }
}

// Calls to equip an item from an inventory slot
export class EquipItem extends Action {
  slot: Slot;
  constructor(slot: Slot) {
    super();
    this.slot = slot;
  }
}

// Calls to sell an item from inventory
export class SellItem extends Action {
  slot: Slot;
  constructor(slot: Slot) {
    super();
    this.slot = slot;
  }
}

// Calls to reset the items of the current shop
export class ResetShop extends Action {}

// Calls for consumption of a consumable item
export class ConsumeItem extends Action {
  itemName: string;
  constructor(itemName: string) {
    super();
    this.itemName = itemName;
  }
}

// Calls for an enemy attack, holding which enemy is attacking and their damage
export class EnemyAttack extends Action {
  damage: number;
  enemy: Enemy;
  constructor(damage: number, enemy: Enemy) {
    super();
    this.damage = damage;
    this.enemy = enemy;
  }
}

// Calls to open/close the rule book
export class ToggleBook extends Action {}

// Calls to open/close the rule book
export class ToggleInventory extends Action {}

// Calls to render an item description next to the cursor
export class ItemDescription extends Action {
  description: string;
  side: typeof LEFT | typeof RIGHT | typeof CENTER;
  descFontSize: number;
  constructor(
    description: string,
    side: typeof LEFT | typeof RIGHT | typeof CENTER,
    descFontSize: number,
  ) {
    super();
    this.description = description;
    this.side = side;
    this.descFontSize = descFontSize;
  }
}

// Calls to restart the game
export class LoseGame extends Action {}

// Calls to restart the game
export class RestartGame extends Action {}

// Calls to start a battle
export class StartBattle extends Action {
  enemyCount: number;
  chest: boolean;
  constructor(enemyCount: number, chest: boolean) {
    super();
    this.enemyCount = enemyCount;
    this.chest = chest;
  }
}

export class PauseGameTimer extends Action {}

// Calls to use the current active item
export class UseActiveItem extends Action {
  slot: ActiveSlot;
  constructor(slot: ActiveSlot) {
    super();
    this.slot = slot;
  }
}
