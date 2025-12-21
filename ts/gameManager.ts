import { LevelManager } from "./level/levelManager.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderBorder } from "./renderBorder.js";

export class GameManager {
  gameState = new GameState();
  levelManager = new LevelManager(this.gameState);

  render(canvasManager: CanvasManager) {
    this.levelManager.render(canvasManager);
    renderBorder(canvasManager, this.gameState);
  }
}
