import type CanvasManager from "./canvasManager.js";
import { findSprite } from "./sprites/findSprite.js";
import Position from "./position.js";

export const cursor = {
  pos: new Position(),
  sprite: findSprite("cursor_default"),
  render(canvasManager: CanvasManager) {
    canvasManager.renderSprite(this.sprite, this.pos, 16, 16);
  },
};
