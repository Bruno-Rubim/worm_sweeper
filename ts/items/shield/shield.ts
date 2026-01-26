import { GAMEWIDTH } from "../../global.js";
import Position from "../../gameElements/position.js";
import { sprites, type Sprite } from "../../sprites.js";
import { Item } from ".././item.js";

export class Shield extends Item {
  bigSprite: Sprite;
  defense: number;
  cooldown: number;
  reflection: number;
  spikes: number;
  stun: number;

  constructor(args: {
    spriteSheetPos: Position;
    name: string;
    shopName: string;
    cost: number;
    defense?: number;
    cooldown: number;
    bigSprite: Sprite;
    reflection?: number;
    spikes?: number;
    stun?: number;
  }) {
    args.defense = args.defense ?? 0;
    args.reflection = args.reflection ?? 0;
    args.spikes = args.spikes ?? 0;
    args.stun = args.stun ?? 0;
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 36),
      descriptionText:
        (args.defense > 0 ? "$dfsDefense: " + args.defense + "\n" : "") +
        (args.reflection > 0
          ? "$refReflection: " + args.reflection + "\n"
          : "") +
        (args.spikes > 0 ? "$spkSpikes: " + args.spikes + "\n" : "") +
        (args.stun > 0 ? "$stnStun: " + args.stun + "s\n" : "") +
        (args.cooldown > 0 ? "$spdCooldown: " + args.cooldown + "s\n" : ""),
    });
    this.cooldown = args.cooldown;
    this.bigSprite = args.bigSprite;
    this.defense = args.defense;
    this.reflection = args.reflection;
    this.spikes = args.spikes;
    this.stun = args.stun;

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
    cooldown: 2.5,
  }),
  jade_shield: new Shield({
    spriteSheetPos: new Position(2, 1),
    bigSprite: sprites.big_shield_jade,
    name: "jade_shield",
    shopName: "Jade Shield",
    cost: 17,
    cooldown: 2,
    reflection: 1,
  }),
  steel_shield: new Shield({
    spriteSheetPos: new Position(4, 1),
    bigSprite: sprites.big_shield_steel,
    name: "steel_shield",
    shopName: "Steel Shield",
    cost: 30,
    defense: 2,
    stun: 1,
    cooldown: 3,
  }),
  hand_shield: new Shield({
    spriteSheetPos: new Position(6, 1),
    bigSprite: sprites.big_shield_hand,
    name: "hand_shield",
    shopName: "Hand Shield",
    cost: 23,
    defense: 0.5,
    cooldown: 1.2,
  }),
  claw_shield: new Shield({
    spriteSheetPos: new Position(8, 1),
    bigSprite: sprites.big_shield_claw,
    name: "claw_shield",
    shopName: "Claw Shield",
    cost: 28,
    defense: 1,
    spikes: 1.5,
    cooldown: 2.3,
  }),
};
