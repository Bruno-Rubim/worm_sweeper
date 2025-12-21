import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Weapon extends Item {
  constructor(pos: Position, spriteSheetPos: Position) {
    super(pos, spriteSheetPos);
  }
}

export const weaponList = {
  wood_sword: new Weapon(new Position(GAMEWIDTH - 20, 18), new Position(0, 3)),
};
