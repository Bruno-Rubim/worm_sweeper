import {
  Action,
  ChangeCursorState,
  ChangeScene,
  ConsumeItem,
  EnemyAttack,
  EquipItem,
  ItemDescription,
  LoseGame,
  ObtainItem,
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
import {
  bagButton,
  bookButton,
  musicButton,
  sfxButton,
} from "./border/uiButtons.js";
import { DEV } from "./global.js";
import { transitionOverlay } from "./level/transitionOverlay.js";
import { SilverBell } from "./items/active/silverBell.js";
import { ActiveItem } from "./items/active/active.js";
import { InstantItem } from "./items/instant/instantItem.js";
import { ActiveSlot, ArmorSlot } from "./inventory/slot.js";
import activeDict from "./items/active/dict.js";

// Says if the cursor has changed or if there's an item description to show TO-DO: change this
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
    gameState.deathTic = timeTracker.currentGameTic;
    gameState.deathScreenStage = 0;
    gameState.deathScreenTimer.start();
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
    gameState.deathTic = 0;
    playerInventory.reset();
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
    // const item = action.slot
    //   ? playerInventory.altActive.item
    //   : playerInventory.active.item;
    // const clonePos = action.slot
    //   ? new Position(GAMEWIDTH - 20, 90)
    //   : new Position(GAMEWIDTH - 20, 72);
    // switch (item.name) {
    //   case "silver_bell":
    //     if (!(item instanceof SilverBell)) {
    //       alert("something is wrong");
    //       break;
    //     }
    //     if (item.ringTimer.inMotion) {
    //       return;
    //     }
    //     if (gameState.currentScene == "battle") {
    //       levelManager.battleManager.stunEnemy(3);
    //     } else {
    //       gameState.level.cave.bellRang = true;
    //     }
    //     soundManager.playSound(sounds.bell);
    //     item.ringTimer.start();
    //     return;
    //   case "empty":
    //     if (gameState.holding != null) {
    //       if (gameState.holding.name == "bomb") {
    //         levelManager.caveManager.bomb = null;
    //       }
    //       // gameState.holding = gameState.holding.clone(clonePos, item.isAlt);
    //       playerInventory.active.item = gameState.holding;
    //       gameState.holding = null;
    //     }
    //     return;
    //   case "bomb":
    //     if (gameState.currentScene == "battle") {
    //       levelManager.handleAction(levelManager.battleManager.bomb());
    //       break;
    //     }
    //     gameState.holding = item;
    //     break;
    //   case "energy_potion":
    //     gameState.tiredTimer.restart();
    //     soundManager.playSound(sounds.drink);
    //     break;
    // }
  }

  /**
   * Adds a given value to health capping at max health
   */
  healPlayer(value: number) {
    gameState.health = Math.min(gameState.maxHealth, gameState.health + value);
  }

  obtainItem(action: ObtainItem) {
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
      if (
        playerInventory.active.item.name != "empty" &&
        playerInventory.hasItem("tool_belt")
      ) {
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

    playerInventory.emptyBatSlot.item = item;
  }

  equipItem(action: EquipItem) {
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
      } else {
        playerInventory.armor.switchItems(action.slot);
      }
    }

    if (item instanceof ActiveItem) {
      if (action.slot instanceof ActiveSlot) {
        playerInventory.emptyBatSlot.switchItems(action.slot);
      } else {
        if (
          playerInventory.hasItem("tool_belt") &&
          playerInventory.active.item.name != "empty"
        ) {
          playerInventory.altActive.switchItems(action.slot);
        } else {
          playerInventory.active.switchItems(action.slot);
        }
      }
    }
  }

  /**
   * Sells an item if on a shop
   * @param action
   */
  sellItem(action: SellItem) {
    // if (
    //   gameState.currentScene != "shop" ||
    //   ["empty"].includes(action.item.name)
    // ) {
    //   return;
    // }
    // if (
    //   ["picaxe", "flag", "wood_sword", "wood_shield"].includes(action.item.name)
    // ) {
    //   soundManager.playSound(sounds.wrong);
    //   return;
    // }
    // playerInventory.soldItemNames.push(action.item.name);
    // if (action.item instanceof Armor) {
    //   if (playerInventory.armor.item == action.item) {
    //     playerInventory.armor.item = armorDict.empty;
    //   } else {
    //     playerInventory.bagSlots.find((x) => x.item == action.item)!.item =
    //       passivesDict.empty;
    //   }
    // } else if (action.item instanceof ActiveItem) {
    //   if (action.item.isAlt) {
    //     playerInventory.altActive.item = activeDict.empty.clone(
    //       new Position(GAMEWIDTH - 20, 90),
    //       true,
    //     );
    //   } else {
    //     playerInventory.active.item = activeDict.empty;
    //   }
    // } else {
    //   // playerInventory.bagSlots = playerInventory.bagSlots.filter(
    //   //   (x) => x != action.item,
    //   // );
    // }
    // gameState.gold += utils.randomInt(4, 1);
    // soundManager.playSound(sounds.gold);
  }

  performEnemyAttack(action: EnemyAttack) {
    return levelManager.battleManager.enemyAttack(action);
  }

  /**
   * Routes an action to its handeling function
   * @param action
   * @returns
   */
  handleAction(action: Action | void | null) {
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
      // this.sellItem(action);
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
        action = timer.reachGoal();
        if (timer.loop) {
          timer.start();
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
        soundManager.playSound(testingSound);
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
      bagButton,
      bookButton,
      musicButton,
      sfxButton,
      ...playerInventory.gearSlots,
    ];
    if (gameState.inInventory) {
      gameObjects.push(...playerInventory.bagSlots);
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
