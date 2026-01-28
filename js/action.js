export class Action {
}
export class ChangeCursorState extends Action {
    newState;
    constructor(newState) {
        super();
        this.newState = newState;
    }
}
export class Transition extends Action {
    transFunc;
    transDelay;
    constructor(transFunc, transDelay) {
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
    starterGridPos;
    constructor(starterGridPos) {
        super();
        this.starterGridPos = starterGridPos;
    }
}
export class ChangeScene extends Action {
    newScene;
    constructor(newScene) {
        super();
        this.newScene = newScene;
    }
}
export class ShopItemDescription extends Action {
    description;
    constructor(description) {
        super();
        this.description = description;
    }
}
export class BuyShopItem extends Action {
    shopItem;
    constructor(shopItem) {
        super();
        this.shopItem = shopItem;
    }
}
export class SellItem extends Action {
    item;
    constructor(item) {
        super();
        this.item = item;
    }
}
export class ResetShop extends Action {
}
export class ConsumeItem extends Action {
    itemName;
    constructor(itemName) {
        super();
        this.itemName = itemName;
    }
}
export class EnemyAttack extends Action {
    damage;
    enemy;
    constructor(damage, enemy) {
        super();
        this.damage = damage;
        this.enemy = enemy;
    }
}
export class ToggleBook extends Action {
}
export class ToggleInventory extends Action {
}
export class ItemDescription extends Action {
    description;
    side;
    descFontSize;
    constructor(description, side, descFontSize) {
        super();
        this.description = description;
        this.side = side;
        this.descFontSize = descFontSize;
    }
}
export class LoseGame extends Action {
}
export class RestartGame extends Action {
}
export class StartBattle extends Action {
    enemyCount;
    constructor(enemyCount) {
        super();
        this.enemyCount = enemyCount;
    }
}
export class PauseGameTimer extends Action {
}
export class UseActiveItem extends Action {
    alt;
    constructor(alt) {
        super();
        this.alt = alt;
    }
}
