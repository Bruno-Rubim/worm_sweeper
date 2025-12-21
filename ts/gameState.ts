import { armorList, type Armor } from "./items/armor.js";
import { consumableList, type Consumable } from "./items/consumable.js";
import {
  Item,
  getItem,
  ITEMPICAXE,
  ITEMFLAG,
  ITEMBOOK,
  ITEMEMPTY,
} from "./items/item.js";
import { shieldList, type Shield } from "./items/shield.js";
import { weaponList, type Weapon } from "./items/weapon.js";
import Position from "./position.js";
import Level from "./level/level.js";
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
  level: Level;
  inventory: inventory = {
    picaxe: getItem(ITEMPICAXE, new Position(GAMEWIDTH - 20, 90)),
    flag: getItem(ITEMFLAG, new Position(GAMEWIDTH - 20, 109)),
    book: getItem(ITEMBOOK, new Position(GAMEWIDTH - 20, 127)),
    weapon: weaponList.wood_sword,
    shield: shieldList.wood_shield,
    armor: armorList.empty,
    consumable: consumableList.empty,
    passive_1: getItem(ITEMEMPTY, new Position(4, 18 * 1)),
    passive_2: getItem(ITEMEMPTY, new Position(4, 18 * 2)),
    passive_3: getItem(ITEMEMPTY, new Position(4, 18 * 3)),
    passive_4: getItem(ITEMEMPTY, new Position(4, 18 * 4)),
    passive_5: getItem(ITEMEMPTY, new Position(4, 18 * 5)),
    passive_6: getItem(ITEMEMPTY, new Position(4, 18 * 6)),
  };

  constructor() {
    this.gold = 0;
    this.time = 0;
    this.level = new Level(0, this.inventory);
  }
}
