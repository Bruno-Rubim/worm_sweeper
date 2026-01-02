import { ChangeCursorState, ChangeScene } from "../action.js";
import type CanvasManager from "../canvasManager.js";
import { CURSORBATTLE } from "../cursor.js";
import type GameState from "../gameState.js";
import {
  BORDERTHICKBOTTOM,
  BORDERTHICKLEFT,
  BORDERTHICKRIGHT,
  BORDERTHICKTOP,
  CLICKLEFT,
  CLICKRIGHT,
  GAMEHEIGHT,
  GAMEWIDTH,
} from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import { timerQueue } from "../timer/timerQueue.js";
import { utils } from "../utils.js";
import SceneManager from "./sceneManager.js";

export default class BattleManager extends SceneManager {
  constructor(gameState: GameState, scenePos: Position) {
    super(gameState, scenePos);
  }

  render = (canvasManager: CanvasManager) => {
    canvasManager.renderSprite(
      sprites.bg_battle,
      new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
      GAMEWIDTH - BORDERTHICKLEFT - BORDERTHICKRIGHT,
      GAMEHEIGHT - BORDERTHICKTOP - BORDERTHICKBOTTOM
    );
    this.gameState.battle?.enemies.forEach((enemy) => {
      canvasManager.renderSpriteFromSheet(
        sprites.enemy_worm,
        enemy.pos,
        64,
        64,
        new Position()
      );
      for (let i = 0; i < enemy.health; i++) {
        canvasManager.renderText(
          "icons",
          enemy.pos.add(33 + i * 9 - (9 * enemy.health) / 2, 64),
          "$hrt"
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
      inventory.shield.bigSprite,
      new Position(BORDERTHICKLEFT + 24, BORDERTHICKTOP + 45),
      128,
      128
    );
    canvasManager.renderSprite(
      inventory.weapon.bigSprite,
      new Position(BORDERTHICKLEFT - 24, BORDERTHICKTOP + 45),
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
        const rId = utils.randomArrayId(this.gameState.battle!.enemies);
        const enemy = this.gameState.battle!.enemies[rId]!;
        enemy.health -= this.gameState.inventory.weapon.totalDamage;
        if (enemy.health < 1) {
          timerQueue.splice(timerQueue.indexOf(enemy.cooldownTimer), 1);
          this.gameState.battle!.enemies.splice(rId, 1);
          if (this.gameState.battle!.enemies.length <= 0) {
            return new ChangeScene("cave");
          }
        }
        tiredTimer.goalSecs = this.gameState.inventory.weapon.cooldown;
        tiredTimer.start();
      } else {
        this.gameState.defending = true;
        tiredTimer.goalSecs = this.gameState.inventory.shield.cooldown;
        tiredTimer.goalFunc = () => {
          this.gameState.defending = false;
        };
        tiredTimer.start();
      }
    }
  };

  handleHover = () => {
    return new ChangeCursorState(CURSORBATTLE);
  };
}
