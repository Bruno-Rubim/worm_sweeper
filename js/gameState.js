import { armorDic } from "./items/armor/armor.js";
import {} from "./items/consumable/consumable.js";
import { Item } from "./items/item.js";
import Position from "./position.js";
import Level from "./level/level.js";
import { GAMEWIDTH } from "./global.js";
import { GAMETIMERSYNC, Timer } from "./timer/timer.js";
import { Battle } from "./level/battle.js";
import { timerQueue } from "./timer/timerQueue.js";
import timeTracker from "./timer/timeTracker.js";
import { getItem } from "./items/passives/dict.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield, shieldDic } from "./items/shield/shield.js";
import { weaponDic } from "./items/weapon/dict.js";
import consumableDic from "./items/consumable/dict.js";
export default class GameState {
    gameTimer;
    gold = 0;
    health = 5;
    deathCount = 0;
    level;
    inTransition = false;
    currentScene = "cave";
    battle = null;
    tiredTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
    attackAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
    defenseAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
    paused = false;
    started = false;
    gameOver = false;
    heldWhileDeath = false;
    inBook = false;
    bookPage = 0;
    holding = null;
    inventory = {
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
        this.gameTimer = new Timer({
            goalSecs: 180,
            goalFunc: () => this.lose(),
            deleteAtEnd: false,
        });
        this.level = new Level(0, this);
        timerQueue.push(this.gameTimer);
        timerQueue.push(this.tiredTimer);
        timerQueue.push(this.attackAnimationTimer);
        timerQueue.push(this.defenseAnimationTimer);
    }
    pauseGameTimer() {
        this.gameTimer.pause();
        timerQueue.forEach((x) => {
            if (x.classes.includes(GAMETIMERSYNC)) {
                x.pause();
            }
        });
    }
    unpauseGameTimer() {
        this.gameTimer.unpause();
        timerQueue.forEach((x) => {
            if (x.classes.includes(GAMETIMERSYNC)) {
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
        this.holding = null;
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
        this.level = new Level(0, this);
        this.gameOver = false;
        timerQueue.push(this.gameTimer);
        timerQueue.push(this.tiredTimer);
        timerQueue.push(this.attackAnimationTimer);
        timerQueue.push(this.defenseAnimationTimer);
        timeTracker.unpause();
    }
    get itemNames() {
        return [
            this.inventory.passive_1.name,
            this.inventory.passive_2.name,
            this.inventory.passive_3.name,
            this.inventory.passive_4.name,
            this.inventory.passive_5.name,
            this.inventory.passive_6.name,
            this.inventory.consumable.name,
            this.inventory.weapon.name,
            this.inventory.shield.name,
            this.inventory.armor.name,
        ];
    }
    hasItem(itemName) {
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
        return space;
    }
}
