import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import type { inventory } from "../gameState.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEWIDTH,
} from "../global.js";
import { armorDic, type Armor } from "../items/armor.js";
import { consumableDic, type Consumable } from "../items/consumable.js";
import { getItem, itemDic, type Item } from "../items/item.js";
import { shieldDic, type Shield } from "../items/shield.js";
import { ShopItem } from "../items/shopItem.js";
import { weaponDic, type Weapon } from "../items/weapon.js";
import { ChangeScene } from "../action.js";
import Position from "../position.js";
import { sprites } from "../sprites.js";
import { utils } from "../utils.js";

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
  objects: GameObject[];
  items: ShopItem[];
  armor: ShopItem | undefined;
  weapon: ShopItem | undefined;
  shield: ShopItem | undefined;
  consumable: ShopItem;
  constructor(inventory: inventory) {
    const inventoryItemNames = [
      inventory.weapon.name,
      inventory.shield.name,
      inventory.armor.name,
      inventory.passive_1?.name,
      inventory.passive_2?.name,
      inventory.passive_3?.name,
      inventory.passive_4?.name,
      inventory.passive_5?.name,
      inventory.passive_6?.name,
    ];
    this.items = utils
      .shuffleArray(
        shopItemList.filter((x) => !inventoryItemNames.includes(x.name))
      )
      .slice(0, 3)
      .map((x) => new ShopItem(x.name));
    this.items.forEach((item, i) => {
      item.pos.update(
        BORDERTHICKLEFT + shelfStartDistance + i * shelfItemDistance,
        28
      );
    });

    const chosenarmor = utils.shuffleArray(
      shopArmorList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.armor = new ShopItem(chosenarmor.name);

    const chosenWeapon = utils.shuffleArray(
      shopWeaponList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.weapon = new ShopItem(chosenWeapon.name);

    const chosenShield = utils.shuffleArray(
      shopShieldList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.shield = new ShopItem(chosenShield.name);

    const chosenConsumable = utils.shuffleArray(shopConsList)[0];
    this.consumable = new ShopItem(chosenConsumable.name);
    this.consumable.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 28, 46);

    this.objects = [exitBtn, ...this.items, this.consumable];
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
