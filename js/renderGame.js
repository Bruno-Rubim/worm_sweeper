import { cursor } from "./cursor.js";
export function renderGame(canvasManager, gameManager) {
    canvasManager.clearCanvas();
    gameManager.render(canvasManager);
    cursor.render(canvasManager);
}
