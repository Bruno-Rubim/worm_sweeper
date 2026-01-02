import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, CLICKLEFT, CLICKRIGHT, } from "../global.js";
import { Action, ChangeCursorState, ChangeScene, NextLevel, RestartGame, } from "../action.js";
import { CURSORDEFAULT, CURSORNONE } from "../cursor.js";
import { sprites } from "../sprite.js";
import timeTracker from "../timer/timeTracker.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import CaveManager from "./caveManager.js";
import BattleManager from "./battleManager.js";
import ShopManager from "./shopManager.js";
import { Battle } from "./battle.js";
const transitionObject = new GameObject({
    sprite: sprites.scene_transition,
    height: 128,
    width: 128,
    pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
});
transitionObject.render = (canvasManager) => {
    if (transitionObject.hidden) {
        return;
    }
    canvasManager.renderAnimationFrame(transitionObject.sprite, transitionObject.pos, transitionObject.width, transitionObject.height, 4, 4, transitionObject.birthTic, timeTracker.currentGameTic, 1, new Position(), false);
};
transitionObject.hidden = true;
export class LevelManager extends GameObject {
    gameState;
    shopManager;
    caveManager;
    battleManager;
    currentSceneManager;
    constructor(gameState) {
        super({
            pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
            sprite: sprites.transparent_pixel,
            width: 128,
            height: 128,
        });
        this.gameState = gameState;
        this.hoverFunction = (cursorPos) => {
            return this.handleHover(cursorPos);
        };
        this.clickFunction = (cursorPos, button) => {
            return this.handleClick(cursorPos, button);
        };
        this.heldFunction = (cursorPos, button) => {
            return this.handleHeld(cursorPos, button);
        };
        this.shopManager = new ShopManager(gameState, this.pos);
        this.caveManager = new CaveManager(gameState, this.pos);
        this.battleManager = new BattleManager(gameState, this.pos);
        switch (gameState.currentScene) {
            case "battle":
                this.currentSceneManager = this.battleManager;
                break;
            case "cave":
                this.currentSceneManager = this.caveManager;
                break;
            case "shop":
                this.currentSceneManager = this.shopManager;
                break;
        }
        transitionObject.endAnimation();
    }
    render(canvasManager) {
        if (this.gameState.paused) {
            canvasManager.renderSprite(sprites.screen_paused, this.pos, this.width, this.height);
            return;
        }
        if (this.gameState.inBook) {
            canvasManager.renderSprite(sprites.bg_rules, this.pos, this.width, this.height);
            return;
        }
        this.currentSceneManager.render(canvasManager);
        transitionObject.render(canvasManager);
        if (this.gameState.gameOver) {
            canvasManager.renderSprite(sprites.screen_defeat, this.pos, this.width, this.height);
        }
    }
    screenTransition(transitionFunc, delay = 0) {
        this.gameState.inTransition = true;
        const delayTimer = new Timer(delay, () => {
            transitionObject.hidden = false;
            transitionObject.resetAnimation();
            const transitionFuncTimer = new Timer(8 / timeTracker.ticsPerSecond, transitionFunc);
            const transitionEndTimer = new Timer(16 / timeTracker.ticsPerSecond, () => {
                this.gameState.inTransition = false;
            });
            timerQueue.push(transitionFuncTimer, transitionEndTimer);
            transitionFuncTimer.start();
            transitionEndTimer.start();
        });
        timerQueue.push(delayTimer);
        delayTimer.start();
    }
    changeScene(action) {
        const currentScene = this.gameState.currentScene;
        this.screenTransition(() => {
            switch (action.newScene) {
                case "battle":
                    this.gameState.level.cave.clearExposedWorms();
                    this.gameState.level.cave.updateAllStats();
                    this.gameState.battle = new Battle(this.gameState.level.depth);
                    this.currentSceneManager = this.battleManager;
                    break;
                case "cave":
                    this.gameState.gameTimer.unpause();
                    switch (currentScene) {
                        case "battle":
                            this.gameState.level.cave.wormsLeft--;
                            this.gameState.level.cave.wormQuantity--;
                            this.caveManager.checkCaveClear();
                        case "shop":
                            this.currentSceneManager = this.caveManager;
                            break;
                    }
                    break;
                case "shop":
                    this.gameState.gameTimer.pause();
                    this.currentSceneManager = new ShopManager(this.gameState, this.pos);
                    break;
            }
            this.gameState.currentScene = action.newScene;
        }, currentScene + action.newScene == "battlecave" ||
            action.newScene == "battle"
            ? 0.5
            : 0);
    }
    handleAction(action) {
        if (!action) {
            return;
        }
        if (action instanceof ChangeScene) {
            this.changeScene(action);
        }
        else if (action instanceof NextLevel) {
            this.screenTransition(() => {
                this.gameState.level = this.gameState.level.nextLevel();
                this.gameState.gameTimer.addSecs(60);
                this.gameState.level.cave.start(action.starterGridPos, this.gameState.passiveItemNames);
            });
        }
        else {
            console.warn("unhandled action", action);
        }
    }
    handleHover(cursorPos) {
        let action = this.currentSceneManager.handleHover(cursorPos);
        if (this.gameState.inTransition) {
            action = new ChangeCursorState(CURSORNONE);
        }
        if (this.gameState.inBook || this.gameState.gameOver) {
            action = new ChangeCursorState(CURSORDEFAULT);
        }
        return action;
    }
    handleClick(cursorPos, button) {
        if (this.gameState.gameOver) {
            return new RestartGame();
        }
        if (this.gameState.inTransition) {
            return;
        }
        if (this.gameState.inBook) {
            return;
        }
        this.handleAction(this.currentSceneManager.handleClick(cursorPos, button));
    }
    handleHeld(cursorPos, button) {
        if (this.gameState.inTransition ||
            this.gameState.inBook ||
            this.gameState.gameOver) {
            return;
        }
        this.handleAction(this.currentSceneManager.handleHeld(cursorPos, button));
    }
    checkBattleEnd() {
        this.handleAction(this.battleManager.checkBattleEnd());
    }
}
