import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Item } from "./item.js";

export class Shield extends Item {
  bigSprite: Sprite;
  defense: number;
  cooldown: number;
  reflection: number;

  constructor(
    spriteSheetPos: Position,
    name: string,
    defense: number,
    cooldown: number,
    bigSprite: Sprite,
    reflection?: number
  ) {
    super(new Position(GAMEWIDTH - 20, 36), spriteSheetPos, name);
    this.defense = defense;
    this.cooldown = cooldown;
    this.bigSprite = bigSprite;
    this.reflection = reflection ?? 0;
    this.description =
      (this.defense > 0 ? "$dfsDefense: " + this.defense + "\n" : "") +
      (this.reflection > 0 ? "$rfcDefense: " + this.reflection + "\n" : "") +
      (this.cooldown > 0 ? "$spdSpeed: " + this.cooldown + "s\n" : "");
    this.descFontSize = 0.6;
  }
}

export const shieldDic = {
  wood_shield: new Shield(
    new Position(0, 1),
    "wood_shield",
    1,
    2,
    sprites.big_shield_wood
  ),
  jade_shield: new Shield(
    new Position(2, 1),
    "jade_shield",
    0,
    2,
    sprites.big_shield_jade,
    1
  ),
  steel_shield: new Shield(
    new Position(4, 1),
    "steel_shield",
    1,
    2,
    sprites.big_shield_steel
  ),
};
