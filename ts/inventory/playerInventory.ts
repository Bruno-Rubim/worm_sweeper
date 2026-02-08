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
  armorSlot: ArmorSlot;
  weaponSlot: WeaponSlot;
  shieldSlot: ShieldSlot;
  activeSlot: ActiveSlot;
  altActiveSlot: ActiveSlot;
  bagSlots: Slot[];
  soldItemNames: string[];

  constructor() {
    this.weaponSlot = new WeaponSlot(weaponDict.wood_sword);
    this.shieldSlot = new ShieldSlot(shieldDict.wood_shield);
    this.armorSlot = new ArmorSlot();
    this.activeSlot = new ActiveSlot(new Position(GAMEWIDTH - 20, 72));
    this.altActiveSlot = new ActiveSlot(
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
      this.weaponSlot.item.name,
      this.armorSlot.item.name,
      this.shieldSlot.item.name,
      this.activeSlot.item.name,
      this.altActiveSlot.item.name,
      ...this.bagSlots.map((x) => x.item.name),
    ];
  }

  hasItem(name: string) {
    const names = [
      this.weaponSlot.item.name,
      this.armorSlot.item.name,
      this.shieldSlot.item.name,
      this.activeSlot.item.name,
      this.altActiveSlot.item.name,
      ...this.bagSlots.map((x) => x.item.name),
    ];
    return names.includes(name);
  }

  reset() {
    this.weaponSlot.reset();
    this.shieldSlot.reset();
    this.armorSlot.reset();
    this.activeSlot.reset();
    this.altActiveSlot.reset();
    this.soldItemNames = [];
    this.bagSlots.forEach((x) => x.reset());
    this.bagSlots[0]!.item = picaxe;
    this.bagSlots[1]!.item = flag;
  }

  get gearSlots(): GameObject[] {
    return [
      this.weaponSlot,
      this.shieldSlot,
      this.armorSlot,
      this.activeSlot,
      this.altActiveSlot,
    ];
  }

  get emptyBagSlot() {
    return this.bagSlots.find((x) => x.item.name == "empty")!;
  }

  updateBagEmpties() {
    let firstEmptyId: null | number = null;
    for (let i = 0; i < this.bagSlots.length; i++) {
      const slot = this.bagSlots[i]!;
      if (firstEmptyId == null && slot.item.name == "empty") {
        firstEmptyId = i;
        continue;
      }
      if (slot.item.name != "empty" && firstEmptyId != null) {
        this.bagSlots[firstEmptyId]?.switchItems(slot);
        i = firstEmptyId;
        firstEmptyId = null;
      }
    }
  }
}

const playerInventory = new Inventory();

export default playerInventory;
