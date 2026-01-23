import type { ActiveItem } from "./items/active/active.js";
import activeDict from "./items/active/dict.js";
import { armorDic, type Armor } from "./items/armor/armor.js";
import { Item } from "./items/item.js";
import { shieldDic, type Shield } from "./items/shield/shield.js";
import { flagItem, picaxeItem } from "./items/uiItems.js";
import { weaponDic } from "./items/weapon/dict.js";
import type { Weapon } from "./items/weapon/weapon.js";

export type inventory = {
  armor: Armor;
  weapon: Weapon;
  shield: Shield;
  active: ActiveItem;
  passives: Item[];
};

const baseInventory: inventory = {
  weapon: weaponDic.wood_sword,
  shield: shieldDic.wood_shield,
  armor: armorDic.empty,
  active: activeDict.bomb,
  passives: [picaxeItem, flagItem],
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
    playerInventory.active.name,
    ...playerInventory.passives.map((x) => x.name),
  ];
  return names.includes(name);
}

export function resetInventory() {
  playerInventory.weapon = baseInventory.weapon;
  playerInventory.shield = baseInventory.shield;
  playerInventory.armor = baseInventory.armor;
  playerInventory.active = baseInventory.active;
  playerInventory.passives = baseInventory.passives;
}

export function getInventoryItems(): Item[] {
  return [
    playerInventory.weapon,
    playerInventory.shield,
    playerInventory.armor,
    playerInventory.active,
    ...playerInventory.passives,
  ];
}
