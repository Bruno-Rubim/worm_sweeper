import GameManager from "./gameManager.js";
export const gameManager = new GameManager();
function frameLoop() {
    gameManager.updateGame();
    gameManager.renderGame();
    requestAnimationFrame(frameLoop);
}
frameLoop();
