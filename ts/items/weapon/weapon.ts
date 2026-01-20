import Position from "../../gameElements/position.js";
import { GAMEWIDTH } from "../../global.js";
import { sounds, type Sound } from "../../sounds.js";
import { type Sprite } from "../../sprites.js";
import { Item } from ".././item.js";

export class Weapon extends Item {
  bigSprite: Sprite;
  damage: number;
  spikes: number;
  stunSecs: number;
  cooldown: number;
  sound: Sound;

  constructor(args: {
    spriteSheetPos: Position;
    bigSprite: Sprite;
    name: string;
    shopName: string;
    cost: number;
    damage: number;
    spikes?: number;
    stunSecs?: number;
    cooldown: number;
    sound?: Sound;
  }) {
    super({
      ...args,
      pos: new Position(GAMEWIDTH - 20, 18),
      descriptionText:
        "$dmgDamage: " +
        args.damage +
        ((args.spikes ?? 0 > 0) ? "\n$spkSpikes: " + args.spikes : "") +
        ((args.stunSecs ?? 0 > 0) ? "\n$stnStun: " + args.stunSecs + "s" : "") +
        "\n$spdCooldown: " +
        args.cooldown +
        "s",
    });
    this.bigSprite = args.bigSprite;
    this.damage = args.damage;
    this.spikes = args.spikes ?? 0;
    this.stunSecs = args.stunSecs ?? 0;
    this.sound = args.sound ?? sounds.stab;
    this.cooldown = args.cooldown;
    this.descFontSize = 0.6;
  }

  get totalDamage() {
    return this.damage;
  }
}
