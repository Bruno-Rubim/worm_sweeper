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
import { getItem, type Item } from "../items/item.js";
import { shieldDic, type Shield } from "../items/shield.js";
import { ShopItem } from "../items/shopItem.js";
import { weaponDic, type Weapon } from "../items/weapon.js";
import { ChangeScene } from "../objectAction.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import { utils } from "../utils.js";

const exitBtn = new GameObject({
  sprite: sprites.button_exit,
  pos: new Position(GAMEWIDTH - BORDERTHICKRIGHT - 16, BORDERTHICKTOP),
  clickFunction: () => {
    return new ChangeScene("cave");
  },
});

const shopItemList: Item[] = [
  getItem("gold_bug"),
  getItem("silver_bell"),
  getItem("dark_crystal"),
  getItem("detonator"),
  getItem("drill"),
];

const shopArmorList: Armor[] = Object.values(armorDic).filter(
  (x) => x.name != "empty"
);

const shopWeaponList: Weapon[] = Object.values(weaponDic).filter(
  (x) => !["empty", "wood_sword"].includes(x.name)
);

const shopShieldList: Shield[] = Object.values(shieldDic).filter(
  (x) => !["empty", "wood_shield"].includes(x.name)
);

const shopConsList: Consumable[] = Object.values(consumableDic).filter(
  (x) => !["empty"].includes(x.name)
);

export default class Shop {
  objects: GameObject[];
  items: ShopItem[];
  armor: ShopItem | undefined;
  weapon: ShopItem | undefined;
  shield: ShopItem | undefined;
  consumable: ShopItem;
  constructor(inventory: inventory) {
    const inventoryItemNames = [
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
      .map((x) => new ShopItem(x.name, x.spriteSheetPos));
    this.items.forEach((item, i) => {
      item.pos.update(BORDERTHICKLEFT + 6 + i * 26, 28);
    });

    const chosenarmor = utils.shuffleArray(
      shopArmorList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.armor = new ShopItem(chosenarmor.name, chosenarmor.spriteSheetPos);

    const chosenWeapon = utils.shuffleArray(
      shopWeaponList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.weapon = new ShopItem(chosenWeapon.name, chosenWeapon.spriteSheetPos);

    const chosenShield = utils.shuffleArray(
      shopShieldList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];
    this.shield = new ShopItem(chosenShield.name, chosenShield.spriteSheetPos);

    const chosenConsumable = utils.shuffleArray(shopConsList)[0];
    this.consumable = new ShopItem(
      chosenConsumable.name,
      chosenConsumable.spriteSheetPos
    );
    this.consumable.pos.update(GAMEWIDTH - BORDERTHICKRIGHT - 28, 46);

    this.objects = [exitBtn, ...this.items, this.consumable];
    let xShift = 6;
    if (this.armor) {
      this.armor.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.armor);
      xShift += 26;
    }
    if (this.shield) {
      this.shield.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.shield);
      xShift += 26;
    }
    if (this.weapon) {
      this.weapon.pos.update(BORDERTHICKLEFT + xShift, 60);
      this.objects.push(this.weapon);
    }
  }
}
