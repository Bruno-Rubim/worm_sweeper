import GameObject from "../gameElements/gameObject.js";
import Position from "../gameElements/position.js";
import { BORDERTHICKLEFT, BORDERTHICKTOP, CENTER, CLICKLEFT, CLICKRIGHT, GAMEWIDTH, RIGHT, } from "../global.js";
import { Action, ChangeCursorState, ChangeScene, NextLevel, ResetShop, RestartGame, StartBattle, } from "../action.js";
import { CURSORBOOK, CURSORDEFAULT, CURSORNONE } from "../cursor.js";
import { sprites } from "../sprites.js";
import timeTracker from "../timer/timeTracker.js";
import { Timer } from "../timer/timer.js";
import sounds from "../sounds/sounds.js";
import CaveManager from "./cave/caveManager.js";
import ShopManager from "./shop/shopManager.js";
import { bookPages } from "../bookPages.js";
import { canvasManager } from "../canvasManager.js";
import { gameState } from "../gameState.js";
import { soundManager } from "../sounds/soundManager.js";
import BattleManager from "./battle/battleManager.js";
import { Battle } from "./battle/battle.js";
import playerInventory from "../playerInventory.js";
import { GAMETIMERSYNC, timerManager } from "../timer/timerManager.js";
import { transitionOverlay } from "./transitionOverlay.js";
export class LevelManager extends GameObject {
    shopManager;
    caveManager;
    battleManager;
    constructor() {
        super({
            pos: new Position(BORDERTHICKLEFT, BORDERTHICKTOP),
            sprite: sprites.transparent_pixel,
            width: 128,
            height: 128,
        });
        this.shopManager = new ShopManager();
        this.caveManager = new CaveManager();
        this.battleManager = new BattleManager();
        transitionOverlay.endAnimation();
    }
    get currentSceneManager() {
        switch (gameState.currentScene) {
            case "battle":
                return this.battleManager;
            case "cave":
                return this.caveManager;
            case "shop":
                return this.shopManager;
        }
    }
    render() {
        if (gameState.inBook) {
            canvasManager.renderSprite(sprites.bg_rules, this.pos, this.width, this.height);
            const fontSize = 0.6;
            const padding = 10 * fontSize;
            canvasManager.renderText("book", this.pos.add(padding, padding), bookPages[gameState.bookPage], RIGHT, this.width - padding * 2, fontSize);
            return;
        }
        if (gameState.paused) {
            canvasManager.renderSprite(sprites.screen_paused, this.pos, this.width, this.height);
            return;
        }
        if (gameState.inInventory) {
            canvasManager.renderSprite(sprites.bg_bag, this.pos, this.width, this.height);
            playerInventory.passives.forEach((item, i) => {
                item.render();
            });
            return;
        }
        this.currentSceneManager.render();
        transitionOverlay.render();
        if (gameState.gameOver) {
            canvasManager.renderSprite(sprites.screen_defeat, this.pos, this.width, this.height);
            console.log(Math.round(gameState.runTime * 10) / 10);
            if (gameState.deathScreenStage > 0) {
                canvasManager.renderText("menu", new Position(GAMEWIDTH / 2, 64), "Level: " + (gameState.level.depth + 1), CENTER);
            }
            if (gameState.deathScreenStage > 1) {
                canvasManager.renderText("menu", new Position(GAMEWIDTH / 2, 80), "Run time: " + Math.floor(gameState.runTime) + "s", CENTER);
            }
            if (gameState.deathScreenStage > 3) {
                canvasManager.renderText("menu", new Position(GAMEWIDTH / 2, 128), "Click to restart", CENTER);
            }
        }
    }
    screenTransition(transitionFunc, delay = 0) {
        gameState.inTransition = true;
        new Timer({
            goalSecs: delay,
            goalFunc: () => {
                transitionOverlay.hidden = false;
                transitionOverlay.resetAnimation();
                new Timer({
                    goalSecs: 8 / timeTracker.ticsPerSecond,
                    goalFunc: transitionFunc,
                });
                new Timer({
                    goalSecs: 16 / timeTracker.ticsPerSecond,
                    goalFunc: () => {
                        gameState.inTransition = false;
                    },
                });
            },
        });
    }
    changeScene(scene) {
        const currentScene = gameState.currentScene;
        if (scene == "cave" && currentScene == "shop") {
            soundManager.playSound(sounds.steps);
        }
        this.screenTransition(() => {
            switch (scene) {
                case "battle":
                    this.caveManager.clearExposedWorms();
                    this.caveManager.updateAllStats();
                    gameState.battle?.start();
                    break;
                case "cave":
                    switch (currentScene) {
                        case "battle":
                            gameState.level.cave.wormsLeft--;
                            gameState.level.cave.wormQuantity--;
                            this.caveManager.checkCaveClear();
                        case "shop":
                            timerManager.unpauseTimers(GAMETIMERSYNC);
                            break;
                    }
                    break;
                case "shop":
                    timerManager.pauseTimers(GAMETIMERSYNC);
                    break;
            }
            gameState.currentScene = scene;
        }, scene == "battle" ? 0.5 : 0);
    }
    handleAction(action) {
        if (!action) {
            return;
        }
        if (action instanceof ChangeScene) {
            return this.changeScene(action.newScene);
        }
        if (action instanceof NextLevel) {
            this.screenTransition(() => {
                gameState.level = gameState.level.nextLevel();
                gameState.gameTimer.addSecs(15);
                this.caveManager.startCave(action.starterGridPos);
            });
        }
        else if (action instanceof StartBattle) {
            gameState.battle = new Battle(gameState.level.depth, action.enemyCount);
            this.changeScene("battle");
        }
        else if (action instanceof ResetShop) {
            if (gameState.gold >= gameState.shopResetPrice) {
                gameState.level.shop.setItems();
                soundManager.playSound(sounds.purchase);
                gameState.gold -= gameState.shopResetPrice;
                gameState.shopResetPrice += 5;
            }
            else {
                soundManager.playSound(sounds.wrong);
            }
        }
        else {
            return action;
        }
    }
    hoverFunction = (cursorPos) => {
        if (gameState.inBook) {
            return new ChangeCursorState(CURSORBOOK);
        }
        if (gameState.gameOver || gameState.paused || gameState.inInventory) {
            return new ChangeCursorState(CURSORDEFAULT);
        }
        if (gameState.inTransition) {
            return new ChangeCursorState(CURSORNONE);
        }
        return this.currentSceneManager.handleHover(cursorPos);
    };
    notHoverFunction = () => {
        let action = this.currentSceneManager.handleNotHover();
        return action;
    };
    clickFunction = (cursorPos, button) => {
        if (gameState.inBook) {
            if (button == CLICKLEFT) {
                gameState.bookPage = Math.min(bookPages.length - 1, gameState.bookPage + 1);
            }
            else {
                gameState.bookPage = Math.max(0, gameState.bookPage - 1);
            }
            return;
        }
        if (gameState.inInventory) {
            return;
        }
        if (gameState.paused) {
            return;
        }
        if (gameState.gameOver) {
            if (gameState.deathScreenStage > 3) {
                return new RestartGame();
            }
            return;
        }
        if (gameState.inTransition) {
            return;
        }
        return this.handleAction(this.currentSceneManager.handleClick(cursorPos, button));
    };
    heldFunction = (cursorPos, button) => {
        if (gameState.inTransition ||
            gameState.inBook ||
            gameState.gameOver ||
            gameState.paused) {
            return;
        }
        let action = this.handleAction(this.currentSceneManager.handleHeld(cursorPos, button));
        return action;
    };
}
export let levelManager = new LevelManager();
