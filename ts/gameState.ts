import { armorDic, type Armor } from "./items/armor/armor.js";
import { type Consumable } from "./items/consumable/consumable.js";
import { Item } from "./items/item.js";
import Position from "./position.js";
import Level from "./level/level.js";
import { GAMEWIDTH } from "./global.js";
import { GAMETIMERSYNC, Timer } from "./timer/timer.js";
import { Battle } from "./level/battle/battle.js";
import { timerQueue } from "./timer/timerQueue.js";
import timeTracker from "./timer/timeTracker.js";
import { getItem } from "./items/passives/dict.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield, shieldDic } from "./items/shield/shield.js";
import type { Chisel } from "./items/passives/chisel.js";
import { weaponDic } from "./items/weapon/dict.js";
import consumableDic from "./items/consumable/dict.js";
import type Bomb from "./items/consumable/bomb.js";

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
  passive_7: Item;
  bag: Item;
};

// Holds the current state of the game at any given time
export default class GameState {
  gameTimer: Timer;
  gold: number = 0;
  health: number = 5;
  deathCount = 0;
  shopResetPrice = 0;

  level: Level;
  inTransition: boolean = false;
  currentScene: "cave" | "shop" | "battle" = "cave";

  battle: Battle | null = new Battle(0, 1);
  tiredTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  attackAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  defenseAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });

  paused: boolean = false;
  started: boolean = false;
  gameOver: boolean = false;
  heldWhileDeath: boolean = false;

  inBook: boolean = false;
  bookPage: number = 0;

  holding: Bomb | Chisel | null = null;

  inventory: inventory = {
    picaxe: getItem("picaxe", new Position(GAMEWIDTH - 20, 90)),
    flag: getItem("flag", new Position(GAMEWIDTH - 20, 109)),
    book: getItem("book", new Position(GAMEWIDTH - 20, 127)),
    weapon: weaponDic.big_sword,
    shield: shieldDic.wood_shield,
    armor: armorDic.empty,
    consumable: consumableDic.empty,
    passive_1: getItem("empty", new Position(4, 18 * 1)),
    passive_2: getItem("empty", new Position(4, 18 * 2)),
    passive_3: getItem("empty", new Position(4, 18 * 3)),
    passive_4: getItem("empty", new Position(4, 18 * 4)),
    passive_5: getItem("empty", new Position(4, 18 * 5)),
    passive_6: getItem("empty", new Position(4, 18 * 6)),
    passive_7: getItem("locked_slot", new Position(4, 18 * 7)),
    bag: getItem("empty", new Position(-Infinity, -Infinity)),
  };

  constructor() {
    this.gameTimer = new Timer({
      goalSecs: 180,
      goalFunc: () => this.lose(),
      deleteAtEnd: false,
    });
    this.level = new Level(5, this);
    timerQueue.push(this.gameTimer);
    timerQueue.push(this.tiredTimer);
    timerQueue.push(this.attackAnimationTimer);
    timerQueue.push(this.defenseAnimationTimer);
  }

  /**
   * Pauses the game timer and any timer in the timerQueue that has the class GAMETIMERSYNC
   */
  pauseGameTimer() {
    this.gameTimer.pause();
    timerQueue.forEach((x) => {
      if (x.classes.includes(GAMETIMERSYNC)) {
        x.pause();
      }
    });
  }

  /**
   * Unpauses the game timer and any timer in the timerQueue that has the class GAMETIMERSYNC
   */
  unpauseGameTimer() {
    this.gameTimer.unpause();
    timerQueue.forEach((x) => {
      if (x.classes.includes(GAMETIMERSYNC)) {
        x.unpause();
      }
    });
  }

  /**
   * Turns game over on, pauses the gameTimer and reveals all blocks in the cave
   */
  lose() {
    this.gameOver = true;
    this.level.cave.revealAllBlocks();
    timeTracker.pause();
  }

  /**
   * Resets all timers and sets game state values to "default" (there is currently no set default)
   */
  restart() {
    this.gameTimer.restart();
    this.tiredTimer.restart();
    this.attackAnimationTimer.restart();
    this.currentScene = "cave";
    this.inTransition = false;
    this.battle = new Battle(0, 1);
    this.holding = null;
    this.deathCount++;
    this.gold = 0;
    this.health = 5;
    this.shopResetPrice = 0;
    this.inventory = {
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
      passive_7: getItem("locked_slot", new Position(4, 18 * 7)),
      bag: getItem("empty", new Position(-Infinity, -Infinity)),
    };
    this.level = new Level(0, this);
    this.gameOver = false;
    timerQueue.push(this.gameTimer);
    timerQueue.push(this.tiredTimer);
    timerQueue.push(this.attackAnimationTimer);
    timerQueue.push(this.defenseAnimationTimer);
    timeTracker.unpause();
  }

  /**
   * lists all item names from inventory
   */
  get itemNames() {
    return [
      this.inventory.passive_1.name,
      this.inventory.passive_2.name,
      this.inventory.passive_3.name,
      this.inventory.passive_4.name,
      this.inventory.passive_5.name,
      this.inventory.passive_6.name,
      this.inventory.passive_7.name,
      this.inventory.consumable.name,
      this.inventory.weapon.name,
      this.inventory.shield.name,
      this.inventory.armor.name,
    ];
  }

  /**
   * Checks if the list of item names from inventory includes a given item name
   * @param itemName string
   * @returns
   */
  hasItem(itemName: string) {
    return this.itemNames.includes(itemName);
  }

  get passiveSpace() {
    let space = 0;
    if (this.inventory.passive_1.name == "empty") {
      space++;
    }
    if (this.inventory.passive_2.name == "empty") {
      space++;
    }
    if (this.inventory.passive_3.name == "empty") {
      space++;
    }
    if (this.inventory.passive_4.name == "empty") {
      space++;
    }
    if (this.inventory.passive_5.name == "empty") {
      space++;
    }
    if (this.inventory.passive_6.name == "empty") {
      space++;
    }
    if (this.inventory.passive_7.name == "empty") {
      space++;
    }
    return space;
  }
}
