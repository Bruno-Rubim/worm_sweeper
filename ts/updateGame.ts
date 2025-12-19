import type CanvasManager from "./canvasManager.js";
import { cursor } from "./cursor.js";
import { LEFT, RIGHT } from "./directions.js";
import { GameManager } from "./gameManager.js";
import { inputState } from "./inputState.js";

export default function updateGame(
  canvasManager: CanvasManager,
  gameManager: GameManager
) {
  console.log();

  cursor.pos = inputState.mouse.pos.divide(canvasManager.renderScale);

  if (inputState.mouse.clickedRight || inputState.mouse.clickedLeft) {
    gameManager.gameObjects.forEach((obj) => {
      if (obj.clickFunction && obj.hitbox.positionInside(cursor.pos)) {
        obj.clickFunction(
          cursor.pos,
          inputState.mouse.clickedRight ? LEFT : RIGHT
        );
      }
    });
    inputState.mouse.clickedRight = false;
  }

  cursor.pos = cursor.pos.subtract(8, 8);
}
