import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Armor extends Item {
  constructor(spriteSheetPos: Position) {
    super(new Position(GAMEWIDTH - 20, 54), spriteSheetPos);
  }
}

export const armorList = {
  empty: new Armor(new Position(14, 2)),
};
