import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import type { inventory } from "../gameState.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEWIDTH,
} from "../global.js";
import { armorDic, type Armor } from "../items/armor/armor.js";
import { type Consumable } from "../items/consumable/consumable.js";
import { ShopItem } from "../items/shopItem.js";
import { ChangeScene, ResetShop, ShopItemDescription } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { utils } from "../utils.js";
import type { Item } from "../items/item.js";
import { itemDic } from "../items/passives/dict.js";
import { Weapon } from "../items/weapon/weapon.js";
import { Shield, shieldDic } from "../items/shield/shield.js";
import { weaponDic } from "../items/weapon/dict.js";
import type GameState from "../gameState.js";
import TimeBlade from "../items/weapon/timeBlade.js";
import consumableDic from "../items/consumable/dict.js";

const exitBtn = new GameObject({
  sprite: sprites.button_exit,
  pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 32, BORDERTHICKTOP),
  width: 32,
  clickFunction: () => {
    return new ChangeScene("cave");
  },
});
exitBtn.render = (canvasManager: CanvasManager) => {
  canvasManager.renderSpriteFromSheet(
    exitBtn.sprite,
    exitBtn.pos,
    32,
    16,
    new Position().add(exitBtn.mouseHovering ? 1 : 0, 0)
  );
};

const resetBtn = new GameObject({
  sprite: sprites.button_reset,
  pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 34, BORDERTHICKTOP + 56),
  width: 32,
  clickFunction: () => {
    return new ResetShop();
  },
  hoverFunction: () => {
    return new ShopItemDescription(
      "Reset items.\n\nItems will always be different than the previous set if possible."
    );
  },
});
resetBtn.render = (canvasManager: CanvasManager) => {
  canvasManager.renderSpriteFromSheet(
    resetBtn.sprite,
    resetBtn.pos,
    32,
    16,
    new Position().add(resetBtn.mouseHovering ? 1 : 0, 0)
  );
};

const shopItemList: Item[] = Object.values(itemDic).filter((x) => x.cost > 0);

const shopArmorList: Armor[] = Object.values(armorDic).filter(
  (x) => x.cost > 0
);

const shopWeaponList: Weapon[] = Object.values(weaponDic).filter(
  (x) => x.cost > 0
);

const shopShieldList: Shield[] = Object.values(shieldDic).filter(
  (x) => x.cost > 0
);

const shopConsList: Consumable[] = Object.values(consumableDic).filter(
  (x) => x.cost > 0
);

const shelfItemDistance = 20;
const shelfStartDistance = 12;

export default class Shop {
  objects!: GameObject[];
  passives!: ShopItem[];
  armor: ShopItem | undefined;
  weapon: ShopItem | undefined;
  shield: ShopItem | undefined;
  consumable!: ShopItem;
  gameState: GameState;
  inventoryItemNames: string[] = [];
  previousSetItemNames: string[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.setItems();
  }

  setItems() {
    this.inventoryItemNames = [
      this.gameState.inventory.weapon.name,
      this.gameState.inventory.shield.name,
      this.gameState.inventory.armor.name,
      this.gameState.inventory.passive_1.name,
      this.gameState.inventory.passive_2.name,
      this.gameState.inventory.passive_3.name,
      this.gameState.inventory.passive_4.name,
      this.gameState.inventory.passive_5.name,
      this.gameState.inventory.passive_6.name,
      this.gameState.inventory.passive_7.name,
      this.gameState.inventory.bag.name,
    ];
    let filterNames = [
      ...this.inventoryItemNames,
      ...this.previousSetItemNames,
    ];
    this.previousSetItemNames = [];
    this.passives = utils
      .shuffleArray(shopItemList.filter((x) => !filterNames.includes(x.name)))
      .slice(0, 3)
      .map((x) => new ShopItem(x.name));
    if (this.passives.length < 3) {
      this.passives = utils
        .shuffleArray(
          shopItemList.filter(
            (x) =>
              ![
                ...this.inventoryItemNames,
                ...this.passives.map((x) => x.item.name),
              ].includes(x.name)
          )
        )
        .slice(0, 3)
        .map((x) => new ShopItem(x.name));
    }
    this.passives.forEach((shopItem, i) => {
      shopItem.pos.update(
        BORDERTHICKLEFT + shelfStartDistance + i * shelfItemDistance,
        28
      );
      this.previousSetItemNames.push(shopItem.item.name);
    });

    const chosenarmor = utils.shuffleArray(
      shopArmorList.filter((x) => !filterNames.includes(x.name))
    )[0];
    this.armor = new ShopItem(chosenarmor.name);
    this.previousSetItemNames.push(this.armor.item.name);

    const chosenWeapon = utils.shuffleArray(
      shopWeaponList.filter((x) => !filterNames.includes(x.name))
    )[0];
    this.weapon = new ShopItem(chosenWeapon.name);
    if (this.weapon.item instanceof TimeBlade) {
      this.weapon.item.gameTimer = this.gameState.gameTimer;
    }
    this.previousSetItemNames.push(this.weapon.item.name);

    const chosenShield = utils.shuffleArray(
      shopShieldList.filter((x) => !filterNames.includes(x.name))
    )[0];
    this.shield = new ShopItem(chosenShield.name);
    this.previousSetItemNames.push(this.shield.item.name);

    const chosenConsumable = utils.shuffleArray(
      shopConsList.filter((x) => !filterNames.includes(x.name))
    )[0];
    this.consumable = new ShopItem(chosenConsumable.name);
    this.consumable.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 28, 40);
    this.previousSetItemNames.push(this.consumable.item.name);

    this.objects = [exitBtn, resetBtn, ...this.passives, this.consumable];
    let xShift = shelfStartDistance;
    if (this.armor) {
      this.armor.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.armor);
      xShift += shelfItemDistance;
    }
    if (this.shield) {
      this.shield.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.shield);
      xShift += shelfItemDistance;
    }
    if (this.weapon) {
      this.weapon.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.weapon);
    }
  }
}
