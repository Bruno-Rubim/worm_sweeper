import CanvasManager from "./canvasManager.js";
import { GameManager } from "./gameManager.js";
import { bindListeners } from "./inputState.js";
import { renderFrame } from "./rendering.js";
import updateGame from "./updateGame.js";

const canvasManager = new CanvasManager();
const gameManager = new GameManager();

bindListeners(canvasManager.canvasElement);

function frameLoop() {
  updateGame(canvasManager, gameManager);
  renderFrame(canvasManager, gameManager);
  requestAnimationFrame(frameLoop);
}

frameLoop();
