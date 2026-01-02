import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Item } from "./item.js";

export class Weapon extends Item {
  bigSprite: Sprite;
  damage: number;
  cooldown: number;

  constructor(
    spriteSheetPos: Position,
    name: string,
    bigSprite: Sprite,
    damage: number,
    cooldown: number
  ) {
    super(new Position(GAMEWIDTH - 20, 18), spriteSheetPos, name);
    this.bigSprite = bigSprite;
    this.damage = damage;
    this.cooldown = cooldown;
    this.description =
      "$dmgDamage: " + this.damage + "\n$spdCooldown: " + this.cooldown + "s";
    this.descFontSize = 0.6;
  }
}

export const weaponDic = {
  wood_sword: new Weapon(
    new Position(0, 3),
    "wood_sword",
    sprites.big_sword_wood,
    1,
    1
  ),
  big_sword: new Weapon(
    new Position(2, 3),
    "big_sword",
    sprites.big_sword_big,
    1,
    1
  ),
  dagger: new Weapon(
    new Position(4, 3),
    "dagger",
    sprites.big_sword_dagger,
    1,
    1
  ),
  time_blade: new Weapon(
    new Position(6, 3),
    "time_blade",
    sprites.big_sword_wood,
    1,
    1
  ),
};
