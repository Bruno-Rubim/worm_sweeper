import {
  cursor,
  CURSORBOMB,
  CURSORCHISEL,
  CURSORDEFAULT,
  type cursorState,
} from "./cursor.js";
import { GameManager } from "./gameManager.js";
import type GameObject from "./gameObject.js";
import { CLICKLEFT, CLICKRIGHT, DEV } from "./global.js";
import { inputState } from "./inputState.js";
import {
  ChangeCursorState,
  ConsumeItem,
  Action,
  ToggleBook as ToggleBook,
  ItemDescription,
  RestartGame,
  EnemyAtack,
  RingBell,
  PickupChisel,
  PickupBomb,
  SellItem,
} from "./action.js";
import timeTracker from "./timer/timeTracker.js";
import { timerQueue } from "./timer/timerQueue.js";
import sounds from "./sounds.js";
import type GameState from "./gameState.js";
import { Chisel } from "./items/passives/chisel.js";
import consumableDic from "./items/consumable/dict.js";
import Bomb from "./items/consumable/bomb.js";
import { Weapon } from "./items/weapon/weapon.js";
import { Shield } from "./items/shield/shield.js";
import { Armor, armorDic } from "./items/armor/armor.js";
import { getItem } from "./items/passives/dict.js";
import { utils } from "./utils.js";
import { Consumable } from "./items/consumable/consumable.js";
import Position from "./position.js";

/**
 * Updates the state of the cursor, changing its visual
 * @param newState
 */
function changeCursorState(newState: cursorState) {
  cursor.state = newState;
}

/**
 * Runs through a series of gameObjects and calls their clickFunction if the cursor is over them while the mouse is clicking any buttons and returns its action
 * @param objects
 * @returns
 */
export function handleMouseClick(objects: GameObject[]): Action | void {
  let action: Action | null = null;
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
      return null;
    }
    if (
      obj.clickFunction &&
      (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)
    ) {
      let clickAction = obj.clickFunction(
        cursor.pos,
        inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT
      );
      if (clickAction instanceof Action) {
        action = clickAction;
      }
    }
  });
  if (action) {
    return action;
  }
}

/**
 * Runs through a series of gameObjects and calls their hoverFunction if the cursor is over them and returns its action
 * @param objects
 * @returns
 */
export function handleMouseHover(objects: GameObject[]): Action | void {
  let action: Action | null = null;
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
      obj.mouseHovering = false;
      return null;
    }
    obj.mouseHovering = true;

    if (!obj.hoverFunction) {
      return null;
    }
    let hoverAction = obj.hoverFunction(cursor.pos);
    if (hoverAction instanceof Action) {
      action = hoverAction;
    }
  });
  if (action) {
    return action;
  }
}

/**
 * Runs through a series of gameObjects and calls their hoverFunction, clickFunction and heldFunction if the conditions meet and returns a series of actions
 * @param objects
 * @returns
 */
function handleMouseInput(objects: GameObject[]): Action[] | void {
  let actions: Action[] = [];
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos)) {
      obj.mouseHovering = false;
      obj.mouseHeldLeft = false;
      obj.mouseHeldRight = false;
      return null;
    }
    obj.mouseHovering = true;

    if (obj.hoverFunction) {
      let hoverAction = obj.hoverFunction(cursor.pos);
      if (hoverAction instanceof Action) {
        actions.push(hoverAction);
      }
    }
    if (
      obj.clickFunction &&
      (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)
    ) {
      let clickAction = obj.clickFunction(
        cursor.pos,
        inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT
      );
      if (clickAction instanceof Action) {
        actions.push(clickAction);
      }
    }
    if (inputState.mouse.heldLeft || inputState.mouse.clickedLeft) {
      obj.mouseHeldLeft = true;
      if (obj.heldFunction) {
        obj.heldFunction(cursor.pos, CLICKLEFT);
      }
    } else if (inputState.mouse.heldRight || inputState.mouse.clickedRight) {
      obj.mouseHeldRight = true;
      if (obj.heldFunction) {
        obj.heldFunction(cursor.pos, CLICKRIGHT);
      }
    }
  });
  if (actions.length) {
    return actions;
  }
}

/**
 * Pauses the game
 * @param gameState
 */
function pauseGame(gameState: GameState) {
  timeTracker.togglePause();
  gameState.paused = timeTracker.isPaused;
}

/**
 * Checks if specific keys are held and
 * @param gameManager
 * @returns
 */
function handleKeyInput(gameManager: GameManager) {
  if (inputState.keyboard.Escape == "pressed") {
    inputState.keyboard.Escape = "read";
    if (gameManager.gameState.inBook) {
      return new ToggleBook();
    }
    pauseGame(gameManager.gameState);
  }
  // Functions avaliable for devs. Check the global.ts
  if (DEV) {
    if (inputState.keyboard.q == "pressed") {
      inputState.keyboard.q = "read";
      if (confirm("Would you like to quit the game?")) {
        gameManager.gameState.lose();
      }
      inputState.keyboard.q = "unpressed";
    }
    if (inputState.keyboard.w == "pressed") {
      inputState.keyboard.w = "read";
      gameManager.soundManager.playSound(sounds.purchase);
    }
  }
}

/**
 * Deals with different consumable functions depending on itemName
 * @param gameManager
 * @param action
 */
function consumeItem(gameManager: GameManager, action: ConsumeItem) {
  switch (action.itemName) {
    case "time_potion":
      gameManager.gameState.gameTimer.addSecs(60);
      gameManager.soundManager.playSound(sounds.drink);
      break;
    case "health_vial":
      gameManager.gameState.health += 0.5;
      gameManager.soundManager.playSound(sounds.drink);
      break;
    case "health_potion":
      gameManager.gameState.health += 1;
      gameManager.soundManager.playSound(sounds.drink);
      break;
    case "health_potion_big":
      gameManager.gameState.health += 2;
      gameManager.soundManager.playSound(sounds.drink);
      break;
    case "empty":
      if (gameManager.gameState.holding instanceof Bomb) {
        gameManager.gameState.inventory.consumable =
          gameManager.gameState.holding;
        gameManager.gameState.holding = null;
      }
      break;
  }
  if (action.itemName != "empty") {
    gameManager.gameState.inventory.consumable = consumableDic.empty;
  }
}

/**
 * Opens/closes the rule book, pausing the time tracker in condition
 * @param gameManager
 */
function toggleBook(gameManager: GameManager) {
  gameManager.gameState.inBook = !gameManager.gameState.inBook;
  if (gameManager.gameState.inBook) {
    timeTracker.pause();
  } else if (!gameManager.gameState.paused && !gameManager.gameState.gameOver) {
    timeTracker.unpause();
  }
}

/**
 * Sets the text description of the cursor's description object according to the action
 * @param action
 */
function setItemDescription(action: ItemDescription) {
  cursor.description.hidden = false;
  cursor.description.side = action.side;
  cursor.description.text = action.description;
  cursor.description.fontSize = action.descFontSize;
}

/**
 * Performs an enemy attack on the player
 * @param gameManager
 * @param action
 * @returns
 */
function performEnemyAttack(gameManager: GameManager, action: EnemyAtack) {
  if (!gameManager.gameState.battle) {
    alert("this shouldn't happen outside of battle");
    return;
  }
  action.enemy.attackAnimTimer.start();
  timerQueue.push(action.enemy.attackAnimTimer);
  let damage = action.damage;

  const reflection = gameManager.gameState.battle!.reflection;
  const leftoverReflection = Math.max(0, reflection - damage);
  damage = Math.max(0, damage - reflection);

  const defense = gameManager.gameState.battle.defense;
  const leftoverDefense = Math.max(0, defense - damage);
  damage = Math.max(0, damage - defense);

  gameManager.gameState.health -= Math.max(0, damage);
  action.enemy.health -= reflection - leftoverReflection;

  gameManager.gameState.battle!.reflection = leftoverReflection;
  gameManager.gameState.battle.defense = leftoverDefense;

  if (gameManager.gameState.health <= 0) {
    if (inputState.mouse.heldLeft || inputState.mouse.heldRight) {
      gameManager.gameState.heldWhileDeath = true;
    }
    gameManager.gameState.lose();
  }
  gameManager.levelManager.checkBattleEnd();
}

/**
 * Ring bell functionality
 * @param gameManager
 */
function ringBell(gameManager: GameManager) {
  if (gameManager.gameState.currentScene == "battle") {
    gameManager.levelManager.battleManager.stunEnemy(3);
  } else {
    gameManager.gameState.level.cave.bellRang = true;
  }
  gameManager.soundManager.playSound(sounds.bell);
}

/**
 * Picks up or lets go of the Chisel item
 */
function pickupChisel(gameManager: GameManager, action: PickupChisel) {
  if (gameManager.gameState.holding == null) {
    gameManager.gameState.holding = action.chiselItem;
  } else if (gameManager.gameState.holding instanceof Chisel) {
    gameManager.gameState.holding = null;
  }
}

/**
 * Sets the current holding object as the bomb and empties the consumable slot
 */
function pickupBomb(gameManager: GameManager, action: PickupBomb) {
  if (gameManager.gameState.holding == null) {
    gameManager.gameState.holding = action.bombItem;
    gameManager.gameState.inventory.consumable = consumableDic.empty;
  }
}

/**
 * Sells an item if on a shop
 * @param gameState
 * @param action
 */
function sellItem(gameManager: GameManager, action: SellItem) {
  if (
    gameManager.gameState.currentScene == "shop" &&
    !["empty", "book", "picaxe", "flag"].includes(action.item.name)
  ) {
    if (action.item instanceof Weapon || action.item instanceof Shield) {
      gameManager.soundManager.playSound(sounds.wrong);
      return;
    }
    const inventory = gameManager.gameState.inventory;
    if (action.item instanceof Armor) {
      inventory.armor = armorDic.empty;
    } else if (action.item instanceof Consumable) {
      inventory.consumable = consumableDic.empty;
    } else {
      if (inventory.passive_1 == action.item) {
        inventory.passive_1 = getItem("empty", new Position(4, 18 * 1));
      }
      if (inventory.passive_2 == action.item) {
        inventory.passive_2 = getItem("empty", new Position(4, 18 * 2));
      }
      if (inventory.passive_3 == action.item) {
        inventory.passive_3 = getItem("empty", new Position(4, 18 * 3));
      }
      if (inventory.passive_4 == action.item) {
        inventory.passive_4 = getItem("empty", new Position(4, 18 * 4));
      }
      if (inventory.passive_5 == action.item) {
        inventory.passive_5 = getItem("empty", new Position(4, 18 * 5));
      }
      if (inventory.passive_6 == action.item) {
        inventory.passive_6 = getItem("empty", new Position(4, 18 * 6));
      }
    }
    gameManager.gameState.gold += utils.randomInt(4, 1);
    gameManager.soundManager.playSound(sounds.gold);
  }
}

// Says if the cursor has changed or if there's an item description to show
type actionResponse = "cursorChange" | "itemDescription" | void;

/**
 * Routes an action to its handeling function
 * @param gameManager
 * @param action
 * @returns
 */
function handleAction(
  gameManager: GameManager,
  action: Action | void | null
): actionResponse {
  if (!action) {
    return;
  }
  if (action instanceof ChangeCursorState) {
    changeCursorState(action.newState);
    return "cursorChange";
  }
  if (action instanceof ConsumeItem) {
    consumeItem(gameManager, action);
    return;
  }
  if (action instanceof ToggleBook) {
    toggleBook(gameManager);
    return;
  }
  if (action instanceof ItemDescription) {
    setItemDescription(action);
    return "itemDescription";
  }
  if (action instanceof RestartGame) {
    gameManager.restart();
    return;
  }
  if (action instanceof EnemyAtack) {
    performEnemyAttack(gameManager, action);
    return;
  }
  if (action instanceof RingBell) {
    ringBell(gameManager);
    return;
  }
  if (action instanceof PickupChisel) {
    pickupChisel(gameManager, action);
    return;
  }
  if (action instanceof PickupBomb) {
    pickupBomb(gameManager, action);
    return;
  }
  if (action instanceof SellItem) {
    sellItem(gameManager, action);
    return;
  }
  console.warn("unhandled action", action);
}

/**
 * Loops through all timers in game, triggering their functions if ready and handling their actions
 * @param gameManager
 */
function updateTimers(gameManager: GameManager) {
  timerQueue.forEach((timer, i) => {
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
          timerQueue.splice(i, 1);
        }
      }
      handleAction(gameManager, action);
    }
  });
}

/**
 * Checks for actions with current input state and game state and handles them
 * @param renderScale
 * @param gameManager
 */
export default function updateGame(
  renderScale: number,
  gameManager: GameManager
) {
  updateTimers(gameManager);
  cursor.pos.update(inputState.mouse.pos.divide(renderScale));

  const gameObjects = [
    gameManager.levelManager,
    ...Object.values(gameManager.gameState.inventory),
  ];

  const actions: Action[] | void = handleMouseInput(gameObjects);

  let cursorChanged = false;
  let itemDescription = false;

  actions?.forEach((action) => {
    let response = handleAction(gameManager, action);
    switch (response) {
      case "cursorChange":
        cursorChanged = true;
        break;
      case "itemDescription":
        itemDescription = true;
        break;
    }
  });

  if (gameManager.gameState.holding != null) {
    if (gameManager.gameState.holding instanceof Bomb) {
      changeCursorState(CURSORBOMB);
      cursorChanged = true;
    } else if (
      gameManager.gameState.holding instanceof Chisel &&
      !gameManager.gameState.holding.chiselTimer.inMotion
    ) {
      changeCursorState(CURSORCHISEL);
      cursorChanged = true;
    }
  }

  if (!cursorChanged) {
    changeCursorState(CURSORDEFAULT);
  }

  if (!itemDescription) {
    cursor.description.hidden = true;
  }

  if (inputState.mouse.clickedRight) {
    inputState.mouse.clickedRight = false;
  }
  if (inputState.mouse.clickedLeft) {
    inputState.mouse.clickedLeft = false;
  }

  cursor.pos.update(cursor.pos.subtract(8, 8));

  handleAction(gameManager, handleKeyInput(gameManager));
}
