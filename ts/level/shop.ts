import GameObject from "../gameObject.js";
import type { inventory } from "../gameState.js";
import {
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  GAMEWIDTH,
} from "../global.js";
import { armorList, type Armor } from "../items/armor.js";
import { consumableList, type Consumable } from "../items/consumable.js";
import { getItem, type Item } from "../items/item.js";
import { shieldList, type Shield } from "../items/shield.js";
import { weaponList, type Weapon } from "../items/weapon.js";
import { ChangeScene } from "../objectAction.js";
import Position from "../position.js";
import { utils } from "../utils.js";

const exitBtn = new GameObject({
  spriteName: "button_exit",
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

const shopArmorList: Armor[] = Object.values(armorList).filter(
  (x) => x.name != "empty"
);

const shopWeaponList: Weapon[] = Object.values(weaponList).filter(
  (x) => !["empty", "wood_sword"].includes(x.name)
);

const shopShieldList: Shield[] = Object.values(shieldList).filter(
  (x) => !["empty", "wood_shield"].includes(x.name)
);

const shopConsList: Consumable[] = Object.values(consumableList).filter(
  (x) => !["empty"].includes(x.name)
);

export default class Shop {
  objects: GameObject[];
  items: Item[];
  armor: Armor | undefined;
  weapon: Weapon | undefined;
  shield: Shield | undefined;
  consumable: Consumable;
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
      .slice(0, 3);
    this.items.forEach((item, i) => {
      item.pos.update(BORDERTHICKLEFT + 6 + i * 26, 28);
    });

    this.armor = utils.shuffleArray(
      shopArmorList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];

    this.weapon = utils.shuffleArray(
      shopWeaponList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];

    this.shield = utils.shuffleArray(
      shopShieldList.filter((x) => !inventoryItemNames.includes(x.name))
    )[0];

    this.consumable = utils.shuffleArray(shopConsList)[0];
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
