import {
  ChangeCursorState,
  ChangeScene,
  PlayerAtack,
  Transition,
} from "../action.js";
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
        canvasManager.renderSpriteFromSheet(
          sprites.icon_sheet,
          enemy.pos.add(33 + i * 9 - (9 * enemy.health) / 2, 64),
          8,
          8,
          new Position(5, 0)
        );
      }
      canvasManager.renderSpriteFromSheet(
        sprites.icon_sheet,
        enemy.pos.add(25, 8),
        8,
        8,
        new Position(3, 1)
      );
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
    if (!this.gameState.tiredTimer.ended) {
      let counterFrame = Math.floor(
        Math.min(15, (this.gameState.tiredTimer.percentage / 100) * 16)
      );
      canvasManager.renderSpriteFromSheet(
        sprites.counter_sheet,
        new Position(GAMEWIDTH / 2 - 4, GAMEHEIGHT - 32),
        8,
        8,
        new Position(counterFrame % 8, Math.floor(counterFrame / 8))
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
    if (button == CLICKLEFT) {
      const tiredTimer = this.gameState.tiredTimer;
      if (tiredTimer.ended || !tiredTimer.started) {
        const rId = utils.randomArrayId(this.gameState.battle!.enemies);
        const enemy = this.gameState.battle!.enemies[rId]!;
        enemy.health -= this.gameState.inventory.weapon.damage;
        if (enemy.health < 1) {
          timerQueue.splice(timerQueue.indexOf(enemy.cooldownTimer), 1);
          this.gameState.battle!.enemies.splice(rId, 1);
          if (this.gameState.battle!.enemies.length <= 0) {
            return new ChangeScene("cave");
          }
        }
        tiredTimer.goalSecs = this.gameState.inventory.weapon.cooldown;
        tiredTimer.start();
      }
    }
  };

  handleHover = () => {
    return new ChangeCursorState(CURSORBATTLE);
  };
}
