import { cursor, type cursorState } from "./cursor.js";
import { GameManager } from "./gameManager.js";
import type GameObject from "./gameObject.js";
import { CLICKLEFT, CLICKRIGHT } from "./global.js";
import { inputState } from "./inputState.js";
import { consumableDic } from "./items/consumable.js";
import {
  ChangeCursorState,
  ConsumeItem,
  Action,
  ToggleBook as ToggleBook,
  ItemDescription,
  RestartGame,
} from "./action.js";
import timeTracker from "./timer/timeTracker.js";

function changeCursorState(newState: cursorState) {
  cursor.state = newState;
}

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

function handleKeyInput(gameManager: GameManager) {
  if (inputState.keyboard.Escape == "pressed") {
    inputState.keyboard.Escape = "read";
    if (gameManager.gameState.inBook) {
      return new ToggleBook();
    }
    timeTracker.togglePause();
    gameManager.gameState.paused = timeTracker.isPaused;
  }
  if (inputState.keyboard.q == "pressed") {
    gameManager.restart();
  }
}

type actionResponse = "cursorChange" | "itemDescription" | void;

function handleAction(
  gameManager: GameManager,
  action: Action | void
): actionResponse {
  if (action instanceof ChangeCursorState) {
    changeCursorState(action.newState);
    return "cursorChange";
  }
  if (action instanceof ConsumeItem) {
    switch (action.itemName) {
      case "time_potion":
        gameManager.gameState.gameTimer.addSecs(60);
        break;
      case "health_potion":
        gameManager.gameState.health += 1;
        break;
      case "health_potion_big":
        gameManager.gameState.health += 2;
        break;
    }
    gameManager.gameState.inventory.consumable = consumableDic.empty;
    return;
  }
  if (action instanceof ToggleBook) {
    gameManager.gameState.inBook = !gameManager.gameState.inBook;
    if (gameManager.gameState.inBook) {
      timeTracker.pause();
    } else if (!gameManager.gameState.paused) {
      timeTracker.unpause();
    }
    return;
  }
  if (action instanceof ItemDescription) {
    cursor.description.hidden = false;
    cursor.description.side = action.side;
    cursor.description.text = action.description;
    cursor.description.fontSize = action.descFontSize;
    return "itemDescription";
  }
  if (action instanceof RestartGame) {
    gameManager.restart();
  }
}

export default function updateGame(
  renderScale: number,
  gameManager: GameManager
) {
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

  if (!cursorChanged) {
    changeCursorState("cursor_default");
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
