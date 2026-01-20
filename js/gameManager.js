import { Action, ChangeCursorState, ChangeScene, ConsumeItem, EnemyAtack, ItemDescription, LoseGame, PickupBomb, RestartGame, RingBell, SellItem, ToggleBook, } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import { cursor, CURSORBOMB, CURSORDEFAULT, } from "./cursor.js";
import { gameState } from "./gameState.js";
import { levelManager } from "./level/levelManager.js";
import { renderBorder } from "./renderBorder.js";
import { soundManager } from "./soundManager.js";
import sounds from "./sounds.js";
import { timerManager } from "./timer/timerManager.js";
import timeTracker from "./timer/timeTracker.js";
import { handleMouseInput } from "./input/handleInput.js";
import { bindListeners, inputState } from "./input/inputState.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield } from "./items/shield/shield.js";
import playerInventory, { resetInventory } from "./playerInventory.js";
import { Armor, armorDic } from "./items/armor/armor.js";
import { Consumable } from "./items/consumable/consumable.js";
import consumableDict from "./items/consumable/dict.js";
import Position from "./gameElements/position.js";
import { utils } from "./utils.js";
import { flagItem, picaxeItem } from "./items/uiItems.js";
import { DEV } from "./global.js";
import Level from "./level/level.js";
import { transitionOverlay } from "./level/transitionOverlay.js";
import { getItem } from "./items/genericDict.js";
import Bomb from "./items/consumable/bomb.js";
export default class GameManager {
    cursorChanged = false;
    hoverItemDesc = false;
    constructor() {
        bindListeners(canvasManager.canvasElement);
    }
    changeCursorState(newState) {
        cursor.state = newState;
        this.cursorChanged = true;
    }
    pauseGame() {
        timeTracker.togglePause();
        gameState.paused = timeTracker.isPaused;
    }
    consumeItem(action) {
        switch (action.itemName) {
            case "time_potion":
                gameState.gameTimer.addSecs(60);
                soundManager.playSound(sounds.drink);
                break;
            case "health_vial":
                gameState.health += 0.5;
                soundManager.playSound(sounds.drink);
                break;
            case "health_potion":
                gameState.health += 1;
                soundManager.playSound(sounds.drink);
                break;
            case "health_potion_big":
                gameState.health += 2;
                soundManager.playSound(sounds.drink);
                break;
            case "empty":
                break;
        }
        if (action.itemName != "empty") {
            playerInventory.consumable = consumableDict.empty;
        }
    }
    toggleBook() {
        gameState.inBook = !gameState.inBook;
        if (gameState.inBook) {
            timeTracker.pause();
        }
        else if (!gameState.paused && !gameState.gameOver) {
            timeTracker.unpause();
        }
    }
    setItemDescription(action) {
        cursor.description.hidden = false;
        cursor.description.side = action.side;
        cursor.description.text = action.description;
        cursor.description.fontSize = action.descFontSize;
        this.hoverItemDesc = true;
    }
    loseGame() {
        gameState.gameOver = true;
        levelManager.caveManager.revealAllBlocks();
        timeTracker.pause();
    }
    restartGame() {
        timerManager.clearQueue();
        gameState.gameOver = false;
        gameState.started = false;
        gameState.inTransition = false;
        gameState.level = new Level(0);
        gameState.gameTimer.restart();
        gameState.tiredTimer.restart();
        gameState.attackAnimationTimer.restart();
        gameState.defenseAnimationTimer.restart();
        gameState.currentScene = "cave";
        gameState.gold = 0;
        gameState.health = 5;
        gameState.deathCount++;
        gameState.inventorySpace = 6;
        resetInventory();
        transitionOverlay.endAnimation();
        timeTracker.unpause();
    }
    checkPlayerDead() {
        if (gameState.health <= 0) {
            if (inputState.mouse.heldLeft || inputState.mouse.heldRight) {
                gameState.heldWhileDeath = true;
            }
            this.loseGame();
            return true;
        }
    }
    ringBell() {
        if (gameState.currentScene == "battle") {
            levelManager.battleManager.stunEnemy(3);
        }
        else {
            gameState.level.cave.bellRang = true;
        }
        soundManager.playSound(sounds.bell);
    }
    pickupBomb(action) {
        if (gameState.holding == null) {
            gameState.holding = action.bombItem;
            playerInventory.consumable = consumableDict.empty;
        }
    }
    sellItem(action) {
        if (gameState.currentScene == "shop" &&
            !["empty", "book", "picaxe", "flag"].includes(action.item.name)) {
            if (action.item instanceof Weapon || action.item instanceof Shield) {
                soundManager.playSound(sounds.wrong);
                return;
            }
            if (action.item instanceof Armor) {
                playerInventory.armor = armorDic.empty;
            }
            else if (action.item instanceof Consumable) {
                playerInventory.consumable = consumableDict.empty;
            }
            else {
                if (playerInventory.passive_1 == action.item) {
                    playerInventory.passive_1 = getItem("empty", new Position(4, 18 * 1));
                }
                if (playerInventory.passive_2 == action.item) {
                    playerInventory.passive_2 = getItem("empty", new Position(4, 18 * 2));
                }
                if (playerInventory.passive_3 == action.item) {
                    playerInventory.passive_3 = getItem("empty", new Position(4, 18 * 3));
                }
                if (playerInventory.passive_4 == action.item) {
                    playerInventory.passive_4 = getItem("empty", new Position(4, 18 * 4));
                }
                if (playerInventory.passive_5 == action.item) {
                    playerInventory.passive_5 = getItem("empty", new Position(4, 18 * 5));
                }
                if (playerInventory.passive_6 == action.item) {
                    playerInventory.passive_6 = getItem("empty", new Position(4, 18 * 6));
                }
                if (playerInventory.passive_7 == action.item) {
                    playerInventory.passive_7 = getItem("empty", new Position(4, 18 * 7));
                }
            }
            gameState.gold += utils.randomInt(4, 1);
            soundManager.playSound(sounds.gold);
        }
    }
    performEnemyAttack(action) {
        return levelManager.battleManager.enemyAtack(action);
    }
    handleAction(action) {
        if (!action) {
            return;
        }
        if (action instanceof ChangeCursorState) {
            this.changeCursorState(action.newState);
            return "cursorChange";
        }
        if (action instanceof ConsumeItem) {
            this.consumeItem(action);
            return;
        }
        if (action instanceof ToggleBook) {
            this.toggleBook();
            return;
        }
        if (action instanceof ItemDescription) {
            this.setItemDescription(action);
            return "itemDescription";
        }
        if (action instanceof RestartGame) {
            this.restartGame();
            return;
        }
        if (action instanceof EnemyAtack) {
            const changeScene = this.performEnemyAttack(action);
            if (this.checkPlayerDead()) {
                return;
            }
            if (changeScene instanceof ChangeScene) {
                this.handleAction(changeScene);
                return;
            }
            return;
        }
        if (action instanceof RingBell) {
            this.ringBell();
            return;
        }
        if (action instanceof PickupBomb) {
            this.pickupBomb(action);
            return;
        }
        if (action instanceof SellItem) {
            this.sellItem(action);
            return;
        }
        if (action instanceof ChangeScene) {
            levelManager.handleAction(action);
            return;
        }
        if (action instanceof LoseGame) {
            this.loseGame();
            return;
        }
        console.warn("unhandled action", action);
    }
    checkTimers() {
        timerManager.queue.forEach((timer) => {
            let action = null;
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
                        timerManager.deleteTimer(timer);
                    }
                }
                this.handleAction(action);
            }
        });
    }
    handleKeyInput() {
        if (inputState.keyboard.Escape == "pressed") {
            inputState.keyboard.Escape = "read";
            if (gameState.inBook) {
                return new ToggleBook();
            }
            this.pauseGame();
        }
        if (DEV) {
            if (inputState.keyboard.q == "pressed") {
                inputState.keyboard.q = "read";
                if (confirm("Would you like to quit the game?")) {
                    this.loseGame();
                }
                inputState.keyboard.q = "unpressed";
            }
            if (inputState.keyboard.w == "pressed") {
                inputState.keyboard.w = "read";
                soundManager.playSound(sounds.stab);
            }
        }
    }
    updateGame() {
        this.cursorChanged = false;
        this.hoverItemDesc = false;
        this.checkTimers();
        cursor.pos.update(inputState.mouse.pos.divide(canvasManager.renderScale));
        const gameObjects = [
            levelManager,
            ...Object.values(playerInventory),
            picaxeItem,
            flagItem,
        ];
        const actions = handleMouseInput(gameObjects);
        actions?.forEach((action) => {
            this.handleAction(action);
        });
        if (gameState.holding != null) {
            if (gameState.holding instanceof Bomb) {
                this.changeCursorState(CURSORBOMB);
            }
        }
        if (!this.cursorChanged) {
            this.changeCursorState(CURSORDEFAULT);
        }
        if (!this.hoverItemDesc) {
            cursor.description.hidden = true;
        }
        if (inputState.mouse.clickedRight) {
            inputState.mouse.clickedRight = false;
        }
        if (inputState.mouse.clickedLeft) {
            inputState.mouse.clickedLeft = false;
        }
        cursor.pos.update(cursor.pos.subtract(8, 8));
        this.handleAction(this.handleKeyInput());
    }
    renderGame() {
        canvasManager.updateElementSize();
        canvasManager.clearCanvas();
        levelManager.render();
        renderBorder();
        cursor.render(canvasManager);
    }
}
