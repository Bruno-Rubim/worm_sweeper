import { GAMEWIDTH } from "../../global.js";
import Position from "../../gameElements/position.js";
import { Sprite } from "../../sprites.js";
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
    descFontSize?: number;
  }) {
    args.defense = args.defense ?? 0;
    args.reflection = args.reflection ?? 0;
    args.spikes = args.spikes ?? 0;
    args.stun = args.stun ?? 0;
    args.descFontSize = args.descFontSize ?? 0.6;
    super({
      ...args,
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
    this.descFontSize = args.descFontSize;
  }

  get totalDefense() {
    return this.defense;
  }
}
