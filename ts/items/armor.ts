import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Armor extends Item {
  constructor(pos: Position, spriteSheetPos: Position) {
    super(pos, spriteSheetPos);
  }
}

export const armorList = {
  empty: new Armor(new Position(GAMEWIDTH - 20, 54), new Position(14, 2)),
};
