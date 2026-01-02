import CanvasManager from "./canvasManager.js";
import { GameManager } from "./gameManager.js";
import { renderGame } from "./renderGame.js";
export function renderFrame(canvasManager, gameManager) {
    canvasManager.updateElementSize();
    renderGame(canvasManager, gameManager);
}
