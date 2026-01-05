import { LevelManager } from "./level/levelManager.js";
import CanvasManager from "./canvasManager.js";
import GameState from "./gameState.js";
import { renderBorder } from "./renderBorder.js";
import { timerQueue } from "./timer/timerQueue.js";
import { EnemyAtack, RingBell } from "./action.js";
import { SoundManager } from "./soundManager.js";
import sounds from "./sounds.js";

export class GameManager {
  gameState = new GameState();
  soundManager = new SoundManager();
  levelManager = new LevelManager(this.gameState, this.soundManager);

  constructor() {
    document.querySelector("button")!.onclick = () => {
      if (this.soundManager.mute == 0) {
        this.soundManager.mute = 1;
      } else {
        this.soundManager.mute = 0;
      }
    };
  }

  restart() {
    timerQueue.splice(0, Infinity);
    this.gameState.restart();
    this.levelManager = new LevelManager(this.gameState, this.soundManager);
  }

  render(canvasManager: CanvasManager) {
    this.levelManager.render(canvasManager);
    renderBorder(canvasManager, this.gameState);
  }
}
