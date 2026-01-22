import { LoseGame } from "./action.js";
import type Bomb from "./items/consumable/bomb.js";
import { Battle } from "./level/battle/battle.js";
import Level from "./level/level.js";
import { Timer } from "./timer/timer.js";
import { GAMETIMERSYNC } from "./timer/timerManager.js";

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

  holding: Bomb | null = null;

  constructor() {
    this.level = new Level(0);
  }
}

export const gameState = new GameState();
