import { LoseGame } from "./action.js";
import { Battle } from "./level/battle/battle.js";
import Level from "./level/level.js";
import { Timer } from "./timer/timer.js";
import { GAMETIMERSYNC } from "./timer/timerManager.js";
export default class GameState {
    gameTimer = new Timer({
        goalSecs: 180,
        goalFunc: () => new LoseGame(),
        deleteAtEnd: false,
        autoStart: false,
        classes: [GAMETIMERSYNC],
    });
    gold = 0;
    health = 5;
    deathCount = 0;
    shopResetPrice = 0;
    level;
    inTransition = false;
    currentScene = "cave";
    battle = new Battle(0, 1);
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
    constructor() {
        this.level = new Level(0);
    }
}
export const gameState = new GameState();
