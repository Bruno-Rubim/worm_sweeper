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
  LEFT,
} from "../global.js";
import Bomb from "../items/consumable/bomb.js";
import Position from "../position.js";
import type { SoundManager } from "../soundManager.js";
import sounds from "../sounds.js";
import { sprites } from "../sprites.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import timeTracker from "../timer/timeTracker.js";
import { checkPlayerDead } from "../updateGame.js";
import { utils } from "../utils.js";
import SceneManager from "./sceneManager.js";

// Manages rendering and interactions with the currentBattle scene of the gameState
export default class BattleManager extends SceneManager {
  stunTicStart: number | null = null;

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
    if (!this.gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    // Render enemies
    canvasManager.renderSprite(
      sprites.bg_battle,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM
    );
    this.gameState.battle.enemies.forEach((enemy) => {
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
        // Render enemy health
        const roundedHealth = Math.floor(enemy.health);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 64),
          "$hrt".repeat(roundedHealth) +
            (enemy.health > roundedHealth ? "$hhr" : ""),
          CENTER
        );
      }
      if (enemy.reflection > 0) {
        // Render enemy reflection
        const roundedReflection = Math.floor(enemy.reflection);
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33, 73),
          "$ref".repeat(roundedReflection) +
            (enemy.reflection > roundedReflection ? "$hrf" : ""),
          CENTER
        );
      }
      if (this.stunTicStart != null) {
        // Render stun animation
        canvasManager.renderAnimationFrame(
          sprites.stun_sprite_sheet,
          enemy.pos.add(enemy.stunSpriteShift),
          64,
          64,
          4,
          1,
          this.stunTicStart,
          timeTracker.currentGameTic,
          0.5
        );
      }

      canvasManager.renderText(
        "numbers_gray",
        enemy.pos.add(34, 8),
        enemy.damage.toString() + "$dmg",
        LEFT
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

    // Weapon rendering
    const inventory = this.gameState.inventory;
    canvasManager.renderSprite(
      inventory.weapon.bigSprite,
      new Position(
        BORDERTHICKLEFT -
          (this.gameState.attackAnimationTimer.inMotion ? 0 : 24),
        BORDERTHICKTOP +
          (this.gameState.attackAnimationTimer.inMotion ? 26 : 45)
      ),
      128,
      128
    );

    // Shield rendering
    canvasManager.renderSprite(
      inventory.shield.bigSprite,
      new Position(
        BORDERTHICKLEFT +
          (this.gameState.defenseAnimationTimer.inMotion ? 0 : 24),
        BORDERTHICKTOP +
          (this.gameState.defenseAnimationTimer.inMotion ? 26 : 45)
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

    // Rendering defense stats
    if (
      this.gameState.battle.defense > 0 ||
      this.gameState.battle.reflection > 0
    ) {
      const reflect = this.gameState.battle.reflection;
      const defense = this.gameState.battle.defense;
      const roundedReflect = Math.floor(reflect);
      const roundedDefense = Math.floor(defense);
      canvasManager.renderText(
        "icons",
        new Position(GAMEWIDTH / 2, GAMEHEIGHT - BORDERTHICKBOTTOM - 11),
        "$ref".repeat(roundedReflect) +
          (reflect > roundedReflect ? "$hrf" : "") +
          "$dfs".repeat(roundedDefense) +
          (defense > roundedDefense ? "$hdf" : ""),
        CENTER
      );
    }
  };

  /**
   * Checks if enemies or player are dead, changing to cave scene if so
   * @returns
   */
  checkBattleEnd() {
    if (!this.gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    this.gameState.battle.enemies.forEach((e, i) => {
      if (e.health <= 0) {
        timerQueue.splice(timerQueue.indexOf(e.cooldownTimer), 1);
        this.gameState.battle!.enemies.splice(i, 1);
        if (this.gameState.hasItem("carving_knife")) {
          this.gameState.gold += 2;
          this.soundManager.playSound(sounds.gold);
        }
      }
    });
    checkPlayerDead(this.gameState);
    if (this.gameState.battle.enemies.length <= 0) {
      return new ChangeScene("cave");
    }
  }

  /**
   * Deals damage to a random enemy and starts the tired timer according to current weapon stats
   * @returns
   */
  playerAttack() {
    if (!this.gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    const rId = utils.randomArrayId(this.gameState.battle.enemies);
    const enemy = this.gameState.battle.enemies[rId]!;
    let damage = this.gameState.inventory.weapon.totalDamage;

    // Reflection
    const enemyReflect = enemy.reflection;
    const playerReflect = this.gameState.battle.reflection;
    const playerDefense = this.gameState.battle.defense;
    enemy.reflection = Math.max(0, enemyReflect - (playerReflect + damage));

    let enemyRefDamage = Math.max(
      0,
      Math.min(damage, enemyReflect - playerReflect)
    );
    this.gameState.battle.reflection = Math.max(
      0,
      playerReflect - enemyReflect
    );
    damage = Math.max(0, damage - Math.max(0, enemyReflect - playerReflect));

    enemy.health -= damage;

    const leftoverDefense = Math.max(0, playerDefense - enemyRefDamage);
    enemyRefDamage = Math.max(0, enemyRefDamage - playerDefense);

    this.gameState.health -= enemyRefDamage;
    this.gameState.battle.defense = leftoverDefense;

    enemy.damagedTimer.start();
    timerQueue.push(enemy.damagedTimer);

    // Weapon animation
    this.gameState.attackAnimationTimer.goalSecs =
      this.gameState.inventory.weapon.cooldown / 3;
    this.gameState.attackAnimationTimer.start();

    // Cooldown
    const tiredTimer = this.gameState.tiredTimer;
    tiredTimer.goalSecs =
      this.gameState.inventory.weapon.cooldown -
      this.gameState.inventory.armor.speed;
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Adds defense to player and starts the tired timer according to current shield stats
   * @returns
   */
  playerDefend() {
    if (!this.gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    // Setting defense stats
    this.gameState.battle.defense += this.gameState.inventory.shield.defense;
    this.gameState.battle.reflection +=
      this.gameState.inventory.shield.reflection;

    // Defense animation
    this.gameState.defenseAnimationTimer.goalSecs =
      this.gameState.inventory.shield.cooldown / 3;
    this.gameState.defenseAnimationTimer.start();

    // Cooldown
    const tiredTimer = this.gameState.tiredTimer;
    tiredTimer.goalSecs =
      this.gameState.inventory.shield.cooldown -
      this.gameState.inventory.armor.speed;
    tiredTimer.start();
  }

  /**
   * Does 5 damage to a random enemy, triggers the enemies damage animation timer and the player's tired timer
   * @returns
   */
  bomb() {
    if (!this.gameState.battle) {
      alert("this shouldn't happen outside of battle");
      return;
    }
    const tiredTimer = this.gameState.tiredTimer;
    const rId = utils.randomArrayId(this.gameState.battle.enemies);
    const enemy = this.gameState.battle.enemies[rId]!;
    this.soundManager.playSound(sounds.explosion);
    enemy.health -= 5;
    enemy.damagedTimer.start();
    timerQueue.push(enemy.damagedTimer);
    tiredTimer.goalSecs = 2 - this.gameState.inventory.armor.speed;
    tiredTimer.start();
    return this.checkBattleEnd();
  }

  /**
   * Pauses the current battle's enemies' cooldown timers for a given ammount of seconds
   * @param seconds
   */
  stunEnemy(seconds: number) {
    if (!this.gameState.battle) {
      alert("not in battle");
      return;
    }
    this.gameState.battle.enemies.forEach((e) => {
      e.cooldownTimer.pause();
    });
    const stunTimer = new Timer({
      goalSecs: seconds,
      goalFunc: () => {
        this.gameState.battle!.enemies.forEach((e) => {
          e.cooldownTimer.unpause();
        });
        this.stunTicStart = null;
      },
    });
    timerQueue.push(stunTimer);
    stunTimer.start();
    this.stunTicStart = timeTracker.currentGameTic;
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
      alert("this shouldn't happen outside of battle");
      return;
    }
    const tiredTimer = this.gameState.tiredTimer;
    if (tiredTimer.ended || !tiredTimer.started) {
      if (button == CLICKLEFT) {
        if (this.gameState.holding instanceof Bomb) {
          this.gameState.holding = null;
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
