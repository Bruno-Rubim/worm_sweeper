import type CanvasManager from "./canvasManager.js";
import { cursor } from "./cursor.js";
import type { GameManager } from "./gameManager.js";

/**
 * Updates the canvas to the current screen size and renders the game and cursor
 * @param canvasManager
 * @param gameManager
 */
export function renderGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  canvasManager.updateElementSize();
  canvasManager.clearCanvas();
  gameManager.render(canvasManager);
  cursor.render(canvasManager);
}
