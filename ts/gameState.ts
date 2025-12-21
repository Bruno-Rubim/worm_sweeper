import Cave from "./level/cave.js";
import { armorList, type Armor } from "./items/armor.js";
import { consumableList, type Consumable } from "./items/consumable.js";
import { itemSheetPos, Item } from "./items/item.js";
import { shieldList, type Shield } from "./items/shield.js";
import { weaponList, type Weapon } from "./items/weapon.js";
import Position from "./position.js";
import { GAMEWIDTH } from "./global.js";

export type inventory = {
  armor: Armor;
  weapon: Weapon;
  shield: Shield;
  consumable: Consumable;
  picaxe: Item;
  flag: Item;
  book: Item;
  passive_1?: Item;
  passive_2?: Item;
  passive_3?: Item;
  passive_4?: Item;
  passive_5?: Item;
  passive_6?: Item;
};

export default class GameState {
  gold: number;
  time: number;
  level: Cave;
  inventory: inventory = {
    picaxe: new Item(new Position(GAMEWIDTH - 20, 90), itemSheetPos.picaxe),
    flag: new Item(new Position(GAMEWIDTH - 20, 109), itemSheetPos.flag),
    book: new Item(new Position(GAMEWIDTH - 20, 127), itemSheetPos.book),
    weapon: weaponList.wood_sword,
    shield: shieldList.wood_shield,
    armor: armorList.empty,
    consumable: consumableList.empty,
    passive_1: new Item(new Position(4, 18 * 1), itemSheetPos.empty),
    passive_2: new Item(new Position(4, 18 * 2), itemSheetPos.empty),
    passive_3: new Item(new Position(4, 18 * 3), itemSheetPos.empty),
    passive_4: new Item(new Position(4, 18 * 4), itemSheetPos.empty),
    passive_5: new Item(new Position(4, 18 * 5), itemSheetPos.empty),
    passive_6: new Item(new Position(4, 18 * 6), itemSheetPos.empty),
  };

  constructor() {
    this.gold = 0;
    this.time = 0;
    this.level = new Cave({});
  }
}
