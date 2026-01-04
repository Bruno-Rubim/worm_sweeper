import { armorDic, type Armor } from "./items/armor.js";
import { consumableDic, type Consumable } from "./items/consumable.js";
import { Item, getItem } from "./items/item.js";
import { shieldDic, type Shield } from "./items/shield.js";
import { weaponDic, type Weapon } from "./items/weapon.js";
import Position from "./position.js";
import Level from "./level/level.js";
import { GAMEWIDTH } from "./global.js";
import { Timer } from "./timer/timer.js";
import { Battle } from "./level/battle.js";
import { timerQueue } from "./timer/timerQueue.js";
import timeTracker from "./timer/timeTracker.js";

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
  gameTimer: Timer;
  level: Level;
  battle: Battle | null = null;
  health: number = 5;
  tiredTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  attackAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  inTransition: boolean = false;
  inBook: boolean = false;
  bookPage: number = 0;
  currentScene: "cave" | "shop" | "battle" = "cave";
  paused: boolean = false;
  defending: boolean = false;
  holdingBomb: boolean = false;
  gameOver: boolean = false;
  deathCount = 0;
  inventory: inventory = {
    picaxe: getItem("picaxe", new Position(GAMEWIDTH - 20, 90)),
    flag: getItem("flag", new Position(GAMEWIDTH - 20, 109)),
    book: getItem("book", new Position(GAMEWIDTH - 20, 127)),
    weapon: weaponDic.wood_sword,
    shield: shieldDic.wood_shield,
    armor: armorDic.empty,
    consumable: consumableDic.bomb,
    passive_1: getItem("detonator", new Position(4, 18 * 1)),
    passive_2: getItem("empty", new Position(4, 18 * 2)),
    passive_3: getItem("empty", new Position(4, 18 * 3)),
    passive_4: getItem("empty", new Position(4, 18 * 4)),
    passive_5: getItem("empty", new Position(4, 18 * 5)),
    passive_6: getItem("empty", new Position(4, 18 * 6)),
  };

  constructor() {
    this.gameTimer = new Timer({
      goalSecs: 180,
      goalFunc: () => this.lose(),
      deleteAtEnd: false,
    });
    this.level = new Level(0, this.inventory);
    timerQueue.push(this.gameTimer);
    timerQueue.push(this.tiredTimer);
    timerQueue.push(this.attackAnimationTimer);
  }

  pauseGameTimer() {
    this.gameTimer.pause();
    timerQueue.forEach((x) => {
      if (x.classes.includes("gameTimer_sync")) {
        x.pause();
      }
    });
  }

  unpauseGameTimer() {
    this.gameTimer.unpause();
    timerQueue.forEach((x) => {
      if (x.classes.includes("gameTimer_sync")) {
        x.unpause();
      }
    });
  }

  lose() {
    this.gameOver = true;
    this.level.cave.revealAllBlocks();
    timeTracker.pause();
  }

  restart() {
    this.gameTimer.restart();
    this.tiredTimer.restart();
    this.attackAnimationTimer.restart();
    this.currentScene = "cave";
    this.inTransition = false;
    this.battle = null;
    this.defending = false;
    this.holdingBomb = false;
    this.deathCount++;
    this.gold = 0;
    this.health = 5;
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
    };
    this.level = new Level(0, this.inventory);
    this.gameOver = false;
    timerQueue.push(this.gameTimer);
    timerQueue.push(this.tiredTimer);
    timerQueue.push(this.attackAnimationTimer);
    timeTracker.unpause();
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

  get currentDefense() {
    return (
      this.inventory.armor.defense +
      +this.inventory.armor.reflection +
      (this.defending
        ? this.inventory.shield.defense + this.inventory.shield.reflection
        : 0)
    );
  }

  get currentReflection() {
    return (
      this.inventory.armor.reflection +
      (this.defending ? this.inventory.shield.reflection : 0)
    );
  }

  hasItem(itemName: string) {
    return this.passiveItemNames.includes(itemName);
  }
}
