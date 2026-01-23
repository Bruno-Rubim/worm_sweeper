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
    bugCurse = false;
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
    inInventory = false;
    inBook = false;
    bookPage = 0;
    holding = null;
    constructor() {
        this.level = new Level(0);
    }
}
const baseState = new GameState();
export const gameState = new GameState();
export function resetGameState() {
    gameState.gameOver = baseState.gameOver;
    gameState.started = baseState.started;
    gameState.inTransition = baseState.inTransition;
    gameState.currentScene = baseState.currentScene;
    gameState.gold = baseState.gold;
    gameState.health = baseState.health;
    gameState.level = new Level(0);
    gameState.gameTimer.restart();
    gameState.tiredTimer.restart();
    gameState.attackAnimationTimer.restart();
    gameState.defenseAnimationTimer.restart();
}
