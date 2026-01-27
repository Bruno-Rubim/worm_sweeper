import {
  Action,
  ChangeCursorState,
  ChangeScene,
  ConsumeItem,
  EnemyAtack,
  ItemDescription,
  LoseGame,
  RestartGame,
  SellItem,
  ToggleBook,
  ToggleInventory,
  UseActiveItem,
} from "./action.js";
import { canvasManager } from "./canvasManager.js";
import {
  cursor,
  CURSORBOMB,
  CURSORDEFAULT,
  type cursorState,
} from "./cursor.js";
import type GameObject from "./gameElements/gameObject.js";
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
import playerInventory, {
  getInventoryItems,
  hasItem,
  resetInventory,
} from "./playerInventory.js";
import { Armor, armorDic } from "./items/armor/armor.js";
import { utils } from "./utils.js";
import { bagItem, bookItem, musicButton, sfxButton } from "./items/uiItems.js";
import { DEV, GAMEWIDTH } from "./global.js";
import { transitionOverlay } from "./level/transitionOverlay.js";
import activeDict from "./items/active/dict.js";
import { SilverBell } from "./items/active/silverBell.js";
import { ActiveItem } from "./items/active/active.js";
import Position from "./gameElements/position.js";

// Says if the cursor has changed or if there's an item description to show TO-DO: change this
type actionResponse = "cursorChange" | "itemDescription" | void;

export default class GameManager {
  cursorChanged = false;
  hoverItemDesc = false;

  constructor() {
    bindListeners(canvasManager.canvasElement);
  }

  /**
   * Updates the state of the cursor, changing its visual
   * @param newState
   */
  changeCursorState(newState: cursorState) {
    cursor.state = newState;
    this.cursorChanged = true;
  }

  /**
   * Pauses the game
   */
  pauseGame() {
    timeTracker.togglePause();
    soundManager.pauseMusic();
    gameState.paused = timeTracker.isPaused;
  }

  /**
   * Deals with different consumable functions depending on itemName
   * @param action
   */
  consumeItem(action: ConsumeItem) {
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

  /**
   * Opens/closes the rule book, pausing the time tracker in condition
   */
  toggleBook() {
    gameState.inBook = !gameState.inBook;
    if (gameState.inBook) {
      timeTracker.pause();
    } else if (!gameState.paused && !gameState.gameOver) {
      timeTracker.unpause();
    }
  }

  /**
   * Opens/closes the inventory
   */
  toggleInventory() {
    gameState.inInventory = !gameState.inInventory;
    if (gameState.inInventory) {
      soundManager.playSound(sounds.bag_open);
    } else {
      soundManager.playSound(sounds.bag_close);
    }
  }

  /**
   * Sets the text description of the cursor's description object according to the action
   * @param action
   */
  setItemDescription(action: ItemDescription) {
    cursor.description.hidden = false;
    cursor.description.side = action.side;
    cursor.description.text = action.description;
    cursor.description.fontSize = action.descFontSize;
    this.hoverItemDesc = true;
  }

  /**
   * Turns game over on, pauses the gameTimer and reveals all blocks in the cave
   */
  loseGame() {
    gameState.gameOver = true;
    levelManager.caveManager.revealAllBlocks();
    timeTracker.pause();
  }

  /**
   * Reset's gamestate's and inventory's values and adds ' to the deathcount
   */
  restartGame() {
    timerManager.clearQueue();
    resetGameState();
    gameState.deathCount++;
    resetInventory();
    transitionOverlay.endAnimation();
    timeTracker.unpause();
  }

  /**
   * Checks if the player's health is below alive, if so loses the game
   */
  checkPlayerDead() {
    if (gameState.health <= 0) {
      if (inputState.mouse.heldLeft || inputState.mouse.heldRight) {
        gameState.heldWhileDeath = true;
      }
      this.loseGame();
      return true;
    }
  }

  /**
   * Applies the active item's effects according to the name on the item in the inventory's active slot
   */
  useActiveItem(action: UseActiveItem) {
    const item = action.alt
      ? playerInventory.altActive
      : playerInventory.active;
    const clonePos = action.alt
      ? new Position(GAMEWIDTH - 20, 90)
      : new Position(GAMEWIDTH - 20, 72);
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
        } else {
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
          gameState.holding = gameState.holding.clone(clonePos, item.isAlt);
          if (item.isAlt) {
            playerInventory.altActive = gameState.holding;
          } else {
            playerInventory.active = gameState.holding;
          }
          gameState.holding = null;
        }
        return;
      case "bomb":
        if (gameState.currentScene == "battle") {
          levelManager.handleAction(levelManager.battleManager.bomb());
          break;
        }
        gameState.holding = item;
        break;
      case "energy_potion":
        gameState.tiredTimer.restart();
        soundManager.playSound(sounds.drink);
        break;
    }
    if (item.isAlt) {
      playerInventory.altActive = activeDict.empty.clone(clonePos, true);
    } else {
      playerInventory.active = activeDict.empty.clone(clonePos);
    }
  }

  /**
   * Adds a given value to health capping at max health
   */
  healPlayer(value: number) {
    gameState.health = Math.min(gameState.maxHealth, gameState.health + value);
  }

  /**
   * Sells an item if on a shop
   * @param action
   */
  sellItem(action: SellItem) {
    if (
      gameState.currentScene == "shop" &&
      !["empty", "book", "picaxe", "flag"].includes(action.item.name)
    ) {
      if (action.item instanceof Weapon || action.item instanceof Shield) {
        soundManager.playSound(sounds.wrong);
        return;
      }
      if (action.item instanceof Armor) {
        playerInventory.armor = armorDic.empty;
      } else if (action.item instanceof ActiveItem) {
        if (action.item.isAlt) {
          playerInventory.altActive = activeDict.empty.clone(
            new Position(GAMEWIDTH - 20, 90),
            true,
          );
        } else {
          playerInventory.active = activeDict.empty;
        }
      } else {
        playerInventory.passives = playerInventory.passives.filter(
          (x) => x != action.item,
        );
      }
      gameState.gold += utils.randomInt(4, 1);
      soundManager.playSound(sounds.gold);
    }
  }

  performEnemyAttack(action: EnemyAtack) {
    return levelManager.battleManager.enemyAtack(action);
  }

  /**
   * Routes an action to its handeling function
   * @param action
   * @returns
   */
  handleAction(action: Action | void | null): actionResponse {
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
      this.useActiveItem(action);
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

  /**
   * Loops through all timers in game, triggering their functions if ready and handling their actions
   */
  checkTimers() {
    timerManager.queue.forEach((timer) => {
      // Possible action in result of timer reaching goal
      let action: Action | void | null = null;
      if (timer.ticsRemaining <= 0 && !timer.ended) {
        if (timer.goalFunc) {
          action = timer.goalFunc();
        }
        if (timer.loop) {
          timer.rewind();
        } else {
          timer.ended = true;
          if (timer.deleteAtEnd) {
            // Deletes timer
            timerManager.deleteTimer(timer);
          }
        }
        this.handleAction(action);
      }
    });
  }

  /**
   * Checks if specific keys are held and
   * @returns
   */
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
      return new UseActiveItem(false);
    }
    // Functions avaliable for devs. Check the global.ts
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
        soundManager.playSound(sounds.bag_open);
      }
    }
  }

  /**
   * Checks for actions with current input state and game state and handles them
   */
  updateGame() {
    this.cursorChanged = false;
    this.hoverItemDesc = false;

    this.checkTimers();
    cursor.pos.update(inputState.mouse.pos.divide(canvasManager.renderScale));

    const gameObjects: GameObject[] = [
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
    if (hasItem("tool_belt")) {
      gameObjects.push(playerInventory.altActive);
    }

    const actions: Action[] | void = handleMouseInput(gameObjects);

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
