import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Item } from "./item.js";

export class Shield extends Item {
  bigSprite: Sprite;

  constructor(spriteSheetPos: Position, name: string, bigSprite: Sprite) {
    super(new Position(GAMEWIDTH - 20, 36), spriteSheetPos, name);
    this.bigSprite = bigSprite;
  }
}

export const shieldDic = {
  wood_shield: new Shield(
    new Position(0, 1),
    "wood_shield",
    sprites.big_shield_wood
  ),
  jade_shield: new Shield(
    new Position(2, 1),
    "jade_shield",
    sprites.big_shield_jade
  ),
  steel_shield: new Shield(
    new Position(4, 1),
    "steel_shield",
    sprites.big_shield_steel
  ),
};
