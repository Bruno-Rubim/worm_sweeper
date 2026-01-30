import type GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, GAMEWIDTH } from "../global.js";
import activeDict from "../items/active/dict.js";
import consumableDict from "../items/consumableDict.js";
import { Item } from "../items/item.js";
import { shieldDict } from "../items/shield/dict.js";
import { weaponDict } from "../items/weapon/dict.js";
import { ActiveSlot, ArmorSlot, ShieldSlot, Slot, WeaponSlot } from "./slot.js";

export const picaxe = new Item({
  spriteSheetPos: new Position(0, 7),
  name: "picaxe",
  shopName: "",
  cost: 0,
  descriptionText: "Left click any block that's been revealed to break it.",
});
export const flag = new Item({
  spriteSheetPos: new Position(2, 7),
  name: "flag",
  shopName: "",
  cost: 0,
  descriptionText: "Right click any block to mark it as a possible threat.",
});

export class Inventory {
  armor: ArmorSlot;
  weapon: WeaponSlot;
  shield: ShieldSlot;
  active: ActiveSlot;
  altActive: ActiveSlot;
  bagSlots: Slot[];
  soldItemNames: string[];

  constructor() {
    this.weapon = new WeaponSlot(weaponDict.wood_sword);
    this.shield = new ShieldSlot(shieldDict.wood_shield);
    this.armor = new ArmorSlot();
    this.active = new ActiveSlot(new Position(GAMEWIDTH - 20, 72));
    this.altActive = new ActiveSlot(
      new Position(GAMEWIDTH - 20, 90),
      activeDict.locked,
      true,
    );
    this.bagSlots = [];
    for (let i = 0; i < 36; i++) {
      this.bagSlots.push(
        new Slot(
          new Position(
            BORDERTHICKLEFT + 13 + 18 * (i % 6),
            BORDERTHICKTOP + 13 + 18 * Math.floor(i / 6),
          ),
        ),
      );
    }
    this.bagSlots[0]!.item = picaxe;
    this.bagSlots[1]!.item = flag;
    this.soldItemNames = [];
  }

  get itemNames() {
    return [
      this.weapon.item.name,
      this.armor.item.name,
      this.shield.item.name,
      this.active.item.name,
      this.altActive.item.name,
      ...this.bagSlots.map((x) => x.item.name),
    ];
  }

  hasItem(name: string) {
    const names = [
      this.weapon.item.name,
      this.armor.item.name,
      this.shield.item.name,
      this.active.item.name,
      this.altActive.item.name,
      ...this.bagSlots.map((x) => x.item.name),
    ];
    return names.includes(name);
  }

  reset() {
    this.weapon.reset();
    this.shield.reset();
    this.armor.reset();
    this.active.reset();
    this.altActive.reset();
    this.soldItemNames = [];
    this.bagSlots.forEach((x) => x.reset);
    this.bagSlots[0]!.item = picaxe;
    this.bagSlots[1]!.item = flag;
  }

  get gearSlots(): GameObject[] {
    return [this.weapon, this.shield, this.armor, this.active, this.altActive];
  }

  get emptyBatSlot() {
    return this.bagSlots.find((x) => x.item.name == "empty")!;
  }
}

const playerInventory = new Inventory();

export default playerInventory;

// export function getRandomItem() {
//   const passives = Object.values(passivesDict).filter(
//     (x) =>
//       !hasItem(x.name) &&
//       !playerInventory.soldItemNames.includes(x.name) &&
//       x.cost > 0,
//   );
//   const r = utils.randomArrayId(passives);
//   const item = passives[r]!;
//   return item;
// }
