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
        document.querySelector("button").onclick = () => {
            if (this.soundManager.mute == 0) {
                this.soundManager.mute = 1;
            }
            else {
                this.soundManager.mute = 0;
            }
        };
    }
    restart() {
        timerQueue.splice(0, Infinity);
        this.gameState.restart();
        this.levelManager = new LevelManager(this.gameState, this.soundManager);
    }
    render(canvasManager) {
        timerQueue.forEach((timer, i) => {
            let action;
            if (timer.ticsRemaining <= 0 && !timer.ended) {
                if (timer.goalFunc) {
                    action = timer.goalFunc();
                }
                if (timer.loop) {
                    timer.rewind();
                }
                else {
                    timer.ended = true;
                    if (timer.deleteAtEnd) {
                        timerQueue.splice(i, 1);
                    }
                }
                if (action instanceof EnemyAtack) {
                    action.enemy.attackAnimTimer.start();
                    timerQueue.push(action.enemy.attackAnimTimer);
                    this.gameState.health -= Math.max(0, action.damage - this.gameState.currentDefense);
                    action.enemy.health -= this.gameState.currentReflection;
                    if (this.gameState.health < 1) {
                        this.gameState.lose();
                    }
                    this.levelManager.checkBattleEnd();
                }
                else if (action instanceof RingBell) {
                    this.soundManager.playSound(sounds.bell);
                    this.gameState.level.cave.bellRang = true;
                }
            }
        });
        this.levelManager.render(canvasManager);
        renderBorder(canvasManager, this.gameState);
    }
}
