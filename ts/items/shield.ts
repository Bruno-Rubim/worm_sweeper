import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { Item } from "./item.js";

export class Shield extends Item {
  constructor(spriteSheetPos: Position, name: string) {
    super(new Position(GAMEWIDTH - 20, 36), spriteSheetPos, name);
  }
}

export const shieldDic = {
  wood_shield: new Shield(new Position(0, 1), "wood_shield"),
  jade_shield: new Shield(new Position(2, 1), "jade_shield"),
  steel_shield: new Shield(new Position(4, 1), "steel_shield"),
};
