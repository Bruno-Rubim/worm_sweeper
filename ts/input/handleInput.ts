import { Action } from "../action.js";
import { cursor } from "../cursor.js";
import type GameObject from "../gameElements/gameObject.js";
import { CLICKLEFT, CLICKRIGHT } from "../global.js";
import { inputState } from "./inputState.js";

export function handleMouseInput(objects: GameObject[]): Action[] | void {
  let actions: Action[] = [];
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos)) {
      obj.mouseHovering = false;
      obj.mouseHeldLeft = false;
      obj.mouseHeldRight = false;
      if (obj.notHoverFunction) {
        obj.notHoverFunction();
      }
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
        inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT,
      );
      if (clickAction instanceof Action) {
        actions.push(clickAction);
      }
    }
    let heldAction: Action | void | null = null;
    if (inputState.mouse.heldLeft || inputState.mouse.clickedLeft) {
      obj.mouseHeldLeft = true;
      if (obj.heldFunction) {
        heldAction = obj.heldFunction(cursor.pos, CLICKLEFT);
      }
    } else if (inputState.mouse.heldRight || inputState.mouse.clickedRight) {
      obj.mouseHeldRight = true;
      if (obj.heldFunction) {
        heldAction = obj.heldFunction(cursor.pos, CLICKRIGHT);
      }
    } else {
      obj.mouseHeldLeft = false;
      obj.mouseHeldRight = false;
    }
    if (heldAction instanceof Action) {
      actions.push(heldAction);
    }
  });
  if (actions.length) {
    return actions;
  }
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
        inputState.mouse.clickedRight ? CLICKRIGHT : CLICKLEFT,
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
      if (obj.notHoverFunction) {
        obj.notHoverFunction();
      }
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
 * Runs through a series of gameObjects and calls their notHoverFunction
 * @param objects
 * @returns
 */
export function handleMouseNotHover(objects: GameObject[]) {
  objects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos) || obj.hidden) {
      obj.mouseHovering = false;
      if (obj.notHoverFunction) {
        obj.notHoverFunction();
      }
      return null;
    }
  });
  return;
}
