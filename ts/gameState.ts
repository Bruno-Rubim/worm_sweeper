import { armorDic, type Armor } from "./items/armor.js";
import { consumableDic, type Consumable } from "./items/consumable.js";
import { Item, getItem } from "./items/item.js";
import { shieldDic, type Shield } from "./items/shield.js";
import { weaponDic, type Weapon } from "./items/weapon.js";
import Position from "./position.js";
import Level from "./level/level.js";
import { GAMEWIDTH } from "./global.js";
import { Timer } from "./timer.js";
import { Battle } from "./level/battle.js";

export type inventory = {
  armor: Armor;
  weapon: Weapon;
  shield: Shield;
  consumable: Consumable;
  picaxe: Item;
  flag: Item;
  book: Item;
  passive_1: Item;
  passive_2: Item;
  passive_3: Item;
  passive_4: Item;
  passive_5: Item;
  passive_6: Item;
};

export default class GameState {
  gold: number = 0;
  timer: Timer;
  level: Level;
  battle: Battle | null = new Battle();
  health: number = 5;
  tiredTimer: Timer | null = null;
  inTransition: boolean = false;
  currentScene: "cave" | "shop" | "battle" = "cave";
  inventory: inventory = {
    picaxe: getItem("picaxe", new Position(GAMEWIDTH - 20, 90)),
    flag: getItem("flag", new Position(GAMEWIDTH - 20, 109)),
    book: getItem("book", new Position(GAMEWIDTH - 20, 127)),
    weapon: weaponDic.wood_sword,
    shield: shieldDic.wood_shield,
    armor: armorDic.empty,
    consumable: consumableDic.empty,
    passive_1: getItem("empty", new Position(4, 18 * 1)),
    passive_2: getItem("empty", new Position(4, 18 * 2)),
    passive_3: getItem("empty", new Position(4, 18 * 3)),
    passive_4: getItem("empty", new Position(4, 18 * 4)),
    passive_5: getItem("empty", new Position(4, 18 * 5)),
    passive_6: getItem("empty", new Position(4, 18 * 6)),
  };

  constructor() {
    this.gold = 0;
    this.timer = new Timer(180);
    this.level = new Level(0, this.inventory);
  }

  get passiveItemNames() {
    return [
      this.inventory.passive_1.name,
      this.inventory.passive_2.name,
      this.inventory.passive_3.name,
      this.inventory.passive_4.name,
      this.inventory.passive_5.name,
      this.inventory.passive_6.name,
    ];
  }

  hasItem(itemName: string) {
    return this.passiveItemNames.includes(itemName);
  }
}
