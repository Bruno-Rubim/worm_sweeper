import Position from "./gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, GAMEWIDTH } from "./global.js";
import activeDict from "./items/active/dict.js";
import { armorDict } from "./items/armor/armor.js";
import { Item } from "./items/item.js";
import { shieldDict } from "./items/shield/dict.js";
import {} from "./items/shield/shield.js";
import { flagItem, picaxeItem } from "./items/uiItems.js";
import { weaponDict } from "./items/weapon/dict.js";
const baseInventory = {
    weapon: weaponDict.wood_sword,
    shield: shieldDict.wood_shield,
    armor: armorDict.empty,
    active: activeDict.empty,
    altActive: activeDict.empty.clone(new Position(GAMEWIDTH - 20, 90)),
    passives: [picaxeItem, flagItem],
    soldItemNames: [],
};
const playerInventory = {
    weapon: baseInventory.weapon,
    shield: baseInventory.shield,
    armor: baseInventory.armor,
    active: baseInventory.active,
    altActive: baseInventory.altActive,
    passives: [...baseInventory.passives],
    soldItemNames: [...baseInventory.soldItemNames],
};
export default playerInventory;
export function hasItem(name) {
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
export function getInventoryItems() {
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
        item.pos.update(BORDERTHICKLEFT + 13 + 18 * (i % 6), BORDERTHICKTOP + 13 + 18 * Math.floor(i / 6));
    });
}
