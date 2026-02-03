import { LoseGame } from "./action.js";
import type { ActiveItem } from "./items/active/active.js";
import { Battle } from "./level/battle/battle.js";
import Level from "./level/level.js";
import { Timer } from "./timer/timer.js";
import { GAMETIMERSYNC } from "./timer/timerManager.js";
import timeTracker from "./timer/timeTracker.js";

// Holds the current state of the game at any given time
export default class GameState {
  gameTimer = new Timer({
    goalSecs: 180,
    goalFunc: () => new LoseGame(),
    deleteAtEnd: false,
    autoStart: false,
    classes: [GAMETIMERSYNC],
  });
  gold: number = 0;
  health: number = 5;
  maxHealth: number = 10;
  deathCount = 0;
  deathTic = 0;

  shopResetPrice = 0;
  bugCurse: boolean = false;
  scalesCollected = 0;

  level: Level;
  inTransition: boolean = false;
  currentScene: "cave" | "shop" | "battle" = "cave";
  battle: Battle | null = new Battle(0, 1, true);

  tiredTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  attackAnimationTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });
  shieldUpTimer = new Timer({ goalSecs: 0, deleteAtEnd: false });

  paused: boolean = false;
  started: boolean = false;
  heldWhileDeath: boolean = false;
  gameOver: boolean = false;
  deathScreenStage = 0;
  deathScreenTimer = new Timer({
    goalSecs: 1.5,
    goalFunc: () => {
      this.deathScreenStage++;
    },
    deleteAtEnd: false,
    autoStart: false,
    loop: true,
    external: true,
  });

  inInventory: boolean = false;
  inBook: boolean = false;
  bookPage: number = 0;

  holding: ActiveItem | null = null;

  constructor() {
    this.level = new Level(0);
  }

  get runTime() {
    return (
      (this.deathTic - this.gameTimer.startTic) / timeTracker.ticsPerSecond
    );
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
  gameState.maxHealth = baseState.maxHealth;
  gameState.shopResetPrice = baseState.shopResetPrice;
  gameState.bugCurse = baseState.bugCurse;
  gameState.scalesCollected = baseState.scalesCollected;
  gameState.level = new Level(0);
  gameState.gameTimer.restart();
  gameState.deathScreenTimer.restart();
  gameState.tiredTimer.restart();
  gameState.attackAnimationTimer.restart();
  gameState.shieldUpTimer.restart();
  gameState.holding = baseState.holding;
}
