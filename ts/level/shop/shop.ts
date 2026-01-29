import { canvasManager } from "../../canvasManager.js";
import GameObject from "../../gameElements/gameObject.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEWIDTH,
} from "../../global.js";
import { ChangeScene, ResetShop, ShopItemDescription } from "../../action.js";
import Position from "../../gameElements/position.js";
import { sprites } from "../../sprites.js";
import { ShopItem } from "./shopItem.js";
import { utils } from "../../utils.js";
import type { Item } from "../../items/item.js";
import { armorDict, type Armor } from "../../items/armor/armor.js";
import { weaponDict } from "../../items/weapon/dict.js";
import { Shield } from "../../items/shield/shield.js";
import type { InstantItem } from "../../items/instant/instantItem.js";
import type { Weapon } from "../../items/weapon/weapon.js";
import playerInventory from "../../inventory/playerInventory.js";
import passivesDict from "../../items/passiveDict.js";
import activeDict from "../../items/active/dict.js";
import consumableDict from "../../items/consumableDict.js";
import { shieldDict } from "../../items/shield/dict.js";

const exitBtn = new GameObject({
  sprite: sprites.button_exit,
  pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 32, BORDERTHICKTOP),
  width: 32,
  clickFunction: () => {
    return new ChangeScene("cave");
  },
});
exitBtn.render = () => {
  canvasManager.renderSpriteFromSheet(
    exitBtn.sprite,
    exitBtn.pos,
    32,
    16,
    new Position().add(exitBtn.mouseHovering ? 1 : 0, 0),
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
      "Reset items.\n\nItems on the left will always be different than the previous set if possible.",
    );
  },
});
resetBtn.render = () => {
  canvasManager.renderSpriteFromSheet(
    resetBtn.sprite,
    resetBtn.pos,
    32,
    16,
    new Position().add(resetBtn.mouseHovering ? 1 : 0, 0),
  );
};

const shopItemList: Item[] = [
  ...Object.values(passivesDict),
  ...Object.values(activeDict),
].filter((x) => x.cost > 0);

const shopArmorList: Armor[] = Object.values(armorDict).filter(
  (x) => x.cost > 0,
);

const shopWeaponList: Weapon[] = Object.values(weaponDict).filter(
  (x) => x.cost > 0,
);

const shopShieldList: Shield[] = Object.values(shieldDict).filter(
  (x) => x.cost > 0,
);

const shopConsList: InstantItem[] = Object.values(consumableDict).filter(
  (x) => x.cost > 0,
);

const shelfItemDistance = 20;
const shelfStartDistance = 9;

export default class Shop {
  objects!: GameObject[];
  genericItems!: ShopItem[];
  armor: ShopItem | undefined;
  weapon: ShopItem | undefined;
  shield: ShopItem | undefined;
  consumable1!: ShopItem;
  consumable2!: ShopItem;
  inventoryItemNames: string[] = [];
  previousSetItemNames: string[] = [];

  constructor() {
    this.setItems();
  }

  setItems() {
    this.inventoryItemNames = [
      playerInventory.weapon.name,
      playerInventory.shield.name,
      playerInventory.armor.name,
      playerInventory.active.name,
      playerInventory.altActive.name,
      ...playerInventory.passives.map((x) => x.name),
    ].filter((x) => !Object.keys(consumableDict).includes(x));
    let filterNames = [
      ...this.inventoryItemNames,
      ...this.previousSetItemNames,
      ...playerInventory.soldItemNames,
    ];
    this.previousSetItemNames = [];
    this.genericItems = utils
      .shuffleArray(shopItemList.filter((x) => !filterNames.includes(x.name)))
      .slice(0, 3)
      .map((x) => new ShopItem(x.name));
    if (this.genericItems.length < 3) {
      this.genericItems = utils
        .shuffleArray(
          shopItemList.filter(
            (x) => ![...this.inventoryItemNames].includes(x.name),
          ),
        )
        .slice(0, 3)
        .map((x) => new ShopItem(x.name));
    }
    this.genericItems.forEach((shopItem, i) => {
      shopItem.pos.update(
        BORDERTHICKLEFT + shelfStartDistance + i * shelfItemDistance,
        28,
      );
      this.previousSetItemNames.push(shopItem.item.name);
    });

    const chosenarmor = utils.shuffleArray(
      shopArmorList.filter((x) => !filterNames.includes(x.name)),
    )[0];
    this.armor = new ShopItem(chosenarmor.name);
    this.previousSetItemNames.push(this.armor.item.name);

    const chosenWeapon = utils.shuffleArray(
      shopWeaponList.filter((x) => !filterNames.includes(x.name)),
    )[0];
    this.weapon = new ShopItem(chosenWeapon.name);
    this.previousSetItemNames.push(this.weapon.item.name);

    const chosenShield = utils.shuffleArray(
      shopShieldList.filter((x) => !filterNames.includes(x.name)),
    )[0];
    this.shield = new ShopItem(chosenShield.name);
    this.previousSetItemNames.push(this.shield.item.name);

    const chosenConsumables = utils
      .shuffleArray(shopConsList.filter((x) => !filterNames.includes(x.name)))
      .slice(0, 2);
    this.consumable1 = new ShopItem(chosenConsumables[0].name);
    this.consumable1.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 24, 40);
    this.consumable2 = new ShopItem(chosenConsumables[1].name);
    this.consumable2.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 44, 40);

    this.objects = [
      exitBtn,
      resetBtn,
      ...this.genericItems,
      this.consumable1,
      this.consumable2,
    ];
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
