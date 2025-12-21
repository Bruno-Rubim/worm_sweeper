import type CanvasManager from "./canvasManager.js";
import { cursor, DEFAULT, type cursorState } from "./cursor.js";
import { GameManager } from "./gameManager.js";
import { LEFT, RIGHT } from "./global.js";
import { inputState } from "./inputState.js";
import { ChangeCursorState, ChangeScene } from "./objectAction.js";

function changeCursorState(newState: cursorState) {
  cursor.state = newState;
}

export default function updateGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  let cursorStateAltered = false;
  cursor.pos = inputState.mouse.pos.divide(canvasManager.renderScale);

  const gameObjects = [
    gameManager.levelManager,
    ...Object.values(gameManager.gameState.inventory),
  ];
  gameObjects.forEach((obj) => {
    if (!obj.hitbox.positionInside(cursor.pos)) {
      obj.mouseHovering = false;
      return;
    }
    obj.mouseHovering = true;

    if (obj.hoverFunction) {
      const action = obj.hoverFunction(cursor.pos);
      if (action instanceof ChangeCursorState) {
        changeCursorState(action.newState);
        cursorStateAltered = true;
      }
    }
    if (
      obj.clickFunction &&
      (inputState.mouse.clickedRight || inputState.mouse.clickedLeft)
    ) {
      const action = obj.clickFunction(
        cursor.pos,
        inputState.mouse.clickedRight ? LEFT : RIGHT
      );
    }
  });

  if (inputState.mouse.clickedRight) {
    inputState.mouse.clickedRight = false;
  }
  if (inputState.mouse.clickedLeft) {
    inputState.mouse.clickedLeft = false;
  }
  if (!cursorStateAltered) {
    changeCursorState(DEFAULT);
  }

  cursor.pos = cursor.pos.subtract(8, 8);
}
