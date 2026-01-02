import { GAMEWIDTH } from "../global.js";
import Position from "../position.js";
import { sprites, type Sprite } from "../sprite.js";
import { Item } from "./item.js";

export class Shield extends Item {
  bigSprite: Sprite;
  defense: number;
  cooldown: number;
  reflection: number;

  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    defense?: number;
    cooldown: number;
    bigSprite: Sprite;
    reflection?: number;
  }) {
    super({ ...args, pos: new Position(GAMEWIDTH - 20, 36) });
    this.cooldown = args.cooldown;
    this.bigSprite = args.bigSprite;
    this.defense = args.defense ?? 0;
    this.reflection = args.reflection ?? 0;
    this.description =
      (this.defense > 0 ? "$dfsDefense: " + this.defense + "\n" : "") +
      (this.reflection > 0 ? "$refReflection: " + this.reflection + "\n" : "") +
      (this.cooldown > 0 ? "$spdCooldown: " + this.cooldown + "s\n" : "");
    this.descFontSize = 0.6;
  }
}

export const shieldDic = {
  wood_shield: new Shield({
    spriteSheetPos: new Position(0, 1),
    bigSprite: sprites.big_shield_wood,
    name: "wood_shield",
    shopName: "",
    cost: 0,
    defense: 1,
    cooldown: 2,
  }),
  jade_shield: new Shield({
    spriteSheetPos: new Position(2, 1),
    bigSprite: sprites.big_shield_jade,
    name: "jade_shield",
    shopName: "Jade Shield",
    cost: 41,
    cooldown: 1,
    reflection: 1,
  }),
  steel_shield: new Shield({
    spriteSheetPos: new Position(4, 1),
    bigSprite: sprites.big_shield_steel,
    name: "steel_shield",
    shopName: "Steel Shield",
    cost: 35,
    defense: 2,
    cooldown: 2,
  }),
};
