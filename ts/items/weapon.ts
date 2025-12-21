import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Weapon extends Item {
  constructor(spriteSheetPos: Position) {
    super(new Position(GAMEWIDTH - 20, 18), spriteSheetPos);
  }
}

export const weaponList = {
  wood_sword: new Weapon(new Position(0, 3)),
};
