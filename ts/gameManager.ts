import type GameObject from "./gameObject.js";
import { LevelInterface } from "./level/levelInterface.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderGameInterface } from "./renderGameInterface.js";

export class GameManager {
  gameState = new GameState();
  levelInterface = new LevelInterface(this.gameState);
  gameObjects: GameObject[] = [this.levelInterface];

  render(canvasManager: CanvasManager) {
    this.levelInterface.render(canvasManager);
    renderGameInterface(canvasManager, this.gameState);
  }
}
