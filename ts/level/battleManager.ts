import { ChangeCursorState, ChangeScene } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import { CURSORBATTLE } from "../cursor.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  CENTER,
  CLICKLEFT,
  CLICKRIGHT,
  GAMEHEIGHT,
  GAMEWIDTH,
} from "../global.js";
import Position from "../position.js";
import type { SoundManager } from "../soundManager.js";
import { sprites } from "../sprites.js";
import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import SceneManager from "./sceneManager.js";

// Manages rendering and interactions with the currentBattle scene of the gameState
export default class BattleManager extends SceneManager {
  constructor(
    gameState: GameState,
    scenePos: Position,
    soundManager: SoundManager
  ) {
    super(gameState, scenePos, soundManager);
  }

  /**
   * Renders enemies and player weapons
   * @param canvasManager
   */
  render = (canvasManager: CanvasManager) => {
    canvasManager.renderSprite(
      sprites.bg_battle,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM
    );
    this.gameState.battle?.enemies.forEach((enemy) => {
      canvasManager.renderSpriteFromSheet(
        enemy.spriteSheet,
        enemy.pos,
        64,
        64,
        new Position(
          enemy.attackAnimTimer.inMotion ? 1 : 0,
          enemy.damagedTimer.inMotion ? 1 : 0
        )
      );
      if (enemy.health > 0) {
        const roundedHealth = Math.floor(enemy.health);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 64),
          "$hrt".repeat(roundedHealth) +
            (enemy.health > roundedHealth ? "$hhr" : ""),
          CENTER
        );
      }

      canvasManager.renderText("icons", enemy.pos.add(25, 8), "$dmg");
      canvasManager.renderText(
        "numbers_gray",
        enemy.pos.add(18, 8),
        enemy.damage.toString()
      );
      let counterFrame = Math.floor(
        Math.min(15, (enemy.cooldownTimer.percentage / 100) * 16)
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        enemy.pos.add(34, 8),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8))
      );
    });

    const inventory = this.gameState.inventory;
    canvasManager.renderSprite(
      inventory.weapon.bigSprite,
      new Position(
        BORDERTHICKLEFT -
          (this.gameState.attackAnimationTimer.ended ||
          !this.gameState.attackAnimationTimer.started
            ? 24
            : 0),
        BORDERTHICKTOP +
          (this.gameState.attackAnimationTimer.ended ||
          !this.gameState.attackAnimationTimer.started
            ? 45
            : 26)
      ),
      128,
      128
    );
    canvasManager.renderSprite(
      inventory.shield.bigSprite,
      new Position(
        BORDERTHICKLEFT + (this.gameState.defending ? 0 : 24),
        BORDERTHICKTOP + (this.gameState.defending ? 26 : 45)
      ),
      128,
      128
    );
    if (!this.gameState.tiredTimer.ended && this.gameState.tiredTimer.started) {
      let counterFrame = Math.floor(
        Math.min(15, (this.gameState.tiredTimer.percentage / 100) * 16)
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        new Position(GAMEWIDTH / 2 - 4, GAMEHEIGHT - BORDERTHICKBOTTOM - 22),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8))
      );
    }

    for (let i = 0; i < this.gameState.currentDefense; i++) {
      canvasManager.renderText(
        "icons",
        new Position(
          88 + i * 9 - (9 * this.gameState.currentDefense) / 2,
          GAMEHEIGHT - BORDERTHICKBOTTOM - 11
        ),
        i < this.gameState.currentReflection ? "$ref" : "$dfs"
      );
    }
  };

  /**
   * Checks if enemies are dead, changing to cave scene if so
   * @returns
   */
  checkBattleEnd() {
    this.gameState.battle?.enemies.forEach((e, i) => {
      if (e.health < 1) {
        timerQueue.splice(timerQueue.indexOf(e.cooldownTimer), 1);
        this.gameState.battle!.enemies.splice(i, 1);
        if (this.gameState.hasItem("carving_knife")) {
          this.gameState.gold += 2;
        }
      }
    });
    if (this.gameState.battle!.enemies.length <= 0) {
      return new ChangeScene("cave");
    }
  }

  /**
   * Deals damage to a random enemy and starts the tired timer according to current weapon stats
   * @returns
   */
  playerAttack() {
    const tiredTimer = this.gameState.tiredTimer;
    const rId = utils.randomArrayId(this.gameState.battle!.enemies);
    const enemy = this.gameState.battle!.enemies[rId]!;
    let damage = this.gameState.inventory.weapon.totalDamage;
    if (this.gameState.inventory.weapon.name == "time_blade") {
      //Calculates time blade's damage
      damage = Math.max(
        1,
        Math.min(
          5,
          Math.floor(5.5 - 2.25 * this.gameState.gameTimer.secondsRemaining)
        )
      );
    }
    enemy.health -= damage;
    enemy.damagedTimer.start();
    timerQueue.push(enemy.damagedTimer);
    this.gameState.attackAnimationTimer.goalSecs =
      this.gameState.inventory.weapon.cooldown / 3;
    this.gameState.attackAnimationTimer.start();
    tiredTimer.goalSecs =
      this.gameState.inventory.weapon.cooldown -
      this.gameState.inventory.armor.speed;
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Does 5 damage to a random enemy, triggers the enemies damage animation timer and the player's tired timer
   * @returns
   */
  bomb() {
    const tiredTimer = this.gameState.tiredTimer;
    const rId = utils.randomArrayId(this.gameState.battle!.enemies);
    const enemy = this.gameState.battle!.enemies[rId]!;
    // TO-DO: add explosion sound (different than bomb sound)
    enemy.health -= 5;
    enemy.damagedTimer.start();
    timerQueue.push(enemy.damagedTimer);
    tiredTimer.goalSecs = 2 - this.gameState.inventory.armor.speed;
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Sets defending to true and starts the tired timer according to current shield stats
   * @returns
   */
  playerDefend() {
    const tiredTimer = this.gameState.tiredTimer;
    this.gameState.defending = true;
    tiredTimer.goalSecs =
      this.gameState.inventory.shield.cooldown -
      this.gameState.inventory.armor.speed;
    tiredTimer.goalFunc = () => {
      this.gameState.defending = false;
    };
    tiredTimer.start();
  }

  /**
   * Checks if the player isn't tired and attacks or defends accordingly
   * @param cursorPos
   * @param button
   * @returns
   */
  handleHeld = (
    cursorPos: Position,
    button: typeof CLICKRIGHT | typeof CLICKLEFT
  ) => {
    if (!this.gameState.battle) {
      return;
    }
    const tiredTimer = this.gameState.tiredTimer;
    if (tiredTimer.ended || !tiredTimer.started) {
      if (button == CLICKLEFT) {
        if (this.gameState.holdingBomb) {
          this.gameState.holdingBomb = false;
          return this.bomb();
        }
        return this.playerAttack();
      } else {
        return this.playerDefend();
      }
    }
  };

  handleHover = () => {
    return new ChangeCursorState(CURSORBATTLE);
  };
}
