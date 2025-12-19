import type CanvasManager from "./canvasManager.js";
import { cursor } from "./cursor.js";
import type { GameManager } from "./gameManager.js";
import GameObject from "./gameObject.js";
import Level from "./level/level.js";

const gameBorder = new GameObject({
  spriteName: "game_border",
  height: 168,
  width: 168,
});

export function renderGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  canvasManager.clearCanvas();
  gameBorder.render(canvasManager);
  gameManager.levelInterface.render(canvasManager);
  cursor.render(canvasManager);
}
