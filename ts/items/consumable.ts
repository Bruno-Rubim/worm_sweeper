import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Consumable extends Item {
  constructor(spriteSheetPos: Position) {
    super(new Position(GAMEWIDTH - 20, 72), spriteSheetPos);
  }
}

export const consumableList = {
  empty: new Consumable(new Position(14, 0)),
};
