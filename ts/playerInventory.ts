import { armorDic, type Armor } from "./items/armor/armor.js";
import type { Consumable } from "./items/consumable/consumable.js";
import consumableDict from "./items/consumable/dict.js";
import { Item } from "./items/item.js";
import { shieldDic, type Shield } from "./items/shield/shield.js";
import { flagItem, picaxeItem } from "./items/uiItems.js";
import { weaponDic } from "./items/weapon/dict.js";
import type { Weapon } from "./items/weapon/weapon.js";

export type inventory = {
  armor: Armor;
  weapon: Weapon;
  shield: Shield;
  consumable: Consumable;
  general: Item[];
};

const baseInventory: inventory = {
  weapon: weaponDic.wood_sword,
  shield: shieldDic.wood_shield,
  armor: armorDic.empty,
  consumable: consumableDict.empty,
  general: [picaxeItem, flagItem],
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
    ...playerInventory.general.map((x) => x.name),
  ];
  return names.includes(name);
}

export function resetInventory() {
  playerInventory.weapon = baseInventory.weapon;
  playerInventory.shield = baseInventory.shield;
  playerInventory.armor = baseInventory.armor;
  playerInventory.consumable = baseInventory.consumable;
  playerInventory.general = baseInventory.general;
}

export function getInventoryItems(): Item[] {
  return [
    playerInventory.weapon,
    playerInventory.shield,
    playerInventory.armor,
    playerInventory.consumable,
    ...playerInventory.general,
  ];
}
