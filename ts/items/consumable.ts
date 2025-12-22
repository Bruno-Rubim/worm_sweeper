import CanvasManager from "../canvasManager.js";
import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites } from "../sprite.js";
import { Item } from "./item.js";

export class Consumable extends Item {
  constructor(spriteSheetPos: Position, name: string) {
    super(new Position(GAMEWIDTH - 20, 72), spriteSheetPos, name);
  }
}

export const consumableList = {
  bomb: new Consumable(new Position(0, 0), "bomb"),
  health_potion: new Consumable(new Position(2, 0), "health_potion"),
  health_potion_big: new Consumable(new Position(4, 0), "health_potion_big"),
  time_potion: new Consumable(new Position(6, 0), "time_potion"),
  empty: new Consumable(new Position(14, 0), "empty"),
};

const pointerSheet = sprites.time_potion_pointer_sheet;
consumableList.time_potion.render = (canvasManager: CanvasManager) => {
  canvasManager.renderSpriteFromSheet(
    consumableList.time_potion.sprite,
    consumableList.time_potion.pos,
    16,
    16,
    new Position(6, 0)
  );
  canvasManager.renderSpriteFromSheet(
    consumableList.time_potion.sprite,
    consumableList.time_potion.pos,
    16,
    16,
    new Position(6, 0)
  );
  canvasManager.renderSpriteFromSheet(
    consumableList.time_potion.sprite,
    consumableList.time_potion.pos,
    16,
    16,
    new Position(6, 0)
  );
};
