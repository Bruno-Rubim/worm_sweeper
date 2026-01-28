import Position from "./gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, GAMEWIDTH } from "./global.js";
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
  altActive: ActiveItem;
  passives: Item[];
  soldItemNames: string[];
};

const baseInventory: inventory = {
  weapon: weaponDic.wood_sword,
  shield: shieldDic.wood_shield,
  armor: armorDic.empty,
  active: activeDict.empty,
  altActive: activeDict.empty.clone(new Position(GAMEWIDTH - 20, 90)),
  passives: [picaxeItem, flagItem],
  soldItemNames: [],
};

const playerInventory: inventory = {
  weapon: baseInventory.weapon,
  shield: baseInventory.shield,
  armor: baseInventory.armor,
  active: baseInventory.active,
  altActive: baseInventory.altActive,
  passives: [...baseInventory.passives],
  soldItemNames: [...baseInventory.soldItemNames],
};

export default playerInventory;

export function hasItem(name: string) {
  const names = [
    playerInventory.weapon.name,
    playerInventory.armor.name,
    playerInventory.shield.name,
    playerInventory.active.name,
    playerInventory.altActive.name,
    ...playerInventory.passives.map((x) => x.name),
  ];
  return names.includes(name);
}

export function resetInventory() {
  playerInventory.weapon = baseInventory.weapon;
  playerInventory.shield = baseInventory.shield;
  playerInventory.armor = baseInventory.armor;
  playerInventory.active = baseInventory.active;
  playerInventory.altActive = baseInventory.altActive;
  playerInventory.passives = [...baseInventory.passives];
  playerInventory.soldItemNames = [...baseInventory.soldItemNames];
}

export function getInventoryItems(): Item[] {
  return [
    playerInventory.weapon,
    playerInventory.shield,
    playerInventory.armor,
    playerInventory.active,
    playerInventory.altActive,
    ...playerInventory.passives,
  ];
}

export function updateInventoryPositions() {
  playerInventory.passives.forEach((item, i) => {
    item.pos.update(
      BORDERTHICKLEFT + 13 + 18 * (i % 6),
      BORDERTHICKTOP + 13 + 18 * Math.floor(i / 6),
    );
  });
}
