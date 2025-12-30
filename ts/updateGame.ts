import { cursor, CURSORDEFAULT, type cursorState } from "./cursor.js";
import { GameManager } from "./gameManager.js";
import type GameObject from "./gameObject.js";
import { CLICKLEFT, CLICKRIGHT } from "./global.js";
import { inputState } from "./inputState.js";
import { ChangeCursorState, ObjectAction } from "./objectAction.js";
import { utils } from "./utils.js";

function changeCursorState(newState: cursorState) {
  cursor.state = newState;
}

export function handleMouseClick(objects: GameObject[]): ObjectAction | void {
  let action: ObjectAction | null = null;
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
        inputState.mouse.clickedRight ? CLICKLEFT : CLICKRIGHT
      );
      if (clickAction instanceof ObjectAction) {
        action = clickAction;
      }
    }
  });
  if (action) {
    return action;
  }
}

export function handleMouseHover(objects: GameObject[]): ObjectAction | void {
  let action: ObjectAction | null = null;
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
    if (hoverAction instanceof ObjectAction) {
      action = hoverAction;
    }
  });
  if (action) {
    return action;
  }
}

function handleMouseInput(objects: GameObject[]): ObjectAction[] | void {
  let actions: ObjectAction[] = [];
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos)) {
      obj.mouseHovering = false;
      return null;
    }
    obj.mouseHovering = true;

    if (obj.hoverFunction) {
      let hoverAction = obj.hoverFunction(cursor.pos);
      if (hoverAction instanceof ObjectAction) {
        actions.push(hoverAction);
      }
    }
    if (
      obj.clickFunction &&
      (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)
    ) {
      let clickAction = obj.clickFunction(
        cursor.pos,
        inputState.mouse.clickedRight ? CLICKLEFT : CLICKRIGHT
      );
      if (clickAction instanceof ObjectAction) {
        actions.push(clickAction);
      }
    }
  });
  if (actions.length) {
    return actions;
  }
}

export default function updateGame(
  renderScale: number,
  gameManager: GameManager
) {
  cursor.pos = inputState.mouse.pos.divide(renderScale);

  const gameObjects = [
    gameManager.levelManager,
    ...Object.values(gameManager.gameState.inventory),
  ];

  const actions: ObjectAction[] | void = handleMouseInput(gameObjects);

  let cursorChanged = false;
  actions?.forEach((action) => {
    if (action instanceof ChangeCursorState) {
      changeCursorState(action.newState);
      cursorChanged = true;
    }
  });
  if (!cursorChanged) {
    changeCursorState(CURSORDEFAULT);
  }

  if (inputState.mouse.clickedRight) {
    inputState.mouse.clickedRight = false;
  }
  if (inputState.mouse.clickedLeft) {
    inputState.mouse.clickedLeft = false;
  }

  cursor.pos = cursor.pos.subtract(8, 8);
}
