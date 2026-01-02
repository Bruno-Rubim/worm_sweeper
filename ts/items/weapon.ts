import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Item } from "./item.js";

export class Weapon extends Item {
  bigSprite: Sprite;
  damage: number;
  cooldown: number;

  constructor(args: {
    spriteSheetPos: Position;
    bigSprite: Sprite;
    name: string;
    shopName: string;
    cost: number;
    damage: number;
    cooldown: number;
  }) {
    super({ ...args, pos: new Position(GAMEWIDTH - 20, 18) });
    this.bigSprite = args.bigSprite;
    this.damage = args.damage;
    this.cooldown = args.cooldown;
    this.description =
      "$dmgDamage: " + this.damage + "\n$spdCooldown: " + this.cooldown + "s";
    this.descFontSize = 0.6;
  }

  get totalDamage() {
    return this.damage;
  }
}

class TimeBlade extends Weapon {
  constructor() {
    super({
      spriteSheetPos: new Position(6, 3),
      bigSprite: sprites.big_sword_wood,
      name: "time_blade",
      shopName: "Time Blade",
      cost: 56,
      damage: 1,
      cooldown: 2.5,
    });
    this.description =
      "The less time the more damage." +
      "\n$spdCooldown: " +
      this.cooldown +
      "s";
    this.descFontSize = 0.4;
  }

  get totalDamage() {
    return 0;
  }
}

export const weaponDic = {
  wood_sword: new Weapon({
    spriteSheetPos: new Position(0, 3),
    bigSprite: sprites.big_sword_wood,
    name: "wood_sword",
    shopName: "",
    cost: 0,
    damage: 1,
    cooldown: 2,
  }),
  big_sword: new Weapon({
    spriteSheetPos: new Position(2, 3),
    bigSprite: sprites.big_sword_big,
    name: "big_sword",
    shopName: "Big Sword",
    cost: 50,
    damage: 3,
    cooldown: 3,
  }),
  dagger: new Weapon({
    spriteSheetPos: new Position(4, 3),
    bigSprite: sprites.big_sword_dagger,
    name: "dagger",
    shopName: "Dagger",
    cost: 37,
    damage: 1,
    cooldown: 0.7,
  }),
  time_blade: new TimeBlade(),
};
