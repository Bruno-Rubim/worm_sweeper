import { LevelManager } from "./level/levelManager.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderBorder } from "./renderBorder.js";
import { timerQueue } from "./timerQueue.js";

export class GameManager {
  gameState = new GameState();
  levelManager = new LevelManager(this.gameState);

  render(canvasManager: CanvasManager) {
    timerQueue.forEach((timer, i) => {
      if (timer.ticsRemaining <= 0 && !timer.ended) {
        if (timer.goalFunc) {
          timer.goalFunc();
        }
        if (timer.loop) {
          timer.reset();
        } else {
          timer.ended = true;
          timerQueue.splice(i, 1);
        }
      }
    });
    this.levelManager.render(canvasManager);
    renderBorder(canvasManager, this.gameState);
  }
}
