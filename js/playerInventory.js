import activeDict from "./items/active/dict.js";
import { armorDic } from "./items/armor/armor.js";
import { Item } from "./items/item.js";
import passivesDict from "./items/passiveDict.js";
import { shieldDic } from "./items/shield/shield.js";
import { flagItem, picaxeItem } from "./items/uiItems.js";
import { weaponDic } from "./items/weapon/dict.js";
const baseInventory = {
    weapon: weaponDic.wood_sword,
    shield: shieldDic.wood_shield,
    armor: armorDic.empty,
    active: activeDict.empty,
    passives: [picaxeItem, flagItem],
};
const playerInventory = {
    weapon: baseInventory.weapon,
    shield: baseInventory.shield,
    armor: baseInventory.armor,
    active: baseInventory.active,
    passives: [...baseInventory.passives],
};
export default playerInventory;
export function hasItem(name) {
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
    playerInventory.passives = [...baseInventory.passives];
}
export function getInventoryItems() {
    return [
        playerInventory.weapon,
        playerInventory.shield,
        playerInventory.armor,
        playerInventory.active,
        ...playerInventory.passives,
    ];
}
