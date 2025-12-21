import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Consumable extends Item {
  constructor(pos: Position, spriteSheetPos: Position) {
    super(pos, spriteSheetPos);
  }
}

export const consumableList = {
  empty: new Consumable(new Position(GAMEWIDTH - 20, 72), new Position(14, 0)),
};
