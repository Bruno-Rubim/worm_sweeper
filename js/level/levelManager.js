import CanvasManager from "../canvasManager.js";
import GameObject from "../gameObject.js";
import Position from "../position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, CLICKLEFT, CLICKRIGHT, } from "../global.js";
import { Action, ChangeCursorState, ChangeScene, NextLevel, RestartGame, StartBattle, } from "../action.js";
import { CURSORDEFAULT, CURSORNONE } from "../cursor.js";
import { sprites } from "../sprites.js";
import timeTracker from "../timer/timeTracker.js";
import { Timer } from "../timer/timer.js";
import { timerQueue } from "../timer/timerQueue.js";
import CaveManager from "./caveManager.js";
import BattleManager from "./battleManager.js";
import ShopManager from "./shopManager.js";
import { Battle } from "./battle.js";
import sounds from "../sounds.js";
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
    canvasManager.renderAnimationFrame(transitionObject.sprite, transitionObject.pos, transitionObject.width, transitionObject.height, 4, 4, transitionObject.firstAnimationTic, timeTracker.currentGameTic, 1, new Position(), false);
};
transitionObject.hidden = true;
export class LevelManager extends GameObject {
    gameState;
    soundManager;
    currentSceneManager;
    shopManager;
    caveManager;
    battleManager;
    constructor(gameState, soundManager) {
        super({
            pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
            sprite: sprites.transparent_pixel,
            width: 128,
            height: 128,
        });
        this.gameState = gameState;
        this.soundManager = soundManager;
        this.shopManager = new ShopManager(gameState, this.pos, this.soundManager);
        this.caveManager = new CaveManager(gameState, this.pos, this.soundManager);
        this.battleManager = new BattleManager(gameState, this.pos, this.soundManager);
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
        if (this.gameState.inBook) {
            canvasManager.renderSprite(sprites.bg_rules, this.pos, this.width, this.height);
            return;
        }
        if (this.gameState.paused) {
            canvasManager.renderSprite(sprites.screen_paused, this.pos, this.width, this.height);
            return;
        }
        this.currentSceneManager.render(canvasManager);
        transitionObject.render(canvasManager);
        if (this.gameState.gameOver) {
            canvasManager.renderSprite(sprites.screen_defeat, this.pos, this.width, this.height);
        }
    }
    checkBattleEnd() {
        this.handleAction(this.battleManager.checkBattleEnd());
    }
    screenTransition(transitionFunc, delay = 0) {
        this.gameState.inTransition = true;
        const delayTimer = new Timer({
            goalSecs: delay,
            goalFunc: () => {
                transitionObject.hidden = false;
                transitionObject.resetAnimation();
                const transitionFuncTimer = new Timer({
                    goalSecs: 8 / timeTracker.ticsPerSecond,
                    goalFunc: transitionFunc,
                });
                const transitionEndTimer = new Timer({
                    goalSecs: 16 / timeTracker.ticsPerSecond,
                    goalFunc: () => {
                        this.gameState.inTransition = false;
                    },
                });
                timerQueue.push(transitionFuncTimer, transitionEndTimer);
                transitionFuncTimer.start();
                transitionEndTimer.start();
            },
        });
        timerQueue.push(delayTimer);
        delayTimer.start();
    }
    changeScene(scene) {
        const currentScene = this.gameState.currentScene;
        if (scene == "cave" && currentScene == "shop") {
            this.soundManager.playSound(sounds.steps);
        }
        this.screenTransition(() => {
            switch (scene) {
                case "battle":
                    this.gameState.level.cave.clearExposedWorms();
                    this.gameState.level.cave.updateAllStats();
                    this.currentSceneManager = this.battleManager;
                    this.gameState.battle?.start(this.gameState.inventory.armor.defense +
                        (this.gameState.hasItem("safety_helmet") ? 1 : 0), this.gameState.inventory.armor.reflection, this.gameState.inventory.armor.spikes);
                    break;
                case "cave":
                    switch (currentScene) {
                        case "battle":
                            this.gameState.level.cave.wormsLeft--;
                            this.gameState.level.cave.wormQuantity--;
                            this.caveManager.checkCaveClear();
                        case "shop":
                            this.currentSceneManager = this.caveManager;
                            this.gameState.unpauseGameTimer();
                            break;
                    }
                    break;
                case "shop":
                    this.gameState.pauseGameTimer();
                    this.currentSceneManager = this.shopManager;
                    break;
            }
            this.gameState.currentScene = scene;
        }, scene == "battle" ? 0.5 : 0);
    }
    handleAction(action) {
        if (!action) {
            return;
        }
        if (action instanceof ChangeScene) {
            this.changeScene(action.newScene);
        }
        else if (action instanceof NextLevel) {
            this.screenTransition(() => {
                this.gameState.level = this.gameState.level.nextLevel();
                this.gameState.gameTimer.addSecs(60);
                this.gameState.level.cave.start(action.starterGridPos, this.gameState.itemNames);
            });
        }
        else if (action instanceof StartBattle) {
            this.gameState.battle = new Battle(this.gameState.level.depth, action.enemyCount);
            this.changeScene("battle");
        }
        else {
            console.warn("unhandled action", action);
        }
    }
    hoverFunction = (cursorPos) => {
        let action = this.currentSceneManager.handleHover(cursorPos);
        if (this.gameState.inTransition) {
            action = new ChangeCursorState(CURSORNONE);
        }
        if (this.gameState.inBook ||
            this.gameState.gameOver ||
            this.gameState.paused) {
            action = new ChangeCursorState(CURSORDEFAULT);
        }
        return action;
    };
    notHoverFunction = () => {
        let action = this.currentSceneManager.handleNotHover();
        return action;
    };
    clickFunction = (cursorPos, button) => {
        if (this.gameState.paused) {
            return;
        }
        if (this.gameState.gameOver) {
            if (this.gameState.heldWhileDeath) {
                this.gameState.heldWhileDeath = false;
                return;
            }
            return new RestartGame();
        }
        if (this.gameState.inTransition) {
            return;
        }
        if (this.gameState.inBook) {
            return;
        }
        this.handleAction(this.currentSceneManager.handleClick(cursorPos, button));
    };
    heldFunction = (cursorPos, button) => {
        if (this.gameState.inTransition ||
            this.gameState.inBook ||
            this.gameState.gameOver ||
            this.gameState.paused) {
            return;
        }
        this.handleAction(this.currentSceneManager.handleHeld(cursorPos, button));
    };
}
