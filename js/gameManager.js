import { Action, ChangeCursorState, ChangeScene, ConsumeItem, EnemyAtack, ItemDescription, LoseGame, RestartGame, SellItem, ToggleBook, ToggleInventory, UseActiveItem, } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import { cursor, CURSORBOMB, CURSORDEFAULT, } from "./cursor.js";
import { gameState, resetGameState } from "./gameState.js";
import { levelManager } from "./level/levelManager.js";
import { renderBorder } from "./renderBorder.js";
import { soundManager } from "./sounds/soundManager.js";
import sounds from "./sounds/sounds.js";
import { timerManager } from "./timer/timerManager.js";
import timeTracker from "./timer/timeTracker.js";
import { handleMouseInput } from "./input/handleInput.js";
import { bindListeners, inputState } from "./input/inputState.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield } from "./items/shield/shield.js";
import playerInventory, { getInventoryItems, resetInventory, } from "./playerInventory.js";
import { Armor, armorDic } from "./items/armor/armor.js";
import { Consumable } from "./items/consumable/consumable.js";
import { utils } from "./utils.js";
import { bagItem, bookItem, musicButton, sfxButton } from "./items/uiItems.js";
import { DEV } from "./global.js";
import Level from "./level/level.js";
import { transitionOverlay } from "./level/transitionOverlay.js";
import activeDict from "./items/active/dict.js";
import { SilverBell } from "./items/active/silverBell.js";
import Position from "./gameElements/position.js";
import { ActiveItem } from "./items/active/active.js";
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
        soundManager.pauseMusic();
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
    toggleInventory() {
        gameState.inInventory = !gameState.inInventory;
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
        resetGameState();
        gameState.deathCount++;
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
    useActiveItem() {
        switch (playerInventory.active.name) {
            case "silver_bell":
                if (!(playerInventory.active instanceof SilverBell)) {
                    alert("something is wrong");
                    break;
                }
                if (playerInventory.active.ringTimer.inMotion) {
                    break;
                }
                if (gameState.currentScene == "battle") {
                    levelManager.battleManager.stunEnemy(3);
                }
                else {
                    gameState.level.cave.bellRang = true;
                }
                soundManager.playSound(sounds.bell);
                playerInventory.active.ringTimer.start();
                break;
            case "bomb":
                if (gameState.currentScene == "battle") {
                    levelManager.handleAction(levelManager.battleManager.bomb());
                    playerInventory.active = activeDict.empty;
                    break;
                }
                gameState.holding = playerInventory.active;
                playerInventory.active = activeDict.empty;
                break;
            case "empty":
                if (gameState.holding != null) {
                    if (gameState.holding.name == "bomb") {
                        levelManager.caveManager.bomb = null;
                    }
                    playerInventory.active = gameState.holding;
                    gameState.holding = null;
                }
                break;
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
            else if (action.item instanceof ActiveItem) {
                playerInventory.active = activeDict.empty;
            }
            else {
                playerInventory.passives = playerInventory.passives.filter((x) => x != action.item);
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
        if (action instanceof ToggleInventory) {
            this.toggleInventory();
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
        if (action instanceof UseActiveItem) {
            this.useActiveItem();
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
        if (inputState.keyboard[" "] == "pressed") {
            inputState.keyboard[" "] = "read";
            return new UseActiveItem();
        }
        if (DEV) {
            if (inputState.keyboard.q == "pressed") {
                inputState.keyboard.q = "read";
                if (confirm("Would you like to lose this run?")) {
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
            bagItem,
            bookItem,
            musicButton,
            sfxButton,
            playerInventory.weapon,
            playerInventory.shield,
            playerInventory.armor,
            playerInventory.active,
        ];
        if (gameState.inInventory) {
            gameObjects.push(...getInventoryItems());
        }
        const actions = handleMouseInput(gameObjects);
        actions?.forEach((action) => {
            this.handleAction(action);
        });
        if (gameState.holding != null) {
            if (gameState.holding.name == "bomb") {
                this.changeCursorState(CURSORBOMB);
            }
        }
        if (!this.cursorChanged) {
            this.changeCursorState(CURSORDEFAULT);
        }
        if (!this.hoverItemDesc) {
            cursor.description.hidden = true;
        }
        inputState.mouse.clickedRight = false;
        inputState.mouse.clickedLeft = false;
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
