import GameManager from "./gameManager.js";

export const gameManager = new GameManager();

/**
 * Recursive function to update the game and render it
 */
function frameLoop() {
  gameManager.updateGame();
  gameManager.renderGame();
  requestAnimationFrame(frameLoop);
}

frameLoop();
