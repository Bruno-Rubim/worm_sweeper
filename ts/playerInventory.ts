import Position from "./gameElements/position.js";
import { armorDic, type Armor } from "./items/armor/armor.js";
import type { Consumable } from "./items/consumable/consumable.js";
import consumableDict from "./items/consumable/dict.js";
import { getItem } from "./items/genericDict.js";
import type { Item } from "./items/item.js";
import { shieldDic, type Shield } from "./items/shield/shield.js";
import { weaponDic } from "./items/weapon/dict.js";
import type { Weapon } from "./items/weapon/weapon.js";

export type inventory = {
  armor: Armor;
  weapon: Weapon;
  shield: Shield;
  consumable: Consumable;
  passive_1: Item;
  passive_2: Item;
  passive_3: Item;
  passive_4: Item;
  passive_5: Item;
  passive_6: Item;
  passive_7: Item;
  bag: Item;
};

const baseInventory: inventory = {
  weapon: weaponDic.wood_sword,
  shield: shieldDic.wood_shield,
  armor: armorDic.empty,
  consumable: consumableDict.empty,
  passive_1: getItem("empty", new Position(4, 18 * 1)),
  passive_2: getItem("empty", new Position(4, 18 * 2)),
  passive_3: getItem("empty", new Position(4, 18 * 3)),
  passive_4: getItem("empty", new Position(4, 18 * 4)),
  passive_5: getItem("empty", new Position(4, 18 * 5)),
  passive_6: getItem("empty", new Position(4, 18 * 6)),
  passive_7: getItem("locked_slot", new Position(4, 18 * 7)),
  bag: getItem("empty", new Position(-Infinity, -Infinity)),
};

const playerInventory: inventory = {
  ...baseInventory,
};

export default playerInventory;

export function hasItem(name: string) {
  const names = [
    playerInventory.weapon.name,
    playerInventory.armor.name,
    playerInventory.shield.name,
    playerInventory.consumable.name,
    playerInventory.passive_1.name,
    playerInventory.passive_2.name,
    playerInventory.passive_3.name,
    playerInventory.passive_4.name,
    playerInventory.passive_5.name,
    playerInventory.passive_6.name,
    playerInventory.passive_7.name,
    playerInventory.bag.name,
  ];
  return names.includes(name);
}

export function resetInventory() {
  playerInventory.weapon = baseInventory.weapon;
  playerInventory.shield = baseInventory.shield;
  playerInventory.armor = baseInventory.armor;
  playerInventory.consumable = baseInventory.consumable;
  playerInventory.passive_1 = baseInventory.passive_1;
  playerInventory.passive_2 = baseInventory.passive_2;
  playerInventory.passive_3 = baseInventory.passive_3;
  playerInventory.passive_4 = baseInventory.passive_4;
  playerInventory.passive_5 = baseInventory.passive_5;
  playerInventory.passive_6 = baseInventory.passive_6;
  playerInventory.passive_7 = baseInventory.passive_7;
  playerInventory.bag = baseInventory.bag;
}

export function getInventorySpace() {
  let space = 0;
  if (playerInventory.passive_1.name == "empty") {
    space++;
  }
  if (playerInventory.passive_2.name == "empty") {
    space++;
  }
  if (playerInventory.passive_3.name == "empty") {
    space++;
  }
  if (playerInventory.passive_4.name == "empty") {
    space++;
  }
  if (playerInventory.passive_5.name == "empty") {
    space++;
  }
  if (playerInventory.passive_6.name == "empty") {
    space++;
  }
  if (playerInventory.passive_7.name == "empty") {
    space++;
  }
  return space;
}
