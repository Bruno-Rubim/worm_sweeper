import { LevelManager } from "./level/levelManager.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderBorder } from "./renderBorder.js";
import { SoundManager } from "./soundManager.js";
import { TimerMnager } from "./timer/timerManager.js";

// Object that holds all information of the game and its pieces
export class GameManager {
  gameState = new GameState();
  soundManager = new SoundManager();
  levelManager = new LevelManager(this.gameState, this.soundManager);
  timerManager = new TimerMnager();

  constructor() {
    document.querySelector("button")!.onclick = () => {
      if (this.soundManager.mute == 0) {
        this.soundManager.mute = 1;
      } else {
        this.soundManager.mute = 0;
      }
    };
  }

  /**
   * Clears the timer queue, restarts the gameState and replaces the levelManager
   */
  restart() {
    this.timerManager.clearQueue();
    this.gameState.restart();
    this.levelManager = new LevelManager(this.gameState, this.soundManager);
  }

  /**
   * Renders the current level and game border
   * @param canvasManager
   */
  render(canvasManager: CanvasManager) {
    this.levelManager.render(canvasManager);
    renderBorder(canvasManager, this.gameState);
  }
}
