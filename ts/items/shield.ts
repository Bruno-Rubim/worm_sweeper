import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Shield extends Item {
  constructor(spriteSheetPos: Position) {
    super(new Position(GAMEWIDTH - 20, 36), spriteSheetPos);
  }
}

export const shieldList = {
  wood_shield: new Shield(new Position(0, 1)),
};
