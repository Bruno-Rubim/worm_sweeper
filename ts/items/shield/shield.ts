import { GAMEWIDTH } from "../../global.js";
import Position from "../../position.js";
import { sprites, type Sprite } from "../../sprites.js";
import { Item } from ".././item.js";

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
    args.defense = args.defense ?? 0;
    args.reflection = args.reflection ?? 0;
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 36),
      descriptionText:
        (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
        (args.reflection > 0
          ? "$refReflection: " + args.reflection + "\n"
          : "") +
        (args.cooldown > 0 ? "$spdCooldown: " + args.cooldown + "s\n" : ""),
    });
    this.cooldown = args.cooldown;
    this.bigSprite = args.bigSprite;
    this.defense = args.defense ?? 0;
    this.reflection = args.reflection ?? 0;

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
    cost: 20,
    cooldown: 1.3,
    reflection: 1,
  }),
  steel_shield: new Shield({
    spriteSheetPos: new Position(4, 1),
    bigSprite: sprites.big_shield_steel,
    name: "steel_shield",
    shopName: "Steel Shield",
    cost: 30,
    defense: 2,
    cooldown: 2,
  }),
};
