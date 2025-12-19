import type CanvasManager from "./canvasManager.js";
import { cursor } from "./cursor.js";
import type { GameManager } from "./gameManager.js";
import GameObject from "./gameObject.js";

const gameBorder = new GameObject({
  spriteName: "game_border",
  height: 168,
  width: 200,
});

export function renderGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  canvasManager.clearCanvas();
  gameBorder.render(canvasManager);
  gameManager.render(canvasManager);
  cursor.render(canvasManager);
}
