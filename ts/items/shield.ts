import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Shield extends Item {
  constructor(pos: Position, spriteSheetPos: Position) {
    super(pos, spriteSheetPos);
  }
}

export const shieldList = {
  wood_shield: new Shield(new Position(GAMEWIDTH - 20, 36), new Position(0, 1)),
};
