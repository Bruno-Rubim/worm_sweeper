import type CanvasManager from "./canvasManager.js";
import { cursor } from "./cursor.js";
import type { GameManager } from "./gameManager.js";

export function renderGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  canvasManager.updateElementSize();
  canvasManager.clearCanvas();
  gameManager.render(canvasManager);
  cursor.render(canvasManager);
}
