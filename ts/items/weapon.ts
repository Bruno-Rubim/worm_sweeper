import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Weapon extends Item {
  constructor(spriteSheetPos: Position, name: string) {
    super(new Position(GAMEWIDTH - 20, 18), spriteSheetPos, name);
  }
}

export const weaponDic = {
  wood_sword: new Weapon(new Position(0, 3), "wood_sword"),
  big_sword: new Weapon(new Position(2, 3), "big_sword"),
  dagger: new Weapon(new Position(4, 3), "dagger"),
  time_blade: new Weapon(new Position(6, 3), "time_blade"),
};
