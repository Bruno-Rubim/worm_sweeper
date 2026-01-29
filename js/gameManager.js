import { Action, ChangeCursorState, ChangeScene, ConsumeItem, EnemyAttack, EquipItem, ItemDescription, LoseGame, ObtainItem, RestartGame, SellItem, ToggleBook, ToggleInventory, UseActiveItem, } from "./action.js";
import { canvasManager } from "./canvasManager.js";
import { cursor, CURSORBOMB, CURSORDEFAULT, } from "./cursor.js";
import { gameState, resetGameState } from "./gameState.js";
import { levelManager } from "./level/levelManager.js";
import { renderBorder } from "./border/renderBorder.js";
import { soundManager } from "./sounds/soundManager.js";
import sounds, { testingSound } from "./sounds/sounds.js";
import { timerManager } from "./timer/timerManager.js";
import timeTracker from "./timer/timeTracker.js";
import { handleMouseInput } from "./input/handleInput.js";
import { bindListeners, inputState } from "./input/inputState.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield } from "./items/shield/shield.js";
import playerInventory from "./inventory/playerInventory.js";
import { Armor } from "./items/armor/armor.js";
import { bagButton, bookButton, musicButton, sfxButton, } from "./border/uiButtons.js";
import { DEV, GAMEWIDTH } from "./global.js";
import { transitionOverlay } from "./level/transitionOverlay.js";
import { SilverBell } from "./items/active/silverBell.js";
import { ActiveItem } from "./items/active/active.js";
import { InstantItem } from "./items/instant/instantItem.js";
import { ActiveSlot, ArmorSlot } from "./inventory/slot.js";
import activeDict from "./items/active/dict.js";
import Position from "./gameElements/position.js";
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
            case "health_potion":
                this.healPlayer(1);
                soundManager.playSound(sounds.drink);
                break;
            case "health_potion_big":
                this.healPlayer(2);
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
        if (gameState.inInventory) {
            soundManager.playSound(sounds.bag_open);
        }
        else {
            soundManager.playSound(sounds.bag_close);
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
        gameState.deathTic = timeTracker.currentGameTic;
        gameState.deathScreenStage = 0;
        gameState.deathScreenTimer.start();
        levelManager.caveManager.revealAllBlocks();
        timeTracker.pause();
    }
    restartGame() {
        timerManager.clearQueue();
        resetGameState();
        gameState.deathCount++;
        gameState.deathTic = 0;
        playerInventory.reset();
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
    useActiveItem(action) {
        const item = action.slot.alt
            ? playerInventory.altActive.item
            : playerInventory.active.item;
        switch (item.name) {
            case "silver_bell":
                if (!(item instanceof SilverBell)) {
                    alert("something is wrong");
                    break;
                }
                if (item.ringTimer.inMotion) {
                    return;
                }
                if (gameState.currentScene == "battle") {
                    levelManager.battleManager.stunEnemy(3);
                }
                else {
                    gameState.level.cave.bellRang = true;
                }
                soundManager.playSound(sounds.bell);
                item.ringTimer.start();
                return;
            case "empty":
                if (gameState.holding != null) {
                    if (gameState.holding.name == "bomb") {
                        levelManager.caveManager.bomb = null;
                    }
                    playerInventory.active.item = gameState.holding;
                    gameState.holding = null;
                }
                return;
            case "bomb":
                action.slot.item = action.slot.emptyItem;
                if (gameState.currentScene == "battle") {
                    levelManager.handleAction(levelManager.battleManager.bomb());
                    break;
                }
                gameState.holding = item;
                break;
            case "energy_potion":
                action.slot.item = action.slot.emptyItem;
                gameState.tiredTimer.restart();
                soundManager.playSound(sounds.drink);
                break;
        }
    }
    healPlayer(value) {
        gameState.health = Math.min(gameState.maxHealth, gameState.health + value);
    }
    obtainItem(action) {
        const item = action.item;
        if (item instanceof Shield) {
            playerInventory.emptyBatSlot.item = playerInventory.shield.item;
            playerInventory.shield.item = item;
            return;
        }
        if (item instanceof Weapon) {
            playerInventory.emptyBatSlot.item = playerInventory.weapon.item;
            playerInventory.weapon.item = item;
            return;
        }
        if (item instanceof Armor) {
            if (playerInventory.armor.item.name != "empty") {
                playerInventory.emptyBatSlot.item = playerInventory.armor.item;
            }
            playerInventory.armor.item = item;
            return;
        }
        if (item instanceof ActiveItem) {
            if (item instanceof SilverBell) {
                item.ringTimer.restart();
            }
            if (playerInventory.active.item.name != "empty" &&
                playerInventory.hasItem("tool_belt")) {
                playerInventory.emptyBatSlot.switchItems(playerInventory.altActive);
                playerInventory.altActive.item = item;
                return;
            }
            playerInventory.emptyBatSlot.switchItems(playerInventory.active);
            playerInventory.active.item = item;
            return;
        }
        if (item instanceof InstantItem) {
            this.consumeItem(new ConsumeItem(item.name));
            return;
        }
        if (item.name == "gold_bug") {
            gameState.bugCurse = true;
            soundManager.playSound(sounds.curse);
        }
        if (item.name == "tool_belt") {
            playerInventory.altActive.item = activeDict.empty;
        }
        if (item instanceof SilverBell) {
            item.ringTimer.restart();
        }
        playerInventory.emptyBatSlot.item = item;
    }
    equipItem(action) {
        const item = action.slot.item;
        if (item.name == "empty") {
            return;
        }
        if (item instanceof Shield) {
            playerInventory.shield.switchItems(action.slot);
        }
        if (item instanceof Weapon) {
            playerInventory.weapon.switchItems(action.slot);
        }
        if (item instanceof Armor) {
            if (action.slot instanceof ArmorSlot) {
                playerInventory.emptyBatSlot.switchItems(action.slot);
            }
            else {
                playerInventory.armor.switchItems(action.slot);
            }
        }
        if (item instanceof ActiveItem) {
            if (action.slot instanceof ActiveSlot) {
                playerInventory.emptyBatSlot.switchItems(action.slot);
            }
            else {
                if (playerInventory.hasItem("tool_belt") &&
                    playerInventory.active.item.name != "empty") {
                    playerInventory.altActive.switchItems(action.slot);
                }
                else {
                    playerInventory.active.switchItems(action.slot);
                }
            }
        }
    }
    sellItem(action) {
    }
    performEnemyAttack(action) {
        return levelManager.battleManager.enemyAttack(action);
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
        if (action instanceof EnemyAttack) {
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
            this.useActiveItem(action);
            return;
        }
        if (action instanceof ObtainItem) {
            this.obtainItem(action);
            return;
        }
        if (action instanceof EquipItem) {
            this.equipItem(action);
            return;
        }
        if (action instanceof SellItem) {
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
                action = timer.reachGoal();
                if (timer.loop) {
                    timer.start();
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
            if (!gameState.gameOver) {
                this.pauseGame();
            }
        }
        if (inputState.keyboard[" "] == "pressed") {
            inputState.keyboard[" "] = "read";
            return new UseActiveItem(playerInventory.active);
        }
        if (inputState.keyboard.Shift == "pressed") {
            inputState.keyboard.Shift = "read";
            return new UseActiveItem(playerInventory.altActive);
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
                soundManager.playSound(testingSound);
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
            bagButton,
            bookButton,
            musicButton,
            sfxButton,
            ...playerInventory.gearSlots,
        ];
        if (gameState.inInventory) {
            gameObjects.push(...playerInventory.bagSlots);
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
        canvasManager.clearCanvas();
        levelManager.render();
        renderBorder();
        cursor.render(canvasManager);
    }
}
