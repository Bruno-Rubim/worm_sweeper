import { LevelManager } from "./level/levelManager.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderBorder } from "./renderBorder.js";
import { timerQueue } from "./timer/timerQueue.js";
import { EnemyAtack } from "./action.js";

export class GameManager {
  gameState = new GameState();
  levelManager = new LevelManager(this.gameState);

  restart() {
    timerQueue.splice(0, Infinity);
    this.gameState.restart();
    this.levelManager = new LevelManager(this.gameState);
  }

  render(canvasManager: CanvasManager) {
    timerQueue.forEach((timer, i) => {
      let action;
      if (timer.ticsRemaining <= 0 && !timer.ended) {
        if (timer.goalFunc) {
          action = timer.goalFunc();
        }
        if (timer.loop) {
          timer.rewind();
        } else {
          timer.ended = true;
          if (timer.deleteAtEnd) {
            timerQueue.splice(i, 1);
          }
        }
        if (action instanceof EnemyAtack) {
          action.enemy.attackAnimTimer.start();
          timerQueue.push(action.enemy.attackAnimTimer);
          this.gameState.health -= Math.max(
            0,
            action.damage - this.gameState.currentDefense
          );
          action.enemy.health -= this.gameState.currentReflection;
          if (this.gameState.health < 1) {
            this.gameState.lose();
          }
          this.levelManager.checkBattleEnd();
        }
      }
    });
    this.levelManager.render(canvasManager);
    renderBorder(canvasManager, this.gameState);
  }
}
